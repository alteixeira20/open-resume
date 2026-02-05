const STEPS = [
  {
    title: "Add a resume pdf",
    text: "or create from scratch",
    href: "/resume-import",
  },
  { title: "Preview design", text: "and make edits", href: "/resume-builder" },
  {
    title: "Download and Analyze",
    text: "get instant ATS feedback",
    href: "/resume-parser",
  },
];

export const Steps = () => {
  return (
    <section className="mx-auto max-w-6xl rounded-2xl border border-sky-100/80 bg-gradient-to-br from-white/90 via-sky-50/80 to-sky-100/70 px-8 py-10 shadow-[0_18px_45px_-30px_rgba(14,116,144,0.55)] backdrop-blur">
      <h1 className="text-primary text-center text-3xl font-bold">
        Build a Resume in 3 Steps
      </h1>
      <div className="mt-8 flex justify-center">
        <dl className="flex flex-col gap-y-10 lg:flex-row lg:justify-center lg:gap-x-20">
          {STEPS.map(({ title, text, href }, idx) => (
            <a
              key={idx}
              href={href}
              className="group relative self-start rounded-xl px-3 py-2 pl-16 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_0_2px_rgba(14,165,233,0.35),0_10px_30px_-18px_rgba(14,116,144,0.45)]"
            >
              <dt className="text-lg font-bold">
                <div className="bg-primary absolute left-4 top-3 flex h-10 w-10 select-none items-center justify-center rounded-full p-[3.5px] opacity-80 transition-transform duration-200 ease-out group-hover:scale-105">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <div className="text-primary -mt-0.5 text-2xl">
                      {idx + 1}
                    </div>
                  </div>
                </div>
                {title}
              </dt>
              <dd className="mt-1 text-gray-700">{text}</dd>
            </a>
          ))}
        </dl>
      </div>
    </section>
  );
};
