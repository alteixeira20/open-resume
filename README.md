<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js badge">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=000000" alt="React badge">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript badge">
  <img src="https://img.shields.io/badge/Tailwind-3.3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind badge">
  <img src="https://img.shields.io/badge/Node-20_LTS-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node badge">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker badge">
  <img src="https://img.shields.io/badge/Status-WIP-yellow?style=for-the-badge" alt="WIP badge">
</p>

<h1 align="center">OpenResume</h1>
<p align="center">Local-first CV builder + ATS parser with EU A4 / US Letter presets.</p>

<p align="center"><sub><em>Original project by <a href="https://github.com/xitanggg">Xitang Zhao</a>. Fork maintained by <a href="https://github.com/alteixeira20">Alexandre Teixeira</a>.</em></sub></p>

<p align="center">
  <a href="https://open-resume.alexandreteixeira.dev/">Live demo</a>
</p>

<p align="center">
  <img src="public/assets/ATS_scoring.png" alt="ATS scoring preview" width="85%" />
  <br />
  <em>ATS scoring breakdown with local diagnostics.</em>
</p>

## Table of Contents
1. [At a Glance](#at-a-glance)
2. [About](#about)
3. [What This Fork Adds](#what-this-fork-adds)
4. [ATS Scoring](#ats-scoring)
5. [EU vs US Presets](#eu-vs-us-presets)
6. [Self-Hosting](#self-hosting)
7. [Deploy with Docker (Behind Reverse Proxy)](#deploy-with-docker-behind-reverse-proxy)
8. [Testing](#testing)
9. [Project Layout](#project-layout)
10. [Maintenance & Upgrades](#maintenance--upgrades)
11. [Credits](#credits)

## At a Glance
> **Highlights:** Local-first CV builder, deterministic ATS scoring, and region-aware defaults.

- EU A4 and US Letter presets for layout, spacing, and headings.
- ATS scoring and diagnostics run entirely offline (no third-party APIs).
- Parser transparency: see extracted fields, token evidence, and issue details.
- Builder includes GitHub profiles, project links, languages, and optional GPA (US).
- Typography controls: body size, name size, section spacing, line height.
- Docker and Makefile workflows for easy self-hosting.

## About
OpenResume is a free, open-source resume/CV builder and ATS parser you can run locally. It generates professional, ATS-friendly PDFs and helps validate parsing reliability before you apply.

## What This Fork Adds
> **Highlights:** EU-focused CV workflow with an ATS-quality feedback loop.

- **Local ATS scoring** with UI + API + CLI parity.
- **EU vs US presets** (A4 vs Letter) in both builder and parser.
- **ATS issue details** to show *exact* detections and missing fields.
- **Extra builder fields**: GitHub, project links, languages, optional GPA.
- **Typography controls** for fine-tuned readability.
- **Navigation sidebar** for fast form section jumps.

## ATS Scoring
The ATS engine grades resumes on parsing reliability, structure, readability, and optional job-description keywords. It returns a score plus a list of actionable issues with diagnostic details.

- Full breakdown: `docs/ATS_SCORING.md`
- Issue list: `docs/ATS_ISSUES.md`

## EU vs US Presets
- **EU (A4)** uses A4 sizing and EU-friendly headings.
- **US (Letter)** uses Letter sizing and US-oriented headings.
- Parser expectations match your selected region.

## Self-Hosting
**Prerequisites:**
- Node.js **20 LTS** (see `.nvmrc`)
- npm

**Quick start (npm):**
```sh
npm install
npm run build
npm start
```

**Quick start (Makefile):**
```sh
make install
make build
make run
```

## Deploy with Docker (Behind Reverse Proxy)
```sh
git clone https://github.com/alteixeira20/open-resume.git
cd open-resume

docker network create edge   # if it doesn't exist

docker compose up -d --build
```

Verify from your proxy container:
```sh
docker exec nginx wget -qO- http://open-resume:3000 | head
```

## Testing
> **Highlights:** Parser heuristics, ATS scoring, and UI safeguards are covered by unit and component tests.

```sh
npm run lint
npm run test:ci
npm run build
```

- Parser coverage: section grouping, bullet extraction, subsection splitting, feature scoring.
- ATS coverage: scoring breakdowns, JD keyword impact, EU vs US formats, issue reporting.
- UI coverage: locale toggle, import dropzone validation.
- Core utils: deep clone/merge helpers, object iterators, class name combinator.

## Project Layout
- `src/app` — Next.js app routes and UI components
- `src/app/lib` — parsing, ATS scoring, and shared utilities
- `public` — assets, fonts, and example resumes
- `docs` — scoring details, issues reference, and hosting notes
- `scripts` — CLI tooling

## Maintenance & Upgrades
This fork is actively maintained with explicit upgrades and compatibility notes:

- **Node 20 LTS** pinned via `.nvmrc`
- **Next 16** migration with Webpack build flags for stability
- **ESLint 9** flat config (`eslint.config.mjs`)
- **Sitemap + robots** via Next route handlers

See `docs/MAINTENANCE.md` for upgrade history and rationale.

## Credits
- Original project: <a href="https://github.com/xitanggg">Xitang Zhao</a>
- Design: <a href="https://www.linkedin.com/in/imzhi">Zhigang Wen</a>
- Fork maintainer: <a href="https://github.com/alteixeira20">Alexandre Teixeira</a>

Licensed under MIT. See `LICENSE`.
