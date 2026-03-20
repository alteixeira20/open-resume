import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parser Workbench — CVForge",
  description:
    "Parse a CV or resume PDF in the browser and inspect local ATS scoring across parsing, structure, readability, and optional keyword alignment.",
  keywords: [
    "resume parser",
    "ats resume parser",
    "ats resume checker",
    "ats resume scoring",
    "resume grader",
    "cv grader",
    "resume evaluator",
    "cv evaluator",
    "resume scoring tool",
    "cv scoring tool",
    "resume analysis",
    "cv analysis",
    "resume audit",
    "cv audit",
    "ats friendly resume",
    "pdf resume parser",
    "resume parsing tool",
  ],
};

export default function ResumeParserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-[calc(100dvh-var(--top-nav-bar-height))] overflow-hidden">{children}</div>;
}
