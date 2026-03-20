import { Section } from "components/layout/Section";
import { SITE } from "content/site";

export const Footer = () => {
  return (
    <footer className="text-sm text-[color:var(--color-text-muted)]">
      <Section>
        <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-base font-black tracking-tight">
          <span className="text-[color:var(--color-text-primary)]">CV</span>
          <span className="text-primary">Forge</span>
        </p>
        <p className="text-xs text-[color:var(--color-text-muted)]">
          Built on{" "}
          <a
            href={SITE.original.github}
            className="underline underline-offset-2 hover:text-[color:var(--color-brand-primary)]"
          >
            OpenResume
          </a>
          {" "}by{" "}
          <a
            href="https://github.com/xitanggg"
            className="underline underline-offset-2 hover:text-[color:var(--color-brand-primary)]"
          >
            Xitang Zhao
          </a>
          {" · "}Extended and maintained by{" "}
          <a
            href={SITE.author.github}
            className="underline underline-offset-2 hover:text-[color:var(--color-brand-primary)]"
          >
            Alexandre Teixeira
          </a>
          {" · "}MIT License
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
          <a href={SITE.github} className="transition-colors hover:text-[color:var(--color-brand-primary)]">
            GitHub
          </a>
          <a href={SITE.liveUrl} className="transition-colors hover:text-[color:var(--color-brand-primary)]">
            Live Demo
          </a>
          <a href={`${SITE.github}/issues/new`} className="transition-colors hover:text-[color:var(--color-brand-primary)]">
            Report Issue
          </a>
          <a href={SITE.original.github} className="transition-colors hover:text-[color:var(--color-brand-primary)]">
            Original Project
          </a>
        </div>
      </div>
      </Section>
    </footer>
  );
};
