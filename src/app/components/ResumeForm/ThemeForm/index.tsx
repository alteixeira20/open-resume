import { Cog6ToothIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { ExpanderWithHeightTransition } from "components/ExpanderWithHeightTransition";
import { BaseForm } from "components/ResumeForm/Form";
import { FontFamilySelectionsCSR } from "components/ResumeForm/ThemeForm/Selection";
import {
  clampNumericSettingDraft,
  getDefaultThemeDraftSettings,
  normalizeThemeColorDraft,
  NUMERIC_SETTING_META,
  THEME_COLORS,
  type NumericThemeDraftField,
  type ThemeDraftField,
  type ThemeDraftSettings,
} from "components/ResumeForm/ThemeForm/constants";
import { ResumeLocaleToggle } from "components/ResumeForm/ResumeLocaleToggle";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeSettings,
  DEFAULT_THEME_COLOR,
  initialSettings,
  selectSettings,
  setSettings,
  type GeneralSetting,
  type Settings,
} from "lib/redux/settingsSlice";
import {
  useEffect,
  useState,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
} from "react";

// ─── Sub-label used inside the Advanced section ───────────────────────────────
const GroupLabel = ({ title }: { title: string }) => (
  <p className="mb-1 mt-5 text-[10px] font-black uppercase tracking-widest text-[color:var(--color-text-muted)] first:mt-0">
    {title}
  </p>
);

// ─── Compact numeric row: label left, input right ────────────────────────────
const CompactNumericRow = ({
  field,
  value,
  onChange,
  onBlur,
  onKeyDown,
  onKeyUp,
  onMouseUp,
}: {
  field: NumericThemeDraftField;
  value: string;
  onChange: (field: NumericThemeDraftField, value: string) => void;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onKeyUp: KeyboardEventHandler<HTMLInputElement>;
  onMouseUp: MouseEventHandler<HTMLInputElement>;
}) => {
  const meta = NUMERIC_SETTING_META[field];
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 pl-3">
      <span className="leading-none text-sm text-[color:var(--color-text-primary)]">
        {meta.label}
      </span>
      <input
        type="number"
        min={meta.min}
        max={meta.max}
        step={meta.step}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseUp={onMouseUp}
        className="h-8 w-20 rounded-md border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)] px-2 text-center text-sm font-semibold text-[color:var(--color-text-primary)] outline-none transition focus:border-[color:var(--color-brand-primary)] focus:ring-2 focus:ring-[color:var(--color-brand-primary)]/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
};

// ─── Section label shared by Basic and Advanced sections ─────────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[color:var(--color-text-muted)]">
    {children}
  </p>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fieldsByGroup = (groupId: string): NumericThemeDraftField[] =>
  (Object.keys(NUMERIC_SETTING_META) as NumericThemeDraftField[]).filter(
    (f) => NUMERIC_SETTING_META[f].group === groupId
  );

const ADVANCED_GROUPS: Array<{ id: string; label: string }> = [
  { id: "type", label: "Typography" },
  { id: "document", label: "Document" },
  { id: "profile", label: "Profile header" },
  { id: "entries", label: "Entry spacing" },
];

