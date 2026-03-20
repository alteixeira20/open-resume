# Self-Hosting CVForge

CVForge is a Next.js web app with three main user-facing routes:
- `/builder`
- `/parser`
- `/resume-import`

The builder, parser, and ATS scoring logic all run in the browser. The server mainly serves the app, static assets, and the optional ATS API route.

## Prerequisites

- **Node.js 20 LTS** (see `.nvmrc`)
- **npm**

## Quick Start (npm)

1. `git clone https://github.com/alteixeira20/cvforge.git`
2. `cd cvforge`
3. `npm install`
4. `npm run build`
5. `npm start`
6. Open `http://localhost:3000`

## Quick Start (Makefile)

1. `git clone https://github.com/alteixeira20/cvforge.git`
2. `cd cvforge`
3. `make install`
4. `make build`
5. `make run`
6. Open `http://localhost:3000`

Note: `make run` uses `npm run dev`, so it starts the development server. If you want the production server locally, use `npm run build && npm start`.

## What Runs Locally

- Builder workbench (PDF generation + JSON export)
- Parser workbench (PDF text extraction + ATS scoring)
- ATS API route, if you call it

CV data processing happens in the browser. The app does include Vercel Analytics in the root layout, but CV parsing, CV generation, and ATS scoring do not depend on any external CV-processing service.

## Docker

The repo includes:
- `Dockerfile`
- `docker-compose.yml`
- `docker-compose.local.yml`

Helpful commands:

```sh
docker compose up -d --build
```

For local production testing:

```sh
make docker-prod-local
```

That uses `scripts/run-prod-local.sh` and `docker-compose.local.yml`.

## Optional Tools

If you want to inspect PDF text extraction outside the app:

- macOS: `brew install poppler`
- Ubuntu/Debian: `sudo apt-get install poppler-utils`
- Arch: `sudo pacman -S poppler`

This gives you `pdftotext` and `pdfinfo` for local PDF inspection.
