import type { AtsScoreResult } from "lib/ats-score";

export const formatBreakdown = (
  result: AtsScoreResult | null
): Array<{ label: string; value: number; max: number }> => {
  if (!result) return [];

  return [
    { label: "Parsing", value: result.breakdown.parsing, max: 40 },
    { label: "Structure", value: result.breakdown.structure, max: 20 },
    { label: "Readability", value: result.breakdown.readability, max: 10 },
  ];
};

const PARSING_ISSUES = [
  "Name not found",
  "Name recognition uncertain",
  "Email not found",
  "Phone number missing",
  "Phone number format unclear",
  "Location not detected",
  "Location format unusual",
  "No links detected",
  "Education section missing",
  "Education details incomplete",
  "Work experience section missing",
  "Work experience details incomplete",
];

const STRUCTURE_ISSUES = [
  "Likely multi-column layout",
  "Section headings not found",
  "Some headings may be hard to detect",
  "Headings formatting unclear",
  "Table-like layout detected",
  "Few bullet points detected",
  "Slightly over one page",
  "Resume over 1.5 pages",
  "Resume length exceeds two pages",
];

const READABILITY_ISSUES = [
  "Limited quantifiable impact statements",
  "Few metrics detected",
  "Consider adding raw URLs",
  "Minor spacing issues detected",
  "Multiple run-together words detected",
];

const includesIssuePrefix = (issue: string, candidates: string[]) =>
  candidates.some((candidate) => issue.startsWith(candidate));

export const scoreCategoryInsights = (result: AtsScoreResult | null) => {
  if (!result) return [];

  const categories = formatBreakdown(result);

  return categories.map((category) => {
    const issues = result.issues.filter((issue) => {
      if (category.label === "Parsing") {
        return includesIssuePrefix(issue, PARSING_ISSUES);
      }
      if (category.label === "Structure") {
        return includesIssuePrefix(issue, STRUCTURE_ISSUES);
      }
      return includesIssuePrefix(issue, READABILITY_ISSUES);
    });

    const why =
      issues.length > 0
        ? issues.map((issue) => ({
            issue,
            details: result.issueDetails?.[issue] ?? [],
          }))
        : [
            {
              issue: "No issues flagged in this category",
              details: [
                `This category kept ${Math.round(category.value)} of ${category.max} available points.`,
              ],
            },
          ];

    return {
      ...category,
      why,
      summary:
        category.label === "Parsing"
          ? "Profile fields, links, education, and work history."
          : category.label === "Structure"
            ? "Layout shape, headings, bullets, and document length."
            : "Metrics, visible URLs, and extraction-friendly text spacing.",
    };
  });
};

export const scoreLabel = (score: number) => {
  if (score < 40) return "Poor";
  if (score < 60) return "Fair";
  if (score < 80) return "Good";
  return "Excellent";
};

export const scoreColor = (score: number) => {
  if (score < 40) return "text-red-500";
  if (score < 60) return "text-amber-500";
  if (score < 80) return "text-primary";
  return "text-emerald-500";
};
