"use client";
import { BaseForm } from "components/ResumeForm/Form";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  applyResumeLocalePreset,
  selectSettings,
  type ResumeLocale,
} from "lib/redux/settingsSlice";
import { MapPinIcon } from "@heroicons/react/24/outline";

const LOCALE_OPTIONS: Array<{ id: ResumeLocale; label: string }> = [
  { id: "eu", label: "EU (A4)" },
  { id: "us", label: "US (Letter)" },
];

export const ResumeLocaleToggle = () => {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <MapPinIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-gray-900">Resume Region</h2>
      </div>
      <select
        className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm font-medium text-gray-700 shadow-sm focus:border-gray-400 focus:outline-none"
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
