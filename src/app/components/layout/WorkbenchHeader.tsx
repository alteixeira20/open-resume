import { cx } from "lib/cx";
import { WORKBENCH_UI } from "components/layout/workbench-ui";

interface WorkbenchHeaderProps {
  title: string;
  description: React.ReactNode;
  actions?: React.ReactNode;
  titleActions?: React.ReactNode;
  wrapperClassName?: string;
  contentClassName?: string;
  textBlockClassName?: string;
  actionsClassName?: string;
}

export const WorkbenchHeader = ({
  title,
  description,
  actions,
  titleActions,
  wrapperClassName,
  contentClassName,
  textBlockClassName,
  actionsClassName,
}: WorkbenchHeaderProps) => (
  <div className={cx(WORKBENCH_UI.header.wrapperClass, wrapperClassName)}>
    <div className={cx(WORKBENCH_UI.header.rowClass, contentClassName)}>
      <div className={cx("min-w-0 w-full flex-1", textBlockClassName)}>
        <div className="flex w-full items-center gap-4">
          <h1 className={cx("min-w-0 flex-1", WORKBENCH_UI.header.titleClass)}>
            {title}
          </h1>
          {titleActions && <div className="shrink-0">{titleActions}</div>}
        </div>
        <div
          className={WORKBENCH_UI.header.descriptionClass}
        >
          {description}
        </div>
      </div>
      {actions && !titleActions && (
        <div className={cx(WORKBENCH_UI.header.actionsClass, actionsClassName)}>
          {actions}
        </div>
      )}
    </div>
    <div
      className={WORKBENCH_UI.header.dividerClass}
      style={{
        marginTop: `${WORKBENCH_UI.headerDescriptionDividerGapRem}rem`,
      }}
    />
  </div>
);

export default WorkbenchHeader;
