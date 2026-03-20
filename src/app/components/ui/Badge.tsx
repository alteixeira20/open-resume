import { cx } from "lib/cx";

const variantClassName = {
  default:
    "border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-secondary)]",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/15",
  error: "bg-red-50 text-red-700 ring-1 ring-red-600/15",
  accent:
    "bg-[color:var(--color-brand-primary)]/10 text-[color:var(--color-brand-primary)] ring-1 ring-[color:var(--color-brand-primary)]/15",
} as const;

export const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: keyof typeof variantClassName;
}) => (
  <span
    className={cx(
      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
      variantClassName[variant]
    )}
  >
    {children}
  </span>
);
