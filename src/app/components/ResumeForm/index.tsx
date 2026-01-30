"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAppSelector,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "lib/redux/hooks";
import {
  ShowForm,
  selectFormsOrder,
  selectFormToHeading,
  selectFormToShow,
} from "lib/redux/settingsSlice";
import { ProfileForm } from "components/ResumeForm/ProfileForm";
import { WorkExperiencesForm } from "components/ResumeForm/WorkExperiencesForm";
import { EducationsForm } from "components/ResumeForm/EducationsForm";
import { ProjectsForm } from "components/ResumeForm/ProjectsForm";
import { SkillsForm } from "components/ResumeForm/SkillsForm";
import { LanguagesForm } from "components/ResumeForm/LanguagesForm";
import { ThemeForm } from "components/ResumeForm/ThemeForm";
import { CustomForm } from "components/ResumeForm/CustomForm";
import { FlexboxSpacer } from "components/FlexboxSpacer";
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

export const ResumeForm = () => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();

  const formsOrder = useAppSelector(selectFormsOrder);
  const formToHeading = useAppSelector(selectFormToHeading);
  const formToShow = useAppSelector(selectFormToShow);
  const [isHover, setIsHover] = useState(false);

  const normalizeLabel = (label: string) =>
    label.trim().toUpperCase().replace(/\s+/g, " ");

  const navItems = useMemo(
    () => [
      { id: "section-profile", label: "Personal Information" },
      ...formsOrder
        .filter((form) => formToShow[form])
        .map((form) => ({
          id: `section-${form}`,
          label: formToHeading[form],
        })),
      { id: "section-settings", label: "Resume Settings" },
    ],
    [formsOrder, formToHeading, formToShow]
  );

  const [activeId, setActiveId] = useState<string>(
    navItems[0]?.id ?? "section-profile"
  );
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isNavDocked, setIsNavDocked] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!navItems.length) {
      return;
    }
    if (!navItems.some((item) => item.id === activeId)) {
      setActiveId(navItems[0].id);
    }
  }, [activeId, navItems]);

  useEffect(() => {
    if (!navItems.length) {
      return;
    }
    const observedElements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!observedElements.length) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );
    observedElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [navItems]);

  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!root) {
      return;
    }
    const sentinel = document.getElementById("resume-form-top-sentinel");
    if (!sentinel) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }
        setIsNavDocked(entry.isIntersecting);
      },
      { root, threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const showNavPanel = isNavOpen;

  return (
    <div
      className={cx(
        "relative flex justify-center scrollbar-thin scrollbar-track-gray-100 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-start md:overflow-y-scroll",
        isHover ? "scrollbar-thumb-gray-200" : "scrollbar-thumb-gray-100"
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      ref={scrollContainerRef}
    >
      <section className="flex w-full max-w-3xl flex-col gap-0 px-[var(--resume-padding)] pb-[var(--resume-padding)] pt-0 md:max-w-none">
        <div id="resume-form-top-sentinel" className="h-px w-full" />
        <div
          className={cx(
            "grid gap-6",
            isNavOpen
              ? "md:grid-cols-[180px_minmax(0,1fr)]"
              : "md:grid-cols-[44px_minmax(0,1fr)]"
          )}
        >
          <nav className="hidden md:block">
            <div className="sticky top-6">
              {showNavPanel ? (
                <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Sections
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsNavOpen(false)}
                      className="rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      aria-expanded={showNavPanel}
                    >
                      Hide
                    </button>
                  </div>
                  <div className="mt-2 flex flex-col gap-1">
                    {navItems.map((item) => {
                      const isActive = item.id === activeId;
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={cx(
                            "rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
                            isActive
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          {normalizeLabel(item.label)}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsNavOpen((open) => !open)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Show section navigation"
                  aria-expanded={showNavPanel}
                >
                  <span className="flex flex-col items-center gap-0.5">
                    <span className="h-0.5 w-3 rounded-full bg-current" />
                    <span className="h-0.5 w-3 rounded-full bg-current" />
                    <span className="h-0.5 w-3 rounded-full bg-current" />
                  </span>
                </button>
              )}
            </div>
          </nav>
          <div className="flex flex-col gap-8">
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
        </div>
      </section>
      <FlexboxSpacer maxWidth={50} className="hidden md:block" />
    </div>
  );
};
