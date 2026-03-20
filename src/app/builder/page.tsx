"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { ResumeDownloadBridge } from "components/Resume/ResumeDownloadBridge";
import { ResumeInlinePreview } from "components/Resume/ResumeInlinePreview";
import { useAppSelector } from "lib/redux/hooks";
import { selectSettings } from "lib/redux/settingsSlice";
import { useWorkbenchCollapse } from "lib/hooks/useWorkbenchCollapse";
import { WorkbenchLayout } from "components/layout/WorkbenchLayout";

const BuilderContent = () => {
  const settings = useAppSelector(selectSettings);
  const { isCollapsed, showPreview, togglePreview } = useWorkbenchCollapse({
    documentSize: settings.documentSize as "A4" | "Letter",
  });

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
  }, []);

  const workbenchContent = (
    <ResumeForm
      showRefreshButton={!isCollapsed}
      preview={isCollapsed && showPreview ? <ResumeInlinePreview /> : undefined}
      onTogglePreview={isCollapsed ? togglePreview : undefined}
      showPreview={showPreview}
    />
  );

  const previewContent = <Resume />;

  return (
    <>
      <WorkbenchLayout
        workbench={workbenchContent}
        preview={previewContent}
        isCollapsed={isCollapsed}
      />
        <ResumeDownloadBridge />
    </>
  );
};

export default function Create() {
  return (
    <Provider store={store}>
      <BuilderContent />
    </Provider>
  );
}
