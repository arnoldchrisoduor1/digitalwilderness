#!/usr/bin/env bash
# SSH key setup, remote helpers, optional ~/.ssh/config alias.

ssh_cmd() {
  # shellcheck disable=SC2086
  ssh -o BatchMode=yes \
      -o IdentitiesOnly=yes \
      -o ConnectTimeout=15 \
      -i "$DEPLOY_SSH_KEY" \
      "${DEPLOY_USER}@${DEPLOY_HOST}" \
      "$@"
}

ssh_tty() {
  ssh -o IdentitiesOnly=yes \
      -o ConnectTimeout=15 \
      -i "$DEPLOY_SSH_KEY" \
      -t "${DEPLOY_USER}@${DEPLOY_HOST}" \
      "$@"
}

# Run a remote bash script via stdin (safer than quoting hell).
ssh_bash() {
  ssh -o BatchMode=yes \
      -o IdentitiesOnly=yes \
      -o ConnectTimeout=15 \
      -i "$DEPLOY_SSH_KEY" \
      "${DEPLOY_USER}@${DEPLOY_HOST}" \
      "bash -s" <<EOF
set -euo pipefail
$*
EOF
}

# Locate in-repo key pair, install under ~/.ssh with correct perms,
# prefer a key that already authenticates, offer to install personal.pub on server.
ssh_setup_keys() {
  log_step_start "ssh" "SSH key setup"

  local repo_priv="${DEPLOY_ROOT}/personal"
  local repo_pub="${DEPLOY_ROOT}/personal.pub"
  local dest_priv="${HOME}/.ssh/portfolio_personal"
  local dest_pub="${HOME}/.ssh/portfolio_personal.pub"
  mkdir -p "${HOME}/.ssh"
  chmod 700 "${HOME}/.ssh" 2>/dev/null || true

  if [[ -f "$repo_priv" ]]; then
    if [[ ! -f "$dest_priv" ]] || ! cmp -s "$repo_priv" "$dest_priv" 2>/dev/null; then
      cp "$repo_priv" "$dest_priv"
      change_record "[copied]    repo personal → ${dest_priv}"
    fi
    chmod 600 "$dest_priv"
    log_ok "In-repo private key available at ${dest_priv}"
  else
    log_warn "No in-repo 'personal' private key found (ok if using another key)"
  fi

  if [[ -f "$repo_pub" ]]; then
    cp "$repo_pub" "$dest_pub"
    chmod 644 "$dest_pub"
  fi

  # Expand ~ in configured key path
  DEPLOY_SSH_KEY="${DEPLOY_SSH_KEY/#\~/$HOME}"

  if [[ ! -f "$DEPLOY_SSH_KEY" ]]; then
    if [[ -f "${HOME}/.ssh/id_ed25519" ]]; then
      DEPLOY_SSH_KEY="${HOME}/.ssh/id_ed25519"
      log_warn "Configured key missing; falling back to ${DEPLOY_SSH_KEY}"
    elif [[ -f "$dest_priv" ]]; then
      DEPLOY_SSH_KEY="$dest_priv"
      log_warn "Configured key missing; falling back to ${DEPLOY_SSH_KEY}"
    else
      log_step_fail "ssh" "SSH key setup" "no private key found"
      return 1
    fi
  fi
  chmod 600 "$DEPLOY_SSH_KEY" 2>/dev/null || true

  log_info "Testing SSH: ${DEPLOY_USER}@${DEPLOY_HOST} with ${DEPLOY_SSH_KEY}"
  if ! retry 3 2 "SSH connect" -- ssh_cmd "echo ssh-ok"; then
    # Try the portfolio_personal key if current failed
    if [[ -f "$dest_priv" && "$DEPLOY_SSH_KEY" != "$dest_priv" ]]; then
      log_warn "Trying alternate key ${dest_priv}…"
      DEPLOY_SSH_KEY="$dest_priv"
      if retry 2 2 "SSH connect (alt key)" -- ssh_cmd "echo ssh-ok"; then
        log_ok "Authenticated with ${DEPLOY_SSH_KEY}"
        change_record "[auth]      SSH ok with ${DEPLOY_SSH_KEY}"
      else
        log_step_fail "ssh" "SSH key setup" "permission denied — add your public key to the droplet"
        return 1
      fi
    else
      log_step_fail "ssh" "SSH key setup" "permission denied"
      return 1
    fi
  else
    log_ok "SSH authentication succeeded"
    change_record "[auth]      SSH ok with ${DEPLOY_SSH_KEY}"
  fi

  # Optionally install the in-repo public key onto the serve
  if [[ -f "$dest_pub" ]]; then
    local pub_body
    pub_body="$(tr -d '\n\r' <"$dest_pub")"
    if ! ssh_cmd "grep -qF '${pub_body}' ~/.ssh/authorized_keys 2>/dev/null"; then
      if ui_confirm "Install in-repo personal.pub onto server authorized_keys?" N; then
        ssh_cmd "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '${pub_body}' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
        change_record "[added]     personal.pub → server authorized_keys"
        log_ok "Installed personal.pub on server"
      fi
    else
      log_info "personal.pub already present in server authorized_keys"
    fi
  fi

  log_step_ok "ssh" "SSH key setup"
}

ssh_offer_config_alias() {
  local cfg="${HOME}/.ssh/config"
  local block
  block="$(cat <<EOF
Host ${DEPLOY_SSH_ALIAS}
  HostName ${DEPLOY_HOST}
  User ${DEPLOY_USER}
  IdentityFile ${DEPLOY_SSH_KEY}
  IdentitiesOnly yes
EOF
)"

  ui_section "SSH config alias"
  echo "  Preview of block to write to ${cfg}:"
  echo "${C_DIM}${block}${C_RESET}" | sed 's/^/  /'

  if ! ui_confirm "Create/update SSH alias '${DEPLOY_SSH_ALIAS}'?" Y; then
    log_step_skip "ssh-cfg" "SSH config alias" "declined"
    return 0
  fi

  mkdir -p "${HOME}/.ssh"
  touch "$cfg"
  chmod 600 "$cfg"

  if grep -qE "^Host[[:space:]]+${DEPLOY_SSH_ALIAS}([[:space:]]|$)" "$cfg" 2>/dev/null; then
    # Remove existing Host block (until next Host or EOF)
    local tmp
    tmp="$(mktemp)"
    awk -v host="$DEPLOY_SSH_ALIAS" '
      BEGIN { skip=0 }
      /^Host[[:space:]]+/ {
        if ($2 == host) { skip=1; next }
        else { skip=0 }
      }
      skip == 0 { print }
    ' "$cfg" >"$tmp"
    cat "$tmp" >"$cfg"
    rm -f "$tmp"
    change_record "[updated]   ~/.ssh/config Host ${DEPLOY_SSH_ALIAS}"
  else
    change_record "[created]   ~/.ssh/config Host ${DEPLOY_SSH_ALIAS}"
  fi

  {
    echo ""
    echo "$block"
  } >>"$cfg"

  log_ok "You can now: ssh ${DEPLOY_SSH_ALIAS}"
  log_step_ok "ssh-cfg" "SSH config alias" "${DEPLOY_SSH_ALIAS}"
}
