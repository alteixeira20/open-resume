import { View, Link } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
  ResumePDFLink,
} from "components/Resume/ResumePDF/common";
import { useResumePDFStyle } from "components/Resume/ResumePDF/common/ResumePDFStyleContext";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeProject } from "lib/redux/types";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
  isPDF,
  showBulletPoints,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
  isPDF: boolean;
  showBulletPoints: boolean;
}) => {
  const { projectItemSpacing } = useResumePDFStyle();
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {projects.map(({ project, link, date, descriptions }, idx) => {
        const normalizedLink =
          link && (link.startsWith("http") ? link : `https://${link}`);
        const dateText = date ? `\u00A0${date}` : "";
        return (
          <View
            key={idx}
            style={idx !== 0 ? { marginTop: `${projectItemSpacing}pt` } : {}}
          >
            <View style={{ ...styles.flexRowBetween }}>
              {normalizedLink ? (
                isPDF ? (
                  <Link src={normalizedLink} style={{ textDecoration: "none" }}>
                    <ResumePDFText bold={true} disableSoftWrap={true}>
                      {project}
                    </ResumePDFText>
                  </Link>
                ) : (
                  <ResumePDFLink src={normalizedLink} isPDF={false}>
                    <ResumePDFText bold={true} disableSoftWrap={true}>
                      {project}
                    </ResumePDFText>
                  </ResumePDFLink>
                )
              ) : (
                <ResumePDFText bold={true}>{project}</ResumePDFText>
              )}
              <ResumePDFText>{dateText}</ResumePDFText>
            </View>
            {normalizedLink && (
              <View style={{ marginTop: spacing["0.5"] }}>
                <ResumePDFLink src={normalizedLink} isPDF={isPDF}>
                  <ResumePDFText disableSoftWrap={true}>
                    {normalizedLink}
                  </ResumePDFText>
                </ResumePDFLink>
              </View>
            )}
            <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
              <ResumePDFBulletList
                items={descriptions}
                showBulletPoints={showBulletPoints}
              />
            </View>
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
