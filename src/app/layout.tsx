import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Analytics } from "@vercel/analytics/react";

const SITE_URL = "https://open-resume.alexandreteixeira.dev";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OpenResume — Free CV Builder (EU A4) + ATS Resume Checker",
    template: "%s | OpenResume",
  },
  description:
    "Open-source resume and CV builder plus ATS resume scoring and parsing. Build ATS-ready resumes, grade CVs locally, and export clean EU A4 or US Letter PDFs.",
  keywords: [
    "cv builder",
    "resume builder",
    "open source resume builder",
    "open source cv builder",
    "free resume builder open source",
    "free cv builder open source",
    "ats resume checker",
    "ats resume scoring",
    "ats scoring",
    "resume grader",
    "cv grader",
    "resume evaluator",
    "cv evaluator",
    "resume scoring tool",
    "cv scoring tool",
    "resume parser",
    "ats resume parser",
    "ats friendly resume builder",
    "ats ready resume",
    "resume analysis",
    "cv analysis",
    "resume audit",
    "cv audit",
    "resume optimizer",
    "cv optimizer",
    "resume formatting",
    "cv formatting",
    "resume builder pdf export",
    "resume json export",
    "resume import json",
    "resume import pdf",
    "local first resume builder",
    "privacy first resume builder",
    "no signup resume builder",
    "eu cv",
    "a4 resume",
    "letter resume",
    "europass alternative",
    "gdpr friendly",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "OpenResume — Free CV Builder (EU A4) + ATS Resume Checker",
    description:
      "Open-source resume and CV builder plus ATS resume scoring and parsing. Build ATS-ready resumes and grade CVs locally.",
    siteName: "OpenResume",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "OpenResume",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenResume — Free CV Builder (EU A4) + ATS Resume Checker",
    description:
      "Open-source resume and CV builder plus ATS resume scoring and parsing. Build ATS-ready resumes and grade CVs locally.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopNavBar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
