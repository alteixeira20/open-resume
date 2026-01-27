# ATS Issues Reference (Fork)

This document lists every issue the scoring system can emit, what it means, and how it is triggered.

> The issues come from `src/app/lib/ats-score/index.ts`.

---

## Parsing Issues

### Name not found
**Meaning:** The parser could not confidently detect a name.
**Triggered when:** `profile.name` is empty or invalid.
**Tip:** Put your full name as a single bold line near the top.

### Name recognition uncertain
**Meaning:** A name was found, but it doesn’t strongly match common patterns.
**Triggered when:** name exists but is not in the header, lacks two words, or contains non‑letter symbols.

### Email not found
**Meaning:** No valid email pattern detected.
**Triggered when:** `profile.email` is missing or fails regex.

### Phone number missing
**Meaning:** No phone number detected.
**Triggered when:** `profile.phone` is empty.

### Phone number format unclear
**Meaning:** Phone number detected but doesn’t match regional patterns.
**Triggered when:** digits exist but regex match fails for region.

### Location not detected
**Meaning:** No location found.
**Triggered when:** `profile.location` is empty.

### Location format unusual
**Meaning:** Location exists but doesn’t match expected patterns.
**Triggered when:** location does not match `City, Country` (EU) or `City, ST` (US).

### No links detected
**Meaning:** No URLs were found in profile or body.
**Triggered when:** no LinkedIn/GitHub/URLs appear in text items.

### Education section missing
**Meaning:** No education entries detected.
**Triggered when:** `resume.educations` is empty.

### Education details incomplete
**Meaning:** Education entries are missing key fields.
**Triggered when:** any entry lacks school/degree/date.

### Work experience section missing
**Meaning:** No work experience detected.
**Triggered when:** `resume.workExperiences` is empty.

### Work experience details incomplete
**Meaning:** Work entries are missing company/title/date.
**Triggered when:** any entry lacks required fields.

---

## Structure Issues

### Likely multi-column layout
**Meaning:** Text is aligned in multiple columns.
**Triggered when:** detected left‑alignment clusters have large horizontal spread.

### Section headings not found
**Meaning:** No recognizable headings detected.
**Triggered when:** headings array is empty after parsing.

### Some headings may be hard to detect
**Meaning:** Some headings detected, but fewer than expected.
**Triggered when:** fewer than 3 headings match canonical patterns.

### Headings formatting unclear
**Meaning:** Headings exist but don’t match expected patterns.
**Triggered when:** headings exist but none match canonical/titlecase/uppercase patterns.

### Table-like layout detected
**Meaning:** Text lines contain table separators (|).
**Triggered when:** >10% of lines include `|`.

### Few bullet points detected
**Meaning:** Resume lacks bullet formatting.
**Triggered when:** bullets appear in <10% of lines.

### Slightly over one page
**Meaning:** Resume length exceeds recommended single page.
**Triggered when:** estimated page usage exceeds region threshold but below 1.3 (EU) or 1.25 (US).

### Resume over 1.5 pages
**Meaning:** Resume length significantly exceeds one page.
**Triggered when:** estimated usage > slight threshold and <= 2 pages.

### Resume length exceeds two pages
**Meaning:** Document likely too long.
**Triggered when:** estimated usage > 2 pages.

---

## Readability Issues

### Limited quantifiable impact statements
**Meaning:** Few numeric metrics detected.
**Triggered when:** at least one but fewer than 3 metric tokens detected.

### Few metrics detected
**Meaning:** No measurable impact found.
**Triggered when:** no numeric/metric tokens detected.

### Consider adding raw URLs
**Meaning:** No visible URLs were found.
**Triggered when:** the resume text lacks `http/https/www` patterns.

### Minor spacing issues detected
**Meaning:** A small number of glued tokens found.
**Triggered when:** 1–2 glued tokens found.

### Multiple run-together words detected
**Meaning:** Several glued tokens found.
**Triggered when:** >2 glued tokens found.

---

## Job Description Issues (Optional)

### Missing JD keywords (category)
**Meaning:** Resume lacks some job‑description keywords in that category.
**Triggered when:** keyword matches for a category are incomplete.

---

## Notes on “Glued tokens”

The glued‑token detector ignores:
- URLs (http/https/www)
- Email addresses
- Tokens containing slashes

It focuses on unusually long words or CamelCase‑like joins (e.g., `SoftwareEngineeringOct`).

---

If you want to adjust any thresholds or add new issues, update `src/app/lib/ats-score/index.ts` and keep this doc in sync.
