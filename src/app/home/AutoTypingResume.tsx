"use client";
import { useEffect, useState, useRef } from "react";
import { ResumePDF } from "components/Resume/ResumePDF";
import { initialResumeState } from "lib/redux/resumeSlice";
import { initialSettings } from "lib/redux/settingsSlice";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { START_HOME_RESUME, END_HOME_RESUME } from "home/constants";
import { makeObjectCharIterator } from "lib/make-object-char-iterator";
import { deepClone } from "lib/deep-clone";
import { LETTER_HEIGHT_PX, LETTER_WIDTH_PX } from "lib/constants";

// countObjectChar(END_HOME_RESUME) -> ~1800 chars
const INTERVAL_MS = 50; // 20 Intervals Per Second
const CHARS_PER_INTERVAL = 10;
// Auto Typing Time:
//  10 CHARS_PER_INTERVAL -> ~1800 / (20*10) = 9s (let's go with 9s so it feels fast)
//  9 CHARS_PER_INTERVAL -> ~1800 / (20*9) = 10s
//  8 CHARS_PER_INTERVAL -> ~1800 / (20*8) = 11s

const RESET_INTERVAL_MS = 60 * 1000; // 60s

export const AutoTypingResume = () => {
  const [resume, setResume] = useState(deepClone(initialResumeState));
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
    const container = containerRef.current;
    if (!container) return;

    const heightPadding = 16;
    const updateScale = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      const widthScale = width / LETTER_WIDTH_PX;
      const heightScale = height / (LETTER_HEIGHT_PX + heightPadding);
      setScale(Math.min(widthScale, heightScale));
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
      <ResumeIframeCSR
        documentSize="Letter"
        scale={scale}
        frameClassName="bg-white"
        heightPadding={16}
      >
        <ResumePDF
          resume={resume}
          settings={{
            ...initialSettings,
            fontSize: "12",
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
  );
};
