# Digital Wilderness — Frontend

Next.js static site exported to `/out` and served with Nginx in Docker.

## Local development

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:4827](http://localhost:4827).

## Build (run locally, not on the server)

```bash
npm run build
```

Output lands in `frontend/out/`. Commit and push `out/` with your deploy.

## Docker (server / preview)

Docker only copies the pre-built `out/` folder into Nginx. It does **not** run `npm install` or `next build`.

```bash
docker compose up -d --build
```

Open [http://localhost:7291](http://localhost:7291).

## Deploy workflow

1. On your machine: `npm run build`
2. Push source + `frontend/out/`
3. On the server: `docker compose up -d --build`

The image build should take seconds — just Nginx + static files.

## Stack

- Next.js 16 (App Router, `output: "export"`)
- Framer Motion
- Three.js (WebGL showcase)
- Tailwind CSS 4
