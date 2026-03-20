# ATS Scoring System

CVForge includes a local, deterministic ATS scoring engine that evaluates a CV PDF after it is parsed. The goal is to surface how a text-based ATS-style parser is likely to interpret the document and highlight parsing or formatting risks.

In the browser UI, this is exposed through the Parser Workbench at `/parser`.

## Overview

The score is computed from three core categories and an optional job-description match:

- **Parsing (40 pts)** – did the parser successfully extract key fields?
- **Structure (20 pts)** – is the layout ATS-friendly and well-structured?
- **Readability (10 pts)** – are results readable and measurable?
- **Keywords (30 pts, optional)** – only when a job description is supplied

When no job description is provided, the score is rescaled to 100 so results remain comparable.

## Input Flow

1. **PDF -> Text Items** using pdf.js
2. **Text Items -> Lines** by merging adjacent tokens
3. **Lines -> Sections** through layout and heading heuristics
4. **Sections -> Resume Model** through feature scoring per section
5. **Resume + Lines -> ATS Score** through heuristic checks and issue generation

In the browser workbench, all parsing and scoring happen locally. The same scoring logic is also available through the CLI and API for debugging and automation.

## 1) Parsing Score (40 pts)

Checks whether critical fields were correctly extracted from the CV:

- **Name** (0–8)
- **Email** (0–6)
- **Phone** (0–6)
- **Location** (0–5)
- **Links** (0–5)
- **Education** (0–5)
- **Work Experience** (0–5)

The parser uses feature scoring and positional heuristics to extract these fields. Partial matches yield partial credit. Missing fields add a suggested improvement.

## 2) Structure Score (20 pts)

Evaluates whether the CV uses ATS-friendly layout and formatting:

- **Single-column detection** (0–6)
- **Heading recognition** (0–6)
- **Bullet style consistency** (0–4)
- **Length heuristics** (0–4)

The length heuristics differ for EU (A4) and US (Letter) expectations.

## 3) Readability Score (10 pts)

- **Quantifiable impact** (0–5)
- **Plain URLs** (0–3)
- **Spacing / glued words** (0–2)

This is where the scorer looks for measurable achievements, visible URLs, and extraction artefacts like words that got merged together by PDF parsing.

## 4) Job Description Keywords (Optional, 30 pts)

If a job description is supplied through the CLI or API, the score adds a keyword alignment component.

Keyword categories include:
- critical tech keywords
- impact verbs
- environment / tools

Stemming and normalization are used so related word forms can match.

## Issue Details

Every detected issue can include expandable details such as tokens, missing fields, or estimates. In the browser UI these appear under the score card suggestions area.

Examples:
- glued tokens that triggered spacing warnings
- which education entries are missing a school or degree
- estimated length versus a single-page target

## Known Limits

- **Multi-column layouts** usually score lower because text extraction becomes less reliable.
- **Highly stylized PDFs** can reduce parse quality.
- The parser is **heuristic**, not OCR. Scanned PDFs will not parse well.
- The browser UI does **not** currently accept a job description. Keyword scoring is available through CLI/API only.

## CLI and API

- **CLI:** `npm run ats-score -- --file resume.pdf [--job job.txt] [--json]`
- **API:** `POST /api/ats-score`

For a full list of issue types and triggers, see `docs/ATS_ISSUES.md`.
