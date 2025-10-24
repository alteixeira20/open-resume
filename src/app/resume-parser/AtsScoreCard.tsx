import type { AtsScoreResult } from "lib/ats-score";
import { cx } from "lib/cx";

interface AtsScoreCardProps {
  result: AtsScoreResult | null;
}

const formatMetric = (label: string, value: number, max: number) => ({
  label,
  value,
  max,
});

const breakdownLabels = (
  result: AtsScoreResult | null
): Array<{ label: string; value: number; max: number }> => {
  if (!result) return [];
  const items = [
    formatMetric("Parsing", result.breakdown.parsing, 40),
    formatMetric("Structure", result.breakdown.structure, 20),
    ...(typeof result.breakdown.keywords === "number"
      ? [formatMetric("Keywords", result.breakdown.keywords, 30)]
      : []),
    formatMetric("Readability", result.breakdown.readability, 10),
  ];
  return items;
};

export const AtsScoreCard = ({ result }: AtsScoreCardProps) => {
  const breakdown = breakdownLabels(result);

  if (!result) {
    return (
      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">ATS Score</h2>
        <p className="mt-2 text-sm text-gray-600">
          Upload a resume to generate a local ATS readiness score.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">ATS Score</h2>
          <p className="mt-1 text-sm text-gray-600">
            Deterministic, local evaluation across parsing, structure, readability
            {typeof result.breakdown.keywords === "number"
              ? ", and job description alignment."
              : "."}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-wide text-gray-500">Score</p>
          <p className="text-4xl font-bold text-primary">{result.score}</p>
        </div>
      </div>

      {breakdown.length > 0 && (
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {breakdown.map((item) => (
            <div key={item.label} className="rounded-md border border-gray-100 p-4">
              <dt className="text-sm font-medium text-gray-700">{item.label}</dt>
              <dd className="mt-2 flex items-baseline gap-2 text-xl font-semibold text-gray-900">
                <span>{Math.round(item.value)}</span>
                <span className="text-xs font-normal text-gray-500">/ {item.max}</span>
              </dd>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={cx(
                    "h-full rounded-full",
                    item.value >= item.max * 0.7 ? "bg-emerald-500" : "bg-primary"
                  )}
                  style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </dl>
      )}

      {result.issues.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Suggested improvements
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {result.issues.map((issue) => (
              <li
                key={issue}
                className="flex items-start gap-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <span className="mt-0.5 h-2 w-2 rounded-full bg-primary" aria-hidden />
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default AtsScoreCard;
