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
  console.log(`Usage: npm run ats-score -- [--file resume.pdf]
Options:
  -f, --file   Path to the resume PDF (required)
      --json   Output raw JSON result
  -h, --help   Show this message`);
};

const prettify = (result: AtsScoreResult) => {
  const lines = [
    `Format Score: ${result.score}`,
    `- Parsing: ${result.breakdown.parsing}/60`,
    `- Structure: ${result.breakdown.structure}/25`,
    `- Readability: ${result.breakdown.readability}/15`,
  ];

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

    const result = calculateAtsScore({
      textItems,
      lines,
      sections,
      resume,
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
