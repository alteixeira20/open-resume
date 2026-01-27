import { extractEducation } from "lib/parse-resume-from-pdf/extract-resume-from-sections/extract-education";
import type { ResumeSectionToLines, TextItem } from "lib/parse-resume-from-pdf/types";

const makeItem = (text: string): TextItem =>
  ({
    text,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fontName: "Helvetica-Bold",
    hasEOL: true,
    page: 1,
  }) as TextItem;

describe("extract-education", () => {
  it("extracts school and degree without GPA", () => {
    const sections: ResumeSectionToLines = {
      education: [
        [makeItem("42 Porto")],
        [makeItem("Software Engineering")],
        [makeItem("Oct 2024 - Present")],
      ],
    };

    const { educations } = extractEducation(sections);
    expect(educations[0].school).toBe("42 Porto");
    expect(educations[0].degree).toBe("Software Engineering");
    expect(educations[0].date).toBe("Oct 2024 - Present");
    expect(educations[0].gpa).toBe("");
  });
});
