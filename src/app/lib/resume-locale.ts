import type { ResumeLocale } from "lib/redux/settingsSlice";

export type ResumeLocaleLabels = {
  profileSummaryLabel: string;
  profileSummaryPlaceholder: string;
  profilePhonePlaceholder: string;
  profileWebsiteLabel: string;
  profileGithubLabel: string;
  profileGithubPlaceholder: string;
  profileLocationPlaceholder: string;
  educationSchoolLabel: string;
  educationDegreeLabel: string;
  educationAdditionalPlaceholder: string;
};

export const RESUME_LOCALE_LABELS: Record<ResumeLocale, ResumeLocaleLabels> = {
  us: {
    profileSummaryLabel: "Objective",
    profileSummaryPlaceholder:
      "Entrepreneur and educator obsessed with making education free for anyone",
    profilePhonePlaceholder: "(123)456-7890",
    profileWebsiteLabel: "Website",
    profileGithubLabel: "GitHub",
    profileGithubPlaceholder: "github.com/username",
    profileLocationPlaceholder: "NYC, NY",
    educationSchoolLabel: "School",
    educationDegreeLabel: "Degree & Major",
    educationAdditionalPlaceholder:
      "Free paragraph space to list out additional activities, courses, awards etc",
  },
  eu: {
    profileSummaryLabel: "Profile",
    profileSummaryPlaceholder:
      "Senior software engineer focused on scalable systems and measurable impact",
    profilePhonePlaceholder: "+44 20 1234 5678",
    profileWebsiteLabel: "Website / LinkedIn",
    profileGithubLabel: "GitHub",
    profileGithubPlaceholder: "github.com/username",
    profileLocationPlaceholder: "Lisbon, PT",
    educationSchoolLabel: "Institution",
    educationDegreeLabel: "Degree / Qualification",
    educationAdditionalPlaceholder:
      "Optional: key modules, awards, Erasmus or thesis highlights",
  },
};
