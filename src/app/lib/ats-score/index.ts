import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import type {
  Lines,
  ResumeSectionToLines,
  TextItem,
  TextItems,
} from "lib/parse-resume-from-pdf/types";
import type { Resume } from "lib/redux/types";
import type { ResumeLocale } from "lib/redux/settingsSlice";
import { PROFILE_SECTION } from "lib/parse-resume-from-pdf/group-lines-into-sections";

export interface AtsScoreBreakdown {
  parsing: number;
  structure: number;
  keywords?: number;
  readability: number;
}

export interface AtsScoreResult {
  score: number;
  breakdown: AtsScoreBreakdown;
  issues: string[];
  issueDetails?: Record<string, string[]>;
}

export interface AtsScoreInput {
  textItems: TextItems;
  resume?: Resume;
  lines?: Lines;
  sections?: ResumeSectionToLines;
  jobDescription?: string;
  locale?: ResumeLocale;
}

export const calculateAtsScore = (input: AtsScoreInput): AtsScoreResult => {
  const textItems = input.textItems ?? [];
  const lines = input.lines ?? groupTextItemsIntoLines(textItems);
  const sections = input.sections ?? groupLinesIntoSections(lines);
  const resume = input.resume ?? extractResumeFromSections(sections);
  const locale = input.locale ?? detectLocale(resume);
  const jobDescription = input.jobDescription?.trim();

  const issues: string[] = [];
  const issueDetails: Record<string, string[]> = {};

  const parsingScore = scoreParsingReliability(
    resume,
    textItems,
    lines,
    issues,
    issueDetails,
    locale
  );
  const structureScore = scoreStructure(
    textItems,
    lines,
    sections,
    issues,
    issueDetails,
    locale
  );
  const readabilityScore = scoreReadability(
    resume,
    lines,
    issues,
    issueDetails
  );

  let keywordsScore: number | undefined;
  let total = parsingScore + structureScore + readabilityScore;

  if (jobDescription) {
    keywordsScore = scoreKeywords(resume, jobDescription, issues, issueDetails);
    total += keywordsScore;
  } else {
    total = rescaleWithoutKeywords(total);
  }

  const score = clamp(Math.round(total), 0, 100);

  const result: AtsScoreResult = {
    score,
    breakdown: {
      parsing: parsingScore,
      structure: structureScore,
      readability: readabilityScore,
      ...(keywordsScore !== undefined ? { keywords: keywordsScore } : {}),
    },
    issues: Array.from(new Set(issues)),
    issueDetails:
      Object.keys(issueDetails).length > 0 ? issueDetails : undefined,
  };

  return result;
};

const rescaleWithoutKeywords = (scoreWithoutKeywords: number) => {
  // A + B + D max to 70; rescale to 100
  const rescaled = Math.round((scoreWithoutKeywords / 70) * 100);
  return clamp(rescaled, 0, 100);
};

const addIssueDetail = (
  issueDetails: Record<string, string[]>,
  issue: string,
  details: string[]
) => {
  if (!details.length) return;
  const existing = issueDetails[issue] ?? [];
  issueDetails[issue] = Array.from(new Set([...existing, ...details]));
};

const scoreParsingReliability = (
  resume: Resume,
  textItems: TextItems,
  lines: Lines,
  issues: string[],
  issueDetails: Record<string, string[]>,
  locale: ResumeLocale
) => {
  const { profile, educations, workExperiences } = resume;

  const score =
    scoreNameField(profile?.name, lines, issues, issueDetails) +
    scoreEmailField(profile?.email, issues, issueDetails) +
    scorePhoneField(profile?.phone, issues, issueDetails, locale) +
    scoreLocationField(profile?.location, lines, issues, issueDetails, locale) +
    scoreLinks(resume, textItems, issues, issueDetails) +
    scoreEducationSection(educations, issues, issueDetails) +
    scoreWorkSection(workExperiences, issues, issueDetails);

  return clamp(score, 0, 40);
};

