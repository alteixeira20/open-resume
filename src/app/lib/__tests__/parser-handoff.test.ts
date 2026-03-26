import {
  BUILDER_TO_PARSER_HANDOFF_KEY,
  clearBuilderParserHandoff,
  isBuilderParserArrival,
  readBuilderParserHandoff,
  writeBuilderParserHandoff,
} from "lib/parser-handoff";

describe("parser handoff helpers", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
  });

  it("writes and reads a fresh builder handoff payload", () => {
    writeBuilderParserHandoff({
      source: "builder",
      createdAt: new Date().toISOString(),
      fileName: "alex-2026-03-20.pdf",
      dataUrl: "data:application/pdf;base64,AAA",
      resumeLocale: "eu",
    });

    expect(readBuilderParserHandoff()).toEqual({
      source: "builder",
      createdAt: expect.any(String),
      fileName: "alex-2026-03-20.pdf",
      dataUrl: "data:application/pdf;base64,AAA",
      resumeLocale: "eu",
    });
  });

  it("rejects stale handoff payloads", () => {
    jest.spyOn(Date, "now").mockReturnValue(new Date("2026-03-20T12:30:00Z").getTime());
    sessionStorage.setItem(
      BUILDER_TO_PARSER_HANDOFF_KEY,
      JSON.stringify({
        source: "builder",
        createdAt: "2026-03-20T11:00:00.000Z",
        fileName: "old.pdf",
        dataUrl: "data:application/pdf;base64,AAA",
      })
    );

    expect(readBuilderParserHandoff()).toBeNull();
  });

  it("clears stored handoff payloads and detects builder arrivals", () => {
    writeBuilderParserHandoff({
      source: "builder",
      createdAt: new Date().toISOString(),
      fileName: "alex.pdf",
      dataUrl: "data:application/pdf;base64,AAA",
    });

    clearBuilderParserHandoff();

    expect(sessionStorage.getItem(BUILDER_TO_PARSER_HANDOFF_KEY)).toBeNull();
    expect(isBuilderParserArrival("?source=builder")).toBe(true);
    expect(isBuilderParserArrival("?source=manual")).toBe(false);
  });
});
