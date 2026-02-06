"use client";
import { useSetDefaultScale } from "components/Resume/hooks";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  maxScale,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  maxScale: number;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const handleRefresh = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
  };

  return (
    <div className="sticky top-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-start justify-center px-[var(--resume-padding)] pt-1 text-gray-600 lg:justify-between">
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={maxScale}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            const nextScale = Number(e.target.value);
            setScale(Math.min(nextScale, maxScale));
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
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          onClick={handleRefresh}
        >
          <ArrowPathIcon className="h-4 w-4" />
          <span className="hidden whitespace-nowrap sm:inline">
            Refresh Preview
          </span>
          <span className="whitespace-nowrap sm:hidden">Refresh</span>
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
