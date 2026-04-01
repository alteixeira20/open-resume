import { useEffect, useRef, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import {
  getHasUsedAppBefore,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { initialSettings } from "lib/redux/settingsSlice";
import { useRouter } from "next/navigation";
import addPdfSrc from "public/assets/add-pdf.svg";
import Image from "next/image";
import { cx } from "lib/cx";
import { deepClone } from "lib/deep-clone";
import { Button } from "components/ui";
import {
  buildImportedPdfState,
  parseImportedJsonState,
} from "lib/redux/import-state";

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
    if (file.type === "json" && file.file) {
      const text = await file.file.text();
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

      saveStateToLocalStorage(importedState);
      router.push("/builder");
      return;
    }
    if (!file.fileUrl) {
      alert("Please select a PDF file.");
      return;
    }
    const resume = await parseResumeFromPdf(file.fileUrl);
    const importedState = buildImportedPdfState({
      resume,
      baseSettings: deepClone(initialSettings),
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

    saveStateToLocalStorage(importedState);
    router.push("/builder");
  };

  useEffect(() => {
    if (autoOpen && !hasFile) {
      inputRef.current?.click();
    }
  }, [autoOpen, hasFile]);

  return (
    <div
      className={cx(
        "flex justify-center rounded-md border-2 border-dashed border-[color:var(--color-surface-border)] px-6 ",
        isHoveredOnDropzone && "border-[color:var(--color-brand-primary)]",
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
                "pt-3 text-[color:var(--color-text-secondary)]",
                !playgroundView && "text-lg font-semibold"
              )}
            >
              Browse a PDF{allowJsonImport ? " or JSON" : ""} file or drop it here
            </p>
            <p className="flex text-sm text-[color:var(--color-text-muted)]">
              <LockClosedIcon className="mr-1 mt-1 h-3 w-3 text-[color:var(--color-text-muted)]" />
              File data is used locally and never leaves your browser
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3 pt-3">
            <div className="pl-7 font-semibold text-[color:var(--color-text-primary)]">
              {file.name} - {getFileSizeString(file.size)}
            </div>
            <button
              type="button"
              className="outline-brand-secondary rounded-md p-1 text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-raised)] hover:text-[color:var(--color-text-secondary)]"
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
                  "within-outline-brand-primary cursor-pointer rounded-full px-6 pb-2.5 pt-2 font-semibold shadow-sm",
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
                <Button onClick={onImportClick}>
                  {file.type === "json" ? "Import JSON" : "Import"} and Continue{" "}
                  <span aria-hidden="true">→</span>
                </Button>
              )}
              <p className={cx(" text-[color:var(--color-text-muted)]", !playgroundView && "mt-6")}>
                Note: {!playgroundView ? "Import" : "Parser"} is most reliable
                on single-column CVs
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
