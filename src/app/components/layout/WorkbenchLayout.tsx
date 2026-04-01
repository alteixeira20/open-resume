"use client";

import { cx } from "lib/cx";
import { WorkbenchPreview } from "components/layout/WorkbenchPreview";
import { WORKBENCH_UI } from "components/layout/workbench-ui";

interface WorkbenchLayoutProps {
  workbench: React.ReactNode;
  preview: React.ReactNode;
  isCollapsed: boolean;
  leftPaneClassName?: string;
}

export const WorkbenchLayout = ({
  workbench,
  preview,
  isCollapsed,
  leftPaneClassName,
}: WorkbenchLayoutProps) => {
  const expandedGridStyle = !isCollapsed
    ? {
        gridTemplateColumns: `minmax(0, 1fr) fit-content(${WORKBENCH_UI.previewPanePreferredWidthPx}px)`,
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
            <div className="h-full pl-3 md:pl-4 xl:pl-6">
              <WorkbenchPreview>{preview}</WorkbenchPreview>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default WorkbenchLayout;
