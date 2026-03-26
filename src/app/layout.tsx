import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Analytics } from "@vercel/analytics/react";
import { SITE } from "content/site";

const SITE_URL = SITE.liveUrl;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/anvil_favicon.svg",
    shortcut: "/anvil_favicon.svg",
    apple: "/anvil_logo.png",
  },
  title: {
    default: "CVForge — CV Builder + ATS Parser | EU A4 + US Letter",
    template: "%s | CVForge",
  },
  description: SITE.description,
  keywords: [
    "cvforge",
    "cv forge",
    "cvforge resume builder",
    "cvforge cv builder",
    "free cv builder",
    "free resume builder",
    "open source cv builder",
    "open source resume builder",
    "cv builder online",
    "resume builder online",
    "cv builder no signup",
    "resume builder no signup",
    "ats cv checker",
    "ats resume checker",
    "ats score",
    "ats scoring",
    "ats resume scorer",
    "ats cv scorer",
    "ats resume grader",
    "ats cv grader",
    "ats resume evaluator",
    "ats cv evaluator",
    "resume parser diagnostics",
    "resume ats analysis",
    "cv ats analysis",
    "resume ats audit",
    "cv ats audit",
    "resume parser",
    "ats resume parser",
    "eu cv builder",
    "a4 cv builder",
    "a4 resume builder",
    "eu a4 cv",
    "cv builder europe",
    "europass alternative",
    "cv builder portugal",
    "cv builder uk",
    "cv builder ireland",
    "browser based resume builder",
    "browser based cv builder",
    "no account resume builder",
    "resume pdf export",
    "cv pdf export",
    "resume json export",
    "resume import pdf",
    "resume import json",
    "reactive resume alternative",
    "flowcv alternative",
    "resume io alternative free",
    "novoresume alternative free",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "CVForge — CV Builder + ATS Parser | EU A4 + US Letter",
    description: SITE.description,
    siteName: SITE.name,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "CVForge — CV Builder with Parser Diagnostics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CVForge — CV Builder + ATS Parser",
    description: SITE.description,
    images: ["/og-image.svg"],
  },
  robots: { index: true, follow: true },
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
