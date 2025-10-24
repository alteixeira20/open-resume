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
}

export interface AtsScoreInput {
  textItems: TextItems;
  resume?: Resume;
  lines?: Lines;
  sections?: ResumeSectionToLines;
  jobDescription?: string;
}

export const calculateAtsScore = (input: AtsScoreInput): AtsScoreResult => {
  const textItems = input.textItems ?? [];
  const lines = input.lines ?? groupTextItemsIntoLines(textItems);
  const sections = input.sections ?? groupLinesIntoSections(lines);
  const resume = input.resume ?? extractResumeFromSections(sections);
  const jobDescription = input.jobDescription?.trim();

  const issues: string[] = [];

  const parsingScore = scoreParsingReliability(resume, textItems, lines, issues);
  const structureScore = scoreStructure(textItems, lines, sections, issues);
  const readabilityScore = scoreReadability(resume, lines, issues);

  let keywordsScore: number | undefined;
  let total = parsingScore + structureScore + readabilityScore;

  if (jobDescription) {
    keywordsScore = scoreKeywords(resume, jobDescription, issues);
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
  };

  return result;
};

const rescaleWithoutKeywords = (scoreWithoutKeywords: number) => {
  // A + B + D max to 70; rescale to 100
  const rescaled = Math.round((scoreWithoutKeywords / 70) * 100);
  return clamp(rescaled, 0, 100);
};

const scoreParsingReliability = (
  resume: Resume,
  textItems: TextItems,
  lines: Lines,
  issues: string[]
) => {
  const { profile, educations, workExperiences } = resume;

  const score =
    scoreNameField(profile?.name, lines, issues) +
    scoreEmailField(profile?.email, issues) +
    scorePhoneField(profile?.phone, issues) +
    scoreLocationField(profile?.location, lines, issues) +
    scoreLinks(resume, textItems, issues) +
    scoreEducationSection(educations, issues) +
    scoreWorkSection(workExperiences, issues);

  return clamp(score, 0, 40);
};

const scoreLinks = (
  resume: Resume,
  textItems: TextItems,
  issues: string[]
) => {
  const profileUrl = resume.profile?.url ?? "";
  const textMatches = textItems.some((item) => containsUrl(item.text));

  if (containsUrl(profileUrl) || textMatches) {
    return 5;
  }

  issues.push("No links detected");
  return 0;
};

const scoreStructure = (
  textItems: TextItems,
  lines: Lines,
  sections: ResumeSectionToLines,
  issues: string[]
) => {
  let score = 0;

  score += scoreSingleColumn(lines, issues);
  score += scoreHeadings(sections, issues);
  score += scoreBulletStyle(lines, issues);
  score += scoreLength(textItems, issues);

  return clamp(score, 0, 20);
};

