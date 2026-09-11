#!/usr/bin/env bash
# Local git status / commit / push.

git_local_push() {
  log_step_start "git" "Commit & push to GitHub"

  pushd "$DEPLOY_ROOT" >/dev/null

  echo ""
  git status --short --branch
  echo ""

  # Stage everything relevant (including out/ for static deploy pattern)
  local dirty=0
  if [[ -n "$(git status --porcelain)" ]]; then
    dirty=1
  fi

  if [[ $dirty -eq 0 ]]; then
    log_info "Working tree clean — nothing to commit"
  else
    local default_msg
    default_msg="deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    local msg
    msg="$(ui_ask "Commit message" "$default_msg")"

    git add -A
    # Intentional: commit may fail if hooks reject; surface clearly
    if ! git commit -m "$msg"; then
      popd >/dev/null
      log_step_fail "git" "Commit & push" "git commit failed"
      return 1
    fi
    change_record "[committed] ${msg}"
    log_ok "Committed locally"
  fi

  local branch
  branch="$(git rev-parse --abbrev-ref HEAD)"
  log_info "Pushing branch ${branch}…"

  if ! retry 3 3 "git push" -- git push -u origin "$branch"; then
    # "everything up-to-date" still exits 0; real failures reach here
    popd >/dev/null
    log_step_fail "git" "Commit & push" "git push failed"
    return 1
  fi

  local sha
  sha="$(git rev-parse --short HEAD)"
  change_record "[pushed]    origin/${branch} @ ${sha}"
  popd >/dev/null
  log_step_ok "git" "Commit & push" "${branch}@${sha}"
}
