"use client";
import { useEffect, useRef, useState } from "react";
import {
  useAppSelector,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "lib/redux/hooks";
import { ShowForm, selectFormsOrder } from "lib/redux/settingsSlice";
import { ProfileForm } from "components/ResumeForm/ProfileForm";
import { WorkExperiencesForm } from "components/ResumeForm/WorkExperiencesForm";
import { EducationsForm } from "components/ResumeForm/EducationsForm";
import { ProjectsForm } from "components/ResumeForm/ProjectsForm";
import { SkillsForm } from "components/ResumeForm/SkillsForm";
import { LanguagesForm } from "components/ResumeForm/LanguagesForm";
import { ThemeForm } from "components/ResumeForm/ThemeForm";
import { CustomForm } from "components/ResumeForm/CustomForm";
import { cx } from "lib/cx";
import type { ReactElement } from "react";

const formTypeToComponent: { [type in ShowForm]: () => ReactElement } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  languages: LanguagesForm,
  custom: CustomForm,
};

export const ResumeForm = ({ preview }: { preview?: React.ReactNode }) => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();

  const formsOrder = useAppSelector(selectFormsOrder);
  const [isHover, setIsHover] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isSmallViewport, setIsSmallViewport] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsSmallViewport(event.matches);
      if (!event.matches) {
        setShowPreview(false);
      }
    };
    handleChange(mediaQuery);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return (
    <div
      className={cx(
        "relative flex h-[calc(100vh-var(--top-nav-bar-height))] justify-start overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-track-gray-100",
        isHover ? "scrollbar-thumb-gray-200" : "scrollbar-thumb-gray-100"
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      ref={scrollContainerRef}
    >
      <section className="flex w-full flex-col gap-0 px-[var(--resume-padding)] pb-[var(--resume-padding)] pt-0">
        {preview && isSmallViewport && (
          <div className="mb-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-gray-900">
                Resume Preview
              </h2>
              <button
                type="button"
                className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowPreview((prev) => !prev)}
                aria-expanded={showPreview}
              >
                {showPreview ? "Hide preview" : "Show preview"}
              </button>
            </div>
            {showPreview && (
              <div className="mt-3 max-h-[70vh] overflow-auto">
                {preview}
              </div>
            )}
            {!showPreview && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Download
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("resume:download-json")
                      )
                    }
                  >
                    JSON
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("resume:download-pdf")
                      )
                    }
                  >
                    PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <div id="resume-form-top-sentinel" className="h-px w-full" />
        <div className="flex w-full flex-col gap-8">
          <div className="sticky top-0 z-10 -mb-8 bg-gray-50">
            <div className="h-6 bg-gray-50 md:-mx-2" />
          </div>
          <ProfileForm />
          {formsOrder.map((form) => {
            const Component = formTypeToComponent[form];
            return <Component key={form} />;
          })}
          <ThemeForm />
          <br />
        </div>
      </section>
    </div>
  );
};
