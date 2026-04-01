"use client";

import { useEffect, useState } from "react";

export type DocumentSize = "A4" | "Letter";
const WORKBENCH_COLLAPSE_WIDTH_PX = 900;

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
  void options;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const compute = () => {
      const screenWidthPx = window.innerWidth;
      if (screenWidthPx < WORKBENCH_COLLAPSE_WIDTH_PX) {
        setIsCollapsed(true);
        return;
      }

      setIsCollapsed(false);
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

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
