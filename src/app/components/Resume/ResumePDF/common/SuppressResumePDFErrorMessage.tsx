"use client";

/**
 * Suppress ResumePDF development errors.
 * See ResumePDF doc string for context.
 */
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  const consoleError = console.error;
  const SUPPRESSED_WARNINGS = ["DOCUMENT", "PAGE", "TEXT", "VIEW"];
  console.error = function filterWarnings(msg, ...args) {
    const messages = [msg, ...args].filter(
      (value): value is string => typeof value === "string"
    );
    const shouldSuppress = SUPPRESSED_WARNINGS.some((entry) =>
      messages.some((value) => value.includes(entry))
    );

    if (!shouldSuppress) {
      consoleError(msg, ...args);
    }
  };
}

export const SuppressResumePDFErrorMessage = () => {
  return <></>;
};
