import { extractSkills } from "lib/parse-resume-from-pdf/extract-resume-from-sections/extract-skills";
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

describe("extractSkills", () => {
  it("extracts featured skills and bullet descriptions", () => {
    const lines: Lines = [
      makeLine("JavaScript"),
      makeLine("TypeScript"),
      makeLine("• Node.js"),
    ];
    const sections: ResumeSectionToLines = {
      SKILLS: lines,
    };

    const { skills } = extractSkills(sections);

    expect(skills.featuredSkills[0].skill).toBe("JavaScript");
    expect(skills.featuredSkills[1].skill).toBe("TypeScript");
    expect(skills.descriptions).toEqual(["Node.js"]);
  });
});
