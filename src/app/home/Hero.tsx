import Link from "next/link";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { AutoTypingResume } from "home/AutoTypingResume";

export const Hero = () => {
  return (
    <section className="mx-auto py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mt-4 grid w-full gap-10 md:mx-auto md:max-w-6xl md:grid-cols-2 md:items-stretch md:gap-8">
        <div className="flex h-full flex-col text-center md:text-left">
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
              <div className="rounded-lg border border-gray-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                ATS-friendly resume formatting with clean spacing and typography.
              </div>
              <div className="rounded-lg border border-gray-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                EU A4 and US Letter presets for regional CV and resume standards.
              </div>
              <div className="rounded-lg border border-gray-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                One-click PDF export, ready for recruiters and ATS systems.
              </div>
              <div className="rounded-lg border border-gray-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                Built-in ATS resume scoring system and resume parser.
              </div>
              <div className="rounded-lg border border-gray-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                JSON export and import for exact backups and seamless resume transfers.
              </div>
              <div className="rounded-lg border border-gray-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                Local-first parsing, ATS scoring, and typography controls keep data private and layouts consistent.
              </div>
            </div>
          <div className="mt-6 flex justify-center md:hidden">
            <div className="flex w-full max-w-[750px] items-center justify-center rounded-2xl bg-white px-6 py-7 shadow-sm">
              <AutoTypingResume />
            </div>
          </div>
        </div>
          <div className="hidden h-full md:flex">
            <div className="relative h-full w-full overflow-hidden px-6 py-7">
              <div className="absolute inset-0 flex items-start justify-center pt-3">
                <AutoTypingResume />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
