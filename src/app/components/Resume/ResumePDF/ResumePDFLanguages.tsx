import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
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
  const filtered = languages.filter(
    (item) => item.language || item.proficiency
  );

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      <View style={{ ...styles.flexCol, gap: spacing["1"] }}>
        {filtered.map(({ language, proficiency }, idx) => (
          <ResumePDFText key={idx}>
            {language}
            {language && proficiency ? " — " : ""}
            {proficiency}
          </ResumePDFText>
        ))}
      </View>
    </ResumePDFSection>
  );
};
