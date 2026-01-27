import { BaseForm } from "components/ResumeForm/Form";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { THEME_COLORS } from "components/ResumeForm/ThemeForm/constants";
import { InlineInput } from "components/ResumeForm/ThemeForm/InlineInput";
import { FontFamilySelectionsCSR } from "components/ResumeForm/ThemeForm/Selection";
import { ResumeLocaleToggle } from "components/ResumeForm/ResumeLocaleToggle";
import {
  changeSettings,
  DEFAULT_THEME_COLOR,
  selectSettings,
  type GeneralSetting,
} from "lib/redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export const ThemeForm = () => {
  const settings = useAppSelector(selectSettings);
  const { fontSize, fontFamily, lineHeight, sectionSpacing } = settings;
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const dispatch = useAppDispatch();

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    dispatch(changeSettings({ field, value }));
  };

  return (
    <BaseForm id="section-settings">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Cog6ToothIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <h1 className="text-lg font-semibold tracking-wide text-gray-900 ">
            Resume Settings
          </h1>
        </div>
        <ResumeLocaleToggle />
        <div>
          <label className="flex items-center gap-2 text-base font-medium text-gray-700">
            <span className="flex w-36 items-center gap-2">
              Section Spacing
              <span className="group relative flex items-center">
                <button
                  type="button"
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-500 transition-colors group-hover:border-gray-400 group-hover:text-gray-700"
                >
                  i
                </button>
                <span className="pointer-events-none absolute left-full top-1/2 ml-2 w-56 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-600 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                  <span className="font-semibold text-gray-800">Recommended:</span>
                  <span className="mt-1 block">• 0.9–1.0 tight</span>
                  <span className="block">• 1.1–1.2 normal</span>
                  <span className="block">• 1.3–1.4 relaxed</span>
                </span>
              </span>
            </span>
            <input
              type="number"
              min="0.1"
              max="1.6"
              step="0.1"
              className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
              value={sectionSpacing ?? ""}
              onChange={(event) =>
                handleSettingsChange("sectionSpacing", event.target.value)
              }
            />
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2 text-base font-medium text-gray-700">
            <span className="flex w-36 items-center gap-2">
              Line Height
              <span className="group relative flex items-center">
                <button
                  type="button"
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-500 transition-colors group-hover:border-gray-400 group-hover:text-gray-700"
                >
                  i
                </button>
                <span className="pointer-events-none absolute left-full top-1/2 ml-2 w-48 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-600 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                  <span className="font-semibold text-gray-800">Recommended:</span>
                  <span className="mt-1 block">• 1.15 tight</span>
                  <span className="block">• 1.25 normal</span>
                  <span className="block">• 1.35 relaxed</span>
                </span>
              </span>
            </span>
            <input
              type="number"
              min="1.0"
              max="1.6"
              step="0.05"
              className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
              value={lineHeight}
              onChange={(event) =>
                handleSettingsChange("lineHeight", event.target.value)
              }
            />
          </label>
        </div>
        <div>
          <InlineInput
            label="Theme Color"
            name="themeColor"
            value={settings.themeColor}
            placeholder={DEFAULT_THEME_COLOR}
            onChange={handleSettingsChange}
            inputStyle={{ color: themeColor }}
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
          <InputGroupWrapper label="Font Family" />
          <FontFamilySelectionsCSR
            selectedFontFamily={fontFamily}
            themeColor={themeColor}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-base font-medium text-gray-700">
            <span className="flex w-36 items-center gap-2">
              Font Size (pt)
              <span className="group relative flex items-center">
                <button
                  type="button"
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-500 transition-colors group-hover:border-gray-400 group-hover:text-gray-700"
                >
                  i
                </button>
                <span className="pointer-events-none absolute left-full top-1/2 ml-2 w-52 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-600 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                  <span className="font-semibold text-gray-800">Recommended:</span>
                  <span className="mt-1 block">• 10–11 compact</span>
                  <span className="block">• 11–12 normal</span>
                  <span className="block">• 12–13 relaxed</span>
                </span>
              </span>
            </span>
            <input
              type="number"
              min="8"
              max="16"
              step="0.5"
              name="fontSize"
              value={fontSize}
              placeholder="11"
              onChange={(event) =>
                handleSettingsChange("fontSize", event.target.value)
              }
              className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-base font-medium text-gray-700">
            <span className="flex w-36 items-center gap-2">
              Name Size (pt)
              <span className="group relative flex items-center">
                <button
                  type="button"
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-500 transition-colors group-hover:border-gray-400 group-hover:text-gray-700"
                >
                  i
                </button>
                <span className="pointer-events-none absolute left-full top-1/2 ml-2 w-48 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-600 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                  <span className="font-semibold text-gray-800">Recommended:</span>
                  <span className="mt-1 block">• 22–24 compact</span>
                  <span className="block">• 24–28 normal</span>
                  <span className="block">• 28–32 relaxed</span>
                </span>
              </span>
            </span>
            <input
              type="number"
              min="22"
              max="32"
              step="0.5"
              value={settings.nameFontSize}
              onChange={(event) =>
                handleSettingsChange("nameFontSize", event.target.value)
              }
              className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-base font-medium text-gray-700">
            <span className="flex w-36 items-center gap-2">
              Section Header (pt)
              <span className="group relative flex items-center">
                <button
                  type="button"
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-500 transition-colors group-hover:border-gray-400 group-hover:text-gray-700"
                >
                  i
                </button>
                <span className="pointer-events-none absolute left-full top-1/2 ml-2 w-52 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-600 opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                  <span className="font-semibold text-gray-800">Recommended:</span>
                  <span className="mt-1 block">• 10–11 compact</span>
                  <span className="block">• 11–12 normal</span>
                  <span className="block">• 12–14 relaxed</span>
                </span>
              </span>
            </span>
            <input
              type="number"
              min="10"
              max="14"
              step="0.5"
              value={settings.sectionHeadingSize}
              onChange={(event) =>
                handleSettingsChange("sectionHeadingSize", event.target.value)
              }
              className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
            />
          </label>
        </div>
      </div>
    </BaseForm>
  );
};