const scoreLinks = (
  resume: Resume,
  textItems: TextItems,
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  const profileUrl = resume.profile?.url ?? "";
  const githubUrl = resume.profile?.github ?? "";
  const textMatches = textItems.some((item) => containsUrl(item.text));

  if (containsUrl(profileUrl) || containsUrl(githubUrl) || textMatches) {
    return 5;
  }

  issues.push("No links detected");
  addIssueDetail(issueDetails, "No links detected", [
    "No URL-like text found in profile or body. Add LinkedIn/GitHub or project links.",
  ]);
  return 0;
};

const scoreStructure = (
  textItems: TextItems,
  lines: Lines,
  sections: ResumeSectionToLines,
  issues: string[],
  issueDetails: Record<string, string[]>,
  locale: ResumeLocale
) => {
  let score = 0;

  score += scoreSingleColumn(lines, issues, issueDetails);
  score += scoreHeadings(sections, issues, issueDetails);
  score += scoreBulletStyle(lines, issues, issueDetails);
  score += scoreLength(textItems, issues, issueDetails, locale);

  return clamp(score, 0, 20);
};

const scoreSingleColumn = (
  lines: Lines,
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  const leftPositions = lines
    .map((line) => getLineLeft(line))
    .filter((value): value is number => value !== undefined);

  if (leftPositions.length < 4) {
    return 6;
  }

  const buckets = bucketize(leftPositions, 40);
  const entries = Array.from(buckets.entries()).sort((a, b) => a[0] - b[0]);

  const total = leftPositions.length;
  const significant = entries.filter(([, count]) => count / total >= 0.1);

  if (significant.length <= 1) {
    return 6;
  }

  const spread =
    significant[significant.length - 1][0] - significant[0][0];
  if (spread > 120) {
    issues.push("Likely multi-column layout");
    addIssueDetail(issueDetails, "Likely multi-column layout", [
      `Detected ${significant.length} left-alignment clusters; spread ≈ ${Math.round(
        spread
      )}pt.`,
    ]);
    return 0;
  }

  return 4;
};

const getLineLeft = (line: TextItem[]) => {
  if (!line?.length) return undefined;
  return Math.min(...line.map((item) => item.x));
};

const bucketize = (values: number[], size: number) => {
  const buckets = new Map<number, number>();
  values.forEach((value) => {
    const bucket = Math.round(value / size) * size;
    buckets.set(bucket, (buckets.get(bucket) ?? 0) + 1);
  });
  return buckets;
};

