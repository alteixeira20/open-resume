import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import or Start — CVForge",
  description:
    "Start a new CV from scratch, continue your last session, or import a PDF or JSON backup. Free, private, no sign-up.",
  keywords: [
    "resume import",
    "resume import pdf",
    "resume import json",
    "resume builder import",
    "resume backup",
    "resume json export",
    "resume pdf parser",
    "resume builder continue",
  ],
};

export default function ResumeImportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
