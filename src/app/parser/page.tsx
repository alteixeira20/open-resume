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
import { Link } from "components/documentation";
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
import {
  clearBuilderParserHandoff,
  dataUrlToObjectUrl,
  isBuilderParserArrival,
  readBuilderParserHandoff,
} from "lib/parser-handoff";

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
  const [builderHandoffName, setBuilderHandoffName] = useState<string | null>(
    null
  );
  const { isCollapsed, showPreview, togglePreview } = useWorkbenchCollapse();
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const handoffObjectUrlRef = useRef<string | null>(null);
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
    if (typeof window === "undefined") return;

    let cancelled = false;

    const loadBuilderHandoff = async () => {
      if (!isBuilderParserArrival(window.location.search)) return;

      const handoff = readBuilderParserHandoff();
      if (!handoff) return;

      try {
        const objectUrl = await dataUrlToObjectUrl(handoff.dataUrl);
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        if (handoffObjectUrlRef.current) {
          URL.revokeObjectURL(handoffObjectUrlRef.current);
        }

        handoffObjectUrlRef.current = objectUrl;
        setFileUrl(objectUrl);
        setBuilderHandoffName(handoff.fileName);
        if (handoff.resumeLocale === "eu" || handoff.resumeLocale === "us") {
          setParserRegion(handoff.resumeLocale);
        }
      } catch {
        clearBuilderParserHandoff();
      }
    };

    loadBuilderHandoff();

    return () => {
      cancelled = true;
    };
  }, []);

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

  useEffect(() => {
    return () => {
      if (handoffObjectUrlRef.current) {
        URL.revokeObjectURL(handoffObjectUrlRef.current);
        handoffObjectUrlRef.current = null;
      }
    };
  }, []);

  const clearBuilderHandoffContext = () => {
    clearBuilderParserHandoff();
    setBuilderHandoffName(null);
    if (handoffObjectUrlRef.current) {
      URL.revokeObjectURL(handoffObjectUrlRef.current);
      handoffObjectUrlRef.current = null;
    }
  };

  const handleExampleSelect = (url: string) => {
    clearBuilderHandoffContext();
    setFileUrl(url);
  };

  const handleUploadedFileUrlChange = (url: string | undefined) => {
    clearBuilderHandoffContext();
    setFileUrl(url || defaultFileUrl);
  };

  const workbenchContent = (
    <div className={WORKBENCH_UI.contentStackClass}>
      <WorkbenchHeader
        title="Parser Workbench"
        description={
          builderHandoffName ? (
            <>
              <p>Evaluating the PDF generated from your current builder state.</p>
              <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                Source file: {builderHandoffName}
              </p>
            </>
          ) : (
            "Upload a PDF to see what a text parser extracts from it. Check field detection, layout flags, and parsing diagnostics."
          )
        }
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
                  onKeyDown={(e) => {
                    if (["Enter", " "].includes(e.key))
                      handleExampleSelect(example.fileUrl);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Use CV example ${idx + 1}`}
                  onClick={() => handleExampleSelect(example.fileUrl)}
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
            <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
              Drop a PDF to see how the parser interprets its structure. Everything happens locally in your browser.
            </p>
            <div className="mt-3">
              <ResumeDropzone
                onFileUrlChange={handleUploadedFileUrlChange}
                playgroundView={true}
              />
            </div>
          </section>

          <section id="results" className="space-y-4">
            <div className="rounded-xl border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)]/75 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                Parser results
              </p>
              <h2 className="mt-1 text-lg font-black text-[color:var(--color-text-primary)]">
                What the parser extracted from this PDF
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                Start with the score, then inspect the parsed resume model and the parser snapshot below.
              </p>
            </div>
            <AtsScoreCard result={atsScore} />
            <section className="rounded-xl border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)]/85 p-4">
              <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                Parsed resume model
              </p>
              <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                This is the structured data the parser reconstructed from the PDF text.
              </p>
              <div className="mt-3 overflow-x-auto">
                <ResumeTable resume={resume} />
              </div>
            </section>
            <ResumeParserAlgorithmArticle
              textItems={textItems}
              lines={lines}
              sections={sections}
            />
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
