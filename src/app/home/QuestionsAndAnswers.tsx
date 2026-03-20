import { QAS } from "content/faq";
import { Section } from "components/layout/Section";
import { SectionHeading } from "components/ui";

export const QuestionsAndAnswers = () => {
  return (
    <Section>
      <SectionHeading align="center" title="FAQ" />
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
    </Section>
  );
};
