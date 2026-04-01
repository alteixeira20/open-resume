import { initialSettings, type Settings } from "lib/redux/settingsSlice";

export { THEME_COLORS } from "lib/theme-tokens";

export type ThemeDraftSettings = Pick<
  Settings,
  | "themeColor"
  | "sectionSpacing"
  | "linksSummarySpacing"
  | "languagesSpacing"
  | "companyRoleSpacing"
  | "companyItemSpacing"
  | "companyDescriptionSpacing"
  | "schoolDegreeSpacing"
  | "educationDescriptionSpacing"
  | "projectItemSpacing"
  | "topBarHeight"
  | "lineHeight"
  | "fontSize"
  | "nameFontSize"
  | "sectionHeadingSize"
>;

export type ThemeDraftField = keyof ThemeDraftSettings;
export type NumericThemeDraftField = Exclude<ThemeDraftField, "themeColor">;

type SettingsGroupId = "document" | "appearance" | "profile" | "entries" | "type";

type NumericSettingMeta = {
  label: string;
  helper: string;
  min: number;
  max: number;
  step: number;
  defaultValue: string;
  group: Exclude<SettingsGroupId, "appearance">;
};

export const SETTINGS_GROUPS: Array<{
  id: SettingsGroupId;
  title: string;
  description: string;
}> = [
  {
    id: "document",
    title: "Document setup",
    description: "Choose the page format and the PDF-level rhythm controls.",
  },
  {
    id: "appearance",
    title: "Visual style",
    description: "Pick the accent color and font family without touching content.",
  },
  {
    id: "profile",
    title: "Profile header spacing",
    description: "Tune the compact header block at the top of the PDF.",
  },
  {
    id: "entries",
    title: "Entry spacing",
    description: "Control how tightly work, education, and project entries stack.",
  },
  {
    id: "type",
    title: "Type scale",
    description: "Adjust the typography scale while keeping the template stable.",
  },
];

export const NUMERIC_SETTING_META: Record<
  NumericThemeDraftField,
  NumericSettingMeta
> = {
  sectionSpacing: {
    label: "Section spacing",
    helper: "Gap between section headings and the section body.",
    min: 0,
    max: 3,
    step: 0.05,
    defaultValue: initialSettings.sectionSpacing,
    group: "document",
  },
  topBarHeight: {
    label: "Top bar height (pt)",
    helper: "Set to 0 to remove the colored top bar entirely.",
    min: 0,
    max: 30,
    step: 0.5,
    defaultValue: initialSettings.topBarHeight,
    group: "document",
  },
  lineHeight: {
    label: "Line height",
    helper: "Controls paragraph leading throughout the PDF.",
    min: 0.7,
    max: 2.5,
    step: 0.05,
    defaultValue: initialSettings.lineHeight,
    group: "document",
  },
  linksSummarySpacing: {
    label: "Summary gap (pt)",
    helper: "Space between the contact links block and the summary line.",
    min: 0,
    max: 40,
    step: 1,
    defaultValue: initialSettings.linksSummarySpacing,
    group: "profile",
  },
  languagesSpacing: {
    label: "Language gap (pt)",
    helper: "Space between language rows in the languages section.",
    min: 0,
    max: 20,
    step: 0.5,
    defaultValue: initialSettings.languagesSpacing,
    group: "profile",
  },
  companyRoleSpacing: {
    label: "Role gap (pt)",
    helper: "Space between the company line and the role/date line.",
    min: 0,
    max: 20,
    step: 0.5,
    defaultValue: initialSettings.companyRoleSpacing,
    group: "entries",
  },
  companyItemSpacing: {
    label: "Companies gap (pt)",
    helper: "Space between separate work-experience entries.",
    min: 0,
    max: 30,
    step: 0.5,
    defaultValue: initialSettings.companyItemSpacing,
    group: "entries",
  },
  companyDescriptionSpacing: {
    label: "Work text gap (pt)",
    helper: "Space between the role/date line and the work description text.",
    min: 0,
    max: 20,
    step: 0.5,
    defaultValue: initialSettings.companyDescriptionSpacing,
    group: "entries",
  },
  schoolDegreeSpacing: {
    label: "School gap (pt)",
    helper: "Space between the school line and the degree/date line.",
    min: 0,
    max: 20,
    step: 0.5,
    defaultValue: initialSettings.schoolDegreeSpacing,
    group: "entries",
  },
  educationDescriptionSpacing: {
    label: "Education text gap (pt)",
    helper: "Space between the degree/date line and the education description text.",
    min: 0,
    max: 20,
    step: 0.5,
    defaultValue: initialSettings.educationDescriptionSpacing,
    group: "entries",
  },
  projectItemSpacing: {
    label: "Projects gap (pt)",
    helper: "Space between separate project entries.",
    min: 0,
    max: 30,
    step: 0.5,
    defaultValue: initialSettings.projectItemSpacing,
    group: "entries",
  },
  fontSize: {
    label: "Body size (pt)",
    helper: "Default text size for most resume copy.",
    min: 6,
    max: 20,
    step: 0.5,
    defaultValue: initialSettings.fontSize,
    group: "type",
  },
  nameFontSize: {
    label: "Name size (pt)",
    helper: "Large display size for the candidate name.",
    min: 12,
    max: 48,
    step: 0.5,
    defaultValue: initialSettings.nameFontSize,
    group: "type",
  },
  sectionHeadingSize: {
    label: "Heading size (pt)",
    helper: "Uppercase section heading size.",
    min: 8,
    max: 20,
    step: 0.5,
    defaultValue: initialSettings.sectionHeadingSize,
    group: "type",
  },
};

