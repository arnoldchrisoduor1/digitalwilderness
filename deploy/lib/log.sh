#!/usr/bin/env bash
# Logging + change-audit trail for deploy runs.

DEPLOY_LOG_FILE="${DEPLOY_ROOT}/deploy.log"
DEPLOY_CHANGES=()
DEPLOY_STEP_RESULTS=()
DEPLOY_RUN_STARTED_AT=""

log_init() {
  DEPLOY_CHANGES=()
  DEPLOY_STEP_RESULTS=()
  DEPLOY_RUN_STARTED_AT="$(date '+%Y-%m-%d %H:%M:%S')"
  mkdir -p "$(dirname "$DEPLOY_LOG_FILE")"
  {
    echo ""
    echo "======== Digital Wilderness deploy run ${DEPLOY_RUN_STARTED_AT} ========"
  } >>"$DEPLOY_LOG_FILE"
}

_log_write() {
  local level="$1"
  local msg="$2"
  local ts
  ts="$(date '+%Y-%m-%d %H:%M:%S')"
  echo "[$ts] [$level] $msg" >>"$DEPLOY_LOG_FILE"
}

log_info() {
  _log_write "INFO" "$*"
  ui_info "$*"
}

log_ok() {
  _log_write "OK" "$*"
  ui_ok "$*"
}

log_warn() {
  _log_write "WARN" "$*"
  ui_warn "$*"
}

log_err() {
  _log_write "ERROR" "$*"
  ui_err "$*"
}

log_step_start() {
  local n="$1"
  local name="$2"
  _log_write "STEP" "START [$n] $name"
  ui_step_start "$n" "$name"
}

log_step_ok() {
  local n="$1"
  local name="$2"
  local detail="${3:-}"
  DEPLOY_STEP_RESULTS+=("PASS|$name|$detail")
  _log_write "STEP" "OK [$n] $name ${detail}"
  ui_step_ok "$n" "$name" "$detail"
}

log_step_fail() {
  local n="$1"
  local name="$2"
  local detail="${3:-}"
  DEPLOY_STEP_RESULTS+=("FAIL|$name|$detail")
  _log_write "STEP" "FAIL [$n] $name ${detail}"
  ui_step_fail "$n" "$name" "$detail"
}

log_step_skip() {
  local n="$1"
  local name="$2"
  local detail="${3:-}"
  DEPLOY_STEP_RESULTS+=("SKIP|$name|$detail")
  _log_write "STEP" "SKIP [$n] $name ${detail}"
  ui_step_skip "$n" "$name" "$detail"
}

# Record a concrete server/local mutation for the end-of-run audit.
# Usage: change_record "[installed] docker-ce"
change_record() {
  local entry="$*"
  DEPLOY_CHANGES+=("$entry")
  _log_write "CHANGE" "$entry"
}

change_summary_print() {
  local label="${DEPLOY_SITE_NAME:-digital-wilderness}"
  echo ""
  ui_section "Digital Wilderness deploy — changes made (${label})"
  if [[ ${#DEPLOY_CHANGES[@]} -eq 0 ]]; then
    echo "  (no changes)  nothing mutated this run"
    _log_write "CHANGE" "(no changes)"
  else
    local c
    for c in "${DEPLOY_CHANGES[@]}"; do
      echo "  $c"
    done
  fi
  {
    echo "---- Digital Wilderness change summary (${label}) ----"
    if [[ ${#DEPLOY_CHANGES[@]} -eq 0 ]]; then
      echo "(no changes)"
    else
      printf '%s\n' "${DEPLOY_CHANGES[@]}"
    fi
    echo "---- end summary ----"
  } >>"$DEPLOY_LOG_FILE"
}

step_summary_print() {
  local elapsed="$1"
  echo ""
  ui_section "Step results (${elapsed})"
  printf "  %-8s  %-36s  %s\n" "STATUS" "STEP" "DETAIL"
  printf "  %-8s  %-36s  %s\n" "------" "----" "------"
  local row status name detail
  for row in "${DEPLOY_STEP_RESULTS[@]:-}"; do
    [[ -z "$row" ]] && continue
    IFS='|' read -r status name detail <<<"$row"
    printf "  %-8s  %-36s  %s\n" "$status" "$name" "$detail"
  done
}
