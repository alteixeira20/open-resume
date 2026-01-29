import { cx } from "lib/cx";

export const Link = ({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer noopener" : undefined}
      className={cx(
        "underline underline-offset-2 hover:decoration-2",
        className
      )}
    >
      {children}
    </a>
  );
};
