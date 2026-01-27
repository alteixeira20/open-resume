# ATS Scoring System (Fork)

This fork adds a local, deterministic ATS scoring engine that evaluates a resume PDF after it is parsed. The goal is to surface *how a typical ATS might interpret the document* and highlight parsing or formatting risks.

## Overview

The score is computed from **three core categories** and an optional **job‑description match**:

- **Parsing (40 pts)** – did the parser successfully extract key fields?
- **Structure (20 pts)** – is the layout ATS‑friendly and well‑structured?
- **Readability (10 pts)** – are results readable and measurable?
- **Keywords (30 pts, optional)** – only when a job description is supplied.

When no job description is provided, the score is rescaled to 100 so results remain comparable.

---

## Input Flow (High‑level)

1. **PDF → Text Items** (pdf.js)
2. **Text Items → Lines** (merge adjacent tokens)
3. **Lines → Sections** (heuristics + headings)
4. **Sections → Resume Model** (feature scoring per section)
5. **Resume + Lines → ATS Score** (heuristic scoring + issues)

All scoring happens **locally**. No data leaves the browser.

---

## 1) Parsing Score (40 pts)

Checks whether critical fields were correctly extracted from the resume:

- **Name** (0–8)
- **Email** (0–6)
- **Phone** (0–6)
- **Location** (0–5)
- **Links** (0–5) – LinkedIn/GitHub or any detected URL
- **Education** (0–5)
- **Work Experience** (0–5)

The parser uses feature scoring and positional heuristics to extract these fields. Partial matches yield partial credit. Missing fields add a suggested improvement.

---

## 2) Structure Score (20 pts)

Evaluates whether the resume uses ATS‑friendly layout and formatting:

- **Single‑column detection** (0–6)
  - Penalizes documents with multiple left‑alignment clusters.
- **Heading recognition** (0–6)
  - Rewards standard, consistent section headings.
- **Bullet style consistency** (0–4)
  - Checks for bullet lines vs. paragraph‑only blocks.
- **Length heuristics** (0–4)
  - EU (A4) vs US (Letter) thresholds.

---

## 3) Readability Score (10 pts)

- **Quantifiable impact** (0–5)
  - Rewards numeric tokens and measurable outcomes.
- **Plain URLs** (0–3)
  - Rewards visible raw URLs in the document.
- **Spacing/glued words** (0–2)
  - Penalizes run‑together words that often occur in PDFs.

---

## 4) Job Description Keywords (optional, 30 pts)

If a job description is supplied (CLI or API), the score adds a keyword alignment component.

Categories include:

- **Critical tech keywords**
- **Impact verbs**
- **Environment/tools**

Stemming and normalization are used so related word forms match. Missing keyword clusters are reported in the issues list.

---

## Issue Details (Verbose Mode)

Every detected issue can include **expandable details** (tokens, missing fields, or estimates). These are exposed in the UI under “Suggested improvements”.

Examples of details:

- Glued tokens that triggered spacing warnings
- Which education entries are missing a school or degree
- Estimated length vs. single‑page target

---

## Known Limits (By Design)

- **Multi‑column layouts** will score lower because most ATS tools struggle with columnar PDFs.
- **Highly stylized PDFs** (tight spacing, decorative text) can reduce parse quality.
- The parser is **heuristic**, not OCR. Scanned PDFs will not parse well.

---

## CLI and API

- **CLI**: `npm run ats-score -- --file resume.pdf [--job job.txt] [--json]`
- **API**: `POST /api/ats-score` with `textItems` (optionally `lines`, `sections`, `resume` to skip reprocessing).

---

For a full list of potential issues and how they are triggered, see `docs/ATS_ISSUES.md`.
