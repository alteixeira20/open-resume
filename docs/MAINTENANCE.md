# Maintenance & Upgrades (Fork)

This file documents the maintenance decisions and upgrades applied to this fork so contributors can understand *what changed, why, and how to keep it stable*.

## Current Baseline
- **Node:** 20 LTS (see `.nvmrc`)
- **Next.js:** 16.x
- **React:** 18.x
- **ESLint:** 9.x (flat config)

## Upgrade Log

### 2026-01 — Runtime + Tooling
- **Node 20 LTS pinned** to standardize native dependencies and avoid ABI mismatches.
- **ESLint 9 migration** using `eslint.config.mjs` and flat config.
- **Next 16 upgrade** for security patches and supported platform longevity.
- **Webpack build flag** used for production builds to keep pdfjs aliases stable.
- **Testing stack refreshed**: `@testing-library/*` moved to 6.x/16.x, Jest stays on 29.x to avoid native `canvas` peer pressure in Jest 30.
- **Tooling patches**: autoprefixer updated to latest 10.4.x, prettier Tailwind plugin updated to 0.7.x.
- **Redux runtime**: `@reduxjs/toolkit` upgraded to 2.x and `react-redux` to 9.x.
- **React types (18.x)**: type packages bumped to satisfy new Redux peer requirements.
- **Sharp patch**: upgraded to latest 0.34.x for security and stability.
- **React-PDF upgrade**: moved to 4.x and added `transpilePackages` in Next config to support ESM-only build.
- **pdfjs-dist upgrade**: moved to 5.x with client-only dynamic import, using `pdfjs-dist/webpack.mjs` so webpack configures the worker in-browser.
- **Tailwind 4**: upgraded Tailwind CSS to 4.x and `tailwind-scrollbar` to 4.x after verifying lint/tests/build.
- **Tailwind PostCSS**: switched PostCSS plugin to `@tailwindcss/postcss` per Tailwind 4 requirements.

### 2026-01 — Version Bump
- **Package version** updated to **0.2.0** to reflect the accumulated upgrades and tooling changes.

## Why Webpack in Next 16
This project uses `pdfjs-dist`, which in Node environments optionally tries to resolve `canvas` and `encoding`. We disable those aliases for browser-only usage. Webpack handles these overrides reliably.

In Next 16, Turbopack is enabled by default, but its alias handling differs and can break with boolean alias entries. We explicitly pass `--webpack` in `npm run build` and `npm run dev` to keep the behavior stable.

## Workspace Root Warning
If Next reports a workspace root warning, it usually means multiple lockfiles exist in a parent directory. We set `outputFileTracingRoot` to the project directory to silence it.

## How to Test After Upgrades
```sh
npm run lint
npm run test:ci
npm run build
```

## Known Risks
- Major upgrades to React or Tailwind require UI snapshot validation.
- Updates to `pdfjs-dist` or `@react-pdf/renderer` can break parsing or PDF rendering; test parser and builder carefully.
