"use client";

interface WorkbenchPreviewProps {
  children: React.ReactNode;
}

export const WorkbenchPreview = ({ children }: WorkbenchPreviewProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start overflow-hidden">
      {children}
    </div>
  );
};

export default WorkbenchPreview;
