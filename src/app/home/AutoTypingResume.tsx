"use client";
import { useEffect, useState, useRef } from "react";
import { ResumePDF } from "components/Resume/ResumePDF";
import { initialResumeState } from "lib/redux/resumeSlice";
import { initialSettings } from "lib/redux/settingsSlice";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { START_HOME_RESUME, END_HOME_RESUME } from "home/constants";
import { makeObjectCharIterator } from "lib/make-object-char-iterator";
import { deepClone } from "lib/deep-clone";
import { LETTER_WIDTH_PX } from "lib/constants";

// countObjectChar(END_HOME_RESUME) -> ~1800 chars
const INTERVAL_MS = 40; // 25 Intervals Per Second
const CHARS_PER_INTERVAL = 9;
// Auto Typing Time:
//  9 CHARS_PER_INTERVAL @ 25 FPS -> ~1800 / (25*9) = 8s
//  8 CHARS_PER_INTERVAL @ 25 FPS -> ~1800 / (25*8) = 9s
//  7 CHARS_PER_INTERVAL @ 25 FPS -> ~1800 / (25*7) = 10s

const RESET_INTERVAL_MS = 60 * 1000; // 60s

export const AutoTypingResume = () => {
  const [resume, setResume] = useState(deepClone(initialResumeState));
  const [themeColor, setThemeColor] = useState("var(--color-brand-accent)");
  const resumeCharIterator = useRef(
    makeObjectCharIterator(START_HOME_RESUME, END_HOME_RESUME)
  );
  const hasSetEndResume = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let next = resumeCharIterator.current.next();
      for (let i = 0; i < CHARS_PER_INTERVAL - 1; i++) {
        next = resumeCharIterator.current.next();
      }
      if (!next.done) {
        setResume(next.value);
      } else {
        // Sometimes the iterator doesn't end on the last char,
        // so we manually set its end state here
        if (!hasSetEndResume.current) {
          setResume(END_HOME_RESUME);
          hasSetEndResume.current = true;
        }
      }
    }, INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      resumeCharIterator.current = makeObjectCharIterator(
        START_HOME_RESUME,
        END_HOME_RESUME
      );
      hasSetEndResume.current = false;
    }, RESET_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const moltenColor = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--color-brand-accent")
      .trim();
    if (moltenColor) {
      setThemeColor(moltenColor);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const width = container.clientWidth;
      if (!width) return;
      const widthScale = width / LETTER_WIDTH_PX;
      setScale(widthScale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    window.addEventListener("resize", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <div className="mx-auto flex w-fit max-w-full justify-center">
        <ResumeIframeCSR
          documentSize="Letter"
          scale={scale}
          frameClassName="bg-white shadow-[0_16px_34px_-24px_rgba(18,13,10,0.75)]"
          heightPadding={16}
        >
          <ResumePDF
            resume={resume}
            settings={{
              ...initialSettings,
              themeColor,
              fontSize: "11",
              lineHeight: "1.35",
              sectionSpacing: "0.85",
              nameFontSize: "19",
              formToHeading: {
                workExperiences: resume.workExperiences[0].company
                  ? "WORK EXPERIENCE"
                  : "",
                educations: resume.educations[0].school ? "EDUCATION" : "",
                projects: resume.projects[0].project ? "PROJECT" : "",
                skills: resume.skills.descriptions.length ? "SKILLS" : "",
                languages: resume.languages[0].language ? "LANGUAGES" : "",
                custom: "CUSTOM SECTION",
              },
            }}
          />
        </ResumeIframeCSR>
      </div>
    </div>
  );
};
