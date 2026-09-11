#!/usr/bin/env bash
# Server-side git pull with dirty-tree / conflict handling.

server_update() {
  log_step_start "pull" "Server git pull"

  local remote_dir="$DEPLOY_REMOTE_DIR"
  local branch="$DEPLOY_BRANCH"

  # Ensure directory exists / is a git repo
  if ! ssh_cmd "test -d '${remote_dir}/.git'"; then
    log_warn "Remote project not cloned yet at ${remote_dir}"
    if ui_confirm "Clone ${DEPLOY_GIT_URL} into ${remote_dir} now?" Y; then
      ssh_cmd "mkdir -p '$(dirname "$remote_dir")' && git clone --branch '${branch}' '${DEPLOY_GIT_URL}' '${remote_dir}'"
      change_record "[cloned]    ${DEPLOY_GIT_URL} → ${remote_dir}"
    else
      log_step_fail "pull" "Server git pull" "remote dir missing"
      return 1
    fi
  fi

  local before after status_out
  before="$(ssh_cmd "cd '${remote_dir}' && git rev-parse --short HEAD")"

  # Detect dirty tree
  status_out="$(ssh_cmd "cd '${remote_dir}' && git status --porcelain")" || true
  if [[ -n "$status_out" ]]; then
    log_warn "Server working tree is dirty:"
    echo "$status_out" | sed 's/^/    /'
    echo ""
    echo "  Options:"
    echo "    a) Abort"
    echo "    r) Reset hard to origin/${branch} (DESTRUCTIVE)"
    echo "    s) Stash, pull, then leave stash"
    local choice
    choice="$(ui_ask "Choose" "a")"
    case "$choice" in
      r|R)
        if ui_confirm "Really reset --hard on the server?" N; then
          ssh_cmd "cd '${remote_dir}' && git fetch origin && git reset --hard 'origin/${branch}' && git clean -fd"
          change_record "[reset]     server git → origin/${branch}"
        else
          log_step_fail "pull" "Server git pull" "aborted (dirty tree)"
          return 1
        fi
        ;;
      s|S)
        ssh_cmd "cd '${remote_dir}' && git stash push -u -m 'deploy-auto-stash'"
        change_record "[stashed]   server dirty tree"
        ;;
      *)
        log_step_fail "pull" "Server git pull" "aborted (dirty tree)"
        return 1
        ;;
    esac
  fi

  if ! retry 3 3 "server git pull" -- ssh_cmd \
    "cd '${remote_dir}' && git fetch origin && git checkout '${branch}' && git pull --ff-only origin '${branch}'"; then
    log_warn "Fast-forward pull failed — possible divergence"
    if ui_confirm "Force reset server to origin/${branch}?" N; then
      ssh_cmd "cd '${remote_dir}' && git fetch origin && git reset --hard 'origin/${branch}'"
      change_record "[reset]     server git force → origin/${branch}"
    else
      log_step_fail "pull" "Server git pull" "pull failed"
      return 1
    fi
  fi

  after="$(ssh_cmd "cd '${remote_dir}' && git rev-parse --short HEAD")"
  if [[ "$before" != "$after" ]]; then
    change_record "[pulled]    git ${before} → ${after}"
  else
    change_record "(no changes) server already at ${after}"
  fi
  log_step_ok "pull" "Server git pull" "${before} → ${after}"
}
