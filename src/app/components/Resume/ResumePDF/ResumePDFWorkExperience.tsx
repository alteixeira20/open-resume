import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { useResumePDFStyle } from "components/Resume/ResumePDF/common/ResumePDFStyleContext";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeWorkExperience } from "lib/redux/types";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
}) => {
  const { companyRoleSpacing, companyItemSpacing } = useResumePDFStyle();
  const companyRoleOffsetPt = companyRoleSpacing - 4.5;
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        // Hide company name if it is the same as the previous company
        const hideCompanyName =
          idx > 0 && company === workExperiences[idx - 1].company;
        const dateText = date ? `\u00A0${date}` : "";

        return (
          <View
            key={idx}
            style={idx !== 0 ? { marginTop: `${companyItemSpacing}pt` } : {}}
          >
            {!hideCompanyName && (
              <ResumePDFText bold={true} style={{ lineHeight: 1 }}>
                {company}
              </ResumePDFText>
            )}
            <View
              style={{
                ...styles.flexRowBetween,
                marginTop: hideCompanyName
                  ? "-" + spacing["1"]
                  : `${companyRoleOffsetPt}pt`,
              }}
            >
              <ResumePDFText style={{ lineHeight: 1 }}>{jobTitle}</ResumePDFText>
              <ResumePDFText style={{ lineHeight: 1 }}>{dateText}</ResumePDFText>
            </View>
            <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
              <ResumePDFBulletList items={descriptions} />
            </View>
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
