"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "components/ui";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import {
  clearStateFromLocalStorage,
  getHasUsedAppBefore,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectResume, setResume } from "lib/redux/resumeSlice";
import {
  selectSettings,
  setSettings,
  type ShowForm,
} from "lib/redux/settingsSlice";

export const ImportResumeButton = () => {
  const dispatch = useAppDispatch();
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const importInputRef = useRef<HTMLInputElement>(null);
  const importPdfInputRef = useRef<HTMLInputElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(false);
  };

  const scheduleCloseMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimeoutRef.current = null;
    }, 500);
  };

  const cancelScheduledClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleImportJsonClick = () => {
    closeMenu();
    importInputRef.current?.click();
  };

  const handleImportPdfClick = () => {
    closeMenu();
    importPdfInputRef.current?.click();
  };

  const handleImportJson = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (getHasUsedAppBefore()) {
      const confirmed = window.confirm(
        "This will overwrite your current resume and settings. Do you want to continue?"
      );
      if (!confirmed) {
        event.target.value = "";
        return;
      }
      clearStateFromLocalStorage();
    }
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as {
        resume?: typeof resume;
        settings?: typeof settings;
      };
      if (!parsed.resume || !parsed.settings) {
        alert("Invalid JSON format. Please use a CVForge export file.");
        return;
      }
      dispatch(setResume(parsed.resume));
      dispatch(setSettings(parsed.settings));
      saveStateToLocalStorage({
        resume: parsed.resume,
        settings: parsed.settings,
      } as any);
    } catch {
      alert("Could not read JSON file. Please check the file and try again.");
    } finally {
      event.target.value = "";
    }
  };

  const handleImportPdf = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (getHasUsedAppBefore()) {
      const confirmed = window.confirm(
        "This will overwrite your current resume and settings. Do you want to continue?"
      );
      if (!confirmed) {
        event.target.value = "";
        return;
      }
      clearStateFromLocalStorage();
    }
    try {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        alert("Please select a PDF file.");
        return;
      }
      const pdfData = await file.arrayBuffer();
      const parsedResume = await parseResumeFromPdf(pdfData);

      const newSettings = { ...settings };
      if (getHasUsedAppBefore()) {
        const sections = Object.keys(newSettings.formToShow) as ShowForm[];
        const hasFeaturedSkills =
          parsedResume.skills.featuredSkills?.some((skill) => skill.skill.trim()) ??
          false;
        const sectionToFormToShow: Record<ShowForm, boolean> = {
          workExperiences: parsedResume.workExperiences.length > 0,
          educations: parsedResume.educations.length > 0,
          projects: parsedResume.projects.length > 0,
          skills:
            parsedResume.skills.descriptions.length > 0 || hasFeaturedSkills,
          languages: parsedResume.languages.length > 0,
          custom: parsedResume.custom.descriptions.length > 0,
        };
        for (const section of sections) {
          newSettings.formToShow[section] = sectionToFormToShow[section];
        }
      }

      dispatch(setResume(parsedResume));
      dispatch(setSettings(newSettings));
      saveStateToLocalStorage({
        resume: parsedResume,
        settings: newSettings,
      } as any);
      window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
    } catch (error) {
      console.error("PDF import failed", error);
      alert("Could not import PDF. Please try another file.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={cancelScheduledClose}
      onMouseLeave={scheduleCloseMenu}
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onBlur={scheduleCloseMenu}
      >
        Import
      </Button>
      {isOpen && (
        <div
          className="absolute left-4 top-full z-20 mt-2 w-max rounded-xl border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)] p-2 shadow-lg"
          onMouseEnter={cancelScheduledClose}
          onMouseLeave={scheduleCloseMenu}
        >
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-left text-sm font-medium text-[color:var(--color-text-primary)] transition-colors hover:bg-[color:var(--color-surface-raised)]"
              onClick={handleImportJsonClick}
              onBlur={scheduleCloseMenu}
            >
              JSON
            </button>
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-left text-sm font-medium text-[color:var(--color-text-primary)] transition-colors hover:bg-[color:var(--color-surface-raised)]"
              onClick={handleImportPdfClick}
              onBlur={scheduleCloseMenu}
            >
              PDF
            </button>
          </div>
        </div>
      )}
      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportJson}
      />
      <input
        ref={importPdfInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleImportPdf}
      />
    </div>
  );
};

export default ImportResumeButton;
