"use client";
import { getHasUsedAppBefore } from "lib/redux/local-storage";
import { ResumeDropzone } from "components/ResumeDropzone";
import { useState, useEffect, Suspense } from "react";
import { Button, Card } from "components/ui";

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
      <Card className="mx-auto mt-14 max-w-4xl space-y-8 shadow-md" padding="lg">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            CV Import Hub
          </h1>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            Launch your CV builder workflow fast: start fresh or import a
            PDF/JSON to reuse your existing CV.
          </p>
        </div>

        <div className="grid gap-4 text-center md:grid-cols-2">
          {hasUsedAppBefore && (
            <OptionCard
              title="Continue where I left off"
              description="CV data is saved in this browser."
            >
              <Button href="/builder">Continue</Button>
            </OptionCard>
          )}
          <OptionCard
            title="Start from scratch"
            description="Begin with a clean CV and customize from the ground up."
          >
            <Button href="/builder">Create new</Button>
          </OptionCard>
        </div>

        <div className="rounded-xl border border-dashed border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-raised)] px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[color:var(--color-text-primary)]">
                Import a CV
              </h2>
              <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
                Parse a PDF to jumpstart your CV, or import a JSON export to
                restore both content and settings.
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
      </Card>
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
    <Card className="flex h-full flex-col items-center justify-between gap-4" padding="md">
      <div>
        <p className="text-base font-semibold text-[color:var(--color-text-primary)]">{title}</p>
        <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{description}</p>
      </div>
      {children}
    </Card>
  );
};
