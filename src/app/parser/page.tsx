"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import { ResumeDropzone } from "components/ResumeDropzone";
import { WorkbenchHeader } from "components/layout/WorkbenchHeader";
import { cx } from "lib/cx";
import { Heading, Link, Paragraph } from "components/documentation";
import { Button } from "components/ui";
import { WorkbenchLayout } from "components/layout/WorkbenchLayout";
import { ResumeTable } from "parser/ResumeTable";
import { ResumeParserAlgorithmArticle } from "parser/ResumeParserAlgorithmArticle";
import { calculateAtsScore } from "lib/ats-score";
import { AtsScoreCard } from "parser/AtsScoreCard";
import type { ResumeLocale } from "lib/redux/settingsSlice";
import { A4_HEIGHT_PX, A4_WIDTH_PX, LETTER_HEIGHT_PX, LETTER_WIDTH_PX } from "lib/constants";
import { useWorkbenchCollapse } from "lib/hooks/useWorkbenchCollapse";
import { WORKBENCH_UI } from "components/layout/workbench-ui";

const RESUME_EXAMPLES = [
  {
    fileUrl: "/resume-example/laverne-resume.pdf",
    description: (
      <span>
        Borrowed from University of La Verne Career Center -{" "}
        <Link href="https://laverne.edu/careers/wp-content/uploads/sites/15/2010/12/Undergraduate-Student-Resume-Examples.pdf">
          Link
        </Link>
      </span>
    ),
  },
  {
    fileUrl: "/resume-example/openresume-resume.pdf",
    description: (
      <span>
        Created with CVForge builder - <Link href="/builder">Link</Link>
      </span>
    ),
  },
];

