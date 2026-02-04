"use client";
import { useMemo, useState } from "react";
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
  const pdfDocument = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );
  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);
  const usePdfViewer = true;

  const handleDownloadJson = () => {
    if (typeof window === "undefined") return;
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      resume,
      settings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `open-resume-${dateStamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div className="relative flex justify-center md:justify-start">
        <div className="relative">
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] w-full min-w-0 overflow-auto md:p-[var(--resume-padding)]">
            <ResumeIframeCSR
              documentSize={settings.documentSize}
              scale={scale}
              enablePDFViewer={usePdfViewer}
              allowOverflow
            >
              <ResumePDF
                resume={resume}
                settings={settings}
                isPDF={usePdfViewer}
              />
            </ResumeIframeCSR>
          </section>
          <ResumeControlBarCSR
            scale={scale}
            setScale={setScale}
            documentSize={settings.documentSize}
            document={pdfDocument}
            fileName={resume.profile.name + " - Resume"}
            onDownloadJson={handleDownloadJson}
          />
        </div>
        <ResumeControlBarBorder />
      </div>
    </>
  );
};
