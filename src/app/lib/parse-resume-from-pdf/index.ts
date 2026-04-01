import { analyzeResumePdf } from "lib/parse-resume-from-pdf/analyze-pdf";
import type { PdfSource } from "lib/parse-resume-from-pdf/read-pdf";

/**
 * Resume parser util that parses a resume from a resume pdf file
 *
 * Note: The parser algorithm only works for single column resume in English language
 */
export const parseResumeFromPdf = async (fileSource: PdfSource) => {
  const analysis = await analyzeResumePdf(fileSource);
  return analysis.resume;
};
