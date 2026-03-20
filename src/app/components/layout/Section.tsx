import { cx } from "lib/cx";
import { PageWrapper } from "components/layout/PageWrapper";

export const Section = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <section id={id} className={cx("py-12", className)}>
      <PageWrapper>{children}</PageWrapper>
    </section>
  );
};
