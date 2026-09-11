#!/usr/bin/env bash
# Terminal UX helpers: colors, banner, spinner, prompts, sections.

_UI_COLOR=1
if [[ ! -t 1 ]] || [[ "${NO_COLOR:-}" == "1" ]]; then
  _UI_COLOR=0
elif ! tput colors &>/dev/null; then
  _UI_COLOR=0
fi

if [[ $_UI_COLOR -eq 1 ]]; then
  C_RESET=$'\033[0m'
  C_BOLD=$'\033[1m'
  C_DIM=$'\033[2m'
  C_RED=$'\033[31m'
  C_GREEN=$'\033[32m'
  C_YELLOW=$'\033[33m'
  C_BLUE=$'\033[34m'
  C_CYAN=$'\033[36m'
else
  C_RESET=""; C_BOLD=""; C_DIM=""; C_RED=""; C_GREEN=""; C_YELLOW=""; C_BLUE=""; C_CYAN=""
fi

ui_banner() {
  local site="${1:-digital-wilderness}"
  local target="${2:-production}"
  echo ""
  echo "${C_CYAN}${C_BOLD}"
  cat <<'EOF'
  ____  _       _ _        _  __        ___ _     _
 |  _ \(_) __ _(_) |_ __ _| | \ \      / (_) | __| |
 | | | | |/ _` | | __/ _` | |  \ \ /\ / /| | |/ _` |
 | |_| | | (_| | | || (_| | |   \ V  V / | | | (_| |
 |____/|_|\__, |_|\__\__,_|_|    \_/\_/  |_|_|\__,_|
          |___/   Digital Wilderness deploy
EOF
  echo "${C_RESET}"
  echo "  ${C_BOLD}${site}${C_RESET}  →  ${C_CYAN}${target}${C_RESET}"
  echo "  ${C_DIM}$(date '+%Y-%m-%d %H:%M:%S')${C_RESET}"
  echo ""
}

ui_section() {
  echo ""
  echo "${C_BOLD}${C_BLUE}▸ $*${C_RESET}"
}

ui_info()  { echo "  ${C_CYAN}ℹ${C_RESET}  $*"; }
ui_ok()    { echo "  ${C_GREEN}✓${C_RESET}  $*"; }
ui_warn()  { echo "  ${C_YELLOW}!${C_RESET}  $*"; }
ui_err()   { echo "  ${C_RED}✗${C_RESET}  $*" >&2; }

ui_step_start() {
  local n="$1" name="$2"
  echo ""
  echo "${C_BOLD}[$n]${C_RESET} ${name} ${C_DIM}…${C_RESET}"
}
ui_step_ok() {
  local n="$1" name="$2" detail="${3:-}"
  echo "  ${C_GREEN}✓${C_RESET} [$n] ${name}${detail:+ — $detail}"
}
ui_step_fail() {
  local n="$1" name="$2" detail="${3:-}"
  echo "  ${C_RED}✗${C_RESET} [$n] ${name}${detail:+ — $detail}" >&2
}
ui_step_skip() {
  local n="$1" name="$2" detail="${3:-}"
  echo "  ${C_DIM}–${C_RESET} [$n] ${name}${detail:+ — $detail}"
}

# Prompt with default. Usage: answer=$(ui_ask "Server host" "example.com")
ui_ask() {
  local prompt="$1"
  local default="${2:-}"
  local reply
  if [[ -n "$default" ]]; then
    read -r -p "  ${prompt} [${default}]: " reply || true
    echo "${reply:-$default}"
  else
    read -r -p "  ${prompt}: " reply || true
    echo "$reply"
  fi
}

# Y/n confirm. Default Y if first arg is Y, else n.
# Usage: ui_confirm "Proceed?" Y && ...
ui_confirm() {
  local prompt="$1"
  local default="${2:-Y}"
  local reply hint
  if [[ "$default" =~ ^[Yy]$ ]]; then
    hint="Y/n"
  else
    hint="y/N"
  fi
  read -r -p "  ${prompt} [${hint}]: " reply || true
  reply="${reply:-$default}"
  [[ "$reply" =~ ^[Yy]$ ]]
}

ui_press_enter() {
  local msg="${1:-Press Enter to continue…}"
  read -r -p "  ${msg}" _ || true
}

# Spinner while a background PID runs.
# Usage: long_cmd & ui_spin $! "Building"
ui_spin() {
  local pid="$1"
  local label="${2:-Working}"
  local frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
  local i=0
  if [[ ! -t 1 ]] || [[ $_UI_COLOR -eq 0 ]]; then
    wait "$pid"
    return $?
  fi
  while kill -0 "$pid" 2>/dev/null; do
    printf "\r  ${C_CYAN}%s${C_RESET} %s…" "${frames[$i]}" "$label"
    i=$(( (i + 1) % ${#frames[@]} ))
    sleep 0.1
  done
  printf "\r\033[K"
  wait "$pid"
}
