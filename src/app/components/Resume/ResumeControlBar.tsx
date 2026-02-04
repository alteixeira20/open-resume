"use client";
import type { ReactElement } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { pdf } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import dynamic from "next/dynamic";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
  onDownloadJson,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: ReactElement<DocumentProps>;
  fileName: string;
  onDownloadJson: () => void;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const handleDownloadPdf = async () => {
    if (typeof window === "undefined") return;
    const blob = await pdf(document).toBlob();
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center px-[var(--resume-padding)] text-gray-600 lg:justify-between">
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">Autoscale</span>
        </label>
      </div>
      <div className="ml-1 flex items-center gap-2 lg:ml-8">
        <button
          type="button"
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100"
          onClick={onDownloadJson}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="hidden whitespace-nowrap sm:inline">
            Download JSON
          </span>
          <span className="whitespace-nowrap sm:hidden">JSON</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100"
          onClick={handleDownloadPdf}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="hidden whitespace-nowrap sm:inline">
            Download PDF
          </span>
          <span className="whitespace-nowrap sm:hidden">PDF</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
