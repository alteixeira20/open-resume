"use client";
import {
  useAppSelector,
  useDebouncedPreviewRefreshOnChange,
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
import { ImportResumeButton } from "components/ResumeForm/ImportResumeButton";
import { WorkbenchHeader } from "components/layout/WorkbenchHeader";
import { WORKBENCH_UI } from "components/layout/workbench-ui";
import { Button } from "components/ui";
import type { ReactElement } from "react";

const formTypeToComponent: { [type in ShowForm]: () => ReactElement } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  languages: LanguagesForm,
  custom: CustomForm,
};

interface ResumeFormProps {
  preview?: React.ReactNode;
  showRefreshButton?: boolean;
  onTogglePreview?: () => void;
  showPreview?: boolean;
}

export const ResumeForm = ({
  preview,
  showRefreshButton = false,
  onTogglePreview,
  showPreview = false,
}: ResumeFormProps) => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();
  useDebouncedPreviewRefreshOnChange({ delay: 425 });

  const formsOrder = useAppSelector(selectFormsOrder);

  return (
    <div className="flex min-h-full flex-col">
      <div className={`${WORKBENCH_UI.contentStackClass} pb-16`}>
        <section className="sticky top-[-1.5rem] z-10 -mx-[var(--workbench-panel-px)] -mt-6 border-b border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)]/95 px-[var(--workbench-panel-px)] pb-2 pt-6 backdrop-blur-sm">
        <WorkbenchHeader
          title="Builder Workbench"
          wrapperClassName="mb-0 min-h-0 gap-1"
          contentClassName="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-8 gap-y-3"
          textBlockClassName="max-w-prose"
          actionsClassName="justify-center self-start"
          description={
            <div className="flex min-h-[3.75rem] flex-col justify-between">
              <p>Preview updates automatically after a short pause.</p>
              <p>
                Use{" "}
                <span className="rounded-md border border-[color:var(--color-brand-primary)]/25 bg-[color:var(--color-forge-100)] px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-forge-700)]">
                  Refresh now
                </span>{" "}
                for an immediate update.
              </p>
            </div>
          }
          actions={
            <div className="flex w-auto origin-top scale-[0.82] flex-col items-end gap-4 sm:scale-[0.9] md:scale-100">
              <div className="shrink-0 whitespace-nowrap md:mr-18">
                <ImportResumeButton />
              </div>
              <div className="shrink-0 whitespace-nowrap md:mr-8">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("resume:evaluate-in-parser")
                    )
                  }
                >
                  Evaluate CV
                </Button>
              </div>
              {showRefreshButton && (
                <div className="shrink-0 whitespace-nowrap">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("resume:refresh-preview")
                      )
                    }
                  >
                    Refresh now
                  </Button>
                </div>
              )}
              {onTogglePreview && (
                <div className="shrink-0 self-end whitespace-nowrap">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onTogglePreview}
                    aria-expanded={showPreview}
                  >
                    {showPreview ? "Hide preview" : "Show preview"}
                  </Button>
                </div>
              )}
            </div>
          }
        />
          {preview && showPreview && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("resume:refresh-preview")
                  )
                }
              >
                Refresh now
              </Button>
            </div>
          )}
        </section>
        <section>
          {preview && showPreview && <div className="mt-3 w-full">{preview}</div>}
        </section>
        <ProfileForm />
        {formsOrder.map((form) => {
          const Component = formTypeToComponent[form];
          return <Component key={form} />;
        })}
        <ThemeForm />
      </div>
      <section className="sticky bottom-[-1rem] z-10 -mx-[var(--workbench-panel-px)] -mb-4 border-t border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)]/95 px-[var(--workbench-panel-px)] py-4 backdrop-blur-sm">
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("resume:download-pdf"))
            }
          >
            Download PDF
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("resume:download-json"))
            }
          >
            Download JSON
          </Button>
        </div>
      </section>
    </div>
  );
};
