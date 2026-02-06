"use client";
import { useEffect, useRef, useState } from "react";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
import { useStore } from "react-redux";
import type { RootState } from "lib/redux/store";
import { A4_HEIGHT_PX, LETTER_HEIGHT_PX } from "lib/constants";
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
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
    const element = scrollContainerRef.current;
    if (!element || typeof window === "undefined") return;

    const getDocHeight = () =>
      previewSettings.documentSize === "A4" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;

    const computeMaxScale = () => {
      const styles = window.getComputedStyle(element);
      const paddingTop = parseFloat(styles.paddingTop || "0");
      const paddingBottom = parseFloat(styles.paddingBottom || "0");
      const availableHeight =
        element.clientHeight - paddingTop - paddingBottom - 1;
      const docHeight = getDocHeight();
      if (availableHeight <= 0 || docHeight <= 0) return;
      const nextScale = Math.max(
        0.5,
        Math.min(1, Math.round((availableHeight / docHeight) * 100) / 100)
      );
      setScale(nextScale);
    };

    computeMaxScale();
    const observer = new ResizeObserver(computeMaxScale);
    observer.observe(element);
    window.addEventListener("resize", computeMaxScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", computeMaxScale);
    };
  }, [previewSettings.documentSize]);

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div className="relative flex justify-center md:justify-start">
        <div className="relative">
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-20px)] w-full min-w-0 overflow-hidden pt-[24px]">
            <div
              ref={scrollContainerRef}
              className="flex h-full w-full justify-center overflow-hidden"
            >
              <ResumeIframeCSR
                documentSize={previewSettings.documentSize}
                scale={scale}
                enablePDFViewer={usePdfViewer}
                allowOverflow
              >
                <ResumePDF
                  resume={previewResume}
                  settings={previewSettings}
                  isPDF={usePdfViewer}
                />
              </ResumeIframeCSR>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
