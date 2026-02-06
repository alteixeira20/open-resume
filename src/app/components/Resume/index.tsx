"use client";
import { useEffect, useState } from "react";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
import {
  ResumeControlBarCSR,
  ResumeControlBarBorder,
} from "components/Resume/ResumeControlBar";
import { useStore } from "react-redux";
import type { RootState } from "lib/redux/store";
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

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div className="relative flex justify-center md:justify-start">
        <div className="relative">
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] w-full min-w-0 overflow-auto md:p-[var(--resume-padding)]">
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
          </section>
          <ResumeControlBarCSR
            scale={scale}
            setScale={setScale}
            documentSize={previewSettings.documentSize}
          />
        </div>
        <ResumeControlBarBorder />
      </div>
    </>
  );
};
