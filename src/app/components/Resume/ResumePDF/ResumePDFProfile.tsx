import { View } from "@react-pdf/renderer";
import {
  ResumePDFIcon,
  type IconType,
} from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import {
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { useResumePDFStyle } from "components/Resume/ResumePDF/common/ResumePDFStyleContext";
import type { ResumeProfile } from "lib/redux/types";

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
  bodyFontSize,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
  bodyFontSize: number;
}) => {
  const { name, email, phone, url, github, summary, location } = profile;
  const iconProps = { email, phone, location, url, github };
  const { nameFontSize, lineHeight } = useResumePDFStyle();
  const rowHeight = `${Number(lineHeight) * bodyFontSize}pt`;

  return (
    <ResumePDFSection style={{ marginTop: spacing["4"] }}>
      <ResumePDFText
        bold={true}
        themeColor={themeColor}
        style={{ fontSize: `${nameFontSize}pt` }}
      >
        {name}
      </ResumePDFText>
      <View
        style={{
          ...styles.flexRowBetween,
          flexWrap: "wrap",
          marginTop: spacing["0.5"],
        }}
      >
        {Object.entries(iconProps).map(([key, value]) => {
          if (!value) return null;

          let iconType: IconType;
          switch (key) {
            case "email":
              iconType = "email";
              break;
            case "phone":
              iconType = "phone";
              break;
            case "location":
              iconType = "location";
              break;
            case "github":
              iconType = "url_github";
              break;
            case "url":
            default:
              if (value.includes("github")) {
                iconType = "url_github";
              } else if (value.includes("linkedin")) {
                iconType = "url_linkedin";
              } else {
                iconType = "url";
              }
              break;
          }

          const shouldUseLinkWrapper = ["email", "url", "phone", "github"].includes(key);
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!shouldUseLinkWrapper) return <>{children}</>;

            let src = "";
            switch (key) {
              case "email": {
                src = `mailto:${value}`;
                break;
              }
              case "phone": {
                src = `tel:${value.replace(/[^\d+]/g, "")}`; // Keep only + and digits
                break;
              }
              default: {
                src = value.startsWith("http") ? value : `https://${value}`;
              }
            }

            return (
              <ResumePDFLink src={src} isPDF={isPDF}>
                {children}
              </ResumePDFLink>
            );
          };

          return (
            <View
              key={key}
              style={{
                ...styles.flexRow,
                alignItems: "center",
                gap: spacing["1"],
                height: rowHeight,
              }}
            >
              <View
                style={{
                  height: rowHeight,
                  justifyContent: "center",
                }}
              >
                <ResumePDFIcon type={iconType} isPDF={isPDF} />
              </View>
              <Wrapper>
                <ResumePDFText>{value}</ResumePDFText>
              </Wrapper>
            </View>
          );
        })}
      </View>
      {summary && <ResumePDFText style={{ marginTop: spacing["1"] }}>{summary}</ResumePDFText>}
    </ResumePDFSection>
  );
};
