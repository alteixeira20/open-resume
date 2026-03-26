import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Builder — CVForge",
  description:
    "Build a CV or resume in the browser with EU A4 and US Letter presets, typography controls, and PDF / JSON export.",
  keywords: [
    "resume builder",
    "cv builder",
    "resume builder eu a4",
    "resume builder letter",
    "open source resume builder",
    "open source cv builder",
    "resume builder pdf export",
    "resume json export",
    "resume import json",
    "resume import pdf",
    "browser based resume builder",
    "browser based cv builder",
  ],
};

export default function ResumeBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-[calc(100dvh-var(--top-nav-bar-height))] overflow-hidden">{children}</div>;
}
