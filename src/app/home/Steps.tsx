import { HOME_STEPS } from "content/home";
import { Section } from "components/layout/Section";

export const Steps = () => {
  return (
    <Section>
      <div className="rounded-2xl border border-[color:var(--color-forge-200)] bg-gradient-to-br from-[color:var(--color-forge-50)] via-[color:var(--color-forge-100)] to-[color:var(--color-forge-200)] px-8 py-10 shadow-[0_18px_45px_-30px_var(--color-brand-glow)] backdrop-blur">
        <h1 className="text-center text-3xl font-bold text-[color:var(--color-forge-600)]">
          {HOME_STEPS.title}
        </h1>
        <div className="mt-8 flex justify-center">
          <dl className="flex flex-col gap-y-10 lg:flex-row lg:justify-center lg:gap-x-20">
            {HOME_STEPS.items.map(({ title, text, href }, idx) => (
              <a
                key={idx}
                href={href}
                className="group relative self-start rounded-xl px-3 py-2 pl-16 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_0_2px_var(--color-brand-glow),0_10px_30px_-18px_var(--color-brand-glow)]"
              >
                <dt className="text-lg font-bold">
                  <div className="bg-primary absolute left-4 top-3 flex h-10 w-10 select-none items-center justify-center rounded-full p-[3.5px] opacity-80 transition-transform duration-200 ease-out group-hover:scale-105">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                      <span className="text-primary -mt-0.5 text-2xl font-black">
                        0{idx + 1}
                      </span>
                    </div>
                  </div>
                  {title}
                </dt>
                <dd className="mt-1 text-gray-700">{text}</dd>
              </a>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
};
