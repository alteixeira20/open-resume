import { render, screen } from "@testing-library/react";
import { AtsScoreCard } from "resume-parser/AtsScoreCard";
import type { AtsScoreResult } from "lib/ats-score";

describe("AtsScoreCard", () => {
  const baseResult: AtsScoreResult = {
    score: 82,
    breakdown: {
      parsing: 30,
      structure: 18,
      readability: 9,
      keywords: 25,
    },
    issues: ["Email not found", "Few metrics detected"],
  };

  it("renders a placeholder when no result is provided", () => {
    render(<AtsScoreCard result={null} />);
    expect(screen.getByText("ATS Score")).toBeInTheDocument();
    expect(
      screen.getByText("Upload a resume to generate a local ATS readiness score.")
    ).toBeInTheDocument();
  });

  it("displays the score and breakdown when result is present", () => {
    render(<AtsScoreCard result={baseResult} />);
    expect(screen.getByText("ATS Score")).toBeInTheDocument();
    expect(screen.getByText("82")).toBeInTheDocument();
    expect(screen.getByText("Parsing")).toBeInTheDocument();
    expect(screen.getByText("Structure")).toBeInTheDocument();
    expect(screen.getByText("Keywords")).toBeInTheDocument();
    expect(screen.getByText("Readability")).toBeInTheDocument();
    expect(screen.getByText("Email not found")).toBeInTheDocument();
    expect(screen.getByText("Few metrics detected")).toBeInTheDocument();
  });
});
