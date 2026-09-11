#!/usr/bin/env bash
# Pre-flight checks: ports, DNS, SSL, Docker, Nginx (this app's site only).

checks_ports() {
  log_step_start "ports" "Port checks"
  local ok=1
  local report=""

  local p
  for p in 22 80 443 "$DEPLOY_APP_PORT"; do
    set +e
    if command -v nc >/dev/null 2>&1; then
      nc -z -w 3 "$DEPLOY_HOST" "$p" 2>/dev/null
      local rc=$?
    else
      timeout 3 bash -c "echo >/dev/tcp/${DEPLOY_HOST}/${p}" 2>/dev/null
      rc=$?
    fi
    set -e
    if [[ $rc -eq 0 ]]; then
      report+=" port ${p}=open"
      log_ok "Port ${p} reachable on ${DEPLOY_HOST}"
    else
      report+=" port ${p}=closed/filtered"
      if [[ "$p" == "22" ]]; then
        log_err "Port 22 not reachable — SSH will fail"
        ok=0
      elif [[ "$p" == "80" || "$p" == "443" ]]; then
        log_warn "Port ${p} not reachable yet (expected before nginx/certbot)"
      else
        log_warn "App port ${p} not reachable yet (expected before containers; bound to 127.0.0.1 so external probe may fail — OK)"
      fi
    fi
  done

  local listen
  listen="$(ssh_cmd "ss -tlnp 2>/dev/null | awk '{print \$4}' | sed 's/.*://' | sort -n | uniq | tr '\n' ' '" || true)"
  log_info "Server listening ports: ${listen:-unknown}"

  # Collision check vs portfolio
  if [[ "$DEPLOY_APP_PORT" == "8472" ]]; then
    log_err "Port collision with portfolio (8472)"
    ok=0
  elif ssh_cmd "ss -tlnp 2>/dev/null | grep -qE '127\\.0\\.0\\.1:${DEPLOY_APP_PORT}\\b'"; then
    log_info "App port ${DEPLOY_APP_PORT} already listening (container may already be up)"
  fi
  if ssh_cmd "ss -tlnp 2>/dev/null | grep -qE '127\\.0\\.0\\.1:8472\\b'"; then
    log_ok "Portfolio port 8472 still listening (expected)"
  fi

  if [[ $ok -eq 1 ]]; then
    log_step_ok "ports" "Port checks" "$report"
  else
    log_step_fail "ports" "Port checks" "$report"
    return 1
  fi
}

checks_dns() {
  log_step_start "dns" "DNS check"
  if [[ -z "${DEPLOY_DOMAIN:-}" ]]; then
    log_step_skip "dns" "DNS check" "no domain configured"
    return 0
  fi

  local resolved=""
  set +e
  if command -v dig >/dev/null 2>&1; then
    resolved="$(dig +short "$DEPLOY_DOMAIN" A | head -1)"
  elif command -v nslookup >/dev/null 2>&1; then
    resolved="$(nslookup "$DEPLOY_DOMAIN" 2>/dev/null | awk '/^Address: / { print $2 }' | tail -1)"
  elif command -v getent >/dev/null 2>&1; then
    resolved="$(getent hosts "$DEPLOY_DOMAIN" | awk '{print $1}' | head -1)"
  fi
  set -e

  if [[ -z "$resolved" ]]; then
    log_warn "Could not resolve ${DEPLOY_DOMAIN} (propagation lag or missing record)"
    log_step_skip "dns" "DNS check" "unresolved"
    return 0
  fi

  if [[ "$resolved" == "$DEPLOY_HOST" ]]; then
    log_ok "${DEPLOY_DOMAIN} → ${resolved} (matches server)"
    log_step_ok "dns" "DNS check" "${resolved}"
  else
    log_warn "${DEPLOY_DOMAIN} → ${resolved}, server is ${DEPLOY_HOST} (mismatch — warn only)"
    log_step_ok "dns" "DNS check" "mismatch ${resolved}≠${DEPLOY_HOST}"
  fi
}

