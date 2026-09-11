#!/usr/bin/env bash
# Local Next.js static export build (app lives under DEPLOY_APP_SUBDIR).

build_local() {
  log_step_start "build" "Local Next.js build"

  local app_dir
  app_dir="$(deploy_local_app_dir)"

  if [[ ! -f "${app_dir}/package.json" ]]; then
    log_step_fail "build" "Local Next.js build" "package.json not found in ${app_dir}"
    return 1
  fi

  pushd "$app_dir" >/dev/null

  if [[ ! -d node_modules ]]; then
    log_info "node_modules missing — running npm ci / npm install"
    if [[ -f package-lock.json ]]; then
      npm ci
    else
      npm install
    fi
    change_record "[installed] local npm dependencies (${DEPLOY_APP_SUBDIR}/)"
  fi

  log_info "Running npm run build in ${app_dir}…"
  if ! npm run build; then
    popd >/dev/null
    log_step_fail "build" "Local Next.js build" "npm run build failed"
    return 1
  fi

  if [[ ! -d out ]] || [[ -z "$(ls -A out 2>/dev/null)" ]]; then
    popd >/dev/null
    log_step_fail "build" "Local Next.js build" "out/ missing or empty"
    return 1
  fi

  if [[ ! -f out/index.html ]]; then
    popd >/dev/null
    log_step_fail "build" "Local Next.js build" "out/index.html missing"
    return 1
  fi

  local count
  count="$(find out -type f | wc -l | tr -d ' ')"
  popd >/dev/null
  change_record "[built]     ${DEPLOY_APP_SUBDIR}/out/ (${count} files)"
  log_step_ok "build" "Local Next.js build" "${count} files in ${DEPLOY_APP_SUBDIR}/out/"
}
