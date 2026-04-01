"use client";
import { useEffect, useRef, useState } from "react";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
import { useStore } from "react-redux";
import type { RootState } from "lib/redux/store";
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  LETTER_HEIGHT_PX,
  LETTER_WIDTH_PX,
} from "lib/constants";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "components/fonts/hooks";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";

export const Resume = () => {
  const store = useStore<RootState>();
  const [scale, setScale] = useState(0.8);
  const [previewResume, setPreviewResume] = useState(
    () => store.getState().resume
  );
  const [previewSettings, setPreviewSettings] = useState(
    () => store.getState().settings
  );
  const viewportRef = useRef<HTMLDivElement | null>(null);
  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(previewSettings.fontFamily);
  const usePdfViewer = true;

  useEffect(() => {
    const handleRefresh = () => {
      const state = store.getState();
      setPreviewResume(state.resume);
      setPreviewSettings(state.settings);
    };
    window.addEventListener("resume:refresh-preview", handleRefresh);
    return () => {
      window.removeEventListener("resume:refresh-preview", handleRefresh);
    };
  }, [store]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element || typeof window === "undefined") return;

    const getDocWidth = () =>
      previewSettings.documentSize === "A4" ? A4_WIDTH_PX : LETTER_WIDTH_PX;
    const getDocHeight = () =>
      previewSettings.documentSize === "A4" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;

    const computeScale = () => {
      const availableWidth = element.clientWidth;
      const availableHeight = element.clientHeight;
      const docWidth = getDocWidth();
      const docHeight = getDocHeight();
      if (
        availableWidth <= 0 ||
        availableHeight <= 0 ||
        docWidth <= 0 ||
        docHeight <= 0
      ) {
        return;
      }

      const widthScale = availableWidth / docWidth;
      const heightScale = availableHeight / docHeight;
      const nextScale = Math.max(
        0.35,
        Math.min(1, Math.round(Math.min(widthScale, heightScale) * 100) / 100)
      );
      setScale((prevScale) =>
        Math.abs(prevScale - nextScale) < 0.01 ? prevScale : nextScale
      );
    };

    computeScale();
    const observer = new ResizeObserver(computeScale);
    observer.observe(element);
    window.addEventListener("resize", computeScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", computeScale);
    };
  }, [previewSettings.documentSize]);

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <section
        ref={viewportRef}
        className="h-full w-full min-w-0 overflow-hidden"
      >
        <div className="flex h-full w-full items-start justify-end overflow-hidden">
        <ResumeIframeCSR
          documentSize={previewSettings.documentSize}
          scale={scale}
          enablePDFViewer={usePdfViewer}
        >
          <ResumePDF
            resume={previewResume}
              settings={previewSettings}
              isPDF={usePdfViewer}
            />
          </ResumeIframeCSR>
        </div>
      </section>
    </>
  );
};
