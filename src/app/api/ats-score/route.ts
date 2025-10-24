import { NextRequest, NextResponse } from "next/server";
import { calculateAtsScore } from "lib/ats-score";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import type {
  Lines,
  ResumeSectionToLines,
  TextItems,
} from "lib/parse-resume-from-pdf/types";
import type { Resume } from "lib/redux/types";

interface AtsScoreRequestBody {
  textItems?: TextItems;
  jobDescription?: string;
  lines?: Lines;
  sections?: ResumeSectionToLines;
  resume?: Resume;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AtsScoreRequestBody;
    const { textItems, jobDescription } = body;

    if (!Array.isArray(textItems) || textItems.length === 0) {
      return NextResponse.json(
        { error: "textItems array is required" },
        { status: 400 }
      );
    }

    const lines = body.lines ?? groupTextItemsIntoLines(textItems);
    const sections = body.sections ?? groupLinesIntoSections(lines);
    const resume = body.resume ?? extractResumeFromSections(sections);

    const result = calculateAtsScore({
      textItems,
      lines,
      sections,
      resume,
      jobDescription,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to compute ATS score", error);
    return NextResponse.json(
      { error: "Failed to compute ATS score" },
      { status: 500 }
    );
  }
}
