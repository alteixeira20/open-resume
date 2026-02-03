"use client";

import dynamic from "next/dynamic";

const ResumeDownloadBridgeClient = dynamic(
  () =>
    import("components/Resume/ResumeDownloadBridgeClient").then(
      (mod) => mod.ResumeDownloadBridgeClient
    ),
  { ssr: false }
);

export const ResumeDownloadBridge = () => <ResumeDownloadBridgeClient />;
