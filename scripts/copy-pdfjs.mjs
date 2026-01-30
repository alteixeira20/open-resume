import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const srcDir = path.join(repoRoot, "node_modules", "pdfjs-dist", "build");
const destDir = path.join(repoRoot, "public", "pdfjs");

await mkdir(destDir, { recursive: true });
await copyFile(path.join(srcDir, "pdf.mjs"), path.join(destDir, "pdf.mjs"));
await copyFile(
  path.join(srcDir, "pdf.worker.mjs"),
  path.join(destDir, "pdf.worker.mjs")
);
