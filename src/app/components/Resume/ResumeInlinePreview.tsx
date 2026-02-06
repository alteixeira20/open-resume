"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "components/fonts/hooks";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";
import type { RootState } from "lib/redux/store";
import { A4_WIDTH_PX, LETTER_WIDTH_PX } from "lib/constants";

export const ResumeInlinePreview = () => {
  const store = useStore<RootState>();
  const [previewResume, setPreviewResume] = useState(
    () => store.getState().resume
  );
  const [previewSettings, setPreviewSettings] = useState(
    () => store.getState().settings
  );
  const [scale, setScale] = useState(0.8);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(previewSettings.fontFamily);

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
    const element = containerRef.current;
    if (!element || typeof window === "undefined") return;

    const getDocWidth = () =>
      previewSettings.documentSize === "A4" ? A4_WIDTH_PX : LETTER_WIDTH_PX;

    const computeScale = () => {
      const styles = window.getComputedStyle(element);
      const paddingLeft = parseFloat(styles.paddingLeft || "0");
      const paddingRight = parseFloat(styles.paddingRight || "0");
      const availableWidth = element.clientWidth - paddingLeft - paddingRight;
      const docWidth = getDocWidth();
      if (availableWidth <= 0 || docWidth <= 0) return;
      const nextScale =
        Math.round(Math.min(availableWidth / docWidth, 1.5) * 100) / 100;
      setScale(Math.max(0.5, nextScale));
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
      <div ref={containerRef} className="w-full">
        <div className="flex justify-center">
          <ResumeIframeCSR
            documentSize={previewSettings.documentSize}
            scale={scale}
            enablePDFViewer
          >
            <ResumePDF
              resume={previewResume}
              settings={previewSettings}
              isPDF
            />
          </ResumeIframeCSR>
        </div>
      </div>
    </>
  );
};
