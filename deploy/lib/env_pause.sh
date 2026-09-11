#!/usr/bin/env bash
# Manual .env review checkpoint on the server.

env_review_pause() {
  log_step_start "env" ".env review pause"

  local remote_env="${DEPLOY_REMOTE_DIR}/.env"
  local local_example="${DEPLOY_ROOT}/.env.example"

  echo ""
  if ssh_cmd "test -f '${remote_env}'"; then
    log_info "Current server .env:"
    ssh_cmd "echo '-----'; sed 's/^/  /' '${remote_env}'; echo '-----'"
  else
    log_warn "No .env on server at ${remote_env}"
    if [[ -f "$local_example" ]]; then
      log_info "Local .env.example for reference:"
      sed 's/^/  /' "$local_example"
    else
      log_info "This static Digital Wilderness site typically needs no .env."
    fi
  fi

  echo ""
  ui_info "Edit the .env on the server now if needed:"
  echo "    ssh ${DEPLOY_SSH_ALIAS:-${DEPLOY_USER}@${DEPLOY_HOST}}"
  echo "    nano ${remote_env}"
  echo ""
  ui_press_enter "Press Enter here to continue deployment…"
  log_step_ok "env" ".env review pause" "acknowledged"
}
