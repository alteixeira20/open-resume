"use client";
import { useEffect, useState } from "react";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
import {
  ResumeControlBarCSR,
  ResumeControlBarBorder,
} from "components/Resume/ResumeControlBar";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "components/fonts/hooks";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";

export const Resume = () => {
  const [scale, setScale] = useState(0.8);
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const [previewResume, setPreviewResume] = useState(resume);
  const [previewSettings, setPreviewSettings] = useState(settings);
  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);
  const usePdfViewer = true;

  useEffect(() => {
    setPreviewResume(resume);
    setPreviewSettings(settings);
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      setPreviewResume(resume);
      setPreviewSettings(settings);
    };
    window.addEventListener("resume:refresh-preview", handleRefresh);
    return () => {
      window.removeEventListener("resume:refresh-preview", handleRefresh);
    };
  }, [resume, settings]);

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
