import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles } from "components/Resume/ResumePDF/styles";
import { useResumePDFStyle } from "components/Resume/ResumePDF/common/ResumePDFStyleContext";
import type { ResumeLanguage } from "lib/redux/types";

export const ResumePDFLanguages = ({
  heading,
  languages,
  themeColor,
}: {
  heading: string;
  languages: ResumeLanguage[];
  themeColor: string;
}) => {
  const { languagesSpacing } = useResumePDFStyle();
  const rowGapPt = languagesSpacing - 6;
  const normalizeLanguage = (value: string) =>
    value.replace(/[\s\u2012\u2013\u2014\u2015\u2212\u2010\u00ad\-:]+$/g, "").trim();
  const normalizeProficiency = (value: string) =>
    value.replace(/^[\s\u2012\u2013\u2014\u2015\u2212\u2010\u00ad\-:]+/g, "").trim();

  const filtered = languages
    .map((item) => ({
      language: normalizeLanguage(item.language),
      proficiency: normalizeProficiency(item.proficiency),
    }))
    .filter((item) => item.language || item.proficiency);

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      <View style={{ ...styles.flexCol }}>
        {filtered.map(({ language, proficiency }, idx) => (
          <View
            key={idx}
            style={idx !== 0 ? { marginTop: `${rowGapPt}pt` } : {}}
          >
            <ResumePDFText style={{ lineHeight: 1 }}>
              {language}
              {language && proficiency ? " — " : ""}
              {proficiency}
            </ResumePDFText>
          </View>
        ))}
      </View>
    </ResumePDFSection>
  );
};
