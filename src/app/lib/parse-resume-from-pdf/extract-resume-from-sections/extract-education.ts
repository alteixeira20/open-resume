import type {
  TextItem,
  FeatureSet,
  ResumeSectionToLines,
} from "lib/parse-resume-from-pdf/types";
import type { ResumeEducation } from "lib/redux/types";
import { getSectionLinesByKeywords } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/get-section-lines";
import { divideSectionIntoSubsections } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/subsections";
import {
  DATE_FEATURE_SETS,
  hasLetter,
  hasNumber,
  isBold,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import { getTextWithHighestFeatureScore } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/feature-scoring-system";
import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";

/**
 *              Unique Attribute
 * School       Has school
 * Degree       Has degree
 */

// prettier-ignore
const SCHOOLS = ['College', 'University', 'Institute', 'School', 'Academy', 'BASIS', 'Magnet']
const hasSchool = (item: TextItem) =>
  SCHOOLS.some((school) => item.text.includes(school));
// prettier-ignore
const DEGREES = ["Associate", "Bachelor", "Master", "PhD", "Ph."];
const hasDegree = (item: TextItem) =>
  DEGREES.some((degree) => item.text.includes(degree)) ||
  /[ABM][A-Z\.]/.test(item.text); // Match AA, B.S., MBA, etc.

const SCHOOL_FEATURE_SETS: FeatureSet[] = [
  [hasSchool, 4],
  [isBold, 2],
  [hasLetter, 1],
  [hasDegree, -4],
  [(item) => /^\d+$/.test(item.text.trim()), -4],
];

const DEGREE_FEATURE_SETS: FeatureSet[] = [
  [hasDegree, 4],
  [hasLetter, 2],
  [hasSchool, -4],
  [hasNumber, -3],
];

const isDateLike = (text: string) =>
  /(?:19|20)\d{2}/.test(text) ||
  /(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(
    text
  ) ||
  /(Present|Now)/i.test(text);

const lineToText = (line: TextItem[]) =>
  line
    .map((item) => item.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

const hasLetterText = (text: string) => /[A-Za-z\u00C0-\u024F]/.test(text);
const isBulletOnly = (text: string) => /^[\s•\-◦·*]+$/.test(text.trim());

export const extractEducation = (sections: ResumeSectionToLines) => {
  const educations: ResumeEducation[] = [];
  const educationsScores = [];
  const lines = getSectionLinesByKeywords(sections, ["education"]);
  const subsections = divideSectionIntoSubsections(lines);
  for (const subsectionLines of subsections) {
    const descriptionsLineIdx = getDescriptionsLineIdx(subsectionLines);
    const nonDescriptionLines =
      descriptionsLineIdx === undefined
        ? subsectionLines
        : subsectionLines.slice(0, descriptionsLineIdx);
    const scoringTextItems = nonDescriptionLines
      .flat()
      .filter((item) => !isBulletOnly(item.text));
    const [school, schoolScores] = getTextWithHighestFeatureScore(
      scoringTextItems,
      SCHOOL_FEATURE_SETS
    );
    const [degree, degreeScores] = getTextWithHighestFeatureScore(
      scoringTextItems,
      DEGREE_FEATURE_SETS
    );
    const [date, dateScores] = getTextWithHighestFeatureScore(
      scoringTextItems,
      DATE_FEATURE_SETS
    );

    let descriptions: string[] = [];
    if (descriptionsLineIdx !== undefined) {
      const descriptionsLines = subsectionLines.slice(descriptionsLineIdx);
      descriptions = getBulletPointsFromLines(descriptionsLines);
    }
    const lineTexts = nonDescriptionLines.map(lineToText).filter(Boolean);

    let finalSchool = school;
    let finalDegree = degree;

    if (
      lineTexts.length >= 2 &&
      isDateLike(lineTexts[1]) &&
      hasLetterText(lineTexts[0]) &&
      !isBulletOnly(lineTexts[0])
    ) {
      finalSchool = lineTexts[0];
    }

    if (!finalSchool) {
      finalSchool =
        lineTexts.find(
          (text) => hasLetterText(text) && !isDateLike(text) && !isBulletOnly(text)
        ) ??
        "";
    }

    if (!finalDegree) {
      const schoolIdx = lineTexts.findIndex((text) => text === finalSchool);
      const startIdx = schoolIdx >= 0 ? schoolIdx + 1 : 0;
      finalDegree =
        lineTexts
          .slice(startIdx)
          .find((text) => !isDateLike(text) && !isBulletOnly(text)) ?? "";
    }

    educations.push({
      school: finalSchool,
      degree: finalDegree,
      gpa: "",
      date,
      descriptions,
    });
    educationsScores.push({
      schoolScores,
      degreeScores,
      dateScores,
    });
  }

  if (educations.length !== 0) {
    const coursesLines = getSectionLinesByKeywords(sections, ["course"]);
    if (coursesLines.length !== 0) {
      educations[0].descriptions.push(
        "Courses: " +
          coursesLines
            .flat()
            .map((item) => item.text)
            .join(" ")
      );
    }
  }

  return {
    educations,
    educationsScores,
  };
};
