import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import type { TextItem, TextItems } from "lib/parse-resume-from-pdf/types";

const makeItem = (
  text: string,
  overrides: Partial<TextItem> = {}
): TextItem => ({
  text,
  x: 0,
  y: 0,
  width: Math.max(text.length, 1) * 5,
  height: 10,
  fontName: "Helvetica",
  hasEOL: false,
  page: 1,
  ...overrides,
});

describe("groupTextItemsIntoLines", () => {
  it("merges adjacent items and preserves semantic spacing", () => {
    const textItems: TextItems = [
      makeItem("Jan", { x: 0, y: 100 }),
      makeItem("2020", { x: 18, y: 100, hasEOL: true }),
      makeItem("-", { x: 0, y: 90 }),
      makeItem("Bullet", { x: 8, y: 90, hasEOL: true }),
    ];

    const lines = groupTextItemsIntoLines(textItems);

    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveLength(1);
    expect(lines[0][0].text).toBe("Jan 2020");
    expect(lines[1][0].text).toBe("- Bullet");
  });

  it("removes stray boundary whitespace inside split words", () => {
    const textItems: TextItems = [
      makeItem("hands-on expe", { x: 0, y: 100, width: 65 }),
      makeItem(" rience", { x: 65.2, y: 100, width: 35 }),
      makeItem(" building", { x: 105, y: 100, width: 45, hasEOL: true }),
    ];

    const lines = groupTextItemsIntoLines(textItems);

    expect(lines).toHaveLength(1);
    expect(lines[0]).toHaveLength(1);
    expect(lines[0][0].text).toBe("hands-on experience building");
  });

  it("preserves real spaces when adjacent items are separated by a normal gap", () => {
    const textItems: TextItems = [
      makeItem("Strong", { x: 0, y: 100, width: 30 }),
      makeItem(" emphasis", { x: 35, y: 100, width: 45, hasEOL: true }),
    ];

    const lines = groupTextItemsIntoLines(textItems);

    expect(lines).toHaveLength(1);
    expect(lines[0]).toHaveLength(1);
    expect(lines[0][0].text).toBe("Strong emphasis");
  });
});
