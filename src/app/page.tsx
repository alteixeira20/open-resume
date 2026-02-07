import { Hero } from "home/Hero";
import { Steps } from "home/Steps";
import { Features } from "home/Features";
import { QuestionsAndAnswers } from "home/QuestionsAndAnswers";
import { ForkHighlights } from "home/ForkHighlights";
import { EvaluatorShowcase } from "home/EvaluatorShowcase";
import { Footer } from "home/Footer";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OpenResume",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://open-resume.alexandreteixeira.dev",
  description:
    "Open-source resume builder and CV evaluator with EU A4 + US Letter presets, ATS resume scoring, resume parser, and local-first privacy.",
  keywords:
    "resume builder, cv builder, ats resume checker, ats resume scoring, resume grader, cv grader, resume evaluator, cv evaluator, resume parser, ats resume parser, open source resume builder, open source cv builder, resume builder pdf export, resume import json, resume import pdf",
  featureList: [
    "ATS-ready resume builder with EU A4 + US Letter presets",
    "Local ATS scoring and parsing diagnostics",
    "PDF export and JSON backup",
    "Local-first privacy with no sign-up",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

export default function Home() {
  const sectionDivider = <div className="my-8 h-px bg-gray-200/70" />;

  return (
    <main className="mx-auto max-w-screen-2xl bg-dot px-8 pb-4 text-gray-900 lg:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="pt-6">
        <Steps />
      </div>
      <Hero />
      {sectionDivider}
      <EvaluatorShowcase />
      {sectionDivider}
      <ForkHighlights />
      {sectionDivider}
      <Features />
      <QuestionsAndAnswers />
      <Footer />
    </main>
  );
}
