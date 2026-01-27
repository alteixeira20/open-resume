const HIGHLIGHTS = [
  {
    title: "EU + US presets",
    text: "A4 vs Letter defaults, headings, and regional assumptions for both builder and parser.",
  },
  {
    title: "Local ATS scoring",
    text: "Deterministic, offline scoring with parsing + structure + readability breakdowns.",
  },
  {
    title: "Diagnostics you can act on",
    text: "Expandable issue details so you can see exactly what was detected.",
  },
  {
    title: "Extra builder fields",
    text: "GitHub, project links, languages, and optional US GPA without breaking ATS.",
  },
  {
    title: "Typography controls",
    text: "Tune body, name, and heading sizes plus line height and section spacing.",
  },
  {
    title: "Parser transparency",
    text: "See extracted fields and token evidence to validate how ATS might read your PDF.",
  },
];

export const ForkHighlights = () => {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          What’s new in this fork
        </h2>
        <p className="mt-3 text-center text-sm text-gray-600">
          This version keeps the original foundation and adds practical upgrades
          for real‑world hiring workflows.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
