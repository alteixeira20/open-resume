import { useEffect, useRef, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import {
  clearStateFromLocalStorage,
  getHasUsedAppBefore,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { type ShowForm, initialSettings } from "lib/redux/settingsSlice";
import { useRouter } from "next/navigation";
import addPdfSrc from "public/assets/add-pdf.svg";
import Image from "next/image";
import { cx } from "lib/cx";
import { deepClone } from "lib/deep-clone";
import type { RootState } from "lib/redux/store";

const defaultFileState = {
  name: "",
  size: 0,
  fileUrl: "",
  type: "" as "pdf" | "json" | "",
  file: null as File | null,
};

export const ResumeDropzone = ({
  onFileUrlChange,
  className,
  playgroundView = false,
  autoOpen = false,
  allowJsonImport = false,
}: {
  onFileUrlChange: (fileUrl: string) => void;
  className?: string;
  playgroundView?: boolean;
  autoOpen?: boolean;
  allowJsonImport?: boolean;
}) => {
  const [file, setFile] = useState(defaultFileState);
  const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);
  const [hasNonPdfFile, setHasNonPdfFile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const hasFile = Boolean(file.name);

  const setNewFile = (newFile: File, type: "pdf" | "json") => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    const { name, size } = newFile;
    const fileUrl = type === "pdf" ? URL.createObjectURL(newFile) : "";
    setFile({ name, size, fileUrl, type, file: newFile });
    onFileUrlChange(fileUrl);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    const fileName = newFile?.name?.toLowerCase() ?? "";
    const isPdf = fileName.endsWith(".pdf");
    const isJson = allowJsonImport && fileName.endsWith(".json");
    if (isPdf || isJson) {
      setHasNonPdfFile(false);
      setNewFile(newFile, isPdf ? "pdf" : "json");
    } else {
      setHasNonPdfFile(true);
    }
    setIsHoveredOnDropzone(false);
  };

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const newFile = files[0];
    const fileName = newFile?.name?.toLowerCase() ?? "";
    const isPdf = fileName.endsWith(".pdf");
    const isJson = allowJsonImport && fileName.endsWith(".json");
    if (!isPdf && !isJson) {
      setHasNonPdfFile(true);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }
    setHasNonPdfFile(false);
    setNewFile(newFile, isPdf ? "pdf" : "json");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onRemove = () => {
    setFile(defaultFileState);
    setHasNonPdfFile(false);
    onFileUrlChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onImportClick = async () => {
    if (getHasUsedAppBefore()) {
      const confirmed = window.confirm(
        "This will overwrite your current resume and settings. Do you want to continue?"
      );
      if (!confirmed) {
        return;
      }
      clearStateFromLocalStorage();
    }
    if (file.type === "json" && file.file) {
      try {
        const text = await file.file.text();
        const parsed = JSON.parse(text) as Partial<RootState>;
        if (!parsed?.resume || !parsed?.settings) {
          alert("Invalid JSON format. Please use an OpenResume export file.");
          return;
        }
        saveStateToLocalStorage({
          resume: parsed.resume,
          settings: parsed.settings,
        } as RootState);
        router.push("/resume-builder");
      } catch {
        alert("Could not read JSON file. Please check the file and try again.");
      }
      return;
    }
    if (!file.fileUrl) {
      alert("Please select a PDF file.");
      return;
    }
    const resume = await parseResumeFromPdf(file.fileUrl);
    const settings = deepClone(initialSettings);

    // Set formToShow settings based on uploaded resume if users have used the app before
    if (getHasUsedAppBefore()) {
      const sections = Object.keys(settings.formToShow) as ShowForm[];
      const hasFeaturedSkills =
        resume.skills.featuredSkills?.some((skill) => skill.skill.trim()) ??
        false;
      const sectionToFormToShow: Record<ShowForm, boolean> = {
        workExperiences: resume.workExperiences.length > 0,
        educations: resume.educations.length > 0,
        projects: resume.projects.length > 0,
        skills: resume.skills.descriptions.length > 0 || hasFeaturedSkills,
        languages: resume.languages.length > 0,
        custom: resume.custom.descriptions.length > 0,
      };
      for (const section of sections) {
        settings.formToShow[section] = sectionToFormToShow[section];
      }
    }

    saveStateToLocalStorage({ resume, settings });
    router.push("/resume-builder");
  };

  useEffect(() => {
    if (autoOpen && !hasFile) {
      inputRef.current?.click();
    }
  }, [autoOpen, hasFile]);

  return (
    <div
      className={cx(
        "flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 ",
        isHoveredOnDropzone && "border-sky-400",
        playgroundView ? "pb-6 pt-4" : "py-12",
        className
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsHoveredOnDropzone(true);
      }}
      onDragLeave={() => setIsHoveredOnDropzone(false)}
      onDrop={onDrop}
    >
      <div
        className={cx(
          "text-center",
          playgroundView ? "space-y-2" : "space-y-3"
        )}
      >
        {!playgroundView && (
          <Image
            src={addPdfSrc}
            className="mx-auto h-14 w-14"
            alt="Add pdf"
            aria-hidden="true"
            priority
          />
        )}
        {!hasFile ? (
          <>
            <p
              className={cx(
                "pt-3 text-gray-700",
                !playgroundView && "text-lg font-semibold"
              )}
            >
              Browse a PDF{allowJsonImport ? " or JSON" : ""} file or drop it here
            </p>
            <p className="flex text-sm text-gray-500">
              <LockClosedIcon className="mr-1 mt-1 h-3 w-3 text-gray-400" />
              File data is used locally and never leaves your browser
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3 pt-3">
            <div className="pl-7 font-semibold text-gray-900">
              {file.name} - {getFileSizeString(file.size)}
            </div>
            <button
              type="button"
              className="outline-theme-blue rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              title="Remove file"
              onClick={onRemove}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        )}
        <div className="pt-4">
          {!hasFile ? (
            <>
              <label
                className={cx(
                  "within-outline-theme-purple cursor-pointer rounded-full px-6 pb-2.5 pt-2 font-semibold shadow-sm",
                  playgroundView ? "border" : "bg-primary"
                )}
              >
                Browse file
                <input
                  type="file"
                  className="sr-only"
                  accept={allowJsonImport ? ".pdf,.json" : ".pdf"}
                  onChange={onInputChange}
                  ref={inputRef}
                />
              </label>
              {hasNonPdfFile && (
                <p className="mt-6 text-red-400">
                  Only {allowJsonImport ? "PDF or JSON" : "PDF"} file is supported
                </p>
              )}
            </>
          ) : (
            <>
              {!playgroundView && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={onImportClick}
                >
                  {file.type === "json" ? "Import JSON" : "Import"} and Continue{" "}
                  <span aria-hidden="true">→</span>
                </button>
              )}
              <p className={cx(" text-gray-500", !playgroundView && "mt-6")}>
                Note: {!playgroundView ? "Import" : "Parser"} works best on
                single column resume
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const getFileSizeString = (fileSizeB: number) => {
  const fileSizeKB = fileSizeB / 1024;
  const fileSizeMB = fileSizeKB / 1024;
  if (fileSizeKB < 1000) {
    return fileSizeKB.toPrecision(3) + " KB";
  } else {
    return fileSizeMB.toPrecision(3) + " MB";
  }
};
