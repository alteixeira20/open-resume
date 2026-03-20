# Fork Overview

CVForge is a fork of OpenResume focused on two concrete additions:

1. A more explicit workbench UX around building and validating a CV.
2. A local parser + ATS scoring workflow that lets the user inspect how a PDF is read.

The fork still preserves the original project model:
- one main PDF template rendered with `@react-pdf/renderer`
- browser-side editing
- browser-side parsing
- export without storing CV content on a backend

## Current Product Shape

The app currently exposes three main routes:
- `/builder` for editing and exporting
- `/parser` for PDF parsing, extraction, and ATS scoring
- `/resume-import` for restoring or importing data into the builder

Legacy route names still redirect:
- `/resume-builder`
- `/resume-parser`
- `/ats-checker`

## What Changed from the Original Fork Base

- **Branding:** the app is now presented as CVForge.
- **Workbench structure:** builder and parser pages use shared layout primitives for the shell, preview container, and header.
- **Parser workbench:** the parser is now a first-class route rather than a secondary utility page.
- **ATS scoring:** the parser page surfaces a score card, issue list, and parsed field table from the same local scoring engine used by the API and CLI.
- **EU / US support:** the builder and parser both support A4 and Letter expectations.
- **Import flow:** users can continue their last session, start fresh, or import PDF/JSON into the builder.
- **Content separation:** homepage copy, nav links, FAQ content, features, and site metadata now live in `src/app/content`.
- **Theme system:** global CSS tokens in `src/app/globals.css` back the forge palette and workbench layout spacing.

## Design Constraints That Matter

- The exported PDF template lives under `src/app/components/Resume/ResumePDF/` and should be treated as a high-sensitivity area because UI changes there affect final output.
- ATS scoring logic lives under `src/app/lib/ats-score/` and should be changed deliberately because docs, tests, and score expectations depend on it.
- The workbench shell is intentionally separate from PDF output. Most branding and layout work should happen in app UI, not inside the PDF renderer.

## Relevant Entry Points

- Landing page: `src/app/page.tsx`
- Builder route: `src/app/builder/page.tsx`
- Parser route: `src/app/parser/page.tsx`
- Import route: `src/app/resume-import/page.tsx`
- Shared workbench shell: `src/app/components/layout/WorkbenchLayout.tsx`
- Shared content source: `src/app/content/*`

## Related Docs

- Architecture: `docs/ARCHITECTURE.md`
- ATS scoring: `docs/ATS_SCORING.md`
- ATS issues: `docs/ATS_ISSUES.md`
- Maintenance: `docs/MAINTENANCE.md`
- Self-hosting: `docs/SELF_HOSTING.md`
