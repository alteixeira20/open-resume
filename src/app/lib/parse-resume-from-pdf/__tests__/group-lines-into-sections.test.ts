import {
  groupLinesIntoSections,
  PROFILE_SECTION,
} from "lib/parse-resume-from-pdf/group-lines-into-sections";
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

const makeLine = (text: string, overrides?: Partial<TextItem>): Line => [
  makeItem(text, overrides),
];

describe("groupLinesIntoSections", () => {
  it("groups lines under bold uppercase section titles", () => {
    const lines: Lines = [
      makeLine("John Doe", { fontName: "Helvetica-Bold", y: 800 }),
      makeLine("john@example.com", { y: 790 }),
      makeLine("WORK EXPERIENCE", { fontName: "Helvetica-Bold", y: 780 }),
      makeLine("Built automation pipelines", { y: 770 }),
      makeLine("Education", { y: 760 }),
      makeLine("B.S. Computer Science", { y: 750 }),
    ];

    const sections = groupLinesIntoSections(lines);

    expect(sections[PROFILE_SECTION]).toHaveLength(2);
    expect(sections["WORK EXPERIENCE"]).toHaveLength(1);
    expect(sections["Education"]).toHaveLength(1);
  });

  it("does not treat multi-item lines as section titles", () => {
    const lines: Lines = [
      makeLine("Jane Doe", { y: 800 }),
      [
        makeItem("WORK", { fontName: "Helvetica-Bold", y: 790 }),
        makeItem("EXPERIENCE", { fontName: "Helvetica-Bold", y: 790 }),
      ],
      makeLine("Shipped features", { y: 780 }),
    ];

    const sections = groupLinesIntoSections(lines);

    expect(Object.keys(sections)).toEqual([PROFILE_SECTION]);
    expect(sections[PROFILE_SECTION]).toHaveLength(3);
  });
});
