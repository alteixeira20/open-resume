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
        format (EU A4 or US Letter), preview the PDF in the builder, and
        export when you're done. There's also a separate ATS Parser that
        parses any PDF and shows you what a text-based ATS system would extract
        from it. No account required, and CV content is not sent to a
        CV-processing backend.
      </p>
    ),
  },
  {
    question: "Q2. How does the format score work?",
    answer: (
      <>
        <p>
          The score runs three checks, all locally in your browser:
        </p>
        <p>
          <span className="font-semibold">Parsing (60 pts)</span> — did the
          parser successfully extract your name, email, phone, location, links,
          education, and work experience? Missing or garbled fields lose points
          here.
        </p>
        <p>
          <span className="font-semibold">Structure (25 pts)</span> — is the
          layout single-column, are section headings recognisable, are bullets
          used consistently, and is the length appropriate for the format?
        </p>
        <p>
          <span className="font-semibold">Readability (15 pts)</span> — are
          there quantifiable results (numbers, percentages), visible URLs, and
          no run-together words from PDF extraction artefacts?
        </p>
        <p>
          The three categories add up directly to 100. A score above
          75 generally means the parser read your CV cleanly and the layout is
          solid. Lower scores point to specific issues in the suggestions list —
          read those, and decide what actually matters for your situation.
        </p>
        <p>
          This is a heuristic formatting check, not a real ATS and not a
          judgement of your CV's content. It tells you how cleanly a text parser
          can read your document — nothing about whether you will get an
          interview.
        </p>
      </>
    ),
  },
  {
    question: "Q3. Is my data private?",
    answer: (
      <p>
        Mostly, yes. The builder, parser, ATS scorer, and PDF renderer run in
        the browser, so your CV content is not sent to a server for parsing or
        scoring. The site does include general analytics, but not CV-content
        processing. You can verify the network requests in your browser dev
        tools.
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
          . The original project is a clean, local-first resume builder —
          CVForge builds on that foundation with parser diagnostics, ATS-style
          scoring, EU A4 support, and updated dependencies.
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
