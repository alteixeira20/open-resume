"use client";

import { useEffect, useMemo } from "react";
import { pdf } from "@react-pdf/renderer";
import { ResumePDF } from "components/Resume/ResumePDF";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "components/fonts/hooks";

export const ResumeDownloadBridgeClient = () => {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const pdfDocument = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );
  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);
  useEffect(() => {
    const handleDownloadJsonEvent = () => {
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

    const handleDownloadPdfEvent = async () => {
      const blob = await pdf(pdfDocument).toBlob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = resume.profile.name + " - Resume";
      link.click();
      URL.revokeObjectURL(url);
    };

    window.addEventListener("resume:download-json", handleDownloadJsonEvent);
    window.addEventListener("resume:download-pdf", handleDownloadPdfEvent);
    return () => {
      window.removeEventListener(
        "resume:download-json",
        handleDownloadJsonEvent
      );
      window.removeEventListener(
        "resume:download-pdf",
        handleDownloadPdfEvent
      );
    };
  }, [pdfDocument, resume, settings]);

  return null;
};
