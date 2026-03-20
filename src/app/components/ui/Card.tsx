import { cx } from "lib/cx";

const paddingClassName = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export const Card = ({
  children,
  className,
  padding = "md",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: keyof typeof paddingClassName;
}) => (
  <div
    className={cx(
      "rounded-xl border border-[color:var(--color-surface-border)] bg-[rgba(253,248,245,0.82)] shadow-sm backdrop-blur-sm",
      paddingClassName[padding],
      className
    )}
  >
    {children}
  </div>
);
