import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Builder Workbench",
  description:
    "Build an ATS-friendly resume or EU CV online. Local-first resume builder with EU A4 + US Letter presets, typography controls, and PDF/JSON export.",
  keywords: [
    "resume builder",
    "cv builder",
    "ats friendly resume builder",
    "ats ready resume",
    "resume builder eu a4",
    "resume builder letter",
    "open source resume builder",
    "open source cv builder",
    "resume builder pdf export",
    "resume json export",
    "resume import json",
    "resume import pdf",
    "privacy first resume builder",
    "local first resume builder",
  ],
};

export default function ResumeBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
