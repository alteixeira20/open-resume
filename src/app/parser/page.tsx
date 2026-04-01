"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { analyzeResumePdf } from "lib/parse-resume-from-pdf/analyze-pdf";
import type { Lines, ResumeSectionToLines, TextItems } from "lib/parse-resume-from-pdf/types";
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
import { initialResumeState } from "lib/redux/resumeSlice";

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
  const [lines, setLines] = useState<Lines>([]);
  const [sections, setSections] = useState<ResumeSectionToLines>({});
  const [resume, setResume] = useState(initialResumeState);
  const [resumeSource, setResumeSource] = useState<"parsed" | "embedded">(
    "parsed"
  );
  const [parserRegion, setParserRegion] = useState<ResumeLocale>("eu");
  const [builderHandoffName, setBuilderHandoffName] = useState<string | null>(
    null
  );
  const { isCollapsed, showPreview, togglePreview } = useWorkbenchCollapse({
    documentSize: parserRegion === "eu" ? "A4" : "Letter",
  });
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const handoffObjectUrlRef = useRef<string | null>(null);
  const [previewScale, setPreviewScale] = useState(1);

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
    let cancelled = false;

    async function analyzeFile() {
      const analysis = await analyzeResumePdf(fileUrl);
      if (cancelled) return;
      setTextItems(analysis.textItems);
      setLines(analysis.lines);
      setSections(analysis.sections);
      setResume(analysis.resume);
      setResumeSource(analysis.source);
    }

    analyzeFile();

    return () => {
      cancelled = true;
    };
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
    const pageWidth = parserRegion === "eu" ? A4_WIDTH_PX : LETTER_WIDTH_PX;
    const pageHeight = parserRegion === "eu" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    const heightScale = height / pageHeight;
    const widthScale = width / pageWidth;
    setPreviewScale(Math.min(heightScale, widthScale, 1));
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
      <section>
        <WorkbenchHeader
          title="Parser Workbench"
          wrapperClassName="mb-0 min-h-0 gap-0.5"
          titleActions={
            <div className="flex items-center gap-2">
              {(["eu", "us"] as ResumeLocale[]).map((region) => (
                <button
                  key={region}
                  type="button"
                  className={`inline-flex items-center border transition-colors ${WORKBENCH_UI.header.compactActionClass} ${
                    parserRegion === region
                      ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)] text-white"
                      : "border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-brand-primary)]"
                  }`}
                  onClick={() => setParserRegion(region)}
                  aria-pressed={parserRegion === region}
                >
                  {region === "eu" ? "EU (A4)" : "US (Letter)"}
                </button>
              ))}
            </div>
          }
          description={
          builderHandoffName ? (
            <>
              <p>Evaluating the PDF generated from your current builder state.</p>
              <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                Source file: {builderHandoffName}
              </p>
            </>
          ) : (
            <>
              <p>
                Parse a PDF here. Check extracted fields, layout flags, and diagnostics.
              </p>
              {resumeSource === "embedded" && (
                <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                  CVForge metadata was detected, so structured fields are being read
                  directly from the exported document while ATS scoring still uses the
                  PDF text layer.
                </p>
              )}
            </>
          )
        }
        actions={
          isCollapsed ? (
            <Button
              variant="secondary"
              size="sm"
              className={WORKBENCH_UI.header.compactActionClass}
              onClick={togglePreview}
              aria-expanded={showPreview}
            >
              {showPreview ? "Hide preview" : "Show preview"}
            </Button>
          ) : undefined
        }
        />
      </section>
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

          <section id="examples" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
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
            <AtsScoreCard result={atsScore} />
            <section className="rounded-xl border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)]/85 p-4">
              <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                Parsed resume model
              </p>
              <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                {resumeSource === "embedded"
                  ? "This PDF includes CVForge metadata, so the structured model comes from the embedded export payload."
                  : "This is the structured data the parser reconstructed from the PDF text."}
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
                className="flex h-full w-full justify-end overflow-hidden"
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
