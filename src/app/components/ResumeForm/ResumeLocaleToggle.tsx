"use client";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  applyResumeLocalePreset,
  selectSettings,
  type ResumeLocale,
} from "lib/redux/settingsSlice";

const LOCALE_OPTIONS: Array<{
  id: ResumeLocale;
  label: string;
  hint: string;
}> = [
  {
    id: "us",
    label: "US Resume",
    hint: "Letter • US-style headings",
  },
  {
    id: "eu",
    label: "EU CV",
    hint: "A4 • EU-style headings",
  },
];

export const ResumeLocaleToggle = () => {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  return (
    <section className="mx-auto mb-4 w-full max-w-5xl rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Resume Region</h2>
          <p className="text-xs text-gray-600">
            Switch between US and EU presets (headings + paper size).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {LOCALE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`rounded-md border px-3 py-2 text-left text-sm font-medium transition-colors ${
                settings.resumeLocale === option.id
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
              onClick={() =>
                dispatch(applyResumeLocalePreset({ locale: option.id }))
              }
            >
              <div>{option.label}</div>
              <div className="text-xs opacity-80">{option.hint}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
