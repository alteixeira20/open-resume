import type { Resume } from "lib/redux/types";

const CVFORGE_EMBEDDED_RESUME_PREFIX = "CVFORGE_RESUME_V1:";

const toBase64 = (value: string) => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf-8").toString("base64");
  }

  const bytes = new TextEncoder().encode(value);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary);
};

const fromBase64 = (value: string) => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64").toString("utf-8");
  }

  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const buildEmbeddedResumeSubject = (resume: Resume) =>
  `${CVFORGE_EMBEDDED_RESUME_PREFIX}${toBase64(JSON.stringify(resume))}`;

export const parseEmbeddedResumeSubject = (
  subject: string | null | undefined
): Resume | null => {
  if (!subject?.startsWith(CVFORGE_EMBEDDED_RESUME_PREFIX)) {
    return null;
  }

  try {
    const encoded = subject.slice(CVFORGE_EMBEDDED_RESUME_PREFIX.length);
    const parsed = JSON.parse(fromBase64(encoded)) as Resume;
    if (!parsed?.profile || !Array.isArray(parsed.workExperiences)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

