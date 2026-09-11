#!/usr/bin/env bash
# Docker Compose bring-up / restart on the server (this app only).

_containers_compose_cmd() {
  # Always pin -p so we never accidentally target the portfolio compose project.
  echo "cd '$(deploy_remote_compose_dir)' && docker compose -p '${DEPLOY_COMPOSE_PROJECT}'"
}

containers_up() {
  log_step_start "docker" "docker compose up -d --build (${DEPLOY_COMPOSE_PROJECT})"

  if ! retry 2 5 "docker compose up" -- ssh_cmd \
    "$(_containers_compose_cmd) up -d --build"; then
    log_step_fail "docker" "docker compose up" "failed"
    return 1
  fi

  change_record "[restarted] ${DEPLOY_COMPOSE_PROJECT} via docker compose up -d --build"
  sleep 3
  ssh_cmd "$(_containers_compose_cmd) ps" || true
  log_step_ok "docker" "docker compose up -d --build"
}

containers_restart() {
  log_step_start "restart" "Restart containers (${DEPLOY_COMPOSE_PROJECT}, no rebuild)"

  if ! ssh_cmd "$(_containers_compose_cmd) restart"; then
    log_step_fail "restart" "Restart containers" "failed"
    return 1
  fi
  change_record "[restarted] ${DEPLOY_COMPOSE_PROJECT} (compose restart)"
  ssh_cmd "$(_containers_compose_cmd) ps" || true
  log_step_ok "restart" "Restart containers"
}
