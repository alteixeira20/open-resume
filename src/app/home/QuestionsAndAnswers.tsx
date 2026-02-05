import { Heading, Link } from "components/documentation";

const QAS = [
  {
    question:
      "Q1. What is a free resume builder, and how is it better than a resume template?",
    answer: (
      <>
        <p>
          You can create a resume with a template (Word/Google Docs) or use a
          free resume builder. A resume builder is an online resume maker that
          formats your content automatically and keeps ATS‑friendly structure
          consistent.
        </p>
        <p>
          Resume templates require manual formatting and often break spacing or
          typography. This fork adds EU A4 + US Letter presets, ATS resume
          scoring, and richer fields (GitHub, projects, languages) so you can
          focus on content, not layout.
        </p>
      </>
    ),
  },
  {
    question:
      "Q2. What makes this open-source resume builder different?",
    answer: (
      <>
        <p>
          Other free resume builders exist, e.g.{" "}
          <Link href="https://rxresu.me/">Reactive Resume</Link> and{" "}
          <Link href="https://flowcv.com/">FlowCV</Link>. This fork focuses on
          ATS‑safe output, EU/US page sizes, ATS resume scoring, and local
          privacy.
        </p>{" "}
        <p>
          <span className="font-semibold">
            1. ATS‑friendly resume templates with EU A4 + US Letter presets.
          </span>
          <br />
          Single‑column layouts are the most reliably parsed by ATS systems. The
          builder keeps formatting consistent and avoids risky elements like
          profile photos.
          <br />{" "}
        </p>
        <p>
          <span className="font-semibold">
            2. Local‑first privacy, ATS resume scoring, and parser diagnostics.
          </span>{" "}
          <br />
          Your data stays in your browser—no account required. The ATS resume
          scoring system and resume parser run locally with transparent
          diagnostics so you can validate parsing and layout.
        </p>
      </>
    ),
  },
  {
    question: "Q3. Who created OpenResume and why is it open source?",
    answer: (
      <>
        <p>
          OpenResume was created by{" "}
          <Link href="https://github.com/xitanggg">Xitang Zhao</Link> and designed
          by <Link href="https://www.linkedin.com/in/imzhi">Zhigang Wen</Link> as
          a weekend project. As immigrants to the US, we had made many mistakes
          when creating our first resumes and applying for internships and jobs.
          It took us a long while to learn some of the best practices. While
          mentoring first generation students and reviewing their resumes, we
          noticed students were making the same mistakes that we had made before.
          This led us to think about how we can be of help with the knowledge and
          skills we have gained. We started chatting and working over the weekends
          that led to OpenResume, where we integrated best practices and our
          knowledge into this resume builder. Our hope is that OpenResume can help
          anyone to easily create a modern professional resume that follows best
          practices and enable anyone to apply for jobs with confidence.
        </p>
        <p>
          This fork is maintained by{" "}
          <Link href="https://github.com/alteixeira20">Alexandre Teixeira</Link>{" "}
          and extends the project with an ATS resume scoring system, EU/US
          presets, and extra diagnostics to help users validate parsing and
          layout safely.
        </p>
      </>
    ),
  },
  {
    question: "Q4. Does the ATS resume checker upload my data?",
    answer: (
      <p>
        No. The ATS resume checker and resume parser run locally in your browser.
        Your resume data is not uploaded to any server.
      </p>
    ),
  },
  {
    question: "Q5. How can I support this free resume builder?",
    answer: (
      <>
        <p>
          The best way to support OpenResume is to share your thoughts and
          feedback with us to help further improve it. You can open an issue at{" "}
          <Link href="https://github.com/alteixeira20/open-resume/issues/new">
            this fork’s GitHub repository
          </Link>{" "}
          or{" "}
          <Link href="https://github.com/xitanggg/open-resume/issues/new">
            the original project
          </Link>
          . Whether you like it or not, we would love to hear from you.
        </p>
        <p>
          Another great way to support OpenResume is by spreading the words.
          Share it with your friends, on social media platforms, or with your
          school’s career center. Our goal is to reach more people who struggle
          with creating their resume, and your word-of-mouth support would be
          greatly appreciated. If you use Github, you can also show your support
          by{" "}
          <Link href="https://github.com/alteixeira20/open-resume">
            giving this fork a star
          </Link>{" "}
          and, if you’d like,{" "}
          <Link href="https://github.com/xitanggg/open-resume">
            starring the original project
          </Link>{" "}
          to help increase its popularity and reach.
        </p>
      </>
    ),
  },
];

export const QuestionsAndAnswers = () => {
  return (
    <section className="mx-auto max-w-6xl divide-y divide-gray-300 py-6 lg:px-2">
      <div className="text-center">
        <Heading className="!mt-0 !mb-3">FAQ</Heading>
      </div>
      <div className="mt-6 divide-y divide-gray-300">
        {QAS.map(({ question, answer }) => (
          <details key={question} className="group py-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold leading-7 text-gray-900">
              <span>{question}</span>
              <span className="text-gray-400 transition group-open:rotate-180">▾</span>
            </summary>
            <div className="mt-3 grid gap-2 leading-7 text-gray-600">
              {answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};
