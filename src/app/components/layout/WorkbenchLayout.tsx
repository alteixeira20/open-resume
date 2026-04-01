"use client";

import { cx } from "lib/cx";
import { WorkbenchPreview } from "components/layout/WorkbenchPreview";
import { WORKBENCH_UI } from "components/layout/workbench-ui";

interface WorkbenchLayoutProps {
  workbench: React.ReactNode;
  preview: React.ReactNode;
  isCollapsed: boolean;
  leftPaneClassName?: string;
  previewColumnWidthPx?: number;
}

export const WorkbenchLayout = ({
  workbench,
  preview,
  isCollapsed,
  leftPaneClassName,
  previewColumnWidthPx,
}: WorkbenchLayoutProps) => {
  const effectivePreviewWidthPx = Math.min(
    Math.max(previewColumnWidthPx ?? WORKBENCH_UI.previewPanePreferredWidthPx, 0),
    WORKBENCH_UI.previewPanePreferredWidthPx
  );
  const expandedGridStyle = !isCollapsed
    ? {
        gridTemplateColumns: `minmax(0, 1fr) minmax(0, ${effectivePreviewWidthPx}px)`,
      }
    : undefined;

  return (
    <main className={WORKBENCH_UI.mainClass}>
      <div
        className={cx(
          WORKBENCH_UI.gridBaseClass,
          isCollapsed ? "" : WORKBENCH_UI.shellMaxWidthClass,
          isCollapsed
            ? WORKBENCH_UI.gridCollapsedClass
            : WORKBENCH_UI.gridExpandedClass
        )}
        style={expandedGridStyle}
      >
        <div
          className={cx(
            WORKBENCH_UI.leftPaneClass,
            isCollapsed ? WORKBENCH_UI.leftPaneCollapsedClass : "",
            leftPaneClassName
          )}
        >
          <div
            className="w-full"
            style={{
              paddingRight: WORKBENCH_UI.panelContentInlinePadding.paddingRight,
            }}
          >
            {workbench}
          </div>
        </div>

        {!isCollapsed && (
          <div className={WORKBENCH_UI.rightPaneClass}>
            <div className="h-full w-full pl-3 md:pl-4 xl:pl-6">
              <WorkbenchPreview>{preview}</WorkbenchPreview>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default WorkbenchLayout;