const scoreNameField = (
  name: string | undefined,
  lines: Lines,
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  if (!hasValue(name)) {
    issues.push("Name not found");
    addIssueDetail(issueDetails, "Name not found", [
      "Ensure your name is a single bold line near the top (letters only).",
    ]);
    return 0;
  }

  const normalizedName = stripDiacritics(name.trim());
  const tokens = normalizedName.split(/\s+/).filter(Boolean);
  const lettersOnly = tokens.every((token) => /^[A-Za-z.'-]+$/.test(token));
  const hasTwoWords = tokens.length >= 2;

  const appearsInHeader = lines
    .slice(0, 6)
    .some((line) => normalizeComparable(lineToText(line)).includes(normalizeComparable(name)));

  if (lettersOnly && hasTwoWords && appearsInHeader) {
    return 8;
  }

  issues.push("Name recognition uncertain");
  const nameChecks: string[] = [];
  if (!lettersOnly) nameChecks.push("Contains non-letter symbols.");
  if (!hasTwoWords) nameChecks.push("Less than two words.");
  if (!appearsInHeader) nameChecks.push("Not detected in top lines.");
  addIssueDetail(issueDetails, "Name recognition uncertain", nameChecks);
  if (hasTwoWords || appearsInHeader) {
    return 4;
  }

  return 0;
};

const scoreEmailField = (
  email: string | undefined,
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  if (!isValidEmail(email)) {
    issues.push("Email not found");
    addIssueDetail(issueDetails, "Email not found", [
      "Use a standard format like name@domain.com.",
    ]);
    return 0;
  }
  return 6;
};

const scorePhoneField = (
  phone: string | undefined,
  issues: string[],
  issueDetails: Record<string, string[]>,
  locale: ResumeLocale
) => {
  if (!hasValue(phone)) {
    issues.push("Phone number missing");
    addIssueDetail(issueDetails, "Phone number missing", [
      "Include a full phone number (country code recommended).",
    ]);
    return 0;
  }

  const digits = (phone.match(/\d/g) ?? []).length;
  if (locale === "us") {
    const usPattern =
      /^(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
    if (usPattern.test(phone.trim())) {
      return 6;
    }
  } else {
    const euPattern = /^\+?[\d\s\-()]{7,}$/;
    if (digits >= 9 && digits <= 15 && euPattern.test(phone.trim())) {
      return 6;
    }
  }

  if (digits >= 9 && /^\+?[\d\s\-()]{7,}$/.test(phone.trim())) {
    return 6;
  }

  issues.push("Phone number format unclear");
  addIssueDetail(issueDetails, "Phone number format unclear", [
    `Detected: "${phone}"`,
    "Try +351 9xx xxx xxx (EU) or (123) 456-7890 (US).",
  ]);
  return 2;
};

const scoreLocationField = (
  location: string | undefined,
  lines: Lines,
  issues: string[],
  issueDetails: Record<string, string[]>,
  locale: ResumeLocale
) => {
  if (!hasValue(location)) {
    issues.push("Location not detected");
    addIssueDetail(issueDetails, "Location not detected", [
      "Use City, Country (EU) or City, ST (US).",
    ]);
    return 0;
  }

  const canonicalPattern =
    locale === "us"
      ? /.+,\s*[A-Z]{2}$/
      : /.+,\s*[\p{L}]{2,}$/u;
  const normalizedLocation = normalizeComparable(location);
  const appears = lines.some((line) =>
    normalizeComparable(lineToText(line)).includes(normalizedLocation)
  );

  if (canonicalPattern.test(location.trim()) && appears) {
    return 5;
  }

  issues.push("Location format unusual");
  addIssueDetail(issueDetails, "Location format unusual", [
    `Detected: "${location}"`,
    "Use City, Country (EU) or City, ST (US).",
  ]);
  return appears ? 3 : 1;
};

const detectLocale = (resume: Resume): ResumeLocale => {
  const location = resume.profile?.location ?? "";
  const phone = resume.profile?.phone ?? "";

  const hasPlusPhone = phone.trim().startsWith("+");
  const usLocationPattern = /,\s*[A-Z]{2}$/;
  const euLocationPattern = /,\s*[\p{L}]{2,}$/u;
  const hasDiacritics = /[^\u0000-\u007F]/.test(location);

  if (hasPlusPhone) return "eu";
  if (usLocationPattern.test(location.trim())) return "us";
  if (euLocationPattern.test(location.trim()) || hasDiacritics) return "eu";

  return "us";
};

const scoreEducationSection = (
  educations: Resume["educations"],
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  if (!educations?.length) {
    issues.push("Education section missing");
    addIssueDetail(issueDetails, "Education section missing", [
      "Add school + degree (and date if possible).",
    ]);
    return 0;
  }

  const strong = educations.some(
    (education) =>
      hasValue(education.school) &&
      hasValue(education.degree) &&
      (hasValue(education.date) || education.descriptions.some(hasValue))
  );

  if (strong) {
    return 5;
  }

  const partial = educations.some(
    (education) => hasValue(education.school) || hasValue(education.degree)
  );

  issues.push("Education details incomplete");
  const missing = educations.map((education, idx) => {
    const missingFields = [];
    if (!hasValue(education.school)) missingFields.push("school");
    if (!hasValue(education.degree)) missingFields.push("degree");
    if (!hasValue(education.date)) missingFields.push("date");
    return missingFields.length
      ? `Entry ${idx + 1} missing: ${missingFields.join(", ")}`
      : null;
  }).filter(Boolean) as string[];
  addIssueDetail(issueDetails, "Education details incomplete", missing);
  return partial ? 3 : 1;
};

const scoreWorkSection = (
  workExperiences: Resume["workExperiences"],
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  if (!workExperiences?.length) {
    issues.push("Work experience section missing");
    addIssueDetail(issueDetails, "Work experience section missing", [
      "Add company, title, and date (or descriptions).",
    ]);
    return 0;
  }

  const strong = workExperiences.some(
    (experience) =>
      hasValue(experience.company) &&
      hasValue(experience.jobTitle) &&
      (hasValue(experience.date) || experience.descriptions.some(hasValue))
  );

  if (strong) {
    return 5;
  }

  const partial = workExperiences.some(
    (experience) =>
      hasValue(experience.company) &&
      (hasValue(experience.date) || experience.descriptions.some(hasValue))
  );

  issues.push("Work experience details incomplete");
  const missing = workExperiences.map((experience, idx) => {
    const missingFields = [];
    if (!hasValue(experience.company)) missingFields.push("company");
    if (!hasValue(experience.jobTitle)) missingFields.push("job title");
    if (!hasValue(experience.date)) missingFields.push("date");
    return missingFields.length
      ? `Entry ${idx + 1} missing: ${missingFields.join(", ")}`
      : null;
  }).filter(Boolean) as string[];
  addIssueDetail(issueDetails, "Work experience details incomplete", missing);
  return partial ? 3 : 1;
};

const scoreHeadings = (
  sections: ResumeSectionToLines,
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  const canonicalHeadings = new Set([
    "profile",
    "summary",
    "experience",
    "professional experience",
    "education",
    "work experience",
    "projects",
    "skills",
    "languages",
    "certifications",
    "awards",
  ]);

  const headings = Object.keys(sections).filter(
    (key) => key !== PROFILE_SECTION
  );

  if (headings.length === 0) {
    issues.push("Section headings not found");
    addIssueDetail(issueDetails, "Section headings not found", [
      "Use clear section headers like EXPERIENCE, EDUCATION, PROJECTS.",
    ]);
    return 0;
  }

  const recognized = headings.filter((heading) => {
    const trimmed = heading.trim();
    if (!trimmed) return false;
    const canonical = trimmed.toLowerCase();
    return (
      canonicalHeadings.has(canonical) || isAllCaps(trimmed) || hasTitleShape(trimmed)
    );
  });

  if (recognized.length >= 3) {
    return 6;
  }
  if (recognized.length > 0) {
    issues.push("Some headings may be hard to detect");
    addIssueDetail(issueDetails, "Some headings may be hard to detect", [
      `Detected headings: ${headings.join(", ")}`,
    ]);
    return 4;
  }

  issues.push("Headings formatting unclear");
  addIssueDetail(issueDetails, "Headings formatting unclear", [
    `Detected headings: ${headings.join(", ")}`,
  ]);
  return 2;
};

const hasTitleShape = (text: string) => /[A-Z][a-z]+/.test(text);

const scoreBulletStyle = (
  lines: Lines,
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  if (!lines.length) return 4;

  const textLines = lines.map((line) => line.map((item) => item.text).join(" "));
  const bulletRegex = /^\s*(?:[-•◦·*]|\d+[.)])/;
  const cleanBullets = textLines.filter((line) => bulletRegex.test(line)).length;
  const tableLines = textLines.filter((line) => /\|/.test(line)).length;

  if (tableLines / textLines.length > 0.1) {
    issues.push("Table-like layout detected");
    addIssueDetail(issueDetails, "Table-like layout detected", [
      `${tableLines} lines contain table separators (|).`,
    ]);
  }

  if (cleanBullets / textLines.length >= 0.1) {
    return 4;
  }
  if (cleanBullets > 0) {
    return 3;
  }

  issues.push("Few bullet points detected");
  addIssueDetail(issueDetails, "Few bullet points detected", [
    `Detected ${cleanBullets} bullet lines.`,
  ]);
  return 2;
};

const scoreLength = (
  textItems: TextItems,
  issues: string[],
  issueDetails: Record<string, string[]>,
  locale: ResumeLocale
) => {
  if (!textItems.length) return 4;

  const pages = aggregatePages(textItems);
  const pageCount = pages.length;

  if (pageCount === 0) return 4;

  const effectiveLength = pages.reduce((acc, page) => acc + page.effectiveHeight, 0);

  const singlePageThreshold = locale === "eu" ? 1.1 : 1.05;
  const slightOverThreshold = locale === "eu" ? 1.3 : 1.25;

  if (pageCount === 1 && effectiveLength <= singlePageThreshold) {
    return 4;
  }

  if (effectiveLength <= slightOverThreshold) {
    issues.push("Slightly over one page");
    addIssueDetail(issueDetails, "Slightly over one page", [
      `Estimated length ≈ ${(effectiveLength * 100).toFixed(0)}% of one page.`,
    ]);
    return 3;
  }

  if (effectiveLength <= 2) {
    issues.push("Resume over 1.5 pages");
    addIssueDetail(issueDetails, "Resume over 1.5 pages", [
      `Estimated length ≈ ${(effectiveLength * 100).toFixed(0)}% of one page.`,
    ]);
    return 2;
  }

  issues.push("Resume length exceeds two pages");
  addIssueDetail(issueDetails, "Resume length exceeds two pages", [
    `Estimated length ≈ ${(effectiveLength * 100).toFixed(0)}% of one page.`,
  ]);
  return 0;
};

interface PageHeight {
  effectiveHeight: number;
}

const aggregatePages = (textItems: TextItems): PageHeight[] => {
  const pages = new Map<number, { maxY: number; minY: number }>();
  textItems.forEach((item) => {
    const pageNumber = item.page ?? 1;
    const entry = pages.get(pageNumber) ?? {
      maxY: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
    };
    entry.maxY = Math.max(entry.maxY, item.y + item.height);
    entry.minY = Math.min(entry.minY, item.y);
    pages.set(pageNumber, entry);
  });

  return Array.from(pages.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, value], index, arr) => {
      const { maxY, minY } = value;
      const heightUsed = Math.max(maxY - minY, 0);
      const fullHeight = maxY || 1;
      const normalized = clamp(heightUsed / fullHeight, 0, 1);
      const isLast = index === arr.length - 1;
      return {
        effectiveHeight: isLast ? normalized : 1,
      };
    });
};

