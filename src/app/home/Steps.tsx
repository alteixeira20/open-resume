const STEPS = [
  { title: "Add a resume pdf", text: "or create from scratch" },
  { title: "Preview design", text: "and make edits" },
  { title: "Download and Analyze", text: "get instant ATS feedback" },
];

export const Steps = () => {
  return (
    <section className="mx-auto max-w-6xl rounded-2xl border border-sky-100/80 bg-gradient-to-br from-white/90 via-sky-50/80 to-sky-100/70 px-8 py-10 shadow-[0_18px_45px_-30px_rgba(14,116,144,0.55)] backdrop-blur">
      <h1 className="text-primary text-center text-3xl font-bold">
        Build a Resume in 3 Steps
      </h1>
      <div className="mt-8 flex justify-center">
        <dl className="flex flex-col gap-y-10 lg:flex-row lg:justify-center lg:gap-x-20">
          {STEPS.map(({ title, text }, idx) => (
            <div className="relative self-start pl-14" key={idx}>
              <dt className="text-lg font-bold">
                <div className="bg-primary absolute left-0 top-1 flex h-10 w-10 select-none items-center justify-center rounded-full p-[3.5px] opacity-80">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <div className="text-primary -mt-0.5 text-2xl">
                      {idx + 1}
                    </div>
                  </div>
                </div>
                {title}
              </dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