const scoreSingleColumn = (lines: Lines, issues: string[]) => {
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

const scoreNameField = (name: string | undefined, lines: Lines, issues: string[]) => {
  if (!hasValue(name)) {
    issues.push("Name not found");
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
  if (hasTwoWords || appearsInHeader) {
    return 4;
  }

  return 0;
};

const scoreEmailField = (email: string | undefined, issues: string[]) => {
  if (!isValidEmail(email)) {
    issues.push("Email not found");
    return 0;
  }
  return 6;
};

const scorePhoneField = (phone: string | undefined, issues: string[]) => {
  if (!hasValue(phone)) {
    issues.push("Phone number missing");
    return 0;
  }

  const digits = (phone.match(/\d/g) ?? []).length;
  if (digits >= 9 && /^\+?[\d\s\-()]{7,}$/.test(phone.trim())) {
    return 6;
  }

  issues.push("Phone number format unclear");
  return 2;
};

const scoreLocationField = (
  location: string | undefined,
  lines: Lines,
  issues: string[]
) => {
  if (!hasValue(location)) {
    issues.push("Location not detected");
    return 0;
  }

  const canonicalPattern = /.+,\s*[A-Za-z]{2,}$/;
  const normalizedLocation = normalizeComparable(location);
  const appears = lines.some((line) =>
    normalizeComparable(lineToText(line)).includes(normalizedLocation)
  );

  if (canonicalPattern.test(location.trim()) && appears) {
    return 5;
  }

  issues.push("Location format unusual");
  return appears ? 3 : 1;
};

const scoreEducationSection = (
  educations: Resume["educations"],
  issues: string[]
) => {
  if (!educations?.length) {
    issues.push("Education section missing");
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
  return partial ? 3 : 1;
};

const scoreWorkSection = (
  workExperiences: Resume["workExperiences"],
  issues: string[]
) => {
  if (!workExperiences?.length) {
    issues.push("Work experience section missing");
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
  return partial ? 3 : 1;
};

const scoreHeadings = (
  sections: ResumeSectionToLines,
  issues: string[]
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
    "certifications",
    "awards",
  ]);

  const headings = Object.keys(sections).filter(
    (key) => key !== PROFILE_SECTION
  );

  if (headings.length === 0) {
    issues.push("Section headings not found");
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
    return 4;
  }

  issues.push("Headings formatting unclear");
  return 2;
};

const hasTitleShape = (text: string) => /[A-Z][a-z]+/.test(text);

const scoreBulletStyle = (lines: Lines, issues: string[]) => {
  if (!lines.length) return 4;

  const textLines = lines.map((line) => line.map((item) => item.text).join(" "));
  const bulletRegex = /^\s*(?:[-•◦·*]|\d+[.)])/;
  const cleanBullets = textLines.filter((line) => bulletRegex.test(line)).length;
  const tableLines = textLines.filter((line) => /\|/.test(line)).length;

  if (tableLines / textLines.length > 0.1) {
    issues.push("Table-like layout detected");
  }

  if (cleanBullets / textLines.length >= 0.1) {
    return 4;
  }
  if (cleanBullets > 0) {
    return 3;
  }

  issues.push("Few bullet points detected");
  return 2;
};

const scoreLength = (textItems: TextItems, issues: string[]) => {
  if (!textItems.length) return 4;

  const pages = aggregatePages(textItems);
  const pageCount = pages.length;

  if (pageCount === 0) return 4;

  const effectiveLength = pages.reduce((acc, page) => acc + page.effectiveHeight, 0);

  if (pageCount === 1 && effectiveLength <= 1.05) {
    return 4;
  }

  if (effectiveLength <= 1.25) {
    issues.push("Slightly over one page");
    return 3;
  }

  if (effectiveLength <= 2) {
    issues.push("Resume over 1.5 pages");
    return 2;
  }

  issues.push("Resume length exceeds two pages");
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
  issues: string[]
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
        issues.push(`Missing JD keywords (${label}): ${missing.join(", ")}`);
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

const scoreReadability = (resume: Resume, lines: Lines, issues: string[]) => {
  const textLines = lines.map((line) => line.map((item) => item.text).join(" "));
  const joinedText = textLines.join(" ");

  const metricsScore = scoreMetrics(joinedText, issues);
  const urlsScore = scorePlainUrls(joinedText, issues);
  const punctuationScore = scoreGluedWords(joinedText, issues);

  return clamp(metricsScore + urlsScore + punctuationScore, 0, 10);
};

const scoreMetrics = (text: string, issues: string[]) => {
  const metrics = collectMetricTokens(text);

  if (metrics.size >= 3) {
    return 5;
  }
  if (metrics.size >= 1) {
    issues.push("Limited quantifiable impact statements");
    return 3;
  }

  issues.push("Few metrics detected");
  return 1;
};

const scorePlainUrls = (text: string, issues: string[]) => {
  if (containsUrl(text)) {
    return 3;
  }
  issues.push("Consider adding raw URLs");
  return 1;
};

const scoreGluedWords = (text: string, issues: string[]) => {
  const rawTokens = text.split(/\s+/).filter(Boolean);
  const gluedTokens = rawTokens.filter((token) => {
    const lettersOnly = token.replace(/[^A-Za-z]/g, "");
    if (lettersOnly.length === 0) {
      return false;
    }
    const hasInternalCaps = /[a-z]{3,}[A-Z][a-z]+/.test(token);
    const tooLong = lettersOnly.length >= 18;
    return hasInternalCaps || tooLong;
  });

  if (!gluedTokens.length) {
    return 2;
  }

  if (gluedTokens.length <= 2) {
    issues.push("Minor spacing issues detected");
    return 1;
  }

  issues.push("Multiple run-together words detected");
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
