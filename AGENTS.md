# AGENTS.md

## Commands
- Use `npm`, not `pnpm` or `yarn`; the repo has `package-lock.json` and `package.json` only.
- Main checks are `npm run lint` and `npm run build`.
- There is no `test` script or test framework configured. Do not claim tests passed unless you added and ran your own.

## Stack And Wiring
- Single-package Next.js 16 App Router app with React 19, TypeScript, Tailwind CSS 4.
- App entrypoints live under `src/app`; the global shell is `src/app/layout.tsx` and global styles are in `src/app/globals.css`.
- Shared UI is organized by feature under `src/components/<Feature>/<Feature>.tsx`, not as flat utility components.
- The TypeScript import alias is `@/* -> src/*`.

## Repo-Specific Constraints
- TypeScript is strict and `noEmit`; there is no separate typecheck script, so use `npm run build` when you need a full compile-level verification.
- Tailwind is configured through `@import "tailwindcss"` in `src/app/globals.css` plus `@tailwindcss/postcss` in `postcss.config.mjs`; do not look for a Tailwind config file unless you create a new need for one.
- `next/image` remote loading is only configured for `https://images.unsplash.com` in `next.config.ts`. New remote image hosts need config updates or images will fail at runtime.

## Route Shape
- Public routes are not limited to the homepage: `src/app` also contains `ban-can-ho-chung-cu`, `properties/[id]`, `nha-moi-gioi`, `doanh-nghiep`, `tin-tuc`, and seller flows under `nguoi-ban` including a `(dashboard)` group.
- Most pages are server components by default. Client components are used selectively in interactive seller-flow files and `src/components/PropertyDetail/PropertyGallery.tsx`; add `"use client"` only where needed.

## Existing Instructions
- `CLAUDE.md` has a useful high-level summary, but its route list is incomplete. Prefer the actual `src/app` tree when mapping features.
