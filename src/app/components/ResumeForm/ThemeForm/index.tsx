import { BaseForm } from "components/ResumeForm/Form";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { THEME_COLORS } from "components/ResumeForm/ThemeForm/constants";
import { InlineInput } from "components/ResumeForm/ThemeForm/InlineInput";
import { FontFamilySelectionsCSR } from "components/ResumeForm/ThemeForm/Selection";
import { ResumeLocaleToggle } from "components/ResumeForm/ResumeLocaleToggle";
import {
  changeSettings,
  DEFAULT_THEME_COLOR,
  initialSettings,
  selectSettings,
  setSettings,
  type GeneralSetting,
} from "lib/redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { selectResume } from "lib/redux/resumeSlice";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { Button, Card } from "components/ui";
import { useEffect, useState } from "react";

export const ThemeForm = () => {
  const sectionTitleClassName = "text-base font-semibold text-gray-900";
  const settings = useAppSelector(selectSettings);
  const resume = useAppSelector(selectResume);
  const {
    fontSize,
    fontFamily,
    lineHeight,
    sectionSpacing,
    linksSummarySpacing,
    languagesSpacing,
    companyRoleSpacing,
    companyItemSpacing,
    schoolDegreeSpacing,
    projectItemSpacing,
    topBarHeight,
  } = settings;
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const dispatch = useAppDispatch();
  const [draftSettings, setDraftSettings] = useState({
    themeColor: settings.themeColor ?? "",
    sectionSpacing: sectionSpacing ?? "",
    linksSummarySpacing: linksSummarySpacing ?? "",
    languagesSpacing: languagesSpacing ?? "",
    companyRoleSpacing: companyRoleSpacing ?? "",
    companyItemSpacing: companyItemSpacing ?? "",
    schoolDegreeSpacing: schoolDegreeSpacing ?? "",
    projectItemSpacing: projectItemSpacing ?? "",
    topBarHeight: topBarHeight ?? "",
    lineHeight: lineHeight ?? "",
    fontSize: fontSize ?? "",
    nameFontSize: settings.nameFontSize ?? "",
    sectionHeadingSize: settings.sectionHeadingSize ?? "",
  });

  useEffect(() => {
    setDraftSettings({
      themeColor: settings.themeColor ?? "",
      sectionSpacing: settings.sectionSpacing ?? "",
      linksSummarySpacing: settings.linksSummarySpacing ?? "",
      languagesSpacing: settings.languagesSpacing ?? "",
      companyRoleSpacing: settings.companyRoleSpacing ?? "",
      companyItemSpacing: settings.companyItemSpacing ?? "",
      schoolDegreeSpacing: settings.schoolDegreeSpacing ?? "",
      projectItemSpacing: settings.projectItemSpacing ?? "",
      topBarHeight: settings.topBarHeight ?? "",
      lineHeight: settings.lineHeight ?? "",
      fontSize: settings.fontSize ?? "",
      nameFontSize: settings.nameFontSize ?? "",
      sectionHeadingSize: settings.sectionHeadingSize ?? "",
    });
  }, [settings]);

  const refreshPreview = () => {
    window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
  };

  const handleSettingsChange = (
    field: GeneralSetting,
    value: string,
    refresh = false
  ) => {
    dispatch(changeSettings({ field, value }));
    if (refresh) refreshPreview();
  };

  const handleDraftChange = (field: keyof typeof draftSettings, value: string) => {
    setDraftSettings((prev) => ({ ...prev, [field]: value }));
  };

  const commitDraftSetting = (
    field: keyof typeof draftSettings,
    nextValue: string
  ) => {
    setDraftSettings((prev) => ({ ...prev, [field]: nextValue }));
    const currentValue = settings[field as keyof typeof settings];
    if (nextValue === currentValue) return;
    handleSettingsChange(field as GeneralSetting, nextValue, true);
  };

  const handleSettingsInputKeyDown =
    (field: keyof typeof draftSettings): React.KeyboardEventHandler<HTMLInputElement> =>
    (event) => {
      if (event.key === "Enter") {
        commitDraftSetting(field, event.currentTarget.value);
        event.currentTarget.blur();
      }
    };

  const handleSettingsInputBlur =
    (field: keyof typeof draftSettings): React.FocusEventHandler<HTMLInputElement> =>
    (event) => {
      commitDraftSetting(field, event.currentTarget.value);
    };

  const handleSettingsNumberMouseUp =
    (field: keyof typeof draftSettings): React.MouseEventHandler<HTMLInputElement> =>
    (event) => {
      commitDraftSetting(field, event.currentTarget.value);
    };

  const handleSettingsNumberKeyUp =
    (field: keyof typeof draftSettings): React.KeyboardEventHandler<HTMLInputElement> =>
    (event) => {
      if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
      commitDraftSetting(field, event.currentTarget.value);
    };

  const handleResetSettings = () => {
    const confirmed = window.confirm(
      "Reset all settings to their default values?"
    );
    if (!confirmed) return;
    dispatch(setSettings(initialSettings));
    saveStateToLocalStorage({
      resume,
      settings: initialSettings,
    } as any);
    window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
  };

  return (
    <BaseForm id="section-settings" className="scroll-mt-40">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cog6ToothIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
            <h1 className="text-xl font-semibold tracking-wide text-gray-900 ">
              Settings
            </h1>
          </div>
          <Button variant="secondary" size="sm" onClick={handleResetSettings}>
            Reset to defaults
          </Button>
        </div>
        <div>
          <InlineInput
            label="Theme Color"
            name="themeColor"
            value={draftSettings.themeColor}
            placeholder={DEFAULT_THEME_COLOR}
            onChange={(field, value) =>
              handleDraftChange(field as keyof typeof draftSettings, value)
            }
            onBlur={(event) =>
              commitDraftSetting("themeColor", event.currentTarget.value)
            }
            onKeyDown={handleSettingsInputKeyDown("themeColor")}
            inputStyle={{ color: themeColor }}
            labelClassName={sectionTitleClassName}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {THEME_COLORS.map((color, idx) => (
              <div
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-sm text-white"
                style={{ backgroundColor: color }}
                key={idx}
                onClick={() => handleSettingsChange("themeColor", color, true)}
                onKeyDown={(e) => {
                  if (["Enter", " "].includes(e.key))
                    handleSettingsChange("themeColor", color, true);
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
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">Section Spacing</span>
                <input
                  type="number"
                  min="0.1"
                  max="3"
                  step="0.05"
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                  value={draftSettings.sectionSpacing}
                  onChange={(event) =>
                    handleDraftChange("sectionSpacing", event.target.value)
                  }
                  onBlur={handleSettingsInputBlur("sectionSpacing")}
                  onKeyDown={handleSettingsInputKeyDown("sectionSpacing")}
                  onKeyUp={handleSettingsNumberKeyUp("sectionSpacing")}
                  onMouseUp={handleSettingsNumberMouseUp("sectionSpacing")}
                />
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">Language Gap (pt)</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="1"
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                  value={draftSettings.languagesSpacing}
                  onChange={(event) =>
                    handleDraftChange("languagesSpacing", event.target.value)
                  }
                  onBlur={handleSettingsInputBlur("languagesSpacing")}
                  onKeyDown={handleSettingsInputKeyDown("languagesSpacing")}
                  onKeyUp={handleSettingsNumberKeyUp("languagesSpacing")}
                  onMouseUp={handleSettingsNumberMouseUp("languagesSpacing")}
                />
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">Role Gap (pt)</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                  value={draftSettings.companyRoleSpacing}
                  onChange={(event) =>
                    handleDraftChange("companyRoleSpacing", event.target.value)
                  }
                  onBlur={handleSettingsInputBlur("companyRoleSpacing")}
                  onKeyDown={handleSettingsInputKeyDown("companyRoleSpacing")}
                  onKeyUp={handleSettingsNumberKeyUp("companyRoleSpacing")}
                  onMouseUp={handleSettingsNumberMouseUp("companyRoleSpacing")}
                />
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">Companies Gap (pt)</span>
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                  value={draftSettings.companyItemSpacing}
                  onChange={(event) =>
                    handleDraftChange("companyItemSpacing", event.target.value)
                  }
                  onBlur={handleSettingsInputBlur("companyItemSpacing")}
                  onKeyDown={handleSettingsInputKeyDown("companyItemSpacing")}
                  onKeyUp={handleSettingsNumberKeyUp("companyItemSpacing")}
                  onMouseUp={handleSettingsNumberMouseUp("companyItemSpacing")}
                />
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">School Gap (pt)</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                  value={draftSettings.schoolDegreeSpacing}
                  onChange={(event) =>
                    handleDraftChange("schoolDegreeSpacing", event.target.value)
                  }
                  onBlur={handleSettingsInputBlur("schoolDegreeSpacing")}
                  onKeyDown={handleSettingsInputKeyDown("schoolDegreeSpacing")}
                  onKeyUp={handleSettingsNumberKeyUp("schoolDegreeSpacing")}
                  onMouseUp={handleSettingsNumberMouseUp("schoolDegreeSpacing")}
                />
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">Projects Gap (pt)</span>
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                  value={draftSettings.projectItemSpacing}
                  onChange={(event) =>
                    handleDraftChange("projectItemSpacing", event.target.value)
                  }
                  onBlur={handleSettingsInputBlur("projectItemSpacing")}
                  onKeyDown={handleSettingsInputKeyDown("projectItemSpacing")}
                  onKeyUp={handleSettingsNumberKeyUp("projectItemSpacing")}
                  onMouseUp={handleSettingsNumberMouseUp("projectItemSpacing")}
                />
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">Top Bar Height (pt)</span>
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                  value={draftSettings.topBarHeight}
                  onChange={(event) =>
                    handleDraftChange("topBarHeight", event.target.value)
                  }
                  onBlur={handleSettingsInputBlur("topBarHeight")}
                  onKeyDown={handleSettingsInputKeyDown("topBarHeight")}
                  onKeyUp={handleSettingsNumberKeyUp("topBarHeight")}
                  onMouseUp={handleSettingsNumberMouseUp("topBarHeight")}
                />
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">Summary Gap (pt)</span>
                <input
                  type="number"
                  min="0"
                  max="40"
                  step="1"
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                  value={draftSettings.linksSummarySpacing}
                  onChange={(event) =>
                    handleDraftChange("linksSummarySpacing", event.target.value)
                  }
                  onBlur={handleSettingsInputBlur("linksSummarySpacing")}
                  onKeyDown={handleSettingsInputKeyDown("linksSummarySpacing")}
                  onKeyUp={handleSettingsNumberKeyUp("linksSummarySpacing")}
                  onMouseUp={handleSettingsNumberMouseUp("linksSummarySpacing")}
                />
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
                  value={draftSettings.lineHeight}
                  onChange={(event) =>
                    handleDraftChange("lineHeight", event.target.value)
                  }
                  onBlur={handleSettingsInputBlur("lineHeight")}
                  onKeyDown={handleSettingsInputKeyDown("lineHeight")}
                  onKeyUp={handleSettingsNumberKeyUp("lineHeight")}
                  onMouseUp={handleSettingsNumberMouseUp("lineHeight")}
                />
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">Body Size (pt)</span>
                <input
                  type="number"
                  min="6"
                  max="20"
                  step="0.5"
                  name="fontSize"
                  value={draftSettings.fontSize}
                  placeholder="11"
                  onChange={(event) =>
                    handleDraftChange("fontSize", event.target.value)
                  }
                  onBlur={handleSettingsInputBlur("fontSize")}
                  onKeyDown={handleSettingsInputKeyDown("fontSize")}
                  onKeyUp={handleSettingsNumberKeyUp("fontSize")}
                  onMouseUp={handleSettingsNumberMouseUp("fontSize")}
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                />
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">Name Size (pt)</span>
                <input
                  type="number"
                  min="16"
                  max="48"
                  step="0.5"
                  value={draftSettings.nameFontSize}
                  onChange={(event) =>
                    handleDraftChange("nameFontSize", event.target.value)
                  }
                  onBlur={handleSettingsInputBlur("nameFontSize")}
                  onKeyDown={handleSettingsInputKeyDown("nameFontSize")}
                  onKeyUp={handleSettingsNumberKeyUp("nameFontSize")}
                  onMouseUp={handleSettingsNumberMouseUp("nameFontSize")}
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                />
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                <span className="flex w-36 items-center gap-2">Heading Size (pt)</span>
                <input
                  type="number"
                  min="8"
                  max="20"
                  step="0.5"
                  value={draftSettings.sectionHeadingSize}
                  onChange={(event) =>
                    handleDraftChange("sectionHeadingSize", event.target.value)
                  }
                  onBlur={handleSettingsInputBlur("sectionHeadingSize")}
                  onKeyDown={handleSettingsInputKeyDown("sectionHeadingSize")}
                  onKeyUp={handleSettingsNumberKeyUp("sectionHeadingSize")}
                  onMouseUp={handleSettingsNumberMouseUp("sectionHeadingSize")}
                  className="w-[5rem] border-b border-gray-300 text-center font-semibold leading-3 outline-none"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </BaseForm>
  );
};
