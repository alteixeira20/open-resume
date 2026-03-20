# Architecture

This document describes how CVForge is currently structured in code and how the main runtime flows fit together.

## Stack

- **Framework:** Next.js 16 App Router
- **UI:** React 19 + TypeScript
- **Styling:** Tailwind CSS 4 + global CSS variables in `src/app/globals.css`
- **State:** Redux Toolkit + `react-redux`
- **PDF rendering:** `@react-pdf/renderer`
- **PDF parsing:** `pdfjs-dist`
- **Tests:** Jest + Testing Library

## Route Map

- `/` landing page
- `/builder` Builder Workbench
- `/parser` Parser Workbench
- `/resume-import` import hub
- `/api/ats-score` ATS scoring API

Legacy redirects are configured in `next.config.js` for:
- `/resume-builder`
- `/resume-parser`
- `/ats-checker`

## High-Level App Structure

### `src/app`

This contains the App Router entry points, route metadata, content files, and globally shared UI.

Important areas:
- `src/app/page.tsx` homepage composition
- `src/app/layout.tsx` root layout, metadata, header, and analytics
- `src/app/builder` builder route
- `src/app/parser` parser route
- `src/app/resume-import` import route
- `src/app/content` public copy and route/link data

### `src/app/components`

Important component groups:
- `Resume/` live preview, iframe rendering, download bridge, and PDF document integration
- `ResumeForm/` builder forms and editing controls
- `layout/` shared page shell primitives such as `WorkbenchLayout`, `WorkbenchPreview`, `WorkbenchHeader`, `Section`, and `PageWrapper`
- `ui/` reusable app primitives such as `Button`, `Card`, `Badge`, and `SectionHeading`
- `fonts/` font registration and lazy CSS loading for React PDF

### `src/app/lib`

This contains business logic and utilities:
- `redux/` store, slices, selectors, persistence helpers
- `parse-resume-from-pdf/` pdf.js ingestion and extraction pipeline
- `ats-score/` ATS heuristics and issue generation
- `hooks/` shared hooks like `useWorkbenchCollapse`
- utility modules such as `cx`, `constants`, and `theme-tokens`

## Builder Workbench

Entry point:
- `src/app/builder/page.tsx`

Main pieces:
- `ResumeForm` on the left
- `Resume` preview on the right
- `ResumeDownloadBridge` for download events

Behavior:
- Redux state is initialized from local storage
- the form updates state continuously
- the large preview refreshes when the user triggers `resume:refresh-preview`
- the mobile / compact preview is shown inline through `ResumeInlinePreview`
- the shell collapses from two-column to one-column through `useWorkbenchCollapse`

Notes:
- the builder workbench and its surrounding UI can change without changing the exported PDF, as long as code under `ResumePDF/` is left alone
- the preview is scaled against available viewport height in `src/app/components/Resume/index.tsx`

## Parser Workbench

Entry point:
- `src/app/parser/page.tsx`

Main pieces:
- parser header and controls
- region toggle (`eu` / `us`)
- example PDF cards
- `ResumeDropzone`
- `AtsScoreCard`
- `ResumeTable`
- `ResumeParserAlgorithmArticle`
- iframe-based PDF preview on the right

Behavior:
- loads a PDF through `readPdf`
- groups text items into lines
- groups lines into sections
- extracts a resume-shaped model from those sections
- computes an ATS score from text items, lines, sections, extracted resume, and parser region

Parser region:
- defaults from local storage
- can inherit the builder locale from stored builder state
- affects page-size expectations and some scoring heuristics

## Shared Workbench Shell

The builder and parser now share the same outer layout structure:

- `WorkbenchLayout.tsx`
  - owns the full-height shell
  - handles two-column vs collapsed layout
  - keeps left and right panel spacing symmetric
- `WorkbenchPreview.tsx`
  - owns the right preview panel container
- `WorkbenchHeader.tsx`
  - normalizes title, description, and action placement
- `useWorkbenchCollapse.ts`
  - centralizes collapse logic for viewport width
  - builder also considers whether the current document can still render above a minimum preview scale

This is why the two workbench pages now feel structurally similar even though their contents differ.

## PDF Generation Flow

The exported document is rendered by React PDF:

1. Builder state lives in Redux.
2. `Resume` reads the current resume/settings state.
3. `ResumeIframeCSR` mounts a preview iframe.
4. `ResumePDF` renders the actual PDF document tree.
5. `ResumeDownloadBridge` listens for download events and triggers PDF / JSON export.

Sensitive area:
- `src/app/components/Resume/ResumePDF/`

Changes there affect actual exported output, not just the workbench UI.

## Parsing and Scoring Flow

The parser/scoring pipeline is:

1. `readPdf`
2. `groupTextItemsIntoLines`
3. `groupLinesIntoSections`
4. `extractResumeFromSections`
5. `calculateAtsScore`

The browser workbench, CLI, and API all depend on that same core logic under `src/app/lib`.

## Content and Branding

Public-facing copy is intentionally centralized:
- `src/app/content/site.ts`
- `src/app/content/home.ts`
- `src/app/content/features.tsx`
- `src/app/content/faq.tsx`
- `src/app/content/nav.ts`

Global forge tokens live in:
- `src/app/globals.css`
- `src/app/lib/theme-tokens.ts`

## Deployment Notes

- `npm run dev` and `npm run build` both explicitly use Webpack
- `next.config.js` disables `canvas` and `encoding` webpack aliases for `pdfjs-dist`
- `scripts/copy-pdfjs.mjs` copies browser pdf.js assets into `public/pdfjs`
- `Dockerfile` and compose files are included for self-hosting

## What to Treat Carefully

- `src/app/components/Resume/ResumePDF/`: changes affect exported PDFs
- `src/app/lib/ats-score/`: changes affect scores, docs, tests, and user expectations
- `src/app/lib/parse-resume-from-pdf/`: changes affect extraction quality and parser output
