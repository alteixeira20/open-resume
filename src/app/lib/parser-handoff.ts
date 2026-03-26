import type { ResumeLocale } from "lib/redux/settingsSlice";

export const BUILDER_TO_PARSER_HANDOFF_KEY = "cvforge-parser-handoff";
export const BUILDER_TO_PARSER_QUERY = "source=builder";
const MAX_HANDOFF_AGE_MS = 30 * 60 * 1000;

export interface BuilderParserHandoffPayload {
  source: "builder";
  createdAt: string;
  fileName: string;
  dataUrl: string;
  resumeLocale?: ResumeLocale;
}

const isClient = () => typeof window !== "undefined";

export const writeBuilderParserHandoff = (
  payload: BuilderParserHandoffPayload
) => {
  if (!isClient()) return;
  window.sessionStorage.setItem(
    BUILDER_TO_PARSER_HANDOFF_KEY,
    JSON.stringify(payload)
  );
};

export const readBuilderParserHandoff = () => {
  if (!isClient()) return null;

  const raw = window.sessionStorage.getItem(BUILDER_TO_PARSER_HANDOFF_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as BuilderParserHandoffPayload;
    if (
      parsed?.source !== "builder" ||
      typeof parsed?.dataUrl !== "string" ||
      typeof parsed?.fileName !== "string" ||
      typeof parsed?.createdAt !== "string"
    ) {
      return null;
    }

    const createdAt = Date.parse(parsed.createdAt);
    if (!Number.isFinite(createdAt)) return null;
    if (Date.now() - createdAt > MAX_HANDOFF_AGE_MS) return null;

    return parsed;
  } catch {
    return null;
  }
};

export const clearBuilderParserHandoff = () => {
  if (!isClient()) return;
  window.sessionStorage.removeItem(BUILDER_TO_PARSER_HANDOFF_KEY);
};

export const isBuilderParserArrival = (search: string) =>
  new URLSearchParams(search).get("source") === "builder";

export const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert blob to data URL."));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read blob."));
    reader.readAsDataURL(blob);
  });

export const dataUrlToObjectUrl = async (dataUrl: string) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
