import { buildImportedPdfState, parseImportedJsonState } from "lib/redux/import-state";
import { initialResumeState } from "lib/redux/resumeSlice";
import { initialSettings } from "lib/redux/settingsSlice";

describe("import state helpers", () => {
  it("normalizes backward-compatible json imports", () => {
    const importedState = parseImportedJsonState(
      JSON.stringify({
        resume: {
          profile: { name: "Imported User" },
        },
        settings: {
          resumeLocale: "us",
          fontSize: 12,
        },
      })
    );

    expect(importedState).toBeDefined();
    expect(importedState?.resume.profile.name).toBe("Imported User");
    expect(importedState?.resume.profile.github).toBe("");
    expect(importedState?.settings.resumeLocale).toBe("us");
    expect(importedState?.settings.fontSize).toBe("12");
  });

  it("derives section visibility from parsed pdf content when requested", () => {
    const importedState = buildImportedPdfState({
      resume: {
        ...initialResumeState,
        workExperiences: [],
        educations: [],
        projects: [],
        languages: [],
        custom: { descriptions: [] },
        skills: {
          featuredSkills: [],
          descriptions: [],
        },
      },
      baseSettings: initialSettings,
      deriveFormVisibility: true,
    });

    expect(importedState.settings.formToShow.workExperiences).toBe(false);
    expect(importedState.settings.formToShow.educations).toBe(false);
    expect(importedState.settings.formToShow.projects).toBe(false);
    expect(importedState.settings.formToShow.languages).toBe(false);
    expect(importedState.settings.formToShow.custom).toBe(false);
  });
});
