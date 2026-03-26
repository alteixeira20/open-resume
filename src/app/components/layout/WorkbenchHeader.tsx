import { cx } from "lib/cx";
import { WORKBENCH_UI } from "components/layout/workbench-ui";

interface WorkbenchHeaderProps {
  title: string;
  description: React.ReactNode;
  actions?: React.ReactNode;
  wrapperClassName?: string;
  contentClassName?: string;
  textBlockClassName?: string;
  actionsClassName?: string;
}

export const WorkbenchHeader = ({
  title,
  description,
  actions,
  wrapperClassName,
  contentClassName,
  textBlockClassName,
  actionsClassName,
}: WorkbenchHeaderProps) => (
  <div className={cx(WORKBENCH_UI.header.wrapperClass, wrapperClassName)}>
    <div className={cx(WORKBENCH_UI.header.rowClass, contentClassName)}>
      <div className={cx("min-w-0", textBlockClassName)}>
        <h1 className={WORKBENCH_UI.header.titleClass}>{title}</h1>
        <div className={WORKBENCH_UI.header.descriptionClass}>{description}</div>
      </div>
      {actions && (
        <div className={cx(WORKBENCH_UI.header.actionsClass, actionsClassName)}>
          {actions}
        </div>
      )}
    </div>
  </div>
);

export default WorkbenchHeader;