const scoreKeywords = (
  resume: Resume,
  jobDescription: string,
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  const resumeCorpus = resumeText(resume).toLowerCase();
  const jdCorpus = jobDescription.toLowerCase();
  const resumeTokens = getStemmedTokenSet(resumeCorpus);
  const jdTokens = getStemmedTokenSet(jdCorpus);

  const categories: KeywordCategory[] = [
    {
      label: "critical tech",
      keywords: [
        "linux",
        "git",
        "docker",
        "bash",
        "ci/cd",
        "pipeline",
        "automation",
        "c",
        "gdb",
        "valgrind",
      ],
      weight: 10,
    },
    {
      label: "impact verbs",
      keywords: [
        "built",
        "implement",
        "optimiz",
        "reduc",
        "automat",
        "debug",
        "design",
      ],
      weight: 10,
    },
    {
      label: "environment",
      keywords: [
        "ubuntu",
        "debian",
        "fedora",
        "arch",
        "suse",
        "scripting",
        "container",
        "kubernetes",
        "version control",
        "testing",
      ],
      weight: 10,
    },
  ];

  let score = 0;

  categories.forEach(({ label, keywords, weight }) => {
    const normalizedKeywords = keywords.map((kw) => ({
      original: kw,
      normalized: normalizeKeyword(kw),
    }));

    const presentInJd = normalizedKeywords.filter(({ normalized, original }) =>
      jdTokens.has(normalized) || jdCorpus.includes(searchToken(original))
    );
    if (!presentInJd.length) {
      return;
    }

    const resumeHits = presentInJd.filter(({ normalized, original }) =>
      matchKeyword(normalized, resumeTokens, resumeCorpus, original)
    ).length;
    const categoryScore = (resumeHits / presentInJd.length) * weight;
    score += categoryScore;

    if (resumeHits < presentInJd.length) {
      const missing = presentInJd
        .filter(
          ({ normalized, original }) =>
            !matchKeyword(normalized, resumeTokens, resumeCorpus, original)
        )
        .map(({ original }) => original);
      if (missing.length) {
        const issue = `Missing JD keywords (${label}): ${missing.join(", ")}`;
        issues.push(issue);
        addIssueDetail(issueDetails, issue, missing);
      }
    }
  });

  return Math.round(clamp(score, 0, 30));
};

