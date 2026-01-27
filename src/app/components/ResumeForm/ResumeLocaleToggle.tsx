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

export const ResumeLocaleToggle = () => {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  return (
    <div>
      <InputGroupWrapper label="Resume Region" />
      <select
        className="mt-2 h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm font-medium text-gray-700 shadow-sm focus:border-gray-400 focus:outline-none"
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
