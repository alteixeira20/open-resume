"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "components/ui";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import { getHasUsedAppBefore, saveStateToLocalStorage } from "lib/redux/local-storage";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { setResume } from "lib/redux/resumeSlice";
import { selectSettings, setSettings } from "lib/redux/settingsSlice";
import {
  buildImportedPdfState,
  parseImportedJsonState,
} from "lib/redux/import-state";

export const ImportResumeButton = ({
  buttonClassName,
}: {
  buttonClassName?: string;
} = {}) => {
  const dispatch = useAppDispatch();
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

    try {
      const text = await file.text();
      const importedState = parseImportedJsonState(text);
      if (!importedState) {
        alert("Invalid JSON format. Please use a compatible CVForge export file.");
        return;
      }

      if (getHasUsedAppBefore()) {
        const confirmed = window.confirm(
          "This will overwrite your current resume and settings. Do you want to continue?"
        );
        if (!confirmed) {
          return;
        }
      }

      dispatch(setResume(importedState.resume));
      dispatch(setSettings(importedState.settings));
      saveStateToLocalStorage(importedState);
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
    let fileUrl: string | null = null;
    try {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        alert("Please select a PDF file.");
        return;
      }
      fileUrl = URL.createObjectURL(file);
      const parsedResume = await parseResumeFromPdf(fileUrl);

      const importedState = buildImportedPdfState({
        resume: parsedResume,
        baseSettings: settings,
        deriveFormVisibility: getHasUsedAppBefore(),
      });

      if (getHasUsedAppBefore()) {
        const confirmed = window.confirm(
          "This will overwrite your current resume and settings. Do you want to continue?"
        );
        if (!confirmed) {
          return;
        }
      }

      dispatch(setResume(importedState.resume));
      dispatch(setSettings(importedState.settings));
      saveStateToLocalStorage(importedState);
      window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
    } catch (error) {
      console.error("PDF import failed", error);
      alert("Could not import PDF. Please try another file.");
    } finally {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
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
        className={buttonClassName}
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
