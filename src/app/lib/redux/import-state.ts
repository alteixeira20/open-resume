import { initialSettings, type Settings, type ShowForm } from "lib/redux/settingsSlice";
import type { RootState } from "lib/redux/store";
import type { Resume } from "lib/redux/types";
import { normalizeRootState, normalizeSettings } from "lib/redux/persisted-state";

const deriveFormToShowFromResume = (resume: Resume): Settings["formToShow"] => {
  const hasFeaturedSkills =
    resume.skills.featuredSkills?.some((skill) => skill.skill.trim()) ?? false;

  return {
    workExperiences: resume.workExperiences.length > 0,
    educations: resume.educations.length > 0,
    projects: resume.projects.length > 0,
    skills: resume.skills.descriptions.length > 0 || hasFeaturedSkills,
    languages: resume.languages.length > 0,
    custom: resume.custom.descriptions.length > 0,
  };
};

export const parseImportedJsonState = (jsonText: string): RootState | null => {
  try {
    const parsed = JSON.parse(jsonText);
    return normalizeRootState(parsed);
  } catch {
    return null;
  }
};

export const buildImportedPdfState = ({
  resume,
  baseSettings,
  deriveFormVisibility,
}: {
  resume: Resume;
  baseSettings: Settings;
  deriveFormVisibility: boolean;
}): RootState => {
  const normalizedSettings = normalizeSettings(baseSettings) ?? initialSettings;

  return {
    resume,
    settings: {
      ...normalizedSettings,
      formToShow: deriveFormVisibility
        ? deriveFormToShowFromResume(resume)
        : normalizedSettings.formToShow,
    },
  };
};
