import { Tooltip } from "components/Tooltip";
import { cx } from "lib/cx";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type SharedProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
};

type AnchorButtonProps = SharedProps &
  Omit<React.ComponentProps<"a">, keyof SharedProps>;
type NativeButtonProps = SharedProps &
  Omit<React.ComponentProps<"button">, keyof SharedProps>;

export type ButtonProps = AnchorButtonProps | NativeButtonProps;

const variantClassName: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary:
    "rounded-full border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-base)] text-[color:var(--color-text-secondary)] shadow-sm hover:border-gray-300 hover:bg-gray-50",
  ghost:
    "rounded-full text-[color:var(--color-text-secondary)] hover:bg-black/5 hover:text-[color:var(--color-text-primary)]",
};

const sizeClassName: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2 text-sm",
  lg: "px-7 py-3 text-base",
};

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
  ...props
}: ButtonProps) => {
  const classes = cx(
    "inline-flex items-center justify-center gap-2 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    variantClassName[variant],
    sizeClassName[size],
    className
  );

  if (href) {
    return (
      <a className={classes} href={href} {...(props as AnchorButtonProps)}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(props as NativeButtonProps)}
    >
      {children}
    </button>
  );
};

type IconButtonProps = Omit<NativeButtonProps, "size"> & {
  size?: "small" | "medium";
  tooltipText: string;
};

export const IconButton = ({
  className,
  size = "medium",
  tooltipText,
  ...props
}: IconButtonProps) => (
  <Tooltip text={tooltipText}>
    <button
      type="button"
      className={cx(
        "rounded-full outline-none hover:bg-gray-100 focus-visible:bg-gray-100",
        size === "medium" ? "p-1.5" : "p-1",
        className
      )}
      {...props}
    />
  </Tooltip>
);
