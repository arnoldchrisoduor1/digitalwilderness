#!/usr/bin/env bash
# Interactive deployment entry point for Digital Wilderness.
# No CLI flags — pick a menu option and answer prompts (Enter accepts defaults).
# Side-by-side on the same droplet as the portfolio site — never targets portfolio.
set -euo pipefail

DEPLOY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export DEPLOY_ROOT

# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/ui.sh"
# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/log.sh"
# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/retry.sh"
# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/config.sh"
# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/ssh.sh"
# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/build.sh"
# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/git_local.sh"
# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/server_update.sh"
# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/checks.sh"
# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/env_pause.sh"
# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/containers.sh"
# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/reachability.sh"
# shellcheck disable=SC1091
source "${DEPLOY_ROOT}/deploy/lib/provision.sh"

_RUN_T0=0

_begin_run() {
  _RUN_T0="$SECONDS"
  log_init
  config_load
  ui_banner "${DEPLOY_SITE_NAME:-digital-wilderness}" "${DEPLOY_HOST:-server}"
}

_end_run() {
  local elapsed=$(( SECONDS - _RUN_T0 ))
  local mins=$(( elapsed / 60 ))
  local secs=$(( elapsed % 60 ))
  change_summary_print
  step_summary_print "${mins}m ${secs}s"
  echo ""
}

# ---- Menu actions -----------------------------------------------------------

action_full_deploy() {
  _begin_run
  config_ensure || { _end_run; return 1; }
  ssh_setup_keys || { _end_run; return 1; }
  ssh_offer_config_alias
  build_local || { _end_run; return 1; }
  git_local_push || { _end_run; return 1; }
  server_update || { _end_run; return 1; }
  # Soft-fail checks: warn but allow continuing if user confirms
  set +e
  checks_all
  local chk=$?
  set -e
  if [[ $chk -ne 0 ]]; then
    if ! ui_confirm "Pre-flight reported issues. Continue anyway?" N; then
      _end_run
      return 1
    fi
  fi
  env_review_pause
  containers_up || { _end_run; return 1; }
  reachability_check || true
  _end_run
}

action_build_push() {
  _begin_run
  build_local || { _end_run; return 1; }
  git_local_push || { _end_run; return 1; }
  _end_run
}

action_server_only() {
  _begin_run
  config_ensure || { _end_run; return 1; }
  ssh_setup_keys || { _end_run; return 1; }
  server_update || { _end_run; return 1; }
  set +e
  checks_docker_nginx
  set -e
  env_review_pause
  containers_up || { _end_run; return 1; }
  reachability_check || true
  _end_run
}

action_restart() {
  _begin_run
  config_ensure || { _end_run; return 1; }
  ssh_setup_keys || { _end_run; return 1; }
  containers_restart || { _end_run; return 1; }
  reachability_check || true
  _end_run
}

action_checks() {
  _begin_run
  config_ensure || { _end_run; return 1; }
  ssh_setup_keys || { _end_run; return 1; }
  checks_all || true
  _end_run
}

action_provision() {
  _begin_run
  provision_server || { _end_run; return 1; }
  _end_run
}

action_logs() {
  _begin_run
  if [[ -f "${DEPLOY_ROOT}/deploy.log" ]]; then
    ui_section "Recent deploy.log (last 80 lines)"
    tail -n 80 "${DEPLOY_ROOT}/deploy.log"
  else
    log_warn "No deploy.log yet"
  fi
  _end_run
}

show_menu() {
  echo ""
  echo "  ${C_BOLD}Digital Wilderness — Deploy menu${C_RESET}"
  echo "  1) Full deploy (build → push → server update → checks → containers)"
  echo "  2) Build and push to GitHub only"
  echo "  3) Push to server only (pull + rebuild containers)"
  echo "  4) Restart containers only (no pull, no rebuild)"
  echo "  5) Run pre-flight checks only"
  echo "  6) Provision server (app setup; skips system pkgs if already present)"
  echo "  7) View recent deploy logs"
  echo "  0) Exit"
  echo ""
}

main() {
  config_load
  ui_banner "${DEPLOY_SITE_NAME:-digital-wilderness}" "${DEPLOY_HOST:-104.248.224.133}"

  while true; do
    show_menu
    local choice
    choice="$(ui_ask "Select option" "1")"
    case "$choice" in
      1) action_full_deploy ;;
      2) action_build_push ;;
      3) action_server_only ;;
      4) action_restart ;;
      5) action_checks ;;
      6) action_provision ;;
      7) action_logs ;;
      0|q|Q) echo "  Bye."; exit 0 ;;
      *) ui_warn "Unknown option: ${choice}" ;;
    esac
  done
}

main "$@"
