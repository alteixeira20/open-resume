"use client";

import { useEffect, useState } from "react";
import { CSS_VARIABLES } from "globals-css";
import { getPxPerRem } from "lib/get-px-per-rem";
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  LETTER_HEIGHT_PX,
  LETTER_WIDTH_PX,
} from "lib/constants";
import { WORKBENCH_UI } from "components/layout/workbench-ui";

export type DocumentSize = "A4" | "Letter";

interface UseWorkbenchCollapseOptions {
  documentSize?: DocumentSize;
}

interface WorkbenchCollapseResult {
  isCollapsed: boolean;
  showPreview: boolean;
  togglePreview: () => void;
}

export function useWorkbenchCollapse(
  options: UseWorkbenchCollapseOptions = {}
): WorkbenchCollapseResult {
  const { documentSize } = options;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const compute = () => {
      const screenWidthPx = window.innerWidth;
      const screenHeightPx = window.innerHeight;
      const PX_PER_REM = getPxPerRem();
      const topNavBarHeightRem = parseFloat(
        CSS_VARIABLES["--top-nav-bar-height"]
      );
      const panelPaddingPx = Math.min(
        Math.max(1.5 * PX_PER_REM, screenWidthPx * 0.04),
        3 * PX_PER_REM
      );
      const panelVerticalPaddingPx = (1.5 + 1) * PX_PER_REM;
      const isSplit = screenWidthPx >= 768;

      if (!isSplit) {
        setIsCollapsed(true);
        return;
      }

      if (screenWidthPx >= 1400) {
        setIsCollapsed(false);
        return;
      }

      if (!documentSize) {
        setIsCollapsed(false);
        return;
      }

      const workbenchWidthPx = Math.min(screenWidthPx, 1820);
      const previewPaneWidthPx = WORKBENCH_UI.previewPanePreferredWidthPx;
      const minimumExpandedWidthPx =
        WORKBENCH_UI.workbenchMinWidthPx + previewPaneWidthPx;

      if (workbenchWidthPx < minimumExpandedWidthPx) {
        setIsCollapsed(true);
        return;
      }

      const availableWidthPx = previewPaneWidthPx - panelPaddingPx * 2;
      const availableHeightPx =
        screenHeightPx -
        topNavBarHeightRem * PX_PER_REM -
        panelVerticalPaddingPx;
      const docHeight = documentSize === "A4" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;
      const docWidth = documentSize === "A4" ? A4_WIDTH_PX : LETTER_WIDTH_PX;
      const heightScale = availableHeightPx / docHeight;
      const widthScale = availableWidthPx / docWidth;
      const effectiveScale = Math.min(widthScale, heightScale);
      setIsCollapsed(effectiveScale < 0.68);
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [documentSize]);

  useEffect(() => {
    if (!isCollapsed) setShowPreview(false);
  }, [isCollapsed]);

  const togglePreview = () => {
    setShowPreview((prev) => {
      const next = !prev;
      if (next) {
        window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
      }
      return next;
    });
  };

  return { isCollapsed, showPreview, togglePreview };
}
