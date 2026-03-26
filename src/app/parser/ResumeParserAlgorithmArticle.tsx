import type {
  Line,
  Lines,
  ResumeSectionToLines,
  TextItem,
  TextItems,
} from "lib/parse-resume-from-pdf/types";

const articleCardClassName =
  "rounded-2xl border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)]/85 p-5 shadow-[0_16px_28px_-24px_rgba(18,13,10,0.45)] backdrop-blur-sm";

const tableClassName =
  "w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-[color:var(--color-surface-border)] text-sm";

const lineToText = (line: Line) => line.map((item) => item.text).join(" ");

const metadataText = (item: TextItem) => {
  const x1 = Math.round(item.x);
  const x2 = Math.round(item.x + item.width);
  const y = Math.round(item.y);
  const parts = [`X1 ${x1}`, `X2 ${x2}`, `Y ${y}`];
  if (item.hasEOL) parts.push("line break");
  return parts.join(" · ");
};

const SectionTable = ({ sections }: { sections: ResumeSectionToLines }) => {
  const rows = Object.entries(sections).map(([title, lines]) => ({
    title: title === "profile" ? "Profile" : title,
    lines: lines.length,
    sample: lines[0] ? lineToText(lines[0]) : "—",
  }));

  return (
    <table className={tableClassName}>
      <thead className="bg-[color:var(--color-forge-100)] text-left">
        <tr>
          <th className="px-3 py-2 font-semibold text-[color:var(--color-text-primary)]">
            Section
          </th>
          <th className="px-3 py-2 font-semibold text-[color:var(--color-text-primary)]">
            Lines
          </th>
          <th className="px-3 py-2 font-semibold text-[color:var(--color-text-primary)]">
            First line seen by the parser
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[color:var(--color-surface-border)]">
        {rows.map((row) => (
          <tr key={row.title} className="bg-[color:var(--color-surface-base)]/70">
            <td className="px-3 py-2 font-medium text-[color:var(--color-text-primary)]">
              {row.title}
            </td>
            <td className="px-3 py-2 text-[color:var(--color-text-secondary)]">
              {row.lines}
            </td>
            <td className="px-3 py-2 text-[color:var(--color-text-secondary)]">
              {row.sample}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const SampleLinesTable = ({ lines }: { lines: Lines }) => {
  const previewLines = lines.slice(0, 10);

  return (
    <table className={tableClassName}>
      <thead className="bg-[color:var(--color-forge-100)] text-left">
        <tr>
          <th className="px-3 py-2 font-semibold text-[color:var(--color-text-primary)]">
            #
          </th>
          <th className="px-3 py-2 font-semibold text-[color:var(--color-text-primary)]">
            Reconstructed line
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[color:var(--color-surface-border)]">
        {previewLines.map((line, index) => (
          <tr key={`${index}-${lineToText(line)}`} className="bg-[color:var(--color-surface-base)]/70">
            <td className="px-3 py-2 text-[color:var(--color-text-secondary)]">
              {index + 1}
            </td>
            <td className="px-3 py-2 text-[color:var(--color-text-primary)]">
              {line.map((item, itemIndex) => (
                <span key={itemIndex}>
                  {item.text}
                  {itemIndex !== line.length - 1 && (
                    <span className="px-2 font-bold text-[color:var(--color-brand-primary)]">
                      |
                    </span>
                  )}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const SampleTextItemsTable = ({ textItems }: { textItems: TextItems }) => {
  const previewItems = textItems.slice(0, 12);

  return (
    <table className={tableClassName}>
      <thead className="bg-[color:var(--color-forge-100)] text-left">
        <tr>
          <th className="px-3 py-2 font-semibold text-[color:var(--color-text-primary)]">
            #
          </th>
          <th className="px-3 py-2 font-semibold text-[color:var(--color-text-primary)]">
            Text item
          </th>
          <th className="px-3 py-2 font-semibold text-[color:var(--color-text-primary)]">
            Metadata
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[color:var(--color-surface-border)]">
        {previewItems.map((item, index) => (
          <tr key={`${index}-${item.text}`} className="bg-[color:var(--color-surface-base)]/70">
            <td className="px-3 py-2 text-[color:var(--color-text-secondary)]">
              {index + 1}
            </td>
            <td className="px-3 py-2 text-[color:var(--color-text-primary)]">
              {item.text}
            </td>
            <td className="px-3 py-2 text-[color:var(--color-text-secondary)]">
              {metadataText(item)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const ResumeParserAlgorithmArticle = ({
  textItems,
  lines,
  sections,
}: {
  textItems: TextItems;
  lines: Lines;
  sections: ResumeSectionToLines;
}) => {
  const sectionCount = Object.keys(sections).length;

  return (
    <article className="mt-8 space-y-4">
      <div className={articleCardClassName}>
        <h2 className="text-lg font-black text-[color:var(--color-text-primary)]">
          How CVForge reads this PDF
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
          CVForge uses pdf.js to read raw text items, reconstructs them into lines,
          groups those lines into sections, and then extracts a structured resume model.
          The parser is heuristic and text-based, so it works best on clean, selectable PDFs.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-raised)]/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
              Text items read
            </p>
            <p className="mt-2 text-2xl font-black text-[color:var(--color-text-primary)]">
              {textItems.length}
            </p>
          </div>
          <div className="rounded-xl border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-raised)]/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
              Lines reconstructed
            </p>
            <p className="mt-2 text-2xl font-black text-[color:var(--color-text-primary)]">
              {lines.length}
            </p>
          </div>
          <div className="rounded-xl border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-raised)]/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
              Sections inferred
            </p>
            <p className="mt-2 text-2xl font-black text-[color:var(--color-text-primary)]">
              {sectionCount}
            </p>
          </div>
        </div>
      </div>

      <div className={articleCardClassName}>
        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[color:var(--color-forge-700)]">
          Signals the parser relies on
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            {
              title: "Layout shape",
              text: "Single-column alignment, consistent left edges, and obvious section blocks help the parser stay reliable.",
            },
            {
              title: "Section headings",
              text: "Uppercase or clearly-emphasized headings make it easier to split the document into profile, work, education, and other sections.",
            },
            {
              title: "Recognisable field formats",
              text: "Email, phone, location, dates, and URLs are scored using explicit pattern checks and section context.",
            },
            {
              title: "Readable body content",
              text: "Bullet structure, visible URLs, quantifiable impact, and clean word spacing all help the final score.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-raised)]/70 px-4 py-3"
            >
              <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                {item.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={articleCardClassName}>
        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[color:var(--color-forge-700)]">
          Current parse snapshot
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
          These tables show a small slice of what the parser extracted from the current PDF.
          They are meant to make the parser behavior inspectable, not mysterious.
        </p>
        <div className="mt-4 space-y-4">
          <div className="overflow-x-auto">
            <SampleTextItemsTable textItems={textItems} />
          </div>
          <div className="overflow-x-auto">
            <SampleLinesTable lines={lines} />
          </div>
          <div className="overflow-x-auto">
            <SectionTable sections={sections} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ResumeParserAlgorithmArticle;
