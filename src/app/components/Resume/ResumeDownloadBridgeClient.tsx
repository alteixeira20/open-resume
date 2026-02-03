"use client";

import { useEffect, useMemo } from "react";
import { usePDF } from "@react-pdf/renderer";
import { ResumePDF } from "components/Resume/ResumePDF";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";

export const ResumeDownloadBridgeClient = () => {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const pdfDocument = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );
  const [instance, update] = usePDF({ document: pdfDocument });

  useEffect(() => {
    update(pdfDocument);
  }, [update, pdfDocument]);

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

    const handleDownloadPdfEvent = () => {
      if (instance.url) {
        const link = window.document.createElement("a");
        link.href = instance.url;
        link.download = resume.profile.name + " - Resume";
        link.click();
      }
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
  }, [instance.url, resume, settings]);

  return null;
};
