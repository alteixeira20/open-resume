import { createContext, useContext } from "react";

export type ResumePDFStyleSettings = {
  lineHeight: number;
  sectionSpacing: number;
  linksSummarySpacing: number;
  languagesSpacing: number;
  companyRoleSpacing: number;
  companyItemSpacing: number;
  companyDescriptionSpacing: number;
  schoolDegreeSpacing: number;
  educationDescriptionSpacing: number;
  projectItemSpacing: number;
  nameFontSize: number;
  sectionHeadingSize: number;
};

const ResumePDFStyleContext = createContext<ResumePDFStyleSettings>({
  lineHeight: 1,
  sectionSpacing: 1,
  linksSummarySpacing: 20,
  languagesSpacing: 0,
  companyRoleSpacing: 4.5,
  companyItemSpacing: 6,
  companyDescriptionSpacing: 4.5,
  schoolDegreeSpacing: 4.5,
  educationDescriptionSpacing: 4.5,
  projectItemSpacing: 6,
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
