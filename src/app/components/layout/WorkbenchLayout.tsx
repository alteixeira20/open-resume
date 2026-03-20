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
      >
        <div
          className={cx(
            WORKBENCH_UI.leftPaneClass,
            isCollapsed ? WORKBENCH_UI.leftPaneCollapsedClass : "",
            leftPaneClassName
          )}
        >
          <div className="w-full" style={WORKBENCH_UI.panelContentInlinePadding}>
            {workbench}
          </div>
        </div>

        {!isCollapsed && (
          <div className={WORKBENCH_UI.rightPaneClass}>
            <div className="h-full w-full" style={WORKBENCH_UI.panelContentInlinePadding}>
              <WorkbenchPreview>{preview}</WorkbenchPreview>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default WorkbenchLayout;
