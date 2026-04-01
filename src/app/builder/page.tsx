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
import { useState } from "react";

const BuilderContent = () => {
  const settings = useAppSelector(selectSettings);
  const [previewColumnWidthPx, setPreviewColumnWidthPx] = useState<number>();
  const { isCollapsed, showPreview, togglePreview } = useWorkbenchCollapse({
    documentSize: settings.documentSize as "A4" | "Letter",
  });

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
  }, []);

  const workbenchContent = (
    <ResumeForm
      preview={isCollapsed && showPreview ? <ResumeInlinePreview /> : undefined}
      onTogglePreview={isCollapsed ? togglePreview : undefined}
      showPreview={showPreview}
    />
  );

  const previewContent = (
    <Resume onPreviewWidthChange={setPreviewColumnWidthPx} />
  );

  return (
    <>
      <WorkbenchLayout
        workbench={workbenchContent}
        preview={previewContent}
        isCollapsed={isCollapsed}
        previewColumnWidthPx={previewColumnWidthPx}
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
