import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { calculateAtsScore } from "lib/ats-score";
import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import type { AtsScoreResult } from "lib/ats-score";

interface CliOptions {
  file?: string;
  job?: string;
  jobText?: string;
  json: boolean;
}

const parseArgs = (argv: string[]): CliOptions => {
  const options: CliOptions = { json: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "-f":
      case "--file":
        options.file = argv[++i];
        break;
      case "-j":
      case "--job":
        options.job = argv[++i];
        break;
      case "--job-text":
        options.jobText = argv[++i];
        break;
      case "--json":
        options.json = true;
        break;
      case "-h":
      case "--help":
        printUsage();
        process.exit(0);
        break;
      default:
        if (!arg.startsWith("-")) {
          options.file = arg;
        }
        break;
    }
  }

  return options;
};

const printUsage = () => {
  console.log(`Usage: npm run ats-score -- [--file resume.pdf] [--job jd.txt]
Options:
  -f, --file       Path to the resume PDF (required)
  -j, --job        Path to a job description text file (optional)
      --job-text   Inline job description string (optional)
      --json       Output raw JSON result
  -h, --help       Show this message`);
};

const readJobDescription = (options: CliOptions) => {
  if (options.jobText) {
    return options.jobText;
  }

  if (!options.job) {
    return undefined;
  }

  const jobPath = resolve(options.job);
  if (!existsSync(jobPath)) {
    throw new Error(`Job description file not found: ${options.job}`);
  }
  return readFileSync(jobPath, "utf8");
};

const prettify = (result: AtsScoreResult) => {
  const lines = [
    `ATS Score: ${result.score}`,
    `- Parsing: ${result.breakdown.parsing}/40`,
    `- Structure: ${result.breakdown.structure}/20`,
  ];

  if (typeof result.breakdown.keywords === "number") {
    lines.push(`- Keywords: ${result.breakdown.keywords}/30`);
  }

  lines.push(`- Readability: ${result.breakdown.readability}/10`);

  if (result.issues.length) {
    lines.push("Issues:");
    result.issues.forEach((issue) => lines.push(`  • ${issue}`));
  }

  return lines.join("\n");
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));

  if (!options.file) {
    printUsage();
    process.exit(1);
    return;
  }

  const resumePath = resolve(options.file);
  if (!existsSync(resumePath)) {
    console.error(`Resume file not found: ${options.file}`);
    process.exit(1);
    return;
  }

  try {
    const pdfBytes = new Uint8Array(readFileSync(resumePath));
    const textItems = await readPdf(pdfBytes);
    const lines = groupTextItemsIntoLines(textItems);
    const sections = groupLinesIntoSections(lines);
    const resume = extractResumeFromSections(sections);
    const jobDescription = readJobDescription(options);

    const result = calculateAtsScore({
      textItems,
      lines,
      sections,
      resume,
      jobDescription,
    });

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(prettify(result));
    }
  } catch (error) {
    console.error((error as Error).message || error);
    process.exit(1);
  }
};

main();
