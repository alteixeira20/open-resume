import { cx } from "lib/cx";
import { WORKBENCH_UI } from "components/layout/workbench-ui";

interface WorkbenchHeaderProps {
  title: string;
  description: React.ReactNode;
  actions?: React.ReactNode;
  wrapperClassName?: string;
}

export const WorkbenchHeader = ({
  title,
  description,
  actions,
  wrapperClassName,
}: WorkbenchHeaderProps) => (
  <div className={cx(WORKBENCH_UI.header.wrapperClass, wrapperClassName)}>
    <div className={WORKBENCH_UI.header.rowClass}>
      <h1 className={WORKBENCH_UI.header.titleClass}>
        {title}
      </h1>
      {actions && <div className={WORKBENCH_UI.header.actionsClass}>{actions}</div>}
    </div>
    <p className={WORKBENCH_UI.header.descriptionClass}>
      {description}
    </p>
  </div>
);

export default WorkbenchHeader;
