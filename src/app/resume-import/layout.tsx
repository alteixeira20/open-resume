import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Import Hub",
  description:
    "Start from scratch, continue where you left off, or import a PDF/JSON resume as a base for the builder. Local-first and private.",
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
