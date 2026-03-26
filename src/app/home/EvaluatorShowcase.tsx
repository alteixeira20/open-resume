"use client";
import { useState } from "react";
import { AtsScoreCard } from "parser/AtsScoreCard";
import { ResumeTable } from "parser/ResumeTable";
import type { AtsScoreResult } from "lib/ats-score";
import type { Resume } from "lib/redux/types";
import { END_HOME_RESUME } from "home/constants";
import { HOME_EVALUATOR } from "content/home";
import { Section } from "components/layout/Section";
import { Button, SectionHeading } from "components/ui";

const demoScore: AtsScoreResult = {
  score: 97,
  breakdown: {
    parsing: 40,
    structure: 18,
    readability: 10,
  },
  issues: [],
};

const demoResume: Resume = END_HOME_RESUME;

export const EvaluatorShowcase = () => {
  const [showParsedResume, setShowParsedResume] = useState(false);

  return (
    <Section>
      <div className="text-center">
        <SectionHeading
          align="center"
          title={HOME_EVALUATOR.title}
          subtitle={HOME_EVALUATOR.description}
        />
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button href={HOME_EVALUATOR.primaryCta.href}>
            {HOME_EVALUATOR.primaryCta.label}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowParsedResume((prev) => !prev)}
            aria-expanded={showParsedResume}
          >
            {showParsedResume
              ? HOME_EVALUATOR.toggle.hide
              : HOME_EVALUATOR.toggle.show}
          </Button>
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
    </Section>
  );
};
