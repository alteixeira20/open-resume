"use client";
import { useState } from "react";
import type { AtsScoreResult } from "lib/ats-score";
import { cx } from "lib/cx";
import { formatBreakdown, scoreColor } from "lib/ats-display";
import { Card } from "components/ui";

interface AtsScoreCardProps {
  result: AtsScoreResult | null;
}

export const AtsScoreCard = ({ result }: AtsScoreCardProps) => {
  const breakdown = formatBreakdown(result);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(
    () => new Set()
  );

  if (!result) {
    return (
      <Card className="mt-6">
        <h2 className="text-lg font-black text-[color:var(--color-text-primary)]">
          ATS Score
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
          Upload a CV to generate a local ATS readiness score.
        </p>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <div>
        <h2 className="text-lg font-black text-[color:var(--color-text-primary)]">
          ATS Score
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
          Deterministic, local evaluation across parsing, structure, readability
          {typeof result.breakdown.keywords === "number"
            ? ", and job description alignment."
            : "."}
        </p>
        <div className="mt-4">
          <p className="text-sm uppercase tracking-wide text-[color:var(--color-text-muted)]">
            Score
          </p>
          <p
            className={cx("mt-1 pl-2 text-5xl font-black leading-none", result.score < 70 && scoreColor(result.score))}
          >
            {result.score >= 70 ? (
              <span
                className="inline-block"
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-forge-700) 0%, var(--color-forge-600) 22%, var(--color-forge-500) 46%, var(--color-brand-secondary) 74%, var(--color-brand-primary) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {result.score}
              </span>
            ) : (
              result.score
            )}
          </p>
        </div>
      </div>

      {breakdown.length > 0 && (
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {breakdown.map((item) => (
            <div key={item.label} className="rounded-md border border-[color:var(--color-surface-border)] p-4">
              <dt className="text-sm font-medium text-[color:var(--color-text-secondary)]">{item.label}</dt>
              <dd className="mt-2 flex items-baseline gap-2 text-xl font-semibold text-[color:var(--color-text-primary)]">
                <span>{Math.round(item.value)}</span>
                <span className="text-xs font-normal text-[color:var(--color-text-muted)]">/ {item.max}</span>
              </dd>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-raised)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-brand-secondary), var(--color-brand-primary))",
                    width: `${Math.min(100, (item.value / item.max) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </dl>
      )}

      {result.issues.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
            Suggested improvements
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-text-secondary)]">
            {result.issues.map((issue) => {
              const details = result.issueDetails?.[issue] ?? [];
              const isExpanded = expandedIssues.has(issue);
              return (
                <li
                  key={issue}
                  className="rounded-md border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-raised)] px-3 py-2"
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm font-bold text-[color:var(--color-brand-primary)]" aria-hidden>
                      ▸
                    </span>
                    <span className="flex-1">{issue}</span>
                    {details.length > 0 && (
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary hover:underline"
                        onClick={() =>
                          setExpandedIssues((prev) => {
                            const next = new Set(prev);
                            if (next.has(issue)) {
                              next.delete(issue);
                            } else {
                              next.add(issue);
                            }
                            return next;
                          })
                        }
                      >
                        {isExpanded ? "Hide details" : "Show details"}
                      </button>
                    )}
                  </div>
                  {details.length > 0 && isExpanded && (
                    <div className="mt-2 rounded-md border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)] px-3 py-2 text-xs text-[color:var(--color-text-secondary)]">
                      <p className="font-semibold text-[color:var(--color-text-secondary)]">
                        Detected tokens
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {details.map((token) => (
                          <span
                            key={token}
                            className="rounded-full border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-raised)] px-2 py-0.5 font-mono"
                          >
                            {token}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="mt-6 text-xs text-[color:var(--color-text-muted)]">
        Disclaimer: this score is a diagnostic aid, not a guarantee of interviews or outcomes.
        Use it to check parsing quality and refine layout, and apply your own judgment.
      </p>
    </Card>
  );
};

export default AtsScoreCard;
