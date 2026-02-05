"use client";
import { useState } from "react";
import { AtsScoreCard } from "resume-parser/AtsScoreCard";
import { ResumeTable } from "resume-parser/ResumeTable";
import type { AtsScoreResult } from "lib/ats-score";
import type { Resume } from "lib/redux/types";
import { Heading, Paragraph } from "components/documentation";
import Link from "next/link";
import { END_HOME_RESUME } from "home/constants";

const demoScore: AtsScoreResult = {
  score: 97,
  breakdown: {
    parsing: 40,
    structure: 18,
    readability: 10,
    keywords: 29,
  },
  issues: [],
};

const demoResume: Resume = END_HOME_RESUME;

export const EvaluatorShowcase = () => {
  const [showParsedResume, setShowParsedResume] = useState(false);

  return (
    <section className="mx-auto max-w-6xl rounded-2xl bg-white/55 p-6 shadow-sm backdrop-blur">
      <div className="text-center">
        <Heading className="!mt-0 !mb-3">
          ATS Resume Scoring System
        </Heading>
        <Paragraph>
          This is a sample ATS scoring preview using the same demo resume shown
          in the builder example above.
        </Paragraph>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/resume-parser" className="btn-primary">
            Try ATS Scoring
          </Link>
          <button
            type="button"
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
            onClick={() => setShowParsedResume((prev) => !prev)}
            aria-expanded={showParsedResume}
          >
            {showParsedResume ? "Hide parsed CV" : "Show parsed CV"}
          </button>
        </div>
      </div>
      <div className="mt-6">
        <AtsScoreCard result={demoScore} />
      </div>
      {showParsedResume && (
        <div className="mt-6">
          <ResumeTable resume={demoResume} />
        </div>
      )}
    </section>
  );
};
