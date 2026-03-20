import type { AtsScoreResult } from "lib/ats-score";

export const formatBreakdown = (
  result: AtsScoreResult | null
): Array<{ label: string; value: number; max: number }> => {
  if (!result) return [];

  return [
    { label: "Parsing", value: result.breakdown.parsing, max: 40 },
    { label: "Structure", value: result.breakdown.structure, max: 20 },
    ...(typeof result.breakdown.keywords === "number"
      ? [{ label: "Keywords", value: result.breakdown.keywords, max: 30 }]
      : []),
    { label: "Readability", value: result.breakdown.readability, max: 10 },
  ];
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