export const getDefaultThemeDraftSettings = (
  settings: ThemeDraftSettings = initialSettings
): ThemeDraftSettings => ({
  themeColor: settings.themeColor ?? "",
  sectionSpacing: settings.sectionSpacing ?? "",
  linksSummarySpacing: settings.linksSummarySpacing ?? "",
  languagesSpacing: settings.languagesSpacing ?? "",
  companyRoleSpacing: settings.companyRoleSpacing ?? "",
  companyItemSpacing: settings.companyItemSpacing ?? "",
  companyDescriptionSpacing: settings.companyDescriptionSpacing ?? "",
  schoolDegreeSpacing: settings.schoolDegreeSpacing ?? "",
  educationDescriptionSpacing: settings.educationDescriptionSpacing ?? "",
  projectItemSpacing: settings.projectItemSpacing ?? "",
  topBarHeight: settings.topBarHeight ?? "",
  lineHeight: settings.lineHeight ?? "",
  fontSize: settings.fontSize ?? "",
  nameFontSize: settings.nameFontSize ?? "",
  sectionHeadingSize: settings.sectionHeadingSize ?? "",
});

export const THEME_SETTING_GROUP_FIELDS: Record<
  SettingsGroupId,
  ThemeDraftField[]
> = {
  document: ["sectionSpacing", "topBarHeight", "lineHeight"],
  appearance: ["themeColor"],
  profile: ["linksSummarySpacing", "languagesSpacing"],
  entries: [
    "companyRoleSpacing",
    "companyItemSpacing",
    "companyDescriptionSpacing",
    "schoolDegreeSpacing",
    "educationDescriptionSpacing",
    "projectItemSpacing",
  ],
  type: ["fontSize", "nameFontSize", "sectionHeadingSize"],
};

export const clampNumericSettingDraft = (
  field: NumericThemeDraftField,
  rawValue: string
) => {
  const trimmed = rawValue.trim();
  const { min, max, defaultValue } = NUMERIC_SETTING_META[field];
  if (trimmed === "") return defaultValue;

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return defaultValue;

  const clamped = Math.min(max, Math.max(min, parsed));
  return String(clamped);
};

export const normalizeThemeColorDraft = (
  rawValue: string,
  fallback: string = initialSettings.themeColor
) => {
  const trimmed = rawValue.trim();
  if (trimmed === "") return fallback;
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)
    ? trimmed
    : fallback;
};
