import { getTextWithHighestFeatureScore } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/feature-scoring-system";
import type { FeatureSet, TextItem, TextItems } from "lib/parse-resume-from-pdf/types";

const makeItem = (text: string): TextItem => ({
  text,
  x: 0,
  y: 0,
  width: text.length * 5,
  height: 10,
  fontName: "Helvetica",
  hasEOL: true,
  page: 1,
});

describe("getTextWithHighestFeatureScore", () => {
  it("prefers matched text when returnMatchingText is enabled", () => {
    const items: TextItems = [
      makeItem("Email: jane@example.com"),
      makeItem("Name: Jane Doe"),
    ];
    const featureSets: FeatureSet[] = [
      [(item) => item.text.match(/\S+@\S+\.\S+/), 3, true],
      [(item) => item.text.includes("Name"), 1],
    ];

    const [text, scores] = getTextWithHighestFeatureScore(items, featureSets);

    expect(text).toBe("jane@example.com");
    expect(scores.some((score) => score.text === "jane@example.com")).toBe(
      true
    );
  });

  it("concatenates ties when requested", () => {
    const items: TextItems = [makeItem("Alpha"), makeItem("Beta")];
    const featureSets: FeatureSet[] = [[() => true, 1]];

    const [text] = getTextWithHighestFeatureScore(
      items,
      featureSets,
      true,
      true
    );

    expect(text).toBe("Alpha Beta");
  });

  it("returns empty string when highest score is non-positive", () => {
    const items: TextItems = [makeItem("Ignore me")];
    const featureSets: FeatureSet[] = [[() => true, -1]];

    const [text] = getTextWithHighestFeatureScore(items, featureSets);

    expect(text).toBe("");
  });
});
