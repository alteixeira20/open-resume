import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";
import type { Lines, TextItem } from "lib/parse-resume-from-pdf/types";

const makeItem = (text: string): TextItem =>
  ({
    text,
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    fontName: "Helvetica",
    hasEOL: true,
    page: 1,
  } as TextItem);

describe("bullet point parsing", () => {
  it("extracts bullet items from lines", () => {
    const lines: Lines = [
      [makeItem("• Built pipelines for CI")],
      [makeItem("• Reduced latency by 30%")],
    ];
    expect(getBulletPointsFromLines(lines)).toEqual([
      "Built pipelines for CI",
      "Reduced latency by 30%",
    ]);
  });

  it("falls back to whole lines when no bullets", () => {
    const lines: Lines = [
      [makeItem("Built observability tooling for production")],
      [makeItem("Improved monitoring coverage across services")],
    ];
    expect(getBulletPointsFromLines(lines)).toEqual([
      "Built observability tooling for production",
      "Improved monitoring coverage across services",
    ]);
  });

  it("detects description start with long paragraph", () => {
    const lines: Lines = [
      [makeItem("Company Name")],
      [makeItem("Role Name")],
      [
        makeItem(
          "Led cross functional delivery across multiple teams with measurable impact"
        ),
      ],
    ];
    expect(getDescriptionsLineIdx(lines)).toBe(2);
  });
});
