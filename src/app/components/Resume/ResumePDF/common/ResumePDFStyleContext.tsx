import { createContext, useContext } from "react";

export type ResumePDFStyleSettings = {
  lineHeight: number;
  sectionSpacing: number;
  nameFontSize: number;
  sectionHeadingSize: number;
};

const ResumePDFStyleContext = createContext<ResumePDFStyleSettings>({
  lineHeight: 1.3,
  sectionSpacing: 1,
  nameFontSize: 20,
  sectionHeadingSize: 11,
});

export const ResumePDFStyleProvider = ({
  value,
  children,
}: {
  value: ResumePDFStyleSettings;
  children: React.ReactNode;
}) => (
  <ResumePDFStyleContext.Provider value={value}>
    {children}
  </ResumePDFStyleContext.Provider>
);

export const useResumePDFStyle = () => useContext(ResumePDFStyleContext);
