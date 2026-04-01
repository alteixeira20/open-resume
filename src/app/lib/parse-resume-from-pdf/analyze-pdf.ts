import type { Resume } from "lib/redux/types";
import type {
  Lines,
  ResumeSectionToLines,
  TextItems,
} from "lib/parse-resume-from-pdf/types";
import {
  getPdfDocument,
  readEmbeddedResumeFromPdfDocument,
  readPdfFromDocument,
  readEmbeddedResumeFromPdf,
  readPdf,
  type PdfSource,
} from "lib/parse-resume-from-pdf/read-pdf";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";

export interface ParsedPdfAnalysis {
  source: "parsed";
  textItems: TextItems;
  lines: Lines;
  sections: ResumeSectionToLines;
  resume: Resume;
}

export interface EmbeddedPdfAnalysis {
  source: "embedded";
  textItems: TextItems;
  lines: Lines;
  sections: ResumeSectionToLines;
  resume: Resume;
}

export type PdfResumeAnalysis = ParsedPdfAnalysis | EmbeddedPdfAnalysis;

export const analyzeResumePdf = async (
  fileSource: PdfSource
): Promise<PdfResumeAnalysis> => {
  if (typeof fileSource === "string") {
    const textItems = await readPdf(fileSource);
    const lines = groupTextItemsIntoLines(textItems);
    const sections = groupLinesIntoSections(lines);
    const parsedResume = extractResumeFromSections(sections);
    const embeddedResume = await readEmbeddedResumeFromPdf(fileSource);

    return {
      source: embeddedResume ? "embedded" : "parsed",
      textItems,
      lines,
      sections,
      resume: embeddedResume ?? parsedResume,
    };
  }

  const pdfFile = await getPdfDocument(fileSource);
  const textItems = await readPdfFromDocument(pdfFile);
  const lines = groupTextItemsIntoLines(textItems);
  const sections = groupLinesIntoSections(lines);
  const parsedResume = extractResumeFromSections(sections);
  const embeddedResume = await readEmbeddedResumeFromPdfDocument(pdfFile);

  return {
    source: embeddedResume ? "embedded" : "parsed",
    textItems,
    lines,
    sections,
    resume: embeddedResume ?? parsedResume,
  };
};