// ─── Main component ───────────────────────────────────────────────────────────
export const ThemeForm = () => {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const { fontFamily, themeColor } = settings;
  const appliedThemeColor = settings.themeColor || DEFAULT_THEME_COLOR;

  const [draftSettings, setDraftSettings] = useState<ThemeDraftSettings>(
    getDefaultThemeDraftSettings(settings)
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setDraftSettings(getDefaultThemeDraftSettings(settings));
  }, [settings]);

  const refreshPreview = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
  };

  const commitSetting = (
    field: GeneralSetting,
    value: string,
    refresh = true
  ) => {
    dispatch(changeSettings({ field, value }));
    if (refresh) refreshPreview();
  };

  const handleDraftChange = (field: ThemeDraftField, value: string) => {
    setDraftSettings((prev) => ({ ...prev, [field]: value }));
  };

  const commitThemeColor = (rawValue: string) => {
    const nextValue = normalizeThemeColorDraft(rawValue, settings.themeColor);
    setDraftSettings((prev) => ({ ...prev, themeColor: nextValue }));
    if (nextValue === settings.themeColor) return;
    commitSetting("themeColor", nextValue);
  };

  const commitNumericSetting = (
    field: NumericThemeDraftField,
    rawValue: string
  ) => {
    const nextValue = clampNumericSettingDraft(field, rawValue);
    setDraftSettings((prev) => ({ ...prev, [field]: nextValue }));
    if (nextValue === settings[field as keyof Settings]) return;
    commitSetting(field as GeneralSetting, nextValue);
  };

  const handleNumericBlur =
    (field: NumericThemeDraftField): FocusEventHandler<HTMLInputElement> =>
    (e) =>
      commitNumericSetting(field, e.currentTarget.value);

  const handleNumericKeyDown =
    (field: NumericThemeDraftField): KeyboardEventHandler<HTMLInputElement> =>
    (e) => {
      if (e.key === "Enter") {
        commitNumericSetting(field, e.currentTarget.value);
        e.currentTarget.blur();
      }
    };

  const handleNumericKeyUp =
    (field: NumericThemeDraftField): KeyboardEventHandler<HTMLInputElement> =>
    (e) => {
      if (["ArrowUp", "ArrowDown"].includes(e.key))
        commitNumericSetting(field, e.currentTarget.value);
    };

  const handleNumericMouseUp =
    (field: NumericThemeDraftField): MouseEventHandler<HTMLInputElement> =>
    (e) =>
      commitNumericSetting(field, e.currentTarget.value);

  const handleReset = () => {
    if (!window.confirm("Reset all settings to their default values?")) return;
    dispatch(setSettings(initialSettings));
    refreshPreview();
  };

  return (
    <BaseForm id="section-settings" className="scroll-mt-40">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cog6ToothIcon
            className="h-5 w-5 text-[color:var(--color-text-secondary)]"
            aria-hidden="true"
          />
          <h1 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
            Settings
          </h1>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-[color:var(--color-text-secondary)] transition hover:bg-black/5 hover:text-[color:var(--color-text-primary)]"
        >
          Reset
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-6">
        {/* ── Region ── */}
        <div>
          <SectionLabel>Region</SectionLabel>
          <ResumeLocaleToggle showLabel={false} />
        </div>

        {/* ── Accent color ── */}
        <div>
          <SectionLabel>Accent color</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {THEME_COLORS.map((color) => {
              const selected = themeColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  className="h-7 w-7 rounded-md border-2 shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    backgroundColor: color,
                    borderColor: selected
                      ? "var(--color-text-primary)"
                      : "transparent",
                  }}
                  onClick={() => commitSetting("themeColor", color)}
                  aria-label={`Use ${color} as accent color`}
                />
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div
              className="h-7 w-7 shrink-0 rounded-md border border-[color:var(--color-surface-border)]"
              style={{ backgroundColor: appliedThemeColor }}
              aria-hidden="true"
            />
            <input
              type="text"
              name="themeColor"
              value={draftSettings.themeColor}
              placeholder={DEFAULT_THEME_COLOR}
              onChange={(e) => handleDraftChange("themeColor", e.target.value)}
              onBlur={(e) => commitThemeColor(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitThemeColor(e.currentTarget.value);
                  e.currentTarget.blur();
                }
              }}
              className="h-7 w-32 rounded-md border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)] px-2 text-sm font-semibold outline-none transition focus:border-[color:var(--color-brand-primary)] focus:ring-2 focus:ring-[color:var(--color-brand-primary)]/20"
              style={{ color: appliedThemeColor }}
            />
          </div>
        </div>

        {/* ── Font family ── */}
        <div>
          <SectionLabel>Font</SectionLabel>
          <FontFamilySelectionsCSR
            selectedFontFamily={fontFamily}
            themeColor={appliedThemeColor}
            handleSettingsChange={commitSetting}
          />
        </div>

        {/* ── Advanced toggle ── */}
        <div>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-raised)]/60 px-4 py-2.5 text-sm font-semibold text-[color:var(--color-text-secondary)] transition hover:bg-[color:var(--color-surface-raised)]"
            onClick={() => setShowAdvanced((v) => !v)}
            aria-expanded={showAdvanced}
          >
            <span>Advanced spacing &amp; typography</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          <ExpanderWithHeightTransition expanded={showAdvanced}>
            <div className="mt-2 rounded-lg border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)] px-4 pb-4 pt-3">
              {ADVANCED_GROUPS.map(({ id, label }) => (
                <div key={id}>
                  <GroupLabel title={label} />
                  {fieldsByGroup(id).map((field) => (
                    <CompactNumericRow
                      key={field}
                      field={field}
                      value={draftSettings[field]}
                      onChange={handleDraftChange}
                      onBlur={handleNumericBlur(field)}
                      onKeyDown={handleNumericKeyDown(field)}
                      onKeyUp={handleNumericKeyUp(field)}
                      onMouseUp={handleNumericMouseUp(field)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </ExpanderWithHeightTransition>
        </div>
      </div>
    </BaseForm>
  );
};