const defaultFileUrl = RESUME_EXAMPLES[1]["fileUrl"];
const PARSER_REGION_STORAGE_KEY = "cvforge-parser-region";
const LEGACY_PARSER_REGION_STORAGE_KEY = "open-resume-parser-region";
const BUILDER_STATE_STORAGE_KEY = "cvforge-state";
const LEGACY_BUILDER_STATE_STORAGE_KEY = "open-resume-state";
export default function ResumeParser() {
  const [fileUrl, setFileUrl] = useState(defaultFileUrl);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const [parserRegion, setParserRegion] = useState<ResumeLocale>("eu");
  const { isCollapsed, showPreview, togglePreview } = useWorkbenchCollapse();
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);

  const lines = useMemo(
    () => groupTextItemsIntoLines(textItems || []),
    [textItems]
  );

  const sections = useMemo(() => groupLinesIntoSections(lines), [lines]);
  const resume = useMemo(
    () => extractResumeFromSections(sections),
    [sections]
  );

  const atsScore = useMemo(() => {
    if (!textItems.length) {
      return null;
    }
    return calculateAtsScore({
      textItems,
      lines,
      sections,
      resume,
      locale: parserRegion,
    });
  }, [textItems, lines, sections, resume, parserRegion]);

  useEffect(() => {
    async function test() {
      const textItems = await readPdf(fileUrl);
      setTextItems(textItems);
    }
    test();
  }, [fileUrl]);

  useEffect(() => {
    const stored =
      localStorage.getItem(PARSER_REGION_STORAGE_KEY) ??
      localStorage.getItem(LEGACY_PARSER_REGION_STORAGE_KEY);
    if (stored === "us" || stored === "eu") {
      setParserRegion(stored);
    }
  }, []);

  const updatePreviewScale = useCallback(() => {
    const container = previewContainerRef.current;
    if (!container) return;
    const pageHeight = parserRegion === "eu" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;
    const height = container.clientHeight;
    if (!height) return;
    const heightScale = height / pageHeight;
    setPreviewScale(Math.min(heightScale, 1));
  }, [parserRegion]);

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    updatePreviewScale();
    const observer = new ResizeObserver(updatePreviewScale);
    observer.observe(container);
    window.addEventListener("resize", updatePreviewScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePreviewScale);
    };
  }, [updatePreviewScale]);

  useEffect(() => {
    updatePreviewScale();
  }, [isCollapsed, updatePreviewScale]);

  useEffect(() => {
    try {
      const storedState =
        localStorage.getItem(BUILDER_STATE_STORAGE_KEY) ??
        localStorage.getItem(LEGACY_BUILDER_STATE_STORAGE_KEY);
      if (!storedState) return;
      const parsed = JSON.parse(storedState) as {
        settings?: { resumeLocale?: ResumeLocale };
      };
      const locale = parsed?.settings?.resumeLocale;
      if (locale === "us" || locale === "eu") {
        setParserRegion(locale);
      }
    } catch {
      // ignore localStorage parse errors
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PARSER_REGION_STORAGE_KEY, parserRegion);
    localStorage.removeItem(LEGACY_PARSER_REGION_STORAGE_KEY);
  }, [parserRegion]);

  const workbenchContent = (
    <div className={WORKBENCH_UI.contentStackClass}>
      <WorkbenchHeader
        title="Parser Workbench"
        description="Upload a PDF to see what a text parser extracts from it. Check field detection, layout flags, and parsing diagnostics."
        actions={
          isCollapsed ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={togglePreview}
              aria-expanded={showPreview}
            >
              {showPreview ? "Hide preview" : "Show preview"}
            </Button>
          ) : undefined
        }
      />
          {isCollapsed && showPreview && (
            <section className="mt-3">
              <div
                className="flex max-h-[70vh] justify-center overflow-auto"
                ref={previewContainerRef}
              >
                <div
                  style={{
                    width:
                      (parserRegion === "eu" ? A4_WIDTH_PX : LETTER_WIDTH_PX) *
                      previewScale,
                    height:
                      (parserRegion === "eu" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX) *
                      previewScale,
                  }}
                  className="bg-white shadow-lg"
                >
                  <iframe
                    src={`${fileUrl}#navpanes=0&zoom=100`}
                    className="h-full w-full"
                    style={{ border: "none" }}
                  />
                </div>
              </div>
            </section>
          )}

          <section
            id="region"
            className="rounded-xl border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)] p-4"
          >
            <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">
              Parser Region
            </p>
            <p className="text-xs text-[color:var(--color-text-muted)]">
              EU (A4) vs US (Letter) alters parsing expectations.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["eu", "us"] as ResumeLocale[]).map((region) => (
                <button
                  key={region}
                  type="button"
                  className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors ${
                    parserRegion === region
                      ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)] text-white"
                      : "border-[color:var(--color-surface-border)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-brand-primary)]"
                  }`}
                  onClick={() => setParserRegion(region)}
                >
                  {region === "eu" ? "EU (A4)" : "US (Letter)"}
                </button>
              ))}
            </div>
          </section>

          <section id="examples" className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
              CV Examples
            </p>
            <div className="flex flex-col gap-3">
              {RESUME_EXAMPLES.map((example, idx) => (
                <article
                  key={idx}
                  className={cx(
                    "rounded-xl border px-4 py-3 shadow-sm outline-none transition-colors",
                    example.fileUrl === fileUrl
                      ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-forge-100)]"
                      : "border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)]"
                  )}
                  onClick={() => setFileUrl(example.fileUrl)}
                  onKeyDown={(e) => {
                    if (["Enter", " "].includes(e.key)) setFileUrl(example.fileUrl);
                  }}
                  tabIndex={0}
                >
                  <p className="font-semibold text-[color:var(--color-text-primary)]">
                    CV Example {idx + 1}
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                    {example.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="upload"
            className="rounded-xl border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)] p-4"
          >
            <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">
              Upload your CV
            </p>
            <Paragraph smallMarginTop={true}>
              Drop a PDF to see how the parser interprets its structure. Everything happens locally in your browser.
            </Paragraph>
            <div className="mt-3">
              <ResumeDropzone
                onFileUrlChange={(url) => setFileUrl(url || defaultFileUrl)}
                playgroundView={true}
              />
            </div>
          </section>

          <section id="results" className="space-y-4">
            <Heading level={2} className="!mt-0">
              CV Parsing Results
            </Heading>
            <AtsScoreCard result={atsScore} />
            <ResumeTable resume={resume} />
            <ResumeParserAlgorithmArticle
              textItems={textItems}
              lines={lines}
              sections={sections}
            />
          </section>

          <section className="rounded-xl border border-dashed border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)] p-3 text-sm text-[color:var(--color-text-muted)]">
            <p>
              CVForge is built on{" "}
              <a
                href="https://github.com/xitanggg/open-resume"
                className="underline underline-offset-2 transition-colors hover:text-[color:var(--color-brand-primary)]"
              >
                OpenResume
              </a>{" "}
              by Xitang Zhao and maintained by{" "}
              <a
                href="https://github.com/alteixeira20"
                className="underline underline-offset-2 transition-colors hover:text-[color:var(--color-brand-primary)]"
              >
                Alexandre Teixeira
              </a>
              . All parsing and ATS scoring run locally in your browser.
            </p>
          </section>
    </div>
  );

  const previewContent = (
    <div className="sticky top-0 h-full w-full pb-2">
              <div
                ref={previewContainerRef}
                className="flex h-full w-full justify-center overflow-hidden"
              >
                <div
                  style={{
                    width:
                      (parserRegion === "eu" ? A4_WIDTH_PX : LETTER_WIDTH_PX) *
                      previewScale,
                    height:
                      (parserRegion === "eu" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX) *
                      previewScale,
                  }}
                  className="bg-white shadow-lg"
                >
                  <iframe
                    src={`${fileUrl}#navpanes=0&zoom=100`}
                    className="h-full w-full"
                    style={{ border: "none" }}
                  />
                </div>
              </div>
    </div>
  );

  return (
    <WorkbenchLayout
      workbench={workbenchContent}
      preview={previewContent}
      isCollapsed={isCollapsed}
    />
  );
}
