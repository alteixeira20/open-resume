"use client";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  applyResumeLocalePreset,
  selectSettings,
  type ResumeLocale,
} from "lib/redux/settingsSlice";

const LOCALE_OPTIONS: Array<{ id: ResumeLocale; label: string }> = [
  { id: "eu", label: "EU (A4)" },
  { id: "us", label: "US (Letter)" },
];

export const ResumeLocaleToggle = ({
  showLabel = true,
}: {
  showLabel?: boolean;
}) => {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  return (
    <div>
      {showLabel && (
        <InputGroupWrapper
          label="Resume region"
          className="text-sm font-semibold text-[color:var(--color-text-primary)]"
        />
      )}
      <select
        className={`${showLabel ? "mt-2" : ""} inline-flex h-10 min-w-[180px] rounded-lg border border-[color:var(--color-surface-border)] bg-white px-3 text-sm font-medium text-[color:var(--color-text-primary)] shadow-sm focus:border-[color:var(--color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-primary)]/20`}
        value={settings.resumeLocale}
        onChange={(event) =>
          dispatch(
            applyResumeLocalePreset({
              locale: event.target.value as ResumeLocale,
            })
          )
        }
      >
        {LOCALE_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
