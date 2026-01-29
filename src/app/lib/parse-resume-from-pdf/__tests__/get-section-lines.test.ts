import { getSectionLinesByKeywords } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/get-section-lines";
import type { Lines, ResumeSectionToLines, TextItem } from "lib/parse-resume-from-pdf/types";

const makeLine = (text: string): TextItem[] => [
  {
    text,
    x: 0,
    y: 0,
    width: text.length * 5,
    height: 10,
    fontName: "Helvetica",
    hasEOL: true,
    page: 1,
  },
];

describe("getSectionLinesByKeywords", () => {
  it("returns the first matching section lines", () => {
    const workLines: Lines = [makeLine("Did the work")];
    const educationLines: Lines = [makeLine("B.S. Computer Science")];
    const sections: ResumeSectionToLines = {
      "Work Experience": workLines,
      Education: educationLines,
    };

    const result = getSectionLinesByKeywords(sections, ["experience"]);

    expect(result).toBe(workLines);
  });

  it("returns empty array when no section matches", () => {
    const sections: ResumeSectionToLines = {
      Projects: [makeLine("Built things")],
    };

    const result = getSectionLinesByKeywords(sections, ["education"]);

    expect(result).toEqual([]);
  });
});
