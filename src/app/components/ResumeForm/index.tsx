"use client";
import { useEffect, useRef, useState } from "react";
import {
  useAppSelector,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "lib/redux/hooks";
import {
  ShowForm,
  selectFormsOrder,
  selectSettings,
} from "lib/redux/settingsSlice";
import { ProfileForm } from "components/ResumeForm/ProfileForm";
import { WorkExperiencesForm } from "components/ResumeForm/WorkExperiencesForm";
import { EducationsForm } from "components/ResumeForm/EducationsForm";
import { ProjectsForm } from "components/ResumeForm/ProjectsForm";
import { SkillsForm } from "components/ResumeForm/SkillsForm";
import { LanguagesForm } from "components/ResumeForm/LanguagesForm";
import { ThemeForm } from "components/ResumeForm/ThemeForm";
import { CustomForm } from "components/ResumeForm/CustomForm";
import { cx } from "lib/cx";
import { Heading, Paragraph } from "components/documentation";
import type { ReactElement } from "react";
import { CSS_VARIABLES } from "globals-css";
import { getPxPerRem } from "lib/get-px-per-rem";
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  LETTER_HEIGHT_PX,
  LETTER_WIDTH_PX,
} from "lib/constants";

const formTypeToComponent: { [type in ShowForm]: () => ReactElement } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  languages: LanguagesForm,
  custom: CustomForm,
};

export const ResumeForm = ({
  preview,
  showRefreshButton = false,
}: {
  preview?: React.ReactNode;
  showRefreshButton?: boolean;
}) => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();

  const formsOrder = useAppSelector(selectFormsOrder);
  const settings = useAppSelector(selectSettings);
  const [isHover, setIsHover] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isSmallViewport, setIsSmallViewport] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const computeIsSmallViewport = () => {
      const screenHeightPx = window.innerHeight;
      const screenWidthPx = window.innerWidth;
      const PX_PER_REM = getPxPerRem();
      const screenHeightRem = screenHeightPx / PX_PER_REM;
      const topNavBarHeightRem = parseFloat(
        CSS_VARIABLES["--top-nav-bar-height"]
      );
      const resumePadding = parseFloat(CSS_VARIABLES["--resume-padding"]);
      const topAndBottomResumePadding = resumePadding * 2;
      const isSplitLayout = screenWidthPx >= 768;
      const availableWidthPx =
        (isSplitLayout ? screenWidthPx / 2 : screenWidthPx) -
        topAndBottomResumePadding * PX_PER_REM;
      const defaultResumeHeightRem =
        screenHeightRem -
        topNavBarHeightRem -
        topAndBottomResumePadding;
      const resumeHeightPx = defaultResumeHeightRem * PX_PER_REM;
      const height =
        settings.documentSize === "A4" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;
      const width =
        settings.documentSize === "A4" ? A4_WIDTH_PX : LETTER_WIDTH_PX;
      const heightScale = resumeHeightPx / height;
      const widthScale = availableWidthPx / width;
      const defaultScale =
        Math.round(Math.min(heightScale, widthScale, 1) * 100) / 100;
      const shouldCollapse = defaultScale < 0.6 || screenWidthPx < 768;
      setIsSmallViewport(shouldCollapse);
      if (!shouldCollapse) {
        setShowPreview(false);
      }
    };

    computeIsSmallViewport();
    window.addEventListener("resize", computeIsSmallViewport);
    return () => {
      window.removeEventListener("resize", computeIsSmallViewport);
    };
  }, [settings.documentSize]);

  return (
    <div
      className={cx(
        "relative flex h-[calc(100vh-var(--top-nav-bar-height)-20px)] justify-start overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-track-gray-100",
        isHover ? "scrollbar-thumb-gray-200" : "scrollbar-thumb-gray-100"
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      ref={scrollContainerRef}
    >
      <section className="flex w-full flex-col gap-0 px-0 pb-0 pt-0">
        <div id="resume-form-top-sentinel" className="h-px w-full" />
        <div className="flex w-full flex-col gap-8">
            <div className="sticky top-0 z-10 -mb-6 bg-gray-50">
              <div className="h-4 bg-gray-50 md:-mx-2" />
            </div>
          <section className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Heading className="text-primary !mt-0">
                Resume Builder Workbench
              </Heading>
              {showRefreshButton && !isSmallViewport && (
                <button
                  type="button"
                  className="rounded-full border border-blue-700 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:bg-emerald-100 active:translate-y-0"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("resume:refresh-preview")
                    )
                  }
                >
                  Refresh Preview
                </button>
              )}
              {preview && isSmallViewport && (
                <button
                  type="button"
                  className="rounded-full border border-emerald-200 bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                  onClick={() => {
                    setShowPreview((prev) => {
                      const next = !prev;
                      if (next && typeof window !== "undefined") {
                        window.dispatchEvent(
                          new CustomEvent("resume:refresh-preview")
                        );
                      }
                      return next;
                    });
                  }}
                  aria-expanded={showPreview}
                >
                  {showPreview ? "Hide preview" : "Show preview"}
                </button>
              )}
            </div>
            <Paragraph>
              Build your resume section by section, fine-tune typography and
              theme settings, then export a polished PDF or JSON backup anytime.
              <br />
              Press{" "}
              <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs font-semibold text-gray-700 align-middle">
                Enter
              </kbd>{" "}
              to refresh the preview.
            </Paragraph>
            {preview && isSmallViewport && showPreview && (
              <div className="mt-3 w-full">
                {preview}
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-emerald-200 bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("resume:download-pdf"))
                }
              >
                Download PDF
              </button>
              <button
                type="button"
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("resume:download-json"))
                }
              >
                Download JSON
              </button>
              </div>
              {preview && isSmallViewport && showPreview && (
                <button
                  type="button"
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("resume:refresh-preview")
                    )
                  }
                >
                  Refresh Preview
                </button>
              )}
            </div>
          </section>
          <ProfileForm />
          {formsOrder.map((form) => {
            const Component = formTypeToComponent[form];
            return <Component key={form} />;
          })}
          <ThemeForm />
        </div>
      </section>
    </div>
  );
};
