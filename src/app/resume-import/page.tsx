"use client";
import { getHasUsedAppBefore } from "lib/redux/local-storage";
import { ResumeDropzone } from "components/ResumeDropzone";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

const ResumeImportBody = () => {
  const [hasUsedAppBefore, setHasUsedAppBefore] = useState(false);
  const autoOpen =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("autoOpen") === "1";

  useEffect(() => {
    setHasUsedAppBefore(getHasUsedAppBefore());
  }, []);

  return (
    <main>
      <div className="mx-auto mt-14 max-w-4xl space-y-8 rounded-md border border-gray-200 bg-white px-8 py-10 shadow-md">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Resume Import Hub
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Launch your resume builder workflow fast: start fresh or import a
            PDF/JSON to reuse your existing resume.
          </p>
        </div>

        <div className="grid gap-4 text-center md:grid-cols-2">
          {hasUsedAppBefore && (
            <OptionCard
              title="Continue where I left off"
              description="Resume data is saved in this browser."
            >
              <Link
                href="/resume-builder"
                className="rounded-full bg-sky-600 px-6 pb-2 pt-1.5 text-sm font-semibold text-white hover:bg-sky-500"
              >
                Continue
              </Link>
            </OptionCard>
          )}
          <OptionCard
            title="Start from scratch"
            description="Begin with a clean resume and customize from the ground up."
          >
            <Link
              href="/resume-builder"
              className="rounded-full bg-gray-900 px-6 pb-2 pt-1.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Create new
            </Link>
          </OptionCard>
        </div>

        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Import a resume
              </h2>
              <p className="mt-1 text-xs text-gray-600">
                Parse a PDF to jumpstart your resume, or import a JSON export for
                a perfect 1:1 restore.
              </p>
            </div>
          </div>
          <ResumeDropzone
            onFileUrlChange={() => {}}
            className="mt-5"
            autoOpen={autoOpen}
            allowJsonImport={true}
          />
        </div>
      </div>
    </main>
  );
};

export default function ImportResume() {
  return (
    <Suspense fallback={null}>
      <ResumeImportBody />
    </Suspense>
  );
}

const OptionCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-6 py-6 shadow-sm">
      <div>
        <p className="text-base font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-xs text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  );
};
