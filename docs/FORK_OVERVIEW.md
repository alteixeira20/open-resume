# Fork Overview

This fork builds on OpenResume’s original foundation and focuses on a local‑first, EU‑ready workflow with a transparent ATS feedback loop. The goal is not to change the spirit of the project, but to make the builder + parser experience clearer, more consistent, and easier to grade before you apply.

## What Changed (High‑Level)
- **ATS scoring and diagnostics** run locally with detailed issue explanations, acting as a resume grader and CV evaluator.
- **EU A4 + US Letter presets** in both the builder and parser for region‑correct formatting.
- **Builder / Parser workbench parity** with consistent layout, widths, and preview behavior.
- **Resume import hub** that supports continuing, starting fresh, or importing a PDF/JSON backup.
- **Preview control improvements** (manual refresh, Enter‑to‑refresh) for stable editing.
- **Additional fields** including GitHub, project links, languages, and optional GPA (US).
- **Improved homepage UX** with clearer examples and ATS preview context.

## Design Principles
- **Local‑first privacy**: parsing, scoring, and editing stay in the browser.
- **Predictable output**: PDF preview is designed to match exported output.
- **Regional correctness**: A4 vs Letter sizing and headings are explicit.
- **Transparent parsing**: ATS results show *what* was extracted and *why*.

## Credits & Attribution
OpenResume was created by Xitang Zhao. This fork preserves that foundation while iterating on UX, ATS diagnostics, and regional presets. Attribution remains in the README and within the application where appropriate.

## Where to Look
- ATS scoring details: `docs/ATS_SCORING.md`
- Issue reference: `docs/ATS_ISSUES.md`
- Maintenance notes: `docs/MAINTENANCE.md`
