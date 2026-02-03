import Link from "next/link";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { AutoTypingResume } from "home/AutoTypingResume";
import { Heading } from "components/documentation";

export const Hero = () => {
  return (
    <section className="mx-auto py-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <Heading className="!mt-0 !mb-3">
            Resume Builder
          </Heading>
        </div>
        <div className="mt-4 grid gap-10 md:grid-cols-[minmax(0,520px)_minmax(0,520px)] md:items-start md:gap-6">
        <div className="text-center md:text-left">
          <h1 className="mt-3 text-primary text-lg font-bold lg:text-xl">
            Build a professional resume or EU CV online
          </h1>
          <p className="mt-4 text-lg text-gray-700 lg:text-xl">
            Free, open-source resume builder with EU A4 + US Letter presets, ATS-friendly
            resume templates, and privacy-first local storage.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link href="/resume-import" className="btn-primary">
              Build Resume <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/resume-parser"
              className="rounded-full border border-gray-200 bg-white px-6 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50"
            >
              ATS Resume Scoring
            </Link>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            No sign up required · All data stays in your browser
          </p>
          <div className="mt-4 grid gap-3 text-left text-sm text-gray-600">
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              ATS-friendly resume formatting with clean spacing and typography.
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              EU A4 and US Letter presets for regional CV and resume standards.
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              One-click PDF export, ready for recruiters and ATS systems.
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              Built-in ATS resume scoring system and resume parser.
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              JSON export and import for exact backups and seamless resume transfers.
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              Local-first parsing, ATS scoring, and typography controls keep data private and layouts consistent.
            </div>
          </div>
          <div className="mt-6 flex justify-center md:hidden">
            <div className="w-full max-w-[520px] rounded-2xl bg-white px-6 py-7 shadow-sm">
              <AutoTypingResume />
            </div>
          </div>
        </div>
        <div className="hidden md:flex md:justify-center">
          <div className="w-full max-w-[520px] rounded-2xl bg-white px-6 py-7 shadow-sm">
            <AutoTypingResume />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
