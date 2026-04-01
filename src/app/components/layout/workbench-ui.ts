export const WORKBENCH_UI = {
  headerDescriptionDividerGapRem: 0.42,
  shellMaxWidthClass: "max-w-[1820px]",
  previewPanePreferredWidthPx: 820,
  workbenchMinWidthPx: 520,
  mainClass:
    "h-full w-full overflow-hidden bg-[color:var(--color-surface-base)]",
  gridExpandedClass: "grid",
  gridCollapsedClass: "grid grid-cols-1",
  gridBaseClass: "mx-auto h-full w-full px-3 md:px-4 xl:px-6",
  leftPaneClass:
    "flex h-full flex-col overflow-y-auto border-r border-[color:var(--color-surface-border)] pt-6 pb-4 scrollbar scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[color:var(--color-forge-200)]",
  leftPaneCollapsedClass: "border-r-0",
  rightPaneClass:
    "hidden h-full flex-col overflow-hidden pt-6 pb-4 md:flex",
  panelContentInlinePadding: {
    paddingLeft: "var(--workbench-panel-px)",
    paddingRight: "var(--workbench-panel-px)",
  } as const,
  header: {
    wrapperClass: "mb-3 flex min-h-[5rem] flex-col gap-1",
    rowClass: "flex flex-wrap items-start justify-between gap-3",
    titleClass:
      "text-primary text-2xl font-black leading-none tracking-tight md:text-[1.75rem]",
    descriptionClass:
      "mt-0.5 max-w-prose text-sm leading-snug text-[color:var(--color-text-secondary)]",
    actionsClass: "flex flex-wrap gap-2",
    compactActionClass: "h-8 rounded-lg px-2.5 py-0 text-xs font-semibold",
    dividerClass: "h-px w-full bg-[color:var(--color-surface-border)]",
  },
  contentStackClass: "space-y-4",
} as const;
