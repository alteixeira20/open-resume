import { Link } from "components/documentation";

const QAS = [
  {
    question:
      "Q1. What is a resume builder? Why resume builder is better than resume template doc?",
    answer: (
      <>
        <p>
          There are two ways to create a resume today. One option is to use a
          resume template, such as an office/google doc, and customize it
          according to your needs. The other option is to use a resume builder,
          an online tool that allows you to input your information and
          automatically generates a resume for you.
        </p>
        <p>
          Using a resume template requires manual formatting work, like copying
          and pasting text sections and adjusting spacing, which can be
          time-consuming and error-prone. It is easy to run into formatting
          issues, such as using different bullet points or font styles after
          copying and pasting. On the other hand, a resume builder like
          OpenResume saves time and prevents formatting mistakes by
          automatically formatting the resume. It also offers the convenience of
          easily changing font types or sizes with a simple click. In summary, a
          resume builder is easier to use compared to a resume template.
        </p>
      </>
    ),
  },
  {
    question:
      "Q2. What uniquely sets OpenResume apart from other resume builders and templates?",
    answer: (
      <>
        <p>
          Other than OpenResume, there are some great free resume builders out
          there, e.g. <Link href="https://rxresu.me/">Reactive Resume</Link>,{" "}
          <Link href="https://flowcv.com/">FlowCV</Link>. However, OpenResume
          stands out with 2 distinctive features:
        </p>{" "}
        <p>
          <span className="font-semibold">
            1. OpenResume focuses on ATS‑friendly, single‑column resumes with
            clear EU/US presets.
          </span>
          <br />
          Unlike other resume builders that target a global audience and offer
          many customization options, OpenResume intentionally only offers
          options that are aligned with ATS best practices. For example, it
          excludes the option to add a profile picture to avoid bias and
          discrimination. It offers only the core sections (profile, work
          experience, education, skills) while omitting unnecessary sections
          like references. It also enforces a single‑column layout because
          single‑column designs are the most reliably parsed by ATS. <br />{" "}
        </p>
        <p>
          <span className="font-semibold">
            2. OpenResume is privacy‑focused.
          </span>{" "}
          <br />
          While other resume builders may require email sign up and store user
          data in their databases, OpenResume believes that resume data should
          remain private and accessible only on user’s local machine. Therefore,
          OpenResume doesn’t require sign up to use the app, and all inputted
          data is stored in user’s browser that only user has access to.
        </p>
      </>
    ),
  },
  {
    question: "Q3. Who created OpenResume and why?",
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
          and extends the project with ATS scoring, EU/US presets, and extra
          diagnostics to help users validate parsing and layout safely.
        </p>
      </>
    ),
  },
  {
    question: "Q4. Why was this fork built?",
    answer: (
      <p>
        This fork keeps OpenResume actively maintained and expands it into a
        local, ATS‑aware workflow. It adds EU/US presets, ATS scoring with
        detailed diagnostics, richer builder fields (GitHub, projects, languages,
        optional GPA for US), safer ATS‑friendly output, and more personalization
        controls (typography, spacing, and navigation). The goal is simple:
        help people validate formatting and parsing with transparent feedback,
        without over‑promising outcomes or replacing human judgment.
      </p>
    ),
  },
  {
    question: "Q5. How can I support OpenResume?",
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
    <section className="mx-auto max-w-3xl divide-y divide-gray-300 lg:mt-4 lg:px-2">
      <h2 className="text-center text-3xl font-bold">Questions & Answers</h2>
      <div className="mt-6 divide-y divide-gray-300">
        {QAS.map(({ question, answer }) => (
          <div key={question} className="py-6">
            <h3 className="font-semibold leading-7">{question}</h3>
            <div className="mt-3 grid gap-2 leading-7 text-gray-600">
              {answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