interface KeywordCategory {
  label: string;
  keywords: string[];
  weight: number;
}

const resumeText = (resume: Resume) => {
  const profileValues = Object.values(resume.profile ?? {}).join(" ");
  const educationText = resume.educations
    .map((education) => Object.values(education).join(" "))
    .join(" ");
  const workText = resume.workExperiences
    .map((experience) => Object.values(experience).join(" "))
    .join(" ");
  const projectText = resume.projects
    .map((project) => Object.values(project).join(" "))
    .join(" ");
  const skillsText = Object.values(resume.skills ?? {}).join(" ");
  const customText = Object.values(resume.custom ?? {}).join(" ");

  return [
    profileValues,
    educationText,
    workText,
    projectText,
    skillsText,
    customText,
  ]
    .join(" ")
    .trim();
};

const getStemmedTokenSet = (text: string) => {
  const tokens = splitTokens(text).map(normalizeKeyword);
  return new Set(tokens.filter(Boolean));
};

const splitTokens = (text: string) =>
  text
    .toLowerCase()
    .split(/[\s,;:()+\-]+/)
    .filter(Boolean);

const normalizeKeyword = (keyword: string) => stem(keyword.toLowerCase());

const searchToken = (keyword: string) =>
  keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const matchKeyword = (
  keyword: string,
  tokens: Set<string>,
  corpus: string,
  original: string
) => {
  if (tokens.has(keyword)) {
    return true;
  }
  const collapsed = keyword.replace(/[^a-z0-9]/g, "");
  if (collapsed && tokens.has(collapsed)) {
    return true;
  }

  const search = searchToken(original);
  if (search && corpus.includes(search)) {
    return true;
  }
  if (collapsed && corpus.includes(collapsed)) {
    return true;
  }

  return false;
};

