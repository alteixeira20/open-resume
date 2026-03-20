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
  const { nameFontSize, linksSummarySpacing } = useResumePDFStyle();
  const iconRowLineHeight = 1;
  const iconBoxSize = "11pt";
  const iconRowTextOffsetPt = 1;
  const iconRowIconOffsetPt = -2.5;

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
          marginTop: spacing["4"],
          marginBottom: `${linksSummarySpacing}pt`,
        }}
      >
        {(() => {
          const items = Object.entries(iconProps)
            .map(([key, value]) => ({ key, value }))
            .filter((item) => item.value);
          const firstRow = items.filter((item) =>
            ["email", "phone", "location"].includes(item.key)
          );
          const secondRow = items.filter((item) =>
            ["url", "github"].includes(item.key)
          );

          const renderItem = (key: string, value: string) => {
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

            const shouldUseLinkWrapper = ["email", "url", "phone", "github"].includes(
              key
            );
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
                }}
              >
                <View
                  style={{
                    width: spacing["4"],
                    height: iconBoxSize,
                    marginRight: spacing["1"],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    top: `${iconRowIconOffsetPt}pt`,
                  }}
                >
                  <ResumePDFIcon type={iconType} isPDF={isPDF} />
                </View>
                {shouldUseLinkWrapper ? (
                  <View style={{ display: "flex", justifyContent: "center" }}>
                    <ResumePDFLink src={src} isPDF={isPDF}>
                      <ResumePDFText
                        disableSoftWrap={true}
                        style={{
                          lineHeight: iconRowLineHeight,
                          position: "relative",
                          top: iconRowTextOffsetPt,
                        }}
                      >
                        {value}
                      </ResumePDFText>
                    </ResumePDFLink>
                  </View>
                ) : (
                  <View style={{ display: "flex", justifyContent: "center" }}>
                    <ResumePDFText
                      style={{
                        lineHeight: iconRowLineHeight,
                        position: "relative",
                        top: iconRowTextOffsetPt,
                      }}
                    >
                      {value}
                    </ResumePDFText>
                  </View>
                )}
              </View>
            );
          };

          return (
            <>
              {firstRow.length > 0 && (
                <View style={{ ...styles.flexRowBetween }}>
                  {firstRow.map((item) => renderItem(item.key, item.value))}
                </View>
              )}
              {secondRow.length > 0 && (
                <View style={{ ...styles.flexRowBetween, marginTop: "0pt" }}>
                  {secondRow.map((item) => renderItem(item.key, item.value))}
                </View>
              )}
            </>
          );
        })()}
      </View>
      {summary && (
        <View>
          <ResumePDFText>{summary}</ResumePDFText>
        </View>
      )}
    </ResumePDFSection>
  );
};
