import { BaseForm } from "components/ResumeForm/Form";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { THEME_COLORS } from "components/ResumeForm/ThemeForm/constants";
import { InlineInput } from "components/ResumeForm/ThemeForm/InlineInput";
import { FontFamilySelectionsCSR } from "components/ResumeForm/ThemeForm/Selection";
import { ResumeLocaleToggle } from "components/ResumeForm/ResumeLocaleToggle";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import { clearStateFromLocalStorage, getHasUsedAppBefore } from "lib/redux/local-storage";
import type { ShowForm } from "lib/redux/settingsSlice";
import {
  changeSettings,
  DEFAULT_THEME_COLOR,
  selectSettings,
  setSettings,
  type GeneralSetting,
} from "lib/redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { selectResume, setResume } from "lib/redux/resumeSlice";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { useRef } from "react";

export const ThemeForm = () => {
  const sectionTitleClassName = "text-base font-semibold text-gray-900";
  const settings = useAppSelector(selectSettings);
  const resume = useAppSelector(selectResume);
  const { fontSize, fontFamily, lineHeight, sectionSpacing } = settings;
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const dispatch = useAppDispatch();
  const importInputRef = useRef<HTMLInputElement>(null);
  const importPdfInputRef = useRef<HTMLInputElement>(null);
  const sectionSpacingValue = Number.isFinite(Number(sectionSpacing))
    ? sectionSpacing
    : "";

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    dispatch(changeSettings({ field, value }));
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportPdfClick = () => {
    importPdfInputRef.current?.click();
  };

  const handleImportJson = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (getHasUsedAppBefore()) {
      const confirmed = window.confirm(
        "This will overwrite your current resume and settings. Do you want to continue?"
      );
      if (!confirmed) {
        event.target.value = "";
        return;
      }
      clearStateFromLocalStorage();
    }
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as {
        resume?: typeof resume;
        settings?: typeof settings;
      };
      if (!parsed.resume || !parsed.settings) {
        alert("Invalid JSON format. Please use an OpenResume export file.");
        return;
      }
      dispatch(setResume(parsed.resume));
      dispatch(setSettings(parsed.settings));
      saveStateToLocalStorage({
        resume: parsed.resume,
        settings: parsed.settings,
      } as any);
    } catch {
      alert("Could not read JSON file. Please check the file and try again.");
    } finally {
      event.target.value = "";
    }
  };

  const handleImportPdf = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (getHasUsedAppBefore()) {
      const confirmed = window.confirm(
        "This will overwrite your current resume and settings. Do you want to continue?"
      );
      if (!confirmed) {
        event.target.value = "";
        return;
      }
      clearStateFromLocalStorage();
    }
    try {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        alert("Please select a PDF file.");
        return;
      }
      const pdfData = await file.arrayBuffer();
      const parsedResume = await parseResumeFromPdf(pdfData);

      const newSettings = { ...settings };
      if (getHasUsedAppBefore()) {
        const sections = Object.keys(newSettings.formToShow) as ShowForm[];
        const hasFeaturedSkills =
          parsedResume.skills.featuredSkills?.some((skill) => skill.skill.trim()) ??
          false;
        const sectionToFormToShow: Record<ShowForm, boolean> = {
          workExperiences: parsedResume.workExperiences.length > 0,
          educations: parsedResume.educations.length > 0,
          projects: parsedResume.projects.length > 0,
          skills:
            parsedResume.skills.descriptions.length > 0 || hasFeaturedSkills,
          languages: parsedResume.languages.length > 0,
          custom: parsedResume.custom.descriptions.length > 0,
        };
        for (const section of sections) {
          newSettings.formToShow[section] = sectionToFormToShow[section];
        }
      }

      dispatch(setResume(parsedResume));
      dispatch(setSettings(newSettings));
      saveStateToLocalStorage({
        resume: parsedResume,
        settings: newSettings,
      } as any);
    } catch (error) {
      console.error("PDF import failed", error);
      alert("Could not import PDF. Please try another file.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <BaseForm id="section-settings">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Cog6ToothIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <h1 className="text-xl font-semibold tracking-wide text-gray-900 ">
            Resume Settings
          </h1>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className={sectionTitleClassName}>Import Resume</h2>
              <p className="mt-1 text-xs text-gray-600">
                Import a JSON backup for an exact resume, or parse a PDF to start
                from an existing resume.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50"
                onClick={handleImportClick}
              >
                Import JSON
              </button>
              <button
                type="button"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50"
                onClick={handleImportPdfClick}
              >
                Import PDF
              </button>
            </div>
          </div>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportJson}
          />
          <input
            ref={importPdfInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleImportPdf}
          />
        </div>
        <div>
          <InlineInput
            label="Theme Color"
            name="themeColor"
            value={settings.themeColor}
            placeholder={DEFAULT_THEME_COLOR}
            onChange={handleSettingsChange}
            inputStyle={{ color: themeColor }}
            labelClassName={sectionTitleClassName}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {THEME_COLORS.map((color, idx) => (
              <div
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-sm text-white"
                style={{ backgroundColor: color }}
                key={idx}
                onClick={() => handleSettingsChange("themeColor", color)}
                onKeyDown={(e) => {
                  if (["Enter", " "].includes(e.key))
                    handleSettingsChange("themeColor", color);
                }}
                tabIndex={0}
              >
                {settings.themeColor === color ? "✓" : ""}
              </div>
            ))}
          </div>
        </div>
        <div>
          <InputGroupWrapper label="Font Family" className={sectionTitleClassName} />
          <FontFamilySelectionsCSR
            selectedFontFamily={fontFamily}
            themeColor={themeColor}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
        <div>
          <h2 className={sectionTitleClassName}>Typography</h2>
          <div className="mt-4 flex flex-col gap-4">
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">
                  Section Spacing
                </span>
                <input
                  type="number"
                  min="0.1"
                  max="3"
                  step="0.05"
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                  value={sectionSpacingValue}
                  onChange={(event) =>
                    handleSettingsChange("sectionSpacing", event.target.value)
                  }
                />
                <span className="group relative flex items-center">
                  <button
                    type="button"
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-500 transition-colors group-hover:border-gray-400 group-hover:text-gray-700"
                  >
                    i
                  </button>
                  <span className="pointer-events-none absolute left-full top-1/2 ml-2 w-56 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-600 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                    <span className="font-semibold text-gray-800">
                      Recommended:
                    </span>
                    <span className="mt-1 block">• 0.9–1.0 tight</span>
                    <span className="block">• 1.1–1.2 normal</span>
                    <span className="block">• 1.3–1.4 relaxed</span>
                  </span>
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">Line Height</span>
                <input
                  type="number"
                  min="0.6"
                  max="2.5"
                  step="0.05"
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                  value={lineHeight}
                  onChange={(event) =>
                    handleSettingsChange("lineHeight", event.target.value)
                  }
                />
                <span className="group relative flex items-center">
                  <button
                    type="button"
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-500 transition-colors group-hover:border-gray-400 group-hover:text-gray-700"
                  >
                    i
                  </button>
                  <span className="pointer-events-none absolute left-full top-1/2 ml-2 w-48 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-600 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                    <span className="font-semibold text-gray-800">
                      Recommended:
                    </span>
                    <span className="mt-1 block">• 1.15 tight</span>
                    <span className="block">• 1.25 normal</span>
                    <span className="block">• 1.35 relaxed</span>
                  </span>
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">
                  Font Size (pt)
                </span>
                <input
                  type="number"
                  min="6"
                  max="20"
                  step="0.5"
                  name="fontSize"
                  value={fontSize}
                  placeholder="11"
                  onChange={(event) =>
                    handleSettingsChange("fontSize", event.target.value)
                  }
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                />
                <span className="group relative flex items-center">
                  <button
                    type="button"
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-500 transition-colors group-hover:border-gray-400 group-hover:text-gray-700"
                  >
                    i
                  </button>
                  <span className="pointer-events-none absolute left-full top-1/2 ml-2 w-52 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-600 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                    <span className="font-semibold text-gray-800">
                      Recommended:
                    </span>
                    <span className="mt-1 block">• 10–11 compact</span>
                    <span className="block">• 11–12 normal</span>
                    <span className="block">• 12–13 relaxed</span>
                  </span>
                </span>
              </label>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">
                  Name Size (pt)
                </span>
                <input
                  type="number"
                  min="16"
                  max="48"
                  step="0.5"
                  value={settings.nameFontSize}
                  onChange={(event) =>
                    handleSettingsChange("nameFontSize", event.target.value)
                  }
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                />
                <span className="group relative flex items-center">
                  <button
                    type="button"
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-500 transition-colors group-hover:border-gray-400 group-hover:text-gray-700"
                  >
                    i
                  </button>
                  <span className="pointer-events-none absolute left-full top-1/2 ml-2 w-48 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-600 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                    <span className="font-semibold text-gray-800">
                      Recommended:
                    </span>
                    <span className="mt-1 block">• 22–24 compact</span>
                    <span className="block">• 24–28 normal</span>
                    <span className="block">• 28–32 relaxed</span>
                  </span>
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">
                  Section Header (pt)
                </span>
                <input
                  type="number"
                  min="8"
                  max="20"
                  step="0.5"
                  value={settings.sectionHeadingSize}
                  onChange={(event) =>
                    handleSettingsChange("sectionHeadingSize", event.target.value)
                  }
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                />
                <span className="group relative flex items-center">
                  <button
                    type="button"
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-500 transition-colors group-hover:border-gray-400 group-hover:text-gray-700"
                  >
                    i
                  </button>
                  <span className="pointer-events-none absolute left-full top-1/2 ml-2 w-52 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-600 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                    <span className="font-semibold text-gray-800">
                      Recommended:
                    </span>
                    <span className="mt-1 block">• 10–11 compact</span>
                    <span className="block">• 11–12 normal</span>
                    <span className="block">• 12–14 relaxed</span>
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </BaseForm>
  );
};
