# Deploying Digital Wilderness

Interactive, menu-driven deploy for this static Next.js export (`frontend/`).

Runs **side-by-side** on the same DigitalOcean droplet as the personal portfolio site. This script never targets the portfolio’s compose project, nginx site, or cert.

## Quick start

From Git Bash (or any bash) in the project root:

```bash
./deploy.sh
```

| Option | What it does |
|--------|----------------|
| 1 | Full deploy: build → commit/push → server pull → checks → containers → reachability |
| 2 | Local build + push to GitHub only |
| 3 | Server pull + `docker compose up -d --build` (skip local build/git) |
| 4 | Restart containers only |
| 5 | Pre-flight checks (ports / DNS / SSL / Docker / Nginx) |
| 6 | **Provision** (idempotent; skips Docker/Nginx/Certbot/UFW if already present; creates this app’s folder, nginx site, cert) |
| 7 | Tail `deploy.log` |
| 0 | Exit |

On this shared droplet, run **6** once for app-specific setup, then **1** for deploys.

## Architecture

```
Internet → host Nginx (:80/:443) → 127.0.0.1:7291 → Docker (nginx:alpine serving frontend/out/)
```

- Build happens **locally** in `frontend/` (`npm run build` → `out/`), committed and pulled on the server.
- Host Nginx + Certbot handle TLS; the container only listens on localhost.
- **Docker network:** fully isolated from the portfolio. Each compose project has its own default network; host Nginx proxies to distinct localhost ports. They do **not** share a Docker network.

## Shared droplet — what’s taken vs this app

| Resource | Portfolio (do not touch) | Digital Wilderness |
|----------|--------------------------|--------------------|
| Remote dir | `/opt/portfolio_v3` | `/opt/digital-wilderness` |
| Compose project | `portfolio_v3` | `digital-wilderness` (`name:` + `-p`) |
| Container | `portfolio-v3-arnol` | `digitalwilderness-web` |
| Host port | `127.0.0.1:8472` | `127.0.0.1:7291` |
| Nginx site file | `sites-available/portfolio` | `sites-available/digital-wilderness` |
| Domain / cert | `oduor-arnold.com` (+ www), cert name `oduor-arnold.com` | `wilderness.oduor-arnold.com`, separate cert (no `--expand`) |
| SSH alias | `portfolio-deploy` | `wilderness-deploy` |
| App path in repo | repo root | `frontend/` |

## Changed from the copied portfolio deploy scripts

- Defaults / `deploy.config` → wilderness domain, `/opt/digital-wilderness`, port **7291**, compose project **digital-wilderness**, nginx site **digital-wilderness**, git remote `digitalwilderness`, SSH alias `wilderness-deploy`.
- Build + compose run under `frontend/` (`DEPLOY_APP_SUBDIR`).
- Provision skips system installs when present; only creates this app’s clone, nginx site, and cert. Refuses portfolio paths/ports/site names.
- Certbot issues a **new** cert for `wilderness.oduor-arnold.com` only (`DEPLOY_INCLUDE_WWW=0`, no `--expand`).
- Reachability includes a **neighbor check** that `https://oduor-arnold.com` stays up.
- Audit trail labeled **“Digital Wilderness deploy — changes made”**.
- Nginx template renamed to `deploy/templates/nginx-digital-wilderness.conf.tpl`.
- `frontend/docker-compose.yml`: localhost bind + explicit `name: digital-wilderness`.

## `deploy.config`

Created/updated locally. **Gitignored.** Reset by deleting it and re-running `./deploy.sh`.

## Logs & audit

Each run appends to `deploy.log` (gitignored) and prints a changes list + step table labeled for Digital Wilderness.

## Manual one-offs

Anything done by hand on the server that the script does not encode should be listed below.

---

## Server notes

- Droplet: `104.248.224.133` (same as portfolio). System stack (Docker, Nginx, Certbot, UFW, swap) already provisioned by the portfolio deploy.
- DNS A record for `wilderness.oduor-arnold.com` → droplet.
- **First successful provision + deploy (2026-09-11):** system pkgs skipped; cloned to `/opt/digital-wilderness`; nginx site `digital-wilderness` enabled; separate Let's Encrypt cert issued (expires ~2026-12-10); container `digitalwilderness-web` on `127.0.0.1:7291`; both https://wilderness.oduor-arnold.com and https://oduor-arnold.com returned HTTP 200.
- Portfolio must remain at https://oduor-arnold.com — neighbor check in this script verifies after each deploy.
