export const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex rounded-md bg-[color:var(--color-surface-raised)] px-2 pb-0.5 align-text-bottom text-xs font-semibold text-[color:var(--color-brand-primary)] ring-1 ring-inset ring-[color:var(--color-brand-glow)]">
    {children}
  </span>
);
