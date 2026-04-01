import { initialResumeState } from "lib/redux/resumeSlice";
import {
  type FormWithBulletPoints,
  initialSettings,
  type ResumeLocale,
  type Settings,
  type ShowForm,
} from "lib/redux/settingsSlice";
import type { RootState } from "lib/redux/store";
import type {
  FeaturedSkill,
  Resume,
  ResumeEducation,
  ResumeLanguage,
  ResumeProfile,
  ResumeProject,
  ResumeWorkExperience,
  ResumeSkills,
} from "lib/redux/types";

type UnknownRecord = Record<string, unknown>;

const SHOW_FORMS = Object.keys(initialSettings.formToShow) as ShowForm[];
const DOCUMENT_SIZES = new Set(["A4", "Letter"]);
const RESUME_LOCALES = new Set<ResumeLocale>(["eu", "us"]);

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown, fallback = "") =>
  typeof value === "string"
    ? value
    : typeof value === "number"
      ? String(value)
      : fallback;

const asBoolean = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

const asStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const normalizeProfile = (value: unknown): ResumeProfile => {
  const input = isRecord(value) ? value : {};
  return {
    name: asString(input.name),
    summary: asString(input.summary),
    email: asString(input.email),
    phone: asString(input.phone),
    location: asString(input.location),
    url: asString(input.url),
    github: asString(input.github),
  };
};

const normalizeWorkExperience = (value: unknown): ResumeWorkExperience => {
  const input = isRecord(value) ? value : {};
  return {
    company: asString(input.company),
    jobTitle: asString(input.jobTitle),
    date: asString(input.date),
    descriptions: asStringArray(input.descriptions),
  };
};

const normalizeEducation = (value: unknown): ResumeEducation => {
  const input = isRecord(value) ? value : {};
  return {
    school: asString(input.school),
    degree: asString(input.degree),
    gpa: asString(input.gpa),
    date: asString(input.date),
    descriptions: asStringArray(input.descriptions),
  };
};

const normalizeProject = (value: unknown): ResumeProject => {
  const input = isRecord(value) ? value : {};
  return {
    project: asString(input.project),
    link: asString(input.link),
    date: asString(input.date),
    descriptions: asStringArray(input.descriptions),
  };
};

const normalizeLanguage = (value: unknown): ResumeLanguage => {
  const input = isRecord(value) ? value : {};
  return {
    language: asString(input.language),
    proficiency: asString(input.proficiency),
  };
};

const normalizeFeaturedSkill = (value: unknown): FeaturedSkill => {
  const input = isRecord(value) ? value : {};
  return {
    skill: asString(input.skill),
    rating:
      typeof input.rating === "number" && Number.isFinite(input.rating)
        ? input.rating
        : 4,
  };
};

export const normalizeResume = (value: unknown): Resume | null => {
  if (!isRecord(value)) {
    return null;
  }

  const skillsInput = isRecord(value.skills) ? value.skills : {};

  return {
    profile: normalizeProfile(value.profile),
    workExperiences: Array.isArray(value.workExperiences)
      ? value.workExperiences.map(normalizeWorkExperience)
      : initialResumeState.workExperiences,
    educations: Array.isArray(value.educations)
      ? value.educations.map(normalizeEducation)
      : initialResumeState.educations,
    projects: Array.isArray(value.projects)
      ? value.projects.map(normalizeProject)
      : initialResumeState.projects,
    skills: normalizeSkills(skillsInput),
    languages: Array.isArray(value.languages)
      ? value.languages.map(normalizeLanguage)
      : initialResumeState.languages,
    custom: {
      descriptions: isRecord(value.custom)
        ? asStringArray(value.custom.descriptions)
        : initialResumeState.custom.descriptions,
    },
  };
};

const normalizeSkills = (value: UnknownRecord): ResumeSkills => {
  const legacyDescriptions = asStringArray(value.descriptions);
  const technicalDescriptions = asStringArray(value.technicalDescriptions);
  const softSkillsDescriptions = asStringArray(value.softSkillsDescriptions);
  // Older state only stored one descriptions array. When split fields are
  // missing, treat that legacy list as the technical bucket by default.
  const hasSplitDescriptions =
    technicalDescriptions.length > 0 || softSkillsDescriptions.length > 0;
  const normalizedTechnicalDescriptions = hasSplitDescriptions
    ? technicalDescriptions
    : legacyDescriptions;
  const normalizedSoftSkillsDescriptions = hasSplitDescriptions
    ? softSkillsDescriptions
    : [];

  return {
    featuredSkills: Array.isArray(value.featuredSkills)
      ? value.featuredSkills.map(normalizeFeaturedSkill)
      : initialResumeState.skills.featuredSkills,
    technicalTitle: asString(
      value.technicalTitle,
      initialResumeState.skills.technicalTitle
    ),
    technicalDescriptions: normalizedTechnicalDescriptions,
    softSkillsTitle: asString(
      value.softSkillsTitle,
      initialResumeState.skills.softSkillsTitle
    ),
    softSkillsDescriptions: normalizedSoftSkillsDescriptions,
    descriptions: [
      ...normalizedTechnicalDescriptions,
      ...normalizedSoftSkillsDescriptions,
    ],
  };
};

