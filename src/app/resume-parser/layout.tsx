import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Parsing Workbench",
  description:
    "Resume parser and ATS scoring workbench. Upload a PDF to see extracted fields, parsing diagnostics, and ATS-friendly formatting issues.",
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
  return children;
}
