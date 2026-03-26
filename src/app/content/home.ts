export const HOME_HERO = {
  eyebrow: "Free CV and resume builder — no account needed",
  headline: "",
  headlineAccent: "Forge your career.",
  description:
    "Build a clean CV or resume, export it as PDF, and check how a parser reads it. Editing, parsing, and ATS-style scoring happen in the browser. No sign-up required.",
  primaryCta: {
    label: "Build my CV",
    href: "/builder",
  },
  secondaryCta: {
    label: "Check ATS Score",
    href: "/parser",
  },
  previewToggle: {
    show: "Preview Example",
    hide: "Hide Example",
  },
  privacyNote:
    "No account · Browser-based editing and parsing · MIT licensed",
} as const;

export const HOME_STEPS = {
  title: "How it works",
  items: [
    {
      title: "Start or import",
      text: "New CV, continue editing, or import a PDF/JSON",
      href: "/builder",
    },
    {
      title: "Build and preview",
      text: "Edit sections, tune layout, and refresh the PDF preview",
      href: "/builder",
    },
    {
      title: "Export and check",
      text: "Download PDF, then run the parser workbench",
      href: "/parser",
    },
  ],
} as const;

export const HOME_HIGHLIGHTS = {
  title: "What CVForge actually does",
  subtitle:
    "Build a CV, export a clean PDF, and verify how a parser actually reads it. No accounts, no paywall, no black-box scoring.",
  items: [
    {
      title: "Parser-friendly layout",
      bullets: [
        "Keeps the document single-column, readable, and easy to extract as text.",
        "Reduces friction with ATS parsing by avoiding fragile multi-column formatting.",
        "Produces a resume PDF that is easier for recruiters and applicant tracking systems to scan.",
      ],
    },
    {
      title: "Builder and parser in one workflow",
      bullets: [
        "Write the CV in the builder, export the PDF, then run it through the parser workbench.",
        "See what was actually extracted, flagged, and scored instead of guessing how the document reads.",
        "Use the parser feedback loop to improve the same CV you just built.",
      ],
    },
    {
      title: "Local by default",
      bullets: [
        "The builder, parser, and ATS scoring run in the browser.",
        "Your CV is not uploaded to a backend just to generate feedback.",
        "No account, no hidden storage, and no unnecessary data transfer.",
      ],
    },
    {
      title: "EU A4 and US Letter",
      bullets: [
        "Switch between A4 and Letter without rebuilding the document.",
        "Page size, margins, and format expectations follow the selected region.",
        "Useful for EU CVs, US resumes, and anyone applying across multiple markets.",
      ],
    },
    {
      title: "PDF and JSON import/export",
      bullets: [
        "Export a clean PDF for job applications and save a JSON backup of the full CV state.",
        "Import JSON later to continue editing without rebuilding the document from scratch.",
        "Start from an existing PDF when you want to inspect or improve an older resume.",
      ],
    },
    {
      title: "ATS-style scoring with receipts",
      bullets: [
        "The parser does not just hand you a number.",
        "It shows extracted fields, structural warnings, and the specific issues that pulled the score down.",
        "That makes the ATS score useful as a diagnostic tool instead of empty reassurance.",
      ],
    },
    {
      title: "Links and profile details that matter",
      bullets: [
        "Add GitHub, LinkedIn, project links, languages, and other useful profile details.",
        "Keep the document professional without turning it into gimmicky resume-builder clutter.",
        "Useful for software engineers, technical profiles, and candidates with project-based work.",
      ],
    },
    {
      title: "Typography controls that help it fit",
      bullets: [
        "Adjust body size, name size, line height, and section spacing.",
        "Fit the final PDF cleanly without hacking the content itself.",
        "Fine-tune the layout when one version needs to fit on a single page.",
      ],
    },
  ],
} as const;

export const HOME_EVALUATOR = {
  title: "What the ATS Parser actually measures",
  description:
    "The score is a local heuristic — not a real ATS simulation. It checks four things: whether key fields were parsed, whether the layout is clean, whether the text is readable, and (optionally) whether your content matches a job description. A score above 75 is fine. Lower scores mean specific detectable issues were flagged — read the suggestions, decide what matters.",
  primaryCta: {
    label: "Try the ATS Parser",
    href: "/parser",
  },
  toggle: {
    show: "Show parsed fields",
    hide: "Hide parsed fields",
  },
} as const;