const stem = (word: string) => {
  let result = word.trim();
  if (!result) return "";

  result = result.replace(/[^a-z0-9+]/g, "");

  const rules: [RegExp, string][] = [
    [/ies$/, "y"],
    [/ves$/, "f"],
    [/ing$/, ""],
    [/ed$/, ""],
    [/ers?$/, ""],
    [/s$/, ""],
  ];

  for (const [pattern, replacement] of rules) {
    if (pattern.test(result) && result.replace(pattern, replacement).length >= 3) {
      result = result.replace(pattern, replacement);
      break;
    }
  }

  return result;
};

const scoreReadability = (
  resume: Resume,
  lines: Lines,
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  const textLines = lines.map((line) => line.map((item) => item.text).join(" "));
  const joinedText = textLines.join(" ");

  const metricsScore = scoreMetrics(joinedText, issues, issueDetails);
  const urlsScore = scorePlainUrls(joinedText, issues, issueDetails);
  const punctuationScore = scoreGluedWords(joinedText, issues, issueDetails);

  return clamp(metricsScore + urlsScore + punctuationScore, 0, 10);
};

const scoreMetrics = (
  text: string,
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  const metrics = collectMetricTokens(text);

  if (metrics.size >= 3) {
    return 5;
  }
  if (metrics.size >= 1) {
    issues.push("Limited quantifiable impact statements");
    addIssueDetail(
      issueDetails,
      "Limited quantifiable impact statements",
      Array.from(metrics).slice(0, 8)
    );
    return 3;
  }

  issues.push("Few metrics detected");
  addIssueDetail(issueDetails, "Few metrics detected", [
    "Add concrete numbers (%, $, time saved, scale, volume).",
  ]);
  return 1;
};

