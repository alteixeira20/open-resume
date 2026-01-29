import type { ResumeWorkExperience } from "lib/redux/types";
import type {
  TextItem,
  FeatureSet,
  ResumeSectionToLines,
} from "lib/parse-resume-from-pdf/types";
import { getSectionLinesByKeywords } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/get-section-lines";
import {
  DATE_FEATURE_SETS,
  hasNumber,
  getHasText,
  isBold,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import { divideSectionIntoSubsections } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/subsections";
import { getTextWithHighestFeatureScore } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/feature-scoring-system";
import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";

// prettier-ignore
const WORK_EXPERIENCE_KEYWORDS_LOWERCASE = ['work', 'experience', 'employment', 'history', 'job'];
// prettier-ignore
const JOB_TITLES = ['Accountant', 'Administrator', 'Advisor', 'Agent', 'Analyst', 'Apprentice', 'Architect', 'Assistant', 'Associate', 'Auditor', 'Bartender', 'Biologist', 'Bookkeeper', 'Buyer', 'Carpenter', 'Cashier', 'CEO', 'Chef', 'Clerk', 'Co-op', 'Co-Founder', 'Consultant', 'Coordinator', 'Cook', 'CTO', 'Developer', 'Designer', 'Director', 'Driver', 'Editor', 'Electrician', 'Engineer', 'Extern', 'Founder', 'Freelancer', 'Head', 'Intern', 'Janitor', 'Journalist', 'Laborer', 'Lawyer', 'Lead', 'Manager', 'Mechanic', 'Member', 'Nurse', 'Officer', 'Operator', 'Operation', 'Operations', 'Owner', 'Photographer', 'President', 'Producer', 'Recruiter', 'Representative', 'Researcher', 'Sales', 'Server', 'Scientist', 'Specialist', 'Supervisor', 'Teacher', 'Technician', 'Trader', 'Trainee', 'Treasurer', 'Tutor', 'Vice', 'VP', 'Volunteer', 'Webmaster', 'Worker'];
const JOB_TITLES_LOWERCASE = JOB_TITLES.map((title) => title.toLowerCase());

const hasJobTitle = (item: TextItem) =>
  item.text
    .split(/\s+/)
    .some((word) => JOB_TITLES_LOWERCASE.includes(word.toLowerCase()));
const hasMoreThan5Words = (item: TextItem) => item.text.split(/\s/).length > 5;
const JOB_TITLE_FEATURE_SET: FeatureSet[] = [
  [hasJobTitle, 4],
  [hasNumber, -4],
  [hasMoreThan5Words, -2],
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

const DATE_TOKEN_RE =
  /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|(?:19|20)\d{2}|Present|Now)\b/i;

const stripDateFromText = (text: string) => {
  const idx = text.search(DATE_TOKEN_RE);
  if (idx === -1) return text.trim();
  return text.slice(0, idx).trim();
};

export const extractWorkExperience = (sections: ResumeSectionToLines) => {
  const workExperiences: ResumeWorkExperience[] = [];
  const workExperiencesScores = [];
  const lines = getSectionLinesByKeywords(
    sections,
    WORK_EXPERIENCE_KEYWORDS_LOWERCASE
  );
  const subsections = divideSectionIntoSubsections(lines);

  for (const subsectionLines of subsections) {
    const descriptionsLineIdx = getDescriptionsLineIdx(subsectionLines) ?? 2;

    const subsectionInfoLines = subsectionLines.slice(0, descriptionsLineIdx);
    const subsectionInfoTextItems = subsectionInfoLines.flat();
    const [date, dateScores] = getTextWithHighestFeatureScore(
      subsectionInfoTextItems,
      DATE_FEATURE_SETS
    );
    const [jobTitle, jobTitleScores] = getTextWithHighestFeatureScore(
      subsectionInfoTextItems,
      JOB_TITLE_FEATURE_SET
    );
    const lineEntries = subsectionInfoLines
      .map((line) => ({
        text: lineToText(line),
        bold: line[0] ? isBold(line[0]) : false,
      }))
      .filter((entry) => entry.text.length > 0);
    const lineCandidates = lineEntries
      .map((entry) => ({
        ...entry,
        cleaned: stripDateFromText(entry.text),
      }))
      .filter(
        (entry) =>
          hasLetterText(entry.cleaned) &&
          !isDateLike(entry.cleaned) &&
          !isBulletOnly(entry.cleaned)
      );
    const nonBoldCandidates = lineCandidates.filter((entry) => !entry.bold);
    const fallbackJobTitle =
      (nonBoldCandidates.length ? nonBoldCandidates : lineCandidates)[0]
        ?.cleaned ?? "";
    const finalJobTitle = jobTitle || fallbackJobTitle;
    const COMPANY_FEATURE_SET: FeatureSet[] = [
      [isBold, 2],
      [getHasText(date), -4],
      [getHasText(finalJobTitle), -4],
    ];
    const [company, companyScores] = getTextWithHighestFeatureScore(
      subsectionInfoTextItems,
      COMPANY_FEATURE_SET,
      false
    );

    const subsectionDescriptionsLines =
      subsectionLines.slice(descriptionsLineIdx);
    const descriptions = getBulletPointsFromLines(subsectionDescriptionsLines);

    workExperiences.push({
      company,
      jobTitle: finalJobTitle,
      date,
      descriptions,
    });
    workExperiencesScores.push({
      companyScores,
      jobTitleScores,
      dateScores,
    });
  }
  return { workExperiences, workExperiencesScores };
};
