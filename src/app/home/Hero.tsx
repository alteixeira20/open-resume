"use client";

import { useState } from "react";
import { AutoTypingResume } from "home/AutoTypingResume";
import { HOME_HERO } from "content/home";
import { Section } from "components/layout/Section";
import { Button } from "components/ui";
import { cx } from "lib/cx";

export const Hero = () => {
  const [showExample, setShowExample] = useState(false);

  return (
    <Section>
      <div>
        <div className="grid w-full grid-cols-1 gap-10 md:gap-8">
          <div className="flex h-full flex-col text-center md:text-left">
            <div
              className={cx(
                "flex flex-col",
                "mx-auto w-full max-w-5xl"
              )}
            >
              <div
                className={cx(
                  "gap-6",
                  "flex flex-col md:flex-row md:items-center md:justify-between"
                )}
              >
                <div className="min-w-0 max-w-3xl">
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
                    {HOME_HERO.eyebrow}
                  </p>
                  <h1 className="mt-4 text-4xl font-black tracking-tight text-[color:var(--color-text-primary)] lg:text-6xl">
                    {HOME_HERO.headline && <span>{HOME_HERO.headline}</span>}
                    <span
                      className={
                        HOME_HERO.headline ? "mt-2 block text-primary" : "text-primary"
                      }
                    >
                      {HOME_HERO.headlineAccent}
                    </span>
                  </h1>
                  <p
                    className={cx(
                      "mt-4 text-lg text-gray-700 lg:text-xl",
                      "max-w-3xl"
                    )}
                  >
                    {HOME_HERO.description}
                  </p>
                  <p className="mt-3 text-sm text-gray-600">
                    {HOME_HERO.privacyNote}
                  </p>
                </div>
                <div
                  className={cx(
                    "mt-2 flex shrink-0 flex-row flex-nowrap items-center justify-center gap-2 overflow-x-auto md:mt-0 md:flex-col md:items-end md:justify-start md:gap-3 md:overflow-visible"
                  )}
                >
                  <Button
                    href={HOME_HERO.primaryCta.href}
                    className="forge-glow whitespace-nowrap md:mr-18"
                  >
                    {HOME_HERO.primaryCta.label} <span aria-hidden="true">→</span>
                  </Button>
                  <Button
                    href={HOME_HERO.secondaryCta.href}
                    variant="secondary"
                    className="whitespace-nowrap md:mr-8"
                  >
                    {HOME_HERO.secondaryCta.label}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowExample((prev) => !prev)}
                    aria-expanded={showExample}
                    className="whitespace-nowrap"
                  >
                    {showExample
                      ? HOME_HERO.previewToggle.hide
                      : HOME_HERO.previewToggle.show}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showExample && (
          <div className="mx-auto mt-8 w-full max-w-5xl px-[200px]">
            <div className="flex w-full justify-center py-7">
              <div className="w-full">
                <AutoTypingResume />
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};
