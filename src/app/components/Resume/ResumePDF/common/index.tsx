import { Text, View, Link } from "@react-pdf/renderer";
import { Children } from "react";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import { useResumePDFStyle } from "components/Resume/ResumePDF/common/ResumePDFStyleContext";

export const ResumePDFSection = ({
  themeColor,
  heading,
  style = {},
  children,
}: {
  themeColor?: string;
  heading?: string;
  style?: Style;
  children: React.ReactNode;
}) => {
  const { sectionSpacing, sectionHeadingSize } = useResumePDFStyle();
  const toPt = (value: string) => Number(value.replace("pt", ""));
  const scalePt = (value: string, factor: number) =>
    `${toPt(value) * factor}pt`;
  const spacingFactor =
    Number.isFinite(sectionSpacing) && sectionSpacing > 0
      ? sectionSpacing
      : 1;
  const sectionSpacingValues = {
    marginTop: scalePt(spacing["5"], spacingFactor),
    gap: scalePt(spacing["2"], spacingFactor),
  };
  const headingContentGap = sectionSpacingValues.marginTop;
  const contentNodes = Children.toArray(children);

  return (
    <View
      style={{
        ...styles.flexCol,
        marginTop: sectionSpacingValues.marginTop,
        ...style,
      }}
    >
      {heading && (
        <View style={{ ...styles.flexRow, alignItems: "center" }}>
          {themeColor && (
            <View
              style={{
                height: "3.75pt",
                width: "30pt",
                backgroundColor: themeColor,
                marginRight: spacing["3.5"],
              }}
              debug={DEBUG_RESUME_PDF_FLAG}
            />
          )}
          <Text
            style={{
              fontWeight: "bold",
              letterSpacing: "0.3pt", // tracking-wide -> 0.025em * 12 pt = 0.3pt
              fontSize: `${sectionHeadingSize}pt`,
            }}
            debug={DEBUG_RESUME_PDF_FLAG}
          >
            {heading}
          </Text>
        </View>
      )}
      <View
        style={{
          marginTop: heading ? headingContentGap : spacing["0"],
        }}
      >
        {contentNodes}
      </View>
    </View>
  );
};

export const ResumePDFText = ({
  bold = false,
  themeColor,
  style = {},
  disableSoftWrap = false,
  children,
}: {
  bold?: boolean;
  themeColor?: string;
  style?: Style;
  disableSoftWrap?: boolean;
  children: React.ReactNode;
}) => {
  const { lineHeight } = useResumePDFStyle();
  const softWrapText = (value: string) => {
    const chunkSize = 24;
    if (value.length <= chunkSize) return value;
    const parts: string[] = [];
    for (let i = 0; i < value.length; i += chunkSize) {
      parts.push(value.slice(i, i + chunkSize));
    }
    return parts.join("\u200b");
  };
  const content =
    typeof children === "string" && !disableSoftWrap
      ? softWrapText(children)
      : children;
  return (
    <Text
      style={{
        color: themeColor || DEFAULT_FONT_COLOR,
        fontWeight: bold ? "bold" : "normal",
        lineHeight,
        ...style,
      }}
      debug={DEBUG_RESUME_PDF_FLAG}
    >
      {content}
    </Text>
  );
};

export const ResumePDFBulletList = ({
  items,
  showBulletPoints = true,
}: {
  items: string[];
  showBulletPoints?: boolean;
}) => {
  const { lineHeight } = useResumePDFStyle();
  return (
    <>
      {items.map((item, idx) => (
        <View style={{ ...styles.flexRow }} key={idx}>
          {showBulletPoints && (
            <ResumePDFText
              style={{
                paddingLeft: spacing["2"],
                paddingRight: spacing["2"],
                lineHeight,
              }}
              bold={true}
            >
              {"•"}
            </ResumePDFText>
          )}
          {/* A breaking change was introduced causing text layout to be wider than node's width
              https://github.com/diegomura/react-pdf/issues/2182. flexGrow & flexBasis fixes it */}
          <ResumePDFText
            style={{ lineHeight, flexGrow: 1, flexBasis: 0 }}
          >
            {item}
          </ResumePDFText>
        </View>
      ))}
    </>
  );
};

export const ResumePDFLink = ({
  src,
  isPDF,
  children,
}: {
  src: string;
  isPDF: boolean;
  children: React.ReactNode;
}) => {
  if (isPDF) {
    return (
      <Link
        src={src}
        style={{ textDecoration: "none", color: DEFAULT_FONT_COLOR }}
      >
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none" }}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const ResumeFeaturedSkill = ({
  skill,
  rating,
  themeColor,
  style = {},
}: {
  skill: string;
  rating: number;
  themeColor: string;
  style?: Style;
}) => {
  const numCircles = 5;

  return (
    <View style={{ ...styles.flexRow, alignItems: "center", ...style }}>
      <ResumePDFText style={{ marginRight: spacing[0.5] }}>
        {skill}
      </ResumePDFText>
      {[...Array(numCircles)].map((_, idx) => (
        <View
          key={idx}
          style={{
            height: "9pt",
            width: "9pt",
            marginLeft: "2.25pt",
            backgroundColor: rating >= idx ? themeColor : "#d9d9d9",
            borderRadius: "100%",
          }}
        />
      ))}
    </View>
  );
};
