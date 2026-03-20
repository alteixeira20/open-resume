import { HOME_HIGHLIGHTS } from "content/home";
import { Section } from "components/layout/Section";
import { Card, SectionHeading } from "components/ui";

export const ForkHighlights = () => {
  return (
    <Section>
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          align="center"
          title={HOME_HIGHLIGHTS.title}
          subtitle={HOME_HIGHLIGHTS.subtitle}
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {HOME_HIGHLIGHTS.items.map((item) => (
            <Card key={item.title} className="bg-white/90 backdrop-blur" padding="sm">
              <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1 text-[color:var(--color-brand-primary)]"
                    >
                      •
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
};
