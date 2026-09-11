#!/usr/bin/env bash
# Retry helper with exponential backoff for network-dependent steps.

# retry <max_attempts> <sleep_base_seconds> <description> -- <command...>
# Example: retry 3 2 "git push" -- git push origin HEAD
retry() {
  local max="$1"
  local base="$2"
  local desc="$3"
  shift 3
  if [[ "${1:-}" == "--" ]]; then shift; fi

  local attempt=1
  local delay="$base"
  # Intentional: catch failures inside the loop rather than exiting via set -e
  set +e
  while (( attempt <= max )); do
    "$@"
    local rc=$?
    if [[ $rc -eq 0 ]]; then
      set -e
      return 0
    fi
    if (( attempt == max )); then
      set -e
      log_err "Failed after ${max} attempts: ${desc}"
      return "$rc"
    fi
    log_warn "Retry ${attempt}/${max} for ${desc} in ${delay}s (exit ${rc})…"
    sleep "$delay"
    delay=$(( delay * 2 ))
    attempt=$(( attempt + 1 ))
  done
  set -e
  return 1
}
