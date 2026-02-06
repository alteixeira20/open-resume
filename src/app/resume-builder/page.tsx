"use client";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { ResumeDownloadBridge } from "components/Resume/ResumeDownloadBridge";
import { ResumeInlinePreview } from "components/Resume/ResumeInlinePreview";
import { useAppSelector } from "lib/redux/hooks";
import { selectSettings } from "lib/redux/settingsSlice";
import { CSS_VARIABLES } from "globals-css";
import { getPxPerRem } from "lib/get-px-per-rem";
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  LETTER_HEIGHT_PX,
  LETTER_WIDTH_PX,
} from "lib/constants";

const BuilderContent = () => {
  const settings = useAppSelector(selectSettings);
  const [shouldCollapsePreview, setShouldCollapsePreview] = useState(false);

  useEffect(() => {
    const computeShouldCollapse = () => {
      const screenHeightPx = window.innerHeight;
      const screenWidthPx = window.innerWidth;
      const PX_PER_REM = getPxPerRem();
      const screenHeightRem = screenHeightPx / PX_PER_REM;
      const topNavBarHeightRem = parseFloat(
        CSS_VARIABLES["--top-nav-bar-height"]
      );
      const resumePadding = parseFloat(CSS_VARIABLES["--resume-padding"]);
      const topAndBottomResumePadding = resumePadding * 2;
      const isSplitLayout = screenWidthPx >= 768;
      const availableWidthPx =
        (isSplitLayout ? screenWidthPx / 2 : screenWidthPx) -
        topAndBottomResumePadding * PX_PER_REM;
      const defaultResumeHeightRem =
        screenHeightRem -
        topNavBarHeightRem -
        topAndBottomResumePadding;
      const resumeHeightPx = defaultResumeHeightRem * PX_PER_REM;
      const height =
        settings.documentSize === "A4" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;
      const width =
        settings.documentSize === "A4" ? A4_WIDTH_PX : LETTER_WIDTH_PX;
      const heightScale = resumeHeightPx / height;
      const widthScale = availableWidthPx / width;
      const defaultScale =
        Math.round(Math.min(heightScale, widthScale, 1) * 100) / 100;
      const collapse = defaultScale < 0.6 || screenWidthPx < 768;
      setShouldCollapsePreview(collapse);
    };

    computeShouldCollapse();
    window.addEventListener("resize", computeShouldCollapse);
    return () => {
      window.removeEventListener("resize", computeShouldCollapse);
    };
  }, [settings.documentSize]);

  return (
    <>
      <main className="relative h-[calc(100vh-var(--top-nav-bar-height)-20px)] w-full overflow-hidden bg-gray-50">
        <div className="mx-auto grid h-full w-full max-w-screen-2xl grid-cols-3 gap-6 px-[var(--resume-padding)] py-0 md:grid-cols-6">
          <div
            className={`min-h-0 min-w-0 ${
              shouldCollapsePreview ? "col-span-3 md:col-span-6" : "col-span-3"
            }`}
          >
            <ResumeForm
              preview={shouldCollapsePreview ? <ResumeInlinePreview /> : undefined}
              showRefreshButton={!shouldCollapsePreview}
            />
          </div>
          {!shouldCollapsePreview && (
            <div className="col-span-3 min-h-0 min-w-0 hidden md:block">
              <Resume />
            </div>
          )}
        </div>
        <ResumeDownloadBridge />
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-50 h-5 bg-gray-50" />
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
