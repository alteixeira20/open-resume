import type { ResumeLanguage } from "lib/redux/types";
import type { Lines, ResumeSectionToLines } from "lib/parse-resume-from-pdf/types";
import { getSectionLinesByKeywords } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/get-section-lines";
import { BULLET_POINTS } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";

const PROFICIENCY_KEYWORDS = [
  "native",
  "bilingual",
  "fluent",
  "proficient",
  "professional",
  "working",
  "limited",
  "basic",
  "intermediate",
  "advanced",
  "beginner",
  "conversational",
  "elementary",
];

const CEFR_REGEX = /\b[ABC][12]\b/i;
const PROFICIENCY_REGEX = new RegExp(
  `\\b(${PROFICIENCY_KEYWORDS.join("|")})\\b`,
  "i"
);
const SEPARATOR_REGEX = /\s*(?:—|–|:)\s*|\s-\s/;
const TRAILING_SEPARATOR_REGEX = /[\s\u2012\u2013\u2014\u2015\u2212\u2010\u00ad\-:]+$/;
const LEADING_SEPARATOR_REGEX = /^[\s\u2012\u2013\u2014\u2015\u2212\u2010\u00ad\-:]+/;

const normalizeText = (text: string) => text.replace(/\s+/g, " ").trim();

const stripBulletPoints = (text: string) => {
  let cleaned = text;
  for (const bullet of BULLET_POINTS) {
    cleaned = cleaned.split(bullet).join(" ");
  }
  return normalizeText(cleaned);
};

const splitOutsideParens = (text: string) => {
  const parts: string[] = [];
  let current = "";
  let depth = 0;

  for (const char of text) {
    if (char === "(") depth++;
    if (char === ")") depth = Math.max(0, depth - 1);

    if (depth === 0 && (char === "," || char === ";" || char === "/")) {
      if (current.trim()) parts.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
};

const normalizeLanguage = (value: string) =>
  value.replace(TRAILING_SEPARATOR_REGEX, "").trim();

const normalizeProficiency = (value: string) =>
  value.replace(LEADING_SEPARATOR_REGEX, "").trim();

const splitLanguageAndProficiency = (text: string): ResumeLanguage | null => {
  const cleaned = normalizeText(text);
  if (!cleaned) return null;

  if (SEPARATOR_REGEX.test(cleaned)) {
    const [language, ...rest] = cleaned.split(SEPARATOR_REGEX);
    return {
      language: normalizeLanguage(language),
      proficiency: normalizeProficiency(rest.join(" - ").trim()),
    };
  }

  const parenMatch = cleaned.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (parenMatch) {
    return {
      language: normalizeLanguage(parenMatch[1]),
      proficiency: normalizeProficiency(parenMatch[2]),
    };
  }

  const cefrMatch = cleaned.match(CEFR_REGEX);
  const keywordMatch = cleaned.match(PROFICIENCY_REGEX);
  const matches = [cefrMatch, keywordMatch].filter(
    (match): match is RegExpMatchArray => Boolean(match)
  );
  const firstMatch = matches.reduce<RegExpMatchArray | null>((best, match) => {
    if (!best) return match;
    return match.index !== undefined && best.index !== undefined && match.index < best.index
      ? match
      : best;
  }, null);

  if (firstMatch && firstMatch.index !== undefined && firstMatch.index > 0) {
    return {
      language: normalizeLanguage(cleaned.slice(0, firstMatch.index)),
      proficiency: normalizeProficiency(cleaned.slice(firstMatch.index)),
    };
  }

  return { language: normalizeLanguage(cleaned), proficiency: "" };
};

const linesToLanguageEntries = (lines: Lines) =>
  lines
    .map((line) => stripBulletPoints(line.map((item) => item.text).join(" ")))
    .flatMap(splitOutsideParens)
    .map((entry) => splitLanguageAndProficiency(entry))
    .filter((entry): entry is ResumeLanguage => Boolean(entry))
    .filter((entry) => entry.language || entry.proficiency);

export const extractLanguages = (sections: ResumeSectionToLines) => {
  const lines = getSectionLinesByKeywords(sections, ["language"]);
  const languages = linesToLanguageEntries(lines);
  return { languages };
};
