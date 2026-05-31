# CLAUDE.md

Guidance for working in this repo. Keep changes minimal and match existing patterns.

## Project

`tadak-frontend` — a typing-practice web app (타닥). Korean-language product; UI copy, comments, and commit messages are written in Korean.

## Stack

- **React 19** + **TypeScript 6**, built with **Vite 8**
- **Tailwind CSS v4** for styling (config-less, `@import "tailwindcss"` in [src/index.css](src/index.css))
- **MUI v9** + **Emotion** (`@mui/material`, `@mui/icons-material`)
- **react-router-dom v7** (`createBrowserRouter`)

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check (`tsc -b`) then build |
| `npm run lint` | ESLint (flat config, [eslint.config.js](eslint.config.js)) |
| `npm run preview` | Preview production build |

Run `npm run build` before claiming a change compiles — `build` includes the type-check.

## Conventions

- **Path aliases** (defined in [tsconfig.paths.json](tsconfig.paths.json), resolved by Vite + tsc) — use aliases for **cross-area** imports (between top-level `src/` areas); keep relative `./` only for same-directory / same-feature-folder siblings (e.g. a page importing its own `./components/*`, a barrel's `./Header`).
  Available: `@assets/*`, `@components/*`, `@layouts/*`, `@pages/*`, `@routes/*`, `@designs/*`, `@design-system`
- **Styling tokens** — define colors as `@theme` CSS variables in [src/index.css](src/index.css), then reference via Tailwind classes (e.g. `bg-indigo-100`). Do **not** hardcode hex values in components.
- **Shared layout classes** — reusable Tailwind class strings live in [src/designs/design-system.ts](src/designs/design-system.ts) as named exports (`pageShell`, `panel`, `sidebarNavItem`, …). Reuse these instead of redefining layout utilities inline.
- **Structure** — pages in `src/pages/`, page-local components under `src/pages/<Page>/components/`, shared components in `src/components/`, layout chrome in `src/layouts/`.
- **Dev-only routes** — routes under `/dev/*` are registered only when `import.meta.env.DEV` (see [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx)).
- **Commits** — Korean message body with conventional prefix (`refactor:`, `feat:`, `fix:`).

## Don'ts

- Don't add hardcoded color hex values — extend `@theme` tokens instead.
- Don't introduce cross-area relative imports (`../`, `../../`) when a path alias covers it — use the alias.
- Don't register new permanent routes under `/dev`.
