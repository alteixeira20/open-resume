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
  const { nameFontSize } = useResumePDFStyle();
  const iconRowLineHeight = 1.1;
  const rowHeight = `${iconRowLineHeight * bodyFontSize}pt`;

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
          let src = "";
          if (shouldUseLinkWrapper) {
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
          }

          return (
            <View
              key={key}
              style={{
                ...styles.flexRow,
                alignItems: "center",
                marginTop: spacing["0.5"],
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: spacing["1"],
                }}
              >
                <View
                  style={{
                    width: spacing["4"],
                    height: rowHeight,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ResumePDFIcon type={iconType} isPDF={isPDF} />
                </View>
              </View>
              {shouldUseLinkWrapper ? (
                <View
                  style={{
                    minHeight: rowHeight,
                    justifyContent: "center",
                    paddingTop: "8pt",
                  }}
                >
                  <ResumePDFLink src={src} isPDF={isPDF}>
                    <ResumePDFText
                      disableSoftWrap={true}
                      style={{ lineHeight: iconRowLineHeight }}
                    >
                      {value}
                    </ResumePDFText>
                  </ResumePDFLink>
                </View>
              ) : (
                <View
                  style={{
                    minHeight: rowHeight,
                    justifyContent: "center",
                    paddingTop: "8pt",
                  }}
                >
                  <ResumePDFText style={{ lineHeight: iconRowLineHeight }}>
                    {value}
                  </ResumePDFText>
                </View>
              )}
            </View>
          );
        })}
      </View>
      {summary && <ResumePDFText style={{ marginTop: spacing["1"] }}>{summary}</ResumePDFText>}
    </ResumePDFSection>
  );
};
