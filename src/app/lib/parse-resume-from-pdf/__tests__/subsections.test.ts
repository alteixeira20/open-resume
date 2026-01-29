import { divideSectionIntoSubsections } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/subsections";
import type { Line, Lines, TextItem } from "lib/parse-resume-from-pdf/types";

const makeItem = (
  text: string,
  overrides: Partial<TextItem> = {}
): TextItem => ({
  text,
  x: 0,
  y: 0,
  width: text.length * 5,
  height: 10,
  fontName: "Helvetica",
  hasEOL: true,
  page: 1,
  ...overrides,
});

const makeLine = (text: string, y: number, fontName = "Helvetica"): Line => [
  makeItem(text, { y, fontName }),
];

describe("divideSectionIntoSubsections", () => {
  it("splits subsections using larger line gaps", () => {
    const lines: Lines = [
      makeLine("Company A", 100),
      makeLine("Engineer", 90),
      makeLine("Impact statement", 80),
      makeLine("Company B", 60),
      makeLine("Engineer", 50),
    ];

    const subsections = divideSectionIntoSubsections(lines);

    expect(subsections).toHaveLength(2);
    expect(subsections[0]).toHaveLength(3);
    expect(subsections[1]).toHaveLength(2);
  });

  it("falls back to bold lines when gaps are uniform", () => {
    const lines: Lines = [
      makeLine("Company A", 100),
      makeLine("Company B", 90, "Helvetica-Bold"),
      makeLine("Role", 80),
    ];

    const subsections = divideSectionIntoSubsections(lines);

    expect(subsections).toHaveLength(2);
    expect(subsections[0][0][0].text).toBe("Company A");
    expect(subsections[1][0][0].text).toBe("Company B");
  });
});
