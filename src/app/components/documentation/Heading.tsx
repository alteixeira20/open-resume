import { cx } from "lib/cx";

const HEADING_CLASSNAMES = {
  1: "text-3xl font-bold lg:text-4xl",
  2: "text-xl font-bold",
  3: "text-lg font-semibold",
};

export const Heading = ({
  level = 1,
  children,
  className = "",
}: {
  level?: 1 | 2 | 3;
  smallMarginTop?: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  const Component = `h${level}` as const;
  return (
    <Component
      className={cx(
        "mt-[2em] heading-text-primary",
        HEADING_CLASSNAMES[level],
        className
      )}
    >
      {children}
    </Component>
  );
};
