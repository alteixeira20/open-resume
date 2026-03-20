# Maintenance & Upgrades (Fork)

This file documents the maintenance decisions and upgrades applied to this fork so contributors can understand what changed, why, and how to keep it stable.

## Current Baseline

- **Node:** 20 LTS (see `.nvmrc`)
- **Next.js:** 16.x
- **React:** 19.2.x
- **ESLint:** 9.x (flat config)
- **Tailwind CSS:** 4.x
- **Redux Toolkit:** 2.x
- **pdfjs-dist:** 5.x
- **@react-pdf/renderer:** 4.x

## Upgrade Log

### 2026-01 — Runtime + Tooling

- **Node 20 LTS pinned** to standardize native dependencies and avoid ABI mismatches.
- **ESLint 9 migration** using `eslint.config.mjs` and flat config.
- **Next 16 upgrade** for security patches and supported platform longevity.
- **Webpack build flag** used for production builds to keep pdf.js aliases stable.
- **Testing stack refreshed** to stay compatible with the newer React / Next baseline.
- **Redux runtime** updated to the current 2.x / 9.x combination.
- **React 19 migration** for runtime and type packages.
- **React-PDF upgrade** to 4.x with `transpilePackages` in Next config for ESM compatibility.
- **pdfjs-dist upgrade** to 5.x with browser asset copying handled by `scripts/copy-pdfjs.mjs`.
- **Tailwind 4 migration** plus the `@tailwindcss/postcss` plugin switch.

### 2026-01 — Version Bump

- **Package version** updated to `0.2.0`.

### 2026-02 — UX + Workbench Alignment

- **Builder / parser parity**: matching workbench structure and preview alignment.
- **Preview controls**: manual refresh and Enter-to-refresh for stable editing.
- **Import hub**: resume import flow consolidated and clarified.

### 2026-03 — Rebrand + Route Cleanup

- **Product identity** changed to CVForge.
- **Canonical routes** changed to `/builder` and `/parser`, with redirects kept for older URLs.
- **Shared layout primitives** added for workbench shell, preview container, and workbench headers.
- **Forge design tokens** moved into `src/app/globals.css` and mirrored in `src/app/lib/theme-tokens.ts`.
- **Homepage content** centralized in `src/app/content/*`.

## Why Webpack in Next 16

This project uses `pdfjs-dist`, which in Node environments optionally tries to resolve `canvas` and `encoding`. We disable those aliases for browser-only usage. Webpack handles these overrides reliably.

In Next 16, Turbopack is enabled by default, but its alias handling differs and can break with boolean alias entries. The project therefore uses `--webpack` in both `npm run dev` and `npm run build`.

## Workspace Root Warning

If Next reports a workspace root warning, it usually means multiple lockfiles exist in a parent directory. The project sets `outputFileTracingRoot` to the project directory to keep tracing local to the repo.

## How to Test After Upgrades

```sh
npm run lint
npm run test:ci
npm run build
```

When touching core UX or parsing behavior, also manually sanity-check:
- `/builder`
- `/parser`
- `/resume-import`

## Known Risks

- Major upgrades to React or Tailwind require UI validation, not just type safety.
- Updates to `pdfjs-dist` or `@react-pdf/renderer` can break parsing or PDF rendering; test builder and parser carefully.
- Changes inside `src/app/components/Resume/ResumePDF/` affect exported PDF output and should be isolated from UI-only rebrand work.
