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
    "Free, open-source resume and CV builder with EU A4 and US Letter presets, ATS scoring, and local-first privacy. Build a professional CV, test ATS readability, and export a clean PDF.",
  keywords: [
    "cv builder",
    "resume builder",
    "ats resume checker",
    "ats scoring",
    "eu cv",
    "a4 resume",
    "europass alternative",
    "open source resume builder",
    "resume parser",
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
      "Free, open-source resume and CV builder with EU A4 and US Letter presets, ATS scoring, and local-first privacy.",
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
      "Free, open-source resume and CV builder with EU A4 and US Letter presets, ATS scoring, and local-first privacy.",
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
