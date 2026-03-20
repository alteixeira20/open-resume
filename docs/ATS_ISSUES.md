# ATS Issues Reference

This document lists the issue types the ATS scoring system can emit, what they mean, and how they are triggered.

> The issues come from `src/app/lib/ats-score/index.ts`.

These issues surface in the Parser Workbench score card and in CLI / API responses that use the same scoring core.

## Parsing Issues

### Name not found
**Meaning:** The parser could not confidently detect a name.  
**Triggered when:** `profile.name` is empty or invalid.  
**Tip:** Put your full name as a single bold line near the top.

### Name recognition uncertain
**Meaning:** A name was found, but it does not strongly match common patterns.  
**Triggered when:** a name exists but is not in the header, lacks two words, or contains non-letter symbols.

### Email not found
**Meaning:** No valid email pattern detected.  
**Triggered when:** `profile.email` is missing or fails regex.

### Phone number missing
**Meaning:** No phone number detected.  
**Triggered when:** `profile.phone` is empty.

### Phone number format unclear
**Meaning:** A phone number was detected but does not match regional patterns.  
**Triggered when:** digits exist but the region-aware regex check fails.

### Location not detected
**Meaning:** No location found.  
**Triggered when:** `profile.location` is empty.

### Location format unusual
**Meaning:** Location exists but does not match expected patterns.  
**Triggered when:** location does not match `City, Country` (EU) or `City, ST` (US).

### No links detected
**Meaning:** No URLs were found in profile or body text.  
**Triggered when:** no LinkedIn, GitHub, or URL-like strings are detected.

### Education section missing
**Meaning:** No education entries detected.  
**Triggered when:** `resume.educations` is empty.

### Education details incomplete
**Meaning:** Education entries are missing key fields.  
**Triggered when:** any entry lacks school, degree, or date data.

### Work experience section missing
**Meaning:** No work experience detected.  
**Triggered when:** `resume.workExperiences` is empty.

### Work experience details incomplete
**Meaning:** Work entries are missing company, title, or date data.  
**Triggered when:** any entry lacks required fields.

## Structure Issues

### Likely multi-column layout
**Meaning:** Text appears to be aligned in multiple columns.  
**Triggered when:** detected left-alignment clusters have large horizontal spread.

### Section headings not found
**Meaning:** No recognizable headings detected.  
**Triggered when:** the headings array is empty after parsing.

### Some headings may be hard to detect
**Meaning:** Some headings were detected, but fewer than expected.  
**Triggered when:** fewer than three headings match canonical patterns.

### Headings formatting unclear
**Meaning:** Headings exist but do not match expected patterns.  
**Triggered when:** headings exist but none match canonical, title-case, or uppercase patterns.

### Table-like layout detected
**Meaning:** Text lines contain table separators.  
**Triggered when:** more than 10% of lines include `|`.

### Few bullet points detected
**Meaning:** CV lacks bullet formatting.  
**Triggered when:** bullets appear in fewer than 10% of lines.

### Slightly over one page
**Meaning:** CV length exceeds a recommended single page.  
**Triggered when:** estimated page usage exceeds the region threshold but stays below the stronger overlength thresholds.

### Resume over 1.5 pages
**Meaning:** CV length significantly exceeds one page.  
**Triggered when:** estimated usage crosses the first major overlength threshold.

### Resume length exceeds two pages
**Meaning:** The document is likely too long for the intended format.  
**Triggered when:** estimated usage exceeds two pages.

## Readability Issues

### Limited quantifiable impact statements
**Meaning:** Few numeric metrics were detected.  
**Triggered when:** at least one but fewer than three metric tokens are found.

### Few metrics detected
**Meaning:** No measurable impact statements were found.  
**Triggered when:** no numeric or metric tokens are detected.

### Consider adding raw URLs
**Meaning:** No visible URLs were found.  
**Triggered when:** the extracted text lacks `http`, `https`, or `www` patterns.

### Minor spacing issues detected
**Meaning:** A small number of glued tokens were found.  
**Triggered when:** one or two glued tokens are detected.

### Multiple run-together words detected
**Meaning:** Several glued tokens were found.  
**Triggered when:** more than two glued tokens are detected.

## Job Description Issues (Optional)

### Missing JD keywords (category)
**Meaning:** CV lacks some job-description keywords in that category.  
**Triggered when:** keyword matches for a category are incomplete.

## Notes on Glued Tokens

The glued-token detector intentionally ignores:
- URLs
- email addresses
- tokens containing slashes

It focuses on unusually long words or merged CamelCase-like joins.

If you adjust issue thresholds or add new issue types, update `src/app/lib/ats-score/index.ts` and keep this document in sync.
