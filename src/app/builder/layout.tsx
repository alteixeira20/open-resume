import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Builder — CVForge",
  description:
    "Build an ATS-friendly CV or resume online. EU A4 and US Letter presets, typography controls, and one-click PDF export. Free and private.",
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
  return <div className="h-[calc(100dvh-var(--top-nav-bar-height))] overflow-hidden">{children}</div>;
}
