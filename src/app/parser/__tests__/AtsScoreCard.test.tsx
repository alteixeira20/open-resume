import { render, screen } from "@testing-library/react";
import { AtsScoreCard } from "parser/AtsScoreCard";
import type { AtsScoreResult } from "lib/ats-score";

describe("AtsScoreCard", () => {
  const baseResult: AtsScoreResult = {
    score: 82,
    breakdown: {
      parsing: 30,
      structure: 18,
      readability: 9,
    },
    issues: ["Email not found", "Few metrics detected"],
  };

  it("renders a placeholder when no result is provided", () => {
    render(<AtsScoreCard result={null} />);
    expect(screen.getByText("Format Score")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Upload a CV to get a local formatting score and diagnostic breakdown."
      )
    ).toBeInTheDocument();
  });

  it("displays the score and breakdown when result is present", () => {
    render(<AtsScoreCard result={baseResult} />);
    expect(screen.getByText("Format Score")).toBeInTheDocument();
    expect(screen.getByText("82")).toBeInTheDocument();
    expect(screen.getAllByText("Parsing").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Structure").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Readability").length).toBeGreaterThan(0);
    expect(screen.getByText("How the score is calculated")).toBeInTheDocument();
    expect(screen.getByText("Point attribution")).toBeInTheDocument();
    expect(screen.getAllByText("Email not found").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Few metrics detected").length).toBeGreaterThan(0);
  });
});
