import { analyzeResumePdf } from "lib/parse-resume-from-pdf/analyze-pdf";
import { initialResumeState } from "lib/redux/resumeSlice";

const readPdfMock = jest.fn();
const readEmbeddedResumeFromPdfMock = jest.fn();
const getPdfDocumentMock = jest.fn();
const readPdfFromDocumentMock = jest.fn();
const readEmbeddedResumeFromPdfDocumentMock = jest.fn();
const groupTextItemsIntoLinesMock = jest.fn();
const groupLinesIntoSectionsMock = jest.fn();
const extractResumeFromSectionsMock = jest.fn();

jest.mock("lib/parse-resume-from-pdf/read-pdf", () => ({
  readPdf: (...args: unknown[]) => readPdfMock(...args),
  readEmbeddedResumeFromPdf: (...args: unknown[]) =>
    readEmbeddedResumeFromPdfMock(...args),
  getPdfDocument: (...args: unknown[]) => getPdfDocumentMock(...args),
  readPdfFromDocument: (...args: unknown[]) => readPdfFromDocumentMock(...args),
  readEmbeddedResumeFromPdfDocument: (...args: unknown[]) =>
    readEmbeddedResumeFromPdfDocumentMock(...args),
}));

jest.mock("lib/parse-resume-from-pdf/group-text-items-into-lines", () => ({
  groupTextItemsIntoLines: (...args: unknown[]) =>
    groupTextItemsIntoLinesMock(...args),
}));

jest.mock("lib/parse-resume-from-pdf/group-lines-into-sections", () => ({
  groupLinesIntoSections: (...args: unknown[]) =>
    groupLinesIntoSectionsMock(...args),
}));

jest.mock("lib/parse-resume-from-pdf/extract-resume-from-sections", () => ({
  extractResumeFromSections: (...args: unknown[]) =>
    extractResumeFromSectionsMock(...args),
}));

describe("analyzeResumePdf", () => {
  beforeEach(() => {
    readPdfMock.mockReset();
    readEmbeddedResumeFromPdfMock.mockReset();
    getPdfDocumentMock.mockReset();
    readPdfFromDocumentMock.mockReset();
    readEmbeddedResumeFromPdfDocumentMock.mockReset();
    groupTextItemsIntoLinesMock.mockReset();
    groupLinesIntoSectionsMock.mockReset();
    extractResumeFromSectionsMock.mockReset();
  });

  it("returns parsed data when no embedded resume is present", async () => {
    const textItems = [{ text: "John Doe" }];
    const lines = [[{ text: "John Doe" }]];
    const sections = { profile: lines };

    readPdfMock.mockResolvedValue(textItems);
    groupTextItemsIntoLinesMock.mockReturnValue(lines);
    groupLinesIntoSectionsMock.mockReturnValue(sections);
    extractResumeFromSectionsMock.mockReturnValue(initialResumeState);
    readEmbeddedResumeFromPdfMock.mockResolvedValue(null);

    const result = await analyzeResumePdf("resume.pdf");

    expect(result.source).toBe("parsed");
    expect(result.textItems).toBe(textItems);
    expect(result.lines).toBe(lines);
    expect(result.sections).toBe(sections);
    expect(result.resume).toBe(initialResumeState);
  });

  it("loads array-buffer PDFs through a single shared document analysis path", async () => {
    const pdfFile = { id: "pdf-file" };
    const textItems = [{ text: "broken pdf text" }];
    const lines = [[{ text: "broken pdf text" }]];
    const sections = { profile: lines };
    const embeddedResume = {
      ...initialResumeState,
      profile: {
        ...initialResumeState.profile,
        name: "Alex Teixeira",
      },
    };

    getPdfDocumentMock.mockResolvedValue(pdfFile);
    readPdfFromDocumentMock.mockResolvedValue(textItems);
    groupTextItemsIntoLinesMock.mockReturnValue(lines);
    groupLinesIntoSectionsMock.mockReturnValue(sections);
    extractResumeFromSectionsMock.mockReturnValue(initialResumeState);
    readEmbeddedResumeFromPdfDocumentMock.mockResolvedValue(embeddedResume);

    const result = await analyzeResumePdf(new ArrayBuffer(8));

    expect(getPdfDocumentMock).toHaveBeenCalledTimes(1);
    expect(readPdfFromDocumentMock).toHaveBeenCalledWith(pdfFile);
    expect(readEmbeddedResumeFromPdfDocumentMock).toHaveBeenCalledWith(pdfFile);
    expect(readPdfMock).not.toHaveBeenCalled();
    expect(readEmbeddedResumeFromPdfMock).not.toHaveBeenCalled();
    expect(result.source).toBe("embedded");
    expect(result.resume).toEqual(embeddedResume);
  });

  it("keeps parser geometry but prefers embedded CVForge resume data when available", async () => {
    const textItems = [{ text: "broken pdf text" }];
    const lines = [[{ text: "broken pdf text" }]];
    const sections = { profile: lines };
    const embeddedResume = {
      ...initialResumeState,
      profile: {
        ...initialResumeState.profile,
        name: "Alex Teixeira",
        email: "alex@example.com",
      },
    };

    readPdfMock.mockResolvedValue(textItems);
    groupTextItemsIntoLinesMock.mockReturnValue(lines);
    groupLinesIntoSectionsMock.mockReturnValue(sections);
    extractResumeFromSectionsMock.mockReturnValue(initialResumeState);
    readEmbeddedResumeFromPdfMock.mockResolvedValue(embeddedResume);

    const result = await analyzeResumePdf("resume.pdf");

    expect(result.source).toBe("embedded");
    expect(result.textItems).toBe(textItems);
    expect(result.lines).toBe(lines);
    expect(result.sections).toBe(sections);
    expect(result.resume).toEqual(embeddedResume);
  });
});
