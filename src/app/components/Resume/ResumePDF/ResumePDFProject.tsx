import { Text, View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
  ResumePDFLink,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeProject } from "lib/redux/types";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
  isPDF,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
  isPDF: boolean;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {projects.map(({ project, link, date, descriptions }, idx) => {
        const normalizedLink =
          link && (link.startsWith("http") ? link : `https://${link}`);
        const dateText = date ? `\u00A0${date}` : "";
        return (
        <View key={idx}>
          <View
            style={{
              ...styles.flexRowBetween,
              marginTop: spacing["0.5"],
            }}
          >
            {normalizedLink ? (
              <ResumePDFLink src={normalizedLink} isPDF={isPDF}>
                <ResumePDFText bold={true}>
                  {project}
                  <Text style={{ fontWeight: "normal", fontSize: "9pt" }}>
                    {`\u00A0-\u00A0${normalizedLink}`}
                  </Text>
                </ResumePDFText>
              </ResumePDFLink>
            ) : (
              <ResumePDFText bold={true}>{project}</ResumePDFText>
            )}
            <ResumePDFText>{dateText}</ResumePDFText>
          </View>
          <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
            <ResumePDFBulletList items={descriptions} />
          </View>
        </View>
        );
      })}
    </ResumePDFSection>
  );
};
