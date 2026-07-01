# Digital Wilderness — Frontend

Next.js static site for [Digital Wilderness](https://digitalwilderness.dev), exported to `/out` for deployment.

## Local development

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build static export

```bash
npm run build
```

Output lands in `frontend/out/`. Commit this folder and deploy it on your server — no build step required on the host.

## Docker build (recommended for reproducible exports)

Build and write `out/` to your machine:

```bash
docker compose run --rm build
```

Preview the built site with nginx:

```bash
docker compose up serve
```

Then open [http://localhost:3000](http://localhost:3000).

## Server deployment

Point your web server (nginx, Apache, Caddy, etc.) at the contents of `frontend/out/`.

Example nginx root:

```nginx
root /var/www/digitalwilderness/out;
index index.html;
try_files $uri $uri/ $uri.html /index.html;
```

## Stack

- Next.js 16 (App Router, `output: "export"`)
- Framer Motion
- Three.js (WebGL showcase)
- Tailwind CSS 4
