#!/usr/bin/env bash
# First-time (idempotent) server provisioning for Digital Wilderness.
# Safe on an already-provisioned droplet that hosts the portfolio:
# system packages are skipped when present; only this app's folder,
# nginx site, cert, and compose project are created/updated.
# NEVER writes to the portfolio nginx site or /opt/portfolio_v3.

provision_certbot_args() {
  # Subdomains (default): only the apex DEPLOY_DOMAIN.
  # Apex + www: set DEPLOY_INCLUDE_WWW=1 in deploy.config.
  local args=(-d "${DEPLOY_DOMAIN}")
  if [[ "${DEPLOY_INCLUDE_WWW}" == "1" ]]; then
    args+=(-d "www.${DEPLOY_DOMAIN}")
  fi
  printf '%q ' "${args[@]}"
}

provision_server() {
  log_step_start "prov" "Provision server (${DEPLOY_SITE_NAME})"

  config_ensure || return 1
  config_assert_isolation || return 1
  ssh_setup_keys || return 1
  ssh_offer_config_alias

  ui_section "Provisioning plan (app-specific on shared droplet)"
  echo "  Host:        ${DEPLOY_USER}@${DEPLOY_HOST}"
  echo "  Dir:         ${DEPLOY_REMOTE_DIR}  (compose in …/${DEPLOY_APP_SUBDIR})"
  echo "  Domain:      ${DEPLOY_DOMAIN:-"(none — HTTP via IP)"}"
  echo "  App port:    ${DEPLOY_APP_PORT}  (portfolio uses 8472 — untouched)"
  echo "  Compose -p:  ${DEPLOY_COMPOSE_PROJECT}"
  echo "  Nginx site:  ${DEPLOY_NGINX_SITE}  (portfolio site file untouched)"
  echo "  System pkgs: skip if already installed (Docker/Nginx/Certbot/UFW from portfolio)"
  echo ""
  if ! ui_confirm "Proceed with provisioning?" Y; then
    log_step_skip "prov" "Provision server" "declined"
    return 0
  fi

  # --- Base packages (idempotent; portfolio already installed these) ---
  if ssh_cmd "command -v curl >/dev/null && command -v git >/dev/null && command -v openssl >/dev/null"; then
    log_ok "Base packages already present — skipping apt install"
    change_record "(no changes) base apt packages already present"
  else
    log_info "Updating apt & installing base packages…"
    ssh_cmd "export DEBIAN_FRONTEND=noninteractive
      apt-get update -qq
      apt-get install -y -qq ca-certificates curl gnupg lsb-release git ufw openssl \
        apt-transport-https software-properties-common >/dev/null"
    change_record "[ensured]   base apt packages (curl,git,ufw,openssl,…)"
  fi

  # --- Swap (low-RAM droplet) ---
  if ssh_cmd "test -f /swapfile || swapon --show | grep -q ."; then
    log_info "Swap already present"
    change_record "(no changes) swap already configured"
  else
    log_info "Creating 1G swapfile (droplet has low RAM)…"
    ssh_cmd "
      fallocate -l 1G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=1024
      chmod 600 /swapfile
      mkswap /swapfile
      swapon /swapfile
      grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
    "
    change_record "[created]   1G /swapfile"
  fi

  # --- Docker ---
  if ssh_cmd "command -v docker >/dev/null && docker compose version >/dev/null 2>&1"; then
    log_ok "Docker + Compose already installed"
    change_record "(no changes) Docker already installed"
  else
    log_info "Installing Docker Engine + Compose plugin…"
    ssh_cmd "
      export DEBIAN_FRONTEND=noninteractive
      install -m 0755 -d /etc/apt/keyrings
      if [[ ! -f /etc/apt/keyrings/docker.asc ]]; then
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
        chmod a+r /etc/apt/keyrings/docker.asc
      fi
      arch=\$(dpkg --print-architecture)
      codename=\$(. /etc/os-release && echo \"\$VERSION_CODENAME\")
      echo \"deb [arch=\${arch} signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \${codename} stable\" \
        > /etc/apt/sources.list.d/docker.list
      apt-get update -qq
      apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
      systemctl enable --now docker
    "
    change_record "[installed] docker-ce, docker-compose-plugin"
  fi
  ssh_cmd "systemctl enable --now docker" || true
  log_ok "$(ssh_cmd 'docker --version; docker compose version')"

  # --- Nginx (host reverse proxy) ---
  if ssh_cmd "command -v nginx >/dev/null"; then
    log_ok "Nginx already installed"
    change_record "(no changes) Nginx already installed"
  else
    log_info "Installing Nginx…"
    ssh_cmd "export DEBIAN_FRONTEND=noninteractive; apt-get install -y -qq nginx; systemctl enable --now nginx"
    change_record "[installed] nginx"
  fi

  # --- Certbot ---
  if ssh_cmd "command -v certbot >/dev/null"; then
    log_ok "Certbot already installed"
    change_record "(no changes) Certbot already installed"
  else
    log_info "Installing Certbot…"
    ssh_cmd "export DEBIAN_FRONTEND=noninteractive; apt-get install -y -qq certbot python3-certbot-nginx"
    change_record "[installed] certbot, python3-certbot-nginx"
  fi

  # --- UFW (idempotent allow rules; already enabled by portfolio) ---
  if ssh_cmd "ufw status 2>/dev/null | grep -qi 'Status: active'"; then
    log_ok "UFW already active — ensuring 22/80/443 allowed"
    ssh_cmd "
      ufw allow OpenSSH >/dev/null || true
      ufw allow 80/tcp >/dev/null || true
      ufw allow 443/tcp >/dev/null || true
      ufw status | head -20
    "
    change_record "(no changes) UFW already active (rules ensured)"
  else
    log_info "Configuring UFW (22/80/443)…"
    ssh_cmd "
      ufw allow OpenSSH >/dev/null
      ufw allow 80/tcp >/dev/null
      ufw allow 443/tcp >/dev/null
      ufw --force enable >/dev/null
      ufw status
    "
    change_record "[enabled]   ufw rules for 22, 80, 443"
  fi

  # --- Project directory / clone (THIS app only) ---
  if ssh_cmd "test -d '${DEPLOY_REMOTE_DIR}/.git'"; then
    log_ok "Project already cloned at ${DEPLOY_REMOTE_DIR}"
    change_record "(no changes) repo already at ${DEPLOY_REMOTE_DIR}"
    ssh_cmd "cd '${DEPLOY_REMOTE_DIR}' && git fetch origin && git checkout '${DEPLOY_BRANCH}' && git pull --ff-only origin '${DEPLOY_BRANCH}'" || true
  else
    log_info "Cloning ${DEPLOY_GIT_URL} → ${DEPLOY_REMOTE_DIR}"
    ssh_cmd "mkdir -p '$(dirname "$DEPLOY_REMOTE_DIR")' && git clone --branch '${DEPLOY_BRANCH}' '${DEPLOY_GIT_URL}' '${DEPLOY_REMOTE_DIR}'"
    change_record "[cloned]    ${DEPLOY_GIT_URL} → ${DEPLOY_REMOTE_DIR}"
  fi

  # --- Nginx site config (NEW file — never touches portfolio) ---
  provision_nginx_site

  # --- Optional SSL (separate cert; no --expand onto portfolio cert) ---
  if [[ -n "${DEPLOY_DOMAIN:-}" ]]; then
    local live="/etc/letsencrypt/live/${DEPLOY_DOMAIN}"
    if ssh_cmd "test -f '${live}/fullchain.pem'"; then
      log_ok "SSL cert already present for ${DEPLOY_DOMAIN}"
      change_record "(no changes) SSL cert already for ${DEPLOY_DOMAIN}"
    elif ui_confirm "Issue NEW Let's Encrypt cert for ${DEPLOY_DOMAIN} only? (separate from portfolio; DNS must point here)" N; then
      local email
      email="$(ui_ask "Email for Let's Encrypt" "arnoldchrisoduor@gmail.com")"
      local cert_args
      cert_args="$(provision_certbot_args)"
      # Intentionally NOT using --expand: keep a separate cert from oduor-arnold.com
      if ssh_cmd "certbot --nginx ${cert_args} --non-interactive --agree-tos -m '${email}' --redirect --cert-name '${DEPLOY_DOMAIN}'"; then
        change_record "[issued]    SSL cert for ${DEPLOY_DOMAIN} (separate from portfolio)"
      else
        log_warn "Certbot failed — site remains on HTTP. Re-run after DNS propagates."
      fi
    fi
  else
    log_info "No domain set — skipping SSL. Site will be reachable at http://${DEPLOY_HOST}:${DEPLOY_APP_PORT} via nginx once configured"
  fi

  log_step_ok "prov" "Provision server" "complete"
}

provision_nginx_site() {
  # server_name: this domain only — do NOT add the droplet IP (portfolio already claims it)
  local server_name
  if [[ -z "${DEPLOY_DOMAIN:-}" ]]; then
    server_name="${DEPLOY_HOST}"
  elif [[ "${DEPLOY_INCLUDE_WWW}" == "1" ]]; then
    server_name="${DEPLOY_DOMAIN} www.${DEPLOY_DOMAIN}"
  else
    server_name="${DEPLOY_DOMAIN}"
  fi

  local tpl="${DEPLOY_ROOT}/deploy/templates/nginx-digital-wilderness.conf.tpl"
  if [[ ! -f "$tpl" ]]; then
    log_err "Missing nginx template: ${tpl}"
    return 1
  fi

  local rendered
  rendered="$(sed -e "s/__DOMAIN__/${server_name}/g" -e "s/__APP_PORT__/${DEPLOY_APP_PORT}/g" "$tpl")"

  local remote_conf="/etc/nginx/sites-available/${DEPLOY_NGINX_SITE}"
  local remote_enabled="/etc/nginx/sites-enabled/${DEPLOY_NGINX_SITE}"

  # Hard guard: never overwrite the portfolio nginx site
  if [[ "${DEPLOY_NGINX_SITE}" == "portfolio" ]] || [[ "$remote_conf" == "/etc/nginx/sites-available/portfolio" ]]; then
    log_err "Refusing to write portfolio nginx site"
    return 1
  fi

  local existing=""
  existing="$(ssh_cmd "cat '${remote_conf}' 2>/dev/null" || true)"
  if [[ "$existing" == "$rendered" ]]; then
    log_ok "Nginx site config already correct (${DEPLOY_NGINX_SITE})"
    change_record "(no changes) Nginx config already correct"
  else
    # If certbot already rewrote the file (HTTPS blocks), don't clobber — only create if missing/HTTP-only
    if ssh_cmd "test -f '${remote_conf}' && grep -q 'managed by Certbot' '${remote_conf}'"; then
      log_ok "Nginx site already has Certbot SSL — leaving untouched"
      change_record "(no changes) Nginx ${DEPLOY_NGINX_SITE} already SSL-managed"
    else
      printf '%s\n' "$rendered" | ssh_cmd "cat > '${remote_conf}'"
      change_record "[created]   ${remote_conf}"
      log_ok "Wrote ${remote_conf}"
    fi
  fi

  # Enable our site only. Do not remove other sites (portfolio stays enabled).
  # Only remove default if it still exists and would catch our hostname.
  ssh_cmd "
    if [[ -L /etc/nginx/sites-enabled/default ]] || [[ -f /etc/nginx/sites-enabled/default ]]; then
      rm -f /etc/nginx/sites-enabled/default
    fi
    ln -sfn '${remote_conf}' '${remote_enabled}'
    nginx -t
    systemctl reload nginx
  "
  change_record "[enabled]   nginx site ${DEPLOY_NGINX_SITE} (portfolio site untouched; nginx reloaded)"
}
