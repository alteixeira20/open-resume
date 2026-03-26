import { Hero } from "home/Hero";
import { Steps } from "home/Steps";
import { QuestionsAndAnswers } from "home/QuestionsAndAnswers";
import { ForkHighlights } from "home/ForkHighlights";
import { EvaluatorShowcase } from "home/EvaluatorShowcase";
import { Footer } from "home/Footer";
import { SITE } from "content/site";
import { SectionDivider } from "components/layout/SectionDivider";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CVForge",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE.liveUrl,
  description: SITE.description,
  featureList: [
    "Local parser diagnostics and ATS-style scoring in the browser",
    "EU A4 and US Letter presets",
    "Single-column resume template",
    "No sign-up required",
    "PDF export and JSON backup",
    "Resume parser with field extraction transparency",
    "Typography controls: body size, name size, spacing, line height",
    "GitHub, project links, and languages fields",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  author: {
    "@type": "Person",
    name: "Alexandre Teixeira",
    url: SITE.author.github,
  },
  isBasedOn: {
    "@type": "SoftwareApplication",
    name: "OpenResume",
    author: {
      "@type": "Person",
      name: "Xitang Zhao",
      url: SITE.original.github,
    },
  },
};

export default function Home() {
  return (
    <main className="mx-auto max-w-screen-xl px-8 pb-4 text-gray-900 lg:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <SectionDivider />
      <Steps />
      <SectionDivider />
      <EvaluatorShowcase />
      <SectionDivider />
      <ForkHighlights />
      <SectionDivider />
      <QuestionsAndAnswers />
      <SectionDivider />
      <Footer />
    </main>
  );
}
