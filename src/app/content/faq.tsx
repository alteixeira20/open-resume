import type { ReactNode } from "react";
import { SITE } from "content/site";

export type FAQItem = {
  question: string;
  answer: ReactNode;
};

export const QAS: FAQItem[] = [
  {
    question: "Q1. What is CVForge?",
    answer: (
      <p>
        A browser-based CV and resume builder. You fill in your details, pick a
        format (EU A4 or US Letter), preview the PDF live, and export when
        you're done. There's also a separate ATS Parser that parses any PDF and
        shows you what a text-based ATS system would extract from it. No
        account, no server, no uploads.
      </p>
    ),
  },
  {
    question: "Q2. How does the ATS score work?",
    answer: (
      <>
        <p>
          The score runs four checks, all locally in your browser:
        </p>
        <p>
          <span className="font-semibold">Parsing (40 pts)</span> — did the
          parser successfully extract your name, email, phone, location, links,
          education, and work experience? Missing or garbled fields lose points
          here.
        </p>
        <p>
          <span className="font-semibold">Structure (20 pts)</span> — is the
          layout single-column, are section headings recognisable, are bullets
          used consistently, and is the length appropriate for the format?
        </p>
        <p>
          <span className="font-semibold">Readability (10 pts)</span> — are
          there quantifiable results (numbers, percentages), visible URLs, and
          no run-together words from PDF extraction artefacts?
        </p>
        <p>
          <span className="font-semibold">Keywords (30 pts, optional)</span> —
          only scored if you paste a job description in the CLI or API. Not
          available in the browser UI yet.
        </p>
        <p>
          Without a job description the score rescales to 100 across the first
          three categories. A score above 75 is generally fine — it means the
          parser read your CV cleanly and the layout is solid. Lower scores
          point to specific issues in the suggestions list. Read those, decide
          what actually matters for your situation.
        </p>
        <p>
          This is a heuristic diagnostic tool, not a real ATS. Real ATS systems
          vary enormously. The score tells you about parse quality and layout
          choices — it says nothing about whether your CV will get you an
          interview.
        </p>
      </>
    ),
  },
  {
    question: "Q3. Is my data private?",
    answer: (
      <p>
        Yes. Everything — the builder, the parser, the ATS scorer, the PDF
        renderer — runs inside your browser tab. Nothing is sent to a server.
        There are no analytics on your CV content. You can verify this by
        checking the network tab while using the tool.
      </p>
    ),
  },
  {
    question: "Q4. How is CVForge different from other CV builders?",
    answer: (
      <>
        <p>
          Most free CV builders store your data on their servers, show ads, or
          push you toward a paid plan. CVForge does none of that. The tradeoff
          is that it's simpler — one clean template, two format options, no
          fancy themes.
        </p>
        <p>
          The main thing CVForge adds that most builders don't have is the
          local ATS Parser: upload any PDF and see exactly what fields a text
          parser can extract, what it missed, and why. That feedback loop is
          useful when you're not sure if your current CV format is going to
          survive ATS parsing intact.
        </p>
      </>
    ),
  },
  {
    question: "Q5. Where did this come from?",
    answer: (
      <>
        <p>
          CVForge is a fork of{" "}
          <a
            href={SITE.original.github}
            className="keyword underline underline-offset-2"
          >
            OpenResume
          </a>
          , originally built by{" "}
          <a
            href="https://github.com/xitanggg"
            className="keyword underline underline-offset-2"
          >
            Xitang Zhao
          </a>{" "}
          and{" "}
          <a
            href="https://www.linkedin.com/in/imzhi"
            className="keyword underline underline-offset-2"
          >
            Zhigang Wen
          </a>
          . The original project is a clean, privacy-first resume builder —
          CVForge keeps that foundation and adds local ATS scoring, EU A4
          support, parser diagnostics, and updated dependencies.
        </p>
        <p>
          Maintained by{" "}
          <a
            href={SITE.author.github}
            className="keyword underline underline-offset-2"
          >
            Alexandre Teixeira
          </a>
          . Issues and PRs welcome on{" "}
          <a
            href={SITE.github}
            className="keyword underline underline-offset-2"
          >
            GitHub
          </a>{" "}
          .
        </p>
      </>
    ),
  },
];
