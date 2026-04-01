import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumeFeaturedSkill,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeSkills } from "lib/redux/types";

export const ResumePDFSkills = ({
  heading,
  skills,
  themeColor,
  showTechnicalBulletPoints,
  showSoftSkillsBulletPoints,
}: {
  heading: string;
  skills: ResumeSkills;
  themeColor: string;
  showTechnicalBulletPoints: boolean;
  showSoftSkillsBulletPoints: boolean;
}) => {
  const {
    descriptions,
    featuredSkills,
    technicalTitle = "Technical",
    technicalDescriptions = descriptions,
    softSkillsTitle = "Soft Skills",
    softSkillsDescriptions = [],
  } = skills;
  const featuredSkillsWithText = featuredSkills.filter((item) => item.skill);
  const hasTechnicalBlock =
    Boolean(technicalTitle.trim()) || technicalDescriptions.length > 0;
  const hasSoftSkillsBlock =
    Boolean(softSkillsTitle.trim()) || softSkillsDescriptions.length > 0;
  const featuredSkillsPair = [
    [featuredSkillsWithText[0], featuredSkillsWithText[3]],
    [featuredSkillsWithText[1], featuredSkillsWithText[4]],
    [featuredSkillsWithText[2], featuredSkillsWithText[5]],
  ];

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {featuredSkillsWithText.length > 0 && (
        <View style={{ ...styles.flexRowBetween, marginTop: spacing["0.5"] }}>
          {featuredSkillsPair.map((pair, idx) => (
            <View
              key={idx}
              style={{
                ...styles.flexCol,
              }}
            >
              {pair.map((featuredSkill, idx) => {
                if (!featuredSkill) return null;
                return (
                  <ResumeFeaturedSkill
                    key={idx}
                    skill={featuredSkill.skill}
                    rating={featuredSkill.rating}
                    themeColor={themeColor}
                    style={{
                      justifyContent: "flex-end",
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>
      )}
      <View style={{ ...styles.flexCol }}>
        {hasTechnicalBlock && (
          <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
            {technicalTitle.trim() && (
              <ResumePDFText bold={true}>{`${technicalTitle.trim()}:`}</ResumePDFText>
            )}
            {technicalDescriptions.length > 0 && (
              <View style={{ marginTop: spacing["0.5"] }}>
                <ResumePDFBulletList
                  items={technicalDescriptions}
                  showBulletPoints={showTechnicalBulletPoints}
                />
              </View>
            )}
          </View>
        )}
        {hasSoftSkillsBlock && (
          <View style={{ ...styles.flexCol, marginTop: spacing["2"] }}>
            {softSkillsTitle.trim() && (
              <ResumePDFText bold={true}>{`${softSkillsTitle.trim()}:`}</ResumePDFText>
            )}
            {softSkillsDescriptions.length > 0 && (
              <View style={{ marginTop: spacing["0.5"] }}>
                <ResumePDFBulletList
                  items={softSkillsDescriptions}
                  showBulletPoints={showSoftSkillsBulletPoints}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </ResumePDFSection>
  );
};
