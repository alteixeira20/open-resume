"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import { ResumeDropzone } from "components/ResumeDropzone";
import { cx } from "lib/cx";
import { Heading, Link, Paragraph } from "components/documentation";
import { ResumeTable } from "resume-parser/ResumeTable";
import { ResumeParserAlgorithmArticle } from "resume-parser/ResumeParserAlgorithmArticle";
import { calculateAtsScore } from "lib/ats-score";
import { AtsScoreCard } from "resume-parser/AtsScoreCard";
import type { ResumeLocale } from "lib/redux/settingsSlice";
import { A4_HEIGHT_PX, A4_WIDTH_PX, LETTER_HEIGHT_PX, LETTER_WIDTH_PX } from "lib/constants";

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
        Created with OpenResume resume builder -{" "}
        <Link href="/resume-builder">Link</Link>
      </span>
    ),
  },
];

const defaultFileUrl = RESUME_EXAMPLES[1]["fileUrl"];
const PARSER_REGION_STORAGE_KEY = "open-resume-parser-region";
const BUILDER_STATE_STORAGE_KEY = "open-resume-state";
export default function ResumeParser() {
  const [fileUrl, setFileUrl] = useState(defaultFileUrl);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const [parserRegion, setParserRegion] = useState<ResumeLocale>("eu");
  const [isSmallViewport, setIsSmallViewport] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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
    const stored = localStorage.getItem(PARSER_REGION_STORAGE_KEY);
    if (stored === "us" || stored === "eu") {
      setParserRegion(stored);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsSmallViewport(event.matches);
      if (!event.matches) {
        setShowPreview(false);
      }
    };
    handleChange(mediaQuery);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;
    const pageWidth = parserRegion === "eu" ? A4_WIDTH_PX : LETTER_WIDTH_PX;
    const pageHeight = parserRegion === "eu" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;

    const updateScale = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      const heightScale = height / pageHeight;
      setPreviewScale(Math.min(heightScale, 1));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    window.addEventListener("resize", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [parserRegion]);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(BUILDER_STATE_STORAGE_KEY);
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
  }, [parserRegion]);

  return (
    <main className="h-[calc(100vh-var(--top-nav-bar-height))] w-full overflow-hidden bg-gray-50">
      <div className="mx-auto grid h-full w-full max-w-screen-2xl gap-6 px-[var(--resume-padding)] py-4 md:grid-cols-6">
        <div className="col-span-3 space-y-6 overflow-y-auto pr-1">
          <section id="overview" className="space-y-2">
            <Heading className="text-primary !mt-0">
              Resume Parsing Workbench
            </Heading>
            <Paragraph>
              Select a parser region, try curated resumes, and upload your PDF to
              see which fields ATS systems can pick up.
            </Paragraph>
          </section>
          {isSmallViewport && (
            <section className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">Resume Preview</p>
                <button
                  type="button"
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowPreview((prev) => !prev)}
                  aria-expanded={showPreview}
                >
                  {showPreview ? "Hide preview" : "Show preview"}
                </button>
              </div>
              {showPreview && (
                <div
                  className="mt-3 flex max-h-[70vh] justify-center overflow-hidden"
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
              )}
            </section>
          )}

          <section id="region" className="rounded-md border border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold text-gray-900">Parser Region</p>
            <p className="text-xs text-gray-500">EU (A4) vs US (Letter) alters parsing expectations.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["eu", "us"] as ResumeLocale[]).map((region) => (
                <button
                  key={region}
                  type="button"
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                    parserRegion === region
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                  onClick={() => setParserRegion(region)}
                >
                  {region === "eu" ? "EU (A4)" : "US (Letter)"}
                </button>
              ))}
            </div>
          </section>

          <section id="examples" className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Resume Examples</p>
            <div className="flex flex-col gap-3">
              {RESUME_EXAMPLES.map((example, idx) => (
                <article
                  key={idx}
                  className={cx(
                    "rounded-md border px-4 py-3 shadow-sm outline-none",
                    example.fileUrl === fileUrl
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 bg-white"
                  )}
                  onClick={() => setFileUrl(example.fileUrl)}
                  onKeyDown={(e) => {
                    if (["Enter", " "].includes(e.key)) setFileUrl(example.fileUrl);
                  }}
                  tabIndex={0}
                >
                  <p className="font-semibold">Resume Example {idx + 1}</p>
                  <p className="mt-1 text-sm text-gray-500">{example.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="upload" className="rounded-md border border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold text-gray-900">Upload your resume</p>
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
              Resume Parsing Results
            </Heading>
            <AtsScoreCard result={atsScore} />
            <ResumeTable resume={resume} />
            <ResumeParserAlgorithmArticle
              textItems={textItems}
              lines={lines}
              sections={sections}
            />
          </section>

          <section id="about" className="rounded-md border border-dashed border-gray-200 bg-white p-3 text-sm text-gray-600">
            <p>
              OpenResume builds on the original project by Xitang Zhao and is currently maintained by Alexandre Teixeira. All parsing runs inside your browser for privacy.
            </p>
          </section>
        </div>

        <div className="col-span-3 hidden md:block">
          <div className="sticky top-[calc(var(--top-nav-bar-height)+0.5rem)] h-[calc(100vh-var(--top-nav-bar-height)-1rem)] w-full pb-2">
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
        </div>
      </div>
    </main>
  );
}
