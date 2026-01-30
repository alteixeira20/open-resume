import { extractLanguages } from "lib/parse-resume-from-pdf/extract-resume-from-sections/extract-languages";
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

describe("extractLanguages", () => {
  it("extracts languages with multiple formatting styles", () => {
    const lines: Lines = [
      makeLine("English (Native), French B2"),
      makeLine("• Spanish — C1"),
    ];
    const sections: ResumeSectionToLines = {
      LANGUAGES: lines,
    };

    const { languages } = extractLanguages(sections);

    expect(languages).toEqual([
      { language: "English", proficiency: "Native" },
      { language: "French", proficiency: "B2" },
      { language: "Spanish", proficiency: "C1" },
    ]);
  });
});