const normalizeShowFormMap = <T extends Record<ShowForm, boolean | string>>(
  value: unknown,
  defaults: T
) => {
  const input = isRecord(value) ? value : {};
  const result = { ...defaults };

  for (const field of SHOW_FORMS) {
    if (typeof defaults[field] === "boolean") {
      result[field] = asBoolean(input[field], defaults[field]) as T[ShowForm];
    } else {
      result[field] = asString(input[field], defaults[field] as string) as T[ShowForm];
    }
  }

  return result;
};

const BULLET_FORMS = Object.keys(
  initialSettings.showBulletPoints
) as FormWithBulletPoints[];

const normalizeBulletPointMap = (
  value: unknown,
  defaults: Settings["showBulletPoints"]
) => {
  const input = isRecord(value) ? value : {};
  const result = { ...defaults };

  for (const field of BULLET_FORMS) {
    if (field === "softSkills") {
      result[field] = asBoolean(
        input[field],
        asBoolean(input.skills, defaults[field])
      );
      continue;
    }
    result[field] = asBoolean(input[field], defaults[field]);
  }

  return result;
};

const normalizeFormsOrder = (value: unknown) => {
  if (!Array.isArray(value)) {
    return initialSettings.formsOrder;
  }

  const normalized = value.filter(
    (item): item is ShowForm =>
      typeof item === "string" && SHOW_FORMS.includes(item as ShowForm)
  );

  const unique = normalized.filter(
    (form, index) => normalized.indexOf(form) === index
  );

  for (const form of initialSettings.formsOrder) {
    if (!unique.includes(form)) {
      unique.push(form);
    }
  }

  return unique;
};

export const normalizeSettings = (value: unknown): Settings | null => {
  if (!isRecord(value)) {
    return null;
  }

  const resumeLocale = RESUME_LOCALES.has(value.resumeLocale as ResumeLocale)
    ? (value.resumeLocale as ResumeLocale)
    : initialSettings.resumeLocale;

  const documentSize = DOCUMENT_SIZES.has(asString(value.documentSize))
    ? asString(value.documentSize)
    : initialSettings.documentSize;

  return {
    resumeLocale,
    themeColor: asString(value.themeColor, initialSettings.themeColor),
    fontFamily: asString(value.fontFamily, initialSettings.fontFamily),
    fontSize: asString(value.fontSize, initialSettings.fontSize),
    lineHeight: asString(value.lineHeight, initialSettings.lineHeight),
    sectionSpacing: asString(
      value.sectionSpacing,
      initialSettings.sectionSpacing
    ),
    linksSummarySpacing: asString(
      value.linksSummarySpacing,
      initialSettings.linksSummarySpacing
    ),
    languagesSpacing: asString(
      value.languagesSpacing,
      initialSettings.languagesSpacing
    ),
    companyRoleSpacing: asString(
      value.companyRoleSpacing,
      initialSettings.companyRoleSpacing
    ),
    companyItemSpacing: asString(
      value.companyItemSpacing,
      initialSettings.companyItemSpacing
    ),
    companyDescriptionSpacing: asString(
      value.companyDescriptionSpacing,
      initialSettings.companyDescriptionSpacing
    ),
    schoolDegreeSpacing: asString(
      value.schoolDegreeSpacing,
      initialSettings.schoolDegreeSpacing
    ),
    educationDescriptionSpacing: asString(
      value.educationDescriptionSpacing,
      initialSettings.educationDescriptionSpacing
    ),
    projectItemSpacing: asString(
      value.projectItemSpacing,
      initialSettings.projectItemSpacing
    ),
    topBarHeight: asString(value.topBarHeight, initialSettings.topBarHeight),
    nameFontSize: asString(value.nameFontSize, initialSettings.nameFontSize),
    sectionHeadingSize: asString(
      value.sectionHeadingSize,
      initialSettings.sectionHeadingSize
    ),
    documentSize,
    formToShow: normalizeShowFormMap(value.formToShow, initialSettings.formToShow),
    formToHeading: normalizeShowFormMap(
      value.formToHeading,
      initialSettings.formToHeading
    ) as Settings["formToHeading"],
    formsOrder: normalizeFormsOrder(value.formsOrder),
    showBulletPoints: normalizeBulletPointMap(
      value.showBulletPoints,
      initialSettings.showBulletPoints
    ),
  };
};

export const normalizeRootState = (value: unknown): RootState | null => {
  if (!isRecord(value)) {
    return null;
  }

  const resume = normalizeResume(value.resume);
  const settings = normalizeSettings(value.settings);

  if (!resume || !settings) {
    return null;
  }

  return {
    resume,
    settings,
  };
};
