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
    "Free, open-source resume builder and CV builder with EU A4 + US Letter presets, ATS resume scoring system, resume parser, and local-first privacy.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

export default function Home() {
  const sectionDivider = <div className="my-8 h-px bg-gray-200/70" />;

  return (
    <main className="mx-auto max-w-screen-2xl bg-dot px-8 pb-32 text-gray-900 lg:px-12">
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
      {sectionDivider}
      <QuestionsAndAnswers />
      <Footer />
    </main>
  );
}