checks_ssl() {
  log_step_start "ssl" "SSL certificate check"
  if [[ -z "${DEPLOY_DOMAIN:-}" ]]; then
    log_step_skip "ssl" "SSL check" "no domain configured"
    return 0
  fi

  local live="/etc/letsencrypt/live/${DEPLOY_DOMAIN}"
  local has_cert
  has_cert="$(ssh_cmd "test -f '${live}/fullchain.pem' && echo yes || echo no")"

  if [[ "$has_cert" == "yes" ]]; then
    local expiry
    expiry="$(ssh_cmd "openssl x509 -enddate -noout -in '${live}/fullchain.pem' 2>/dev/null | cut -d= -f2" || echo unknown)"
    log_ok "Cert exists for ${DEPLOY_DOMAIN} (expires: ${expiry})"
    log_step_ok "ssl" "SSL check" "present, expires ${expiry}"
  else
    log_warn "No Let's Encrypt cert for ${DEPLOY_DOMAIN}"
    if ui_confirm "Issue NEW cert for ${DEPLOY_DOMAIN} only (will NOT expand portfolio cert)?" N; then
      if ssh_cmd "command -v certbot >/dev/null"; then
        local email
        email="$(ui_ask "Email for Let's Encrypt" "arnoldchrisoduor@gmail.com")"
        local cert_args
        cert_args="$(provision_certbot_args)"
        if ssh_cmd "certbot --nginx ${cert_args} --non-interactive --agree-tos -m '${email}' --redirect --cert-name '${DEPLOY_DOMAIN}'"; then
          change_record "[issued]    SSL cert for ${DEPLOY_DOMAIN} (separate certbot name)"
          log_step_ok "ssl" "SSL check" "issued"
        else
          log_step_fail "ssl" "SSL check" "certbot failed"
          return 1
        fi
      else
        log_err "certbot not installed — run menu option 6 (Provision) first"
        log_step_fail "ssl" "SSL check" "certbot missing"
        return 1
      fi
    else
      log_step_skip "ssl" "SSL check" "no cert, skipped issuance"
    fi
  fi
}

checks_docker_nginx() {
  log_step_start "stack" "Docker & Nginx checks"
  local problems=0

  if ssh_cmd "command -v docker >/dev/null && docker --version"; then
    log_ok "Docker installed"
  else
    log_err "Docker NOT installed — run menu option 6 (Provision server)"
    problems=1
  fi

  if ssh_cmd "docker compose version >/dev/null 2>&1 && docker compose version"; then
    log_ok "Docker Compose plugin installed"
  else
    log_err "Docker Compose plugin NOT installed — run Provision"
    problems=1
  fi

  if ssh_cmd "systemctl is-active --quiet docker"; then
    log_ok "Docker service active"
  else
    log_warn "Docker service not active"
    problems=1
  fi

  if ssh_cmd "command -v nginx >/dev/null && nginx -v"; then
    log_ok "Nginx installed (host reverse proxy)"
  else
    log_err "Nginx NOT installed — run Provision"
    problems=1
  fi

  if ssh_cmd "systemctl is-active --quiet nginx"; then
    log_ok "Nginx service active"
  else
    log_warn "Nginx service not active"
  fi

  local conf="/etc/nginx/sites-available/${DEPLOY_NGINX_SITE}"
  if ssh_cmd "test -f '${conf}'"; then
    log_ok "Nginx site config present: ${conf}"
    if ssh_cmd "nginx -t"; then
      log_ok "nginx -t passed"
    else
      log_err "nginx -t FAILED"
      problems=1
    fi
  else
    log_warn "Nginx site config missing (${conf}) — run Provision"
    problems=1
  fi

  # Confirm portfolio site file still exists (we must never delete it)
  if ssh_cmd "test -f /etc/nginx/sites-available/portfolio"; then
    log_ok "Portfolio nginx site still present (untouched)"
  else
    log_warn "Portfolio nginx site missing — unexpected on this shared droplet"
  fi

  if [[ $problems -eq 0 ]]; then
    log_step_ok "stack" "Docker & Nginx checks"
  else
    log_step_fail "stack" "Docker & Nginx checks" "see messages above"
    return 1
  fi
}

checks_all() {
  config_assert_isolation || return 1
  checks_ports
  checks_dns
  checks_ssl
  checks_docker_nginx
}
