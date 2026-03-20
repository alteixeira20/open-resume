import { Heading } from "components/documentation";
import { cx } from "lib/cx";

export const SectionHeading = ({
  title,
  subtitle,
  align = "left",
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) => {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={alignment}>
      <Heading
        className={cx(
          "!mt-0 !mb-3 bg-none text-[color:var(--color-forge-600)]",
          alignment
        )}
      >
        {title}
      </Heading>
      {subtitle ? (
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};
