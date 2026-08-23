# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

Single-page marketing site for "Digital Wilderness" studio. Real app lives in `frontend/`; `prototype.html` at repo root is a standalone static mockup (not wired into the Next.js app — don't edit it expecting it to affect the site).

All commands below run from `frontend/`.

## Commands

```bash
npm install
npm run dev      # localhost:4827
npm run build    # static export to frontend/out/
npm run lint
```

No test suite configured.

### Deploy (manual, not CI)

Build is done locally, not on the server — Docker only copies the prebuilt `out/`:

1. `npm run build` locally
2. commit + push source **and** `frontend/out/`
3. on server: `docker compose up -d --build` (Nginx serves `out/` on port 7291; dev server is 4827)

## Architecture

Next.js 16 App Router, but `output: "export"` (next.config.ts) — this is a fully static site, no server runtime, no API routes, no route handlers. Keep new code compatible with static export (no `next/server`-only features).

- `src/app/page.tsx` composes the whole page as a flat stack of section components (`Hero`, `Capabilities`, `Showcase`, `Pipeline`, `Research`, `Stack`, `CtaBand`, `Footer`) plus chrome (`Navbar`, `ScrollProgress`, `ToTop`). To add/reorder a section, edit this file and drop a component in `src/components/`.
- `src/lib/constants.ts` is the single source of copy/content — nav links, capability cards, pipeline steps, research stats, stack rows, footer links. Prefer editing data here over hardcoding text in components.
- `src/components/canvas/` holds the WebGL work: raw Three.js scenes (`ThreeScene.tsx`, `HeroCanvas.tsx`, `SwarmCanvas.tsx`) driven by manual `useEffect` + `requestAnimationFrame` loops (no react-three-fiber). Each mounts into a ref'd div, owns pointer/resize listeners, and must clean up (`cancelAnimationFrame`, remove listeners, `renderer.dispose()`) in the effect's return — follow this pattern for new scenes.
- Framer Motion (`MotionReveal.tsx`) drives scroll-triggered reveals used across sections.
- Fonts are loaded via `next/font/google` in `src/app/layout.tsx` (Syne, Inter, JetBrains Mono) and exposed as CSS variables consumed in `globals.css`/Tailwind.
- Styling is Tailwind CSS 4 (no `tailwind.config` — v4 CSS-based config lives in `globals.css`).

## Notes

- `AGENTS.md` flags that this repo's Next.js version (16) may diverge from training data — check `node_modules/next/dist/docs/` for current APIs/conventions before assuming behavior.
- `frontend/out/` and `frontend/.next/` are build artifacts; `out/` is intentionally committed (it's what gets deployed) but should only change via `npm run build`, never hand-edited.
