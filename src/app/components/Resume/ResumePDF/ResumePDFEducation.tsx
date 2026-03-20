import { View } from "@react-pdf/renderer";
import {
  ResumePDFBulletList,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { useResumePDFStyle } from "components/Resume/ResumePDF/common/ResumePDFStyleContext";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeEducation } from "lib/redux/types";

export const ResumePDFEducation = ({
  heading,
  educations,
  themeColor,
  showBulletPoints,
  showGpa,
}: {
  heading: string;
  educations: ResumeEducation[];
  themeColor: string;
  showBulletPoints: boolean;
  showGpa: boolean;
}) => {
  const { schoolDegreeSpacing } = useResumePDFStyle();
  const schoolDegreeOffsetPt = schoolDegreeSpacing - 4.5;
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {educations.map(({ school, degree, gpa, date, descriptions = [] }, idx) => {
          // Hide school name if it is the same as the previous school
          const hideSchoolName =
            idx > 0 && school === educations[idx - 1].school;
          const showDescriptions = descriptions.join() !== "";
          const dateText = date ? `\u00A0${date}` : "";
          const gpaText =
            showGpa && gpa ? `\u00A0-\u00A0GPA: ${gpa}` : "";

          return (
            <View key={idx}>
              {!hideSchoolName && (
                <ResumePDFText bold={true} style={{ lineHeight: 1 }}>
                  {school.replace(/(\d)\s+(?=[\p{L}])/gu, "$1\u00A0")}
                </ResumePDFText>
              )}
              <View
                style={{
                  ...styles.flexRowBetween,
                  marginTop: hideSchoolName
                    ? "-" + spacing["1"]
                    : `${schoolDegreeOffsetPt}pt`,
                }}
              >
                <View style={{ ...styles.flexRow, flexGrow: 1, flexBasis: 0 }}>
                  <ResumePDFText style={{ lineHeight: 1 }}>{degree}</ResumePDFText>
                  {gpaText && (
                    <ResumePDFText style={{ fontSize: "9pt", lineHeight: 1 }}>
                      {gpaText}
                    </ResumePDFText>
                  )}
                </View>
                <ResumePDFText style={{ lineHeight: 1 }}>{dateText}</ResumePDFText>
              </View>
              {showDescriptions && (
                <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
                  <ResumePDFBulletList
                    items={descriptions}
                    showBulletPoints={showBulletPoints}
                  />
                </View>
              )}
            </View>
          );
        }
      )}
    </ResumePDFSection>
  );
};
