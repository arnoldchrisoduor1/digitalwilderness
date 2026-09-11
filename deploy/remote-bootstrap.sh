#!/usr/bin/env bash
# One-shot remote provisioner for Digital Wilderness (idempotent).
# Prefer menu option 6 in deploy.sh — this script is a fallback for first setup.
# Safe on a droplet that already hosts the portfolio: skips installed system pkgs;
# only creates THIS app's clone, nginx site, and (optionally) cert.
set -euo pipefail

REMOTE_DIR="/opt/digital-wilderness"
GIT_URL="https://github.com/arnoldchrisoduor1/digitalwilderness.git"
BRANCH="redesign/swiss-modernism"
APP_SUBDIR="frontend"
APP_PORT="7291"
DOMAIN="wilderness.oduor-arnold.com"
NGINX_SITE="digital-wilderness"

echo "==> Base packages (skip heavy work if already present)"
export DEBIAN_FRONTEND=noninteractive
if command -v curl >/dev/null && command -v git >/dev/null; then
  echo "base tools present"
else
  apt-get update -qq
  apt-get install -y -qq ca-certificates curl gnupg lsb-release git ufw openssl \
    apt-transport-https software-properties-common
fi

echo "==> swap"
if [[ ! -f /swapfile ]]; then
  fallocate -l 1G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=1024
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "swap created"
else
  echo "swap exists"
fi

echo "==> Docker"
if command -v docker >/dev/null && docker compose version >/dev/null 2>&1; then
  echo "Docker already installed"
else
  install -m 0755 -d /etc/apt/keyrings
  if [[ ! -f /etc/apt/keyrings/docker.asc ]]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
  fi
  arch="$(dpkg --print-architecture)"
  codename="$(. /etc/os-release && echo "$VERSION_CODENAME")"
  echo "deb [arch=${arch} signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${codename} stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi
systemctl enable --now docker

echo "==> Nginx"
if command -v nginx >/dev/null; then
  echo "Nginx already installed"
else
  apt-get install -y -qq nginx
fi
systemctl enable --now nginx

echo "==> Certbot"
if command -v certbot >/dev/null; then
  echo "Certbot already installed"
else
  apt-get install -y -qq certbot python3-certbot-nginx
fi

echo "==> UFW"
ufw allow OpenSSH >/dev/null || true
ufw allow 80/tcp >/dev/null || true
ufw allow 443/tcp >/dev/null || true
ufw --force enable || true

echo "==> Clone Digital Wilderness (NOT portfolio)"
if [[ -d "${REMOTE_DIR}/.git" ]]; then
  echo "Already cloned"
  cd "$REMOTE_DIR"
  git fetch origin
  git checkout "$BRANCH"
  git pull --ff-only origin "$BRANCH" || true
else
  mkdir -p "$(dirname "$REMOTE_DIR")"
  git clone --branch "$BRANCH" "$GIT_URL" "$REMOTE_DIR"
fi

echo "==> Nginx site ${NGINX_SITE} (does not touch sites-available/portfolio)"
cat > "/etc/nginx/sites-available/${NGINX_SITE}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
rm -f /etc/nginx/sites-enabled/default
ln -sfn "/etc/nginx/sites-available/${NGINX_SITE}" "/etc/nginx/sites-enabled/${NGINX_SITE}"
nginx -t
systemctl reload nginx

echo "==> Provision complete for Digital Wilderness"
echo "Compose dir: ${REMOTE_DIR}/${APP_SUBDIR}"
echo "Next: docker compose -p digital-wilderness up -d --build"
echo "Then: certbot --nginx -d ${DOMAIN} --cert-name ${DOMAIN}  (separate from portfolio cert)"