const scorePlainUrls = (
  text: string,
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  if (containsUrl(text)) {
    return 3;
  }
  issues.push("Consider adding raw URLs");
  addIssueDetail(issueDetails, "Consider adding raw URLs", [
    "Include full LinkedIn/GitHub or project URLs as visible text.",
  ]);
  return 1;
};

const scoreGluedWords = (
  text: string,
  issues: string[],
  issueDetails: Record<string, string[]>
) => {
  const rawTokens = text.split(/\s+/).filter(Boolean);
  const gluedTokens = rawTokens.filter((token) => {
    const cleaned = token.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "");
    if (!cleaned) return false;
    if (cleaned.includes("@")) return false;
    if (cleaned.includes("http") || cleaned.includes("www.")) return false;
    if (cleaned.includes("/")) return false;
    const lettersOnly = cleaned.replace(/[^A-Za-z]/g, "");
    if (lettersOnly.length === 0) {
      return false;
    }
    const hasInternalCaps = /[a-z]{3,}[A-Z][a-z]+/.test(cleaned);
    const tooLong = lettersOnly.length >= 18;
    if (hasInternalCaps && lettersOnly.length >= 12) {
      return true;
    }
    return tooLong;
  });

  if (!gluedTokens.length) {
    return 2;
  }

  if (gluedTokens.length <= 2) {
    issues.push("Minor spacing issues detected");
    addIssueDetail(
      issueDetails,
      "Minor spacing issues detected",
      Array.from(new Set(gluedTokens)).slice(0, 10)
    );
    return 1;
  }

  issues.push("Multiple run-together words detected");
  addIssueDetail(
    issueDetails,
    "Multiple run-together words detected",
    Array.from(new Set(gluedTokens)).slice(0, 12)
  );
  return 0;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const hasValue = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const lineToText = (line: TextItem[]) => line.map((item) => item.text).join(" ");

const stripDiacritics = (input: string) =>
  input.normalize("NFD").replace(/\p{Diacritic}/gu, "");

const normalizeComparable = (input: string) =>
  stripDiacritics(input)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const containsUrl = (text: string) => {
  if (!text) return false;
  const canonical = text.trim();
  const explicitPattern = /(https?:\/\/|www\.)[\w\-._~:/?#[\]@!$&'()*+,;=%]+/i;
  if (explicitPattern.test(canonical)) {
    return true;
  }

  const bareDomainPattern =
    /\b[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+(?:\/[\w.,@?^=%&:/~+#-]*)?\b/i;
  return bareDomainPattern.test(canonical);
};

const collectMetricTokens = (text: string) => {
  const metrics = new Set<string>();

  const addMatches = (pattern: RegExp) => {
    const matches = text.match(pattern) ?? [];
    matches.forEach((match) => metrics.add(match.toLowerCase()));
  };

  addMatches(/\d+(?:\.\d+)?%/g);
  addMatches(/\d+(?:\.\d+)?x\b/gi);
  addMatches(/\b\d+(?:\.\d+)?\s?(?:k|m|b|mm|million|billion)\b/gi);

  const contextualNumberRegex = /\b\d{2,}\b/g;
  let contextualMatch: RegExpExecArray | null;
  while ((contextualMatch = contextualNumberRegex.exec(text)) !== null) {
    const index = contextualMatch.index ?? 0;
    const preceding = text.slice(Math.max(0, index - 40), index).toLowerCase();
    if (/(increase|improv|reduc|cut|boost|grow|scal|optim|achiev|deliver|drive|lift|accelerat|decreas)/.test(preceding)) {
      metrics.add(contextualMatch[0].toLowerCase());
    }
  }

  return metrics;
};

const isValidEmail = (value: string | undefined) =>
  typeof value === "string" && /\S+@\S+\.\S+/.test(value.trim());

const isAllCaps = (text: string) => {
  const alpha = text.replace(/[^A-Za-z]/g, "");
  return alpha.length > 0 && alpha === alpha.toUpperCase();
};
