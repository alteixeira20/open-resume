import { Form } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
  InputGroupWrapper,
} from "components/ResumeForm/Form/InputGroup";
import { FeaturedSkillInput } from "components/ResumeForm/Form/FeaturedSkillInput";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectSkills, changeSkills } from "lib/redux/resumeSlice";
import {
  selectShowBulletPoints,
  changeShowBulletPoints,
  selectThemeColor,
} from "lib/redux/settingsSlice";

export const SkillsForm = () => {
  const skills = useAppSelector(selectSkills);
  const dispatch = useAppDispatch();
  const {
    featuredSkills,
    technicalTitle = "Technical",
    technicalDescriptions = [],
    softSkillsTitle = "Soft Skills",
    softSkillsDescriptions = [],
  } = skills;
  const technicalBulletPoints = useAppSelector(selectShowBulletPoints("skills"));
  const softSkillsBulletPoints = useAppSelector(
    selectShowBulletPoints("softSkills")
  );
  const themeColor = useAppSelector(selectThemeColor) || "#38bdf8";
  const [showFeaturedSkills, setShowFeaturedSkills] = useState(false);

  const handleFeaturedSkillsChange = (
    idx: number,
    skill: string,
    rating: number
  ) => {
    dispatch(changeSkills({ field: "featuredSkills", idx, skill, rating }));
  };
  const handleShowTechnicalBulletPoints = (value: boolean) => {
    dispatch(changeShowBulletPoints({ field: "skills", value }));
  };
  const handleShowSoftSkillsBulletPoints = (value: boolean) => {
    dispatch(changeShowBulletPoints({ field: "softSkills", value }));
  };

  return (
    <Form form="skills">
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="col-span-full">
          <Input
            label="Technical Skills Title"
            labelClassName="col-span-full"
            name="technicalTitle"
            placeholder="Technical"
            value={technicalTitle}
            maxLength={40}
            onChange={(field, value) =>
              dispatch(changeSkills({ field, value }))
            }
          />
          <BulletListTextarea
            label="Description"
            labelClassName="col-span-full"
            labelAction={
              <BulletListIconButton
                showBulletPoints={technicalBulletPoints}
                onClick={handleShowTechnicalBulletPoints}
              />
            }
            name="technicalDescriptions"
            placeholder="One skill per line"
            value={technicalDescriptions}
            maxLength={420}
            onChange={(field, value) =>
              dispatch(changeSkills({ field, value }))
            }
            showBulletPoints={technicalBulletPoints}
          />
        </div>
        <div className="col-span-full">
          <Input
            label="Soft Skills Title"
            labelClassName="col-span-full"
            name="softSkillsTitle"
            placeholder="Soft Skills"
            value={softSkillsTitle}
            maxLength={40}
            onChange={(field, value) =>
              dispatch(changeSkills({ field, value }))
            }
          />
          <BulletListTextarea
            label="Description"
            labelClassName="col-span-full"
            labelAction={
              <BulletListIconButton
                showBulletPoints={softSkillsBulletPoints}
                onClick={handleShowSoftSkillsBulletPoints}
              />
            }
            name="softSkillsDescriptions"
            placeholder="Optional second list"
            value={softSkillsDescriptions}
            maxLength={420}
            onChange={(field, value) =>
              dispatch(changeSkills({ field, value }))
            }
            showBulletPoints={softSkillsBulletPoints}
          />
        </div>
        <div className="col-span-full mb-4 mt-6 border-t-2 border-dotted border-gray-200" />
        <div className="col-span-full flex items-center justify-between gap-4">
          <InputGroupWrapper label="Featured Skills (Optional)" />
          <button
            type="button"
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 hover:border-gray-400 hover:text-gray-800"
            onClick={() => setShowFeaturedSkills((prev) => !prev)}
          >
            {showFeaturedSkills ? "Hide" : "Show"}
          </button>
        </div>
        {showFeaturedSkills && (
          <>
            <InputGroupWrapper
              label="Featured Skills (Optional)"
              className="col-span-full"
            >
              <p className="mt-2 text-sm font-normal text-gray-600">
                Featured skills is optional to highlight top skills, with more
                circles mean higher proficiency.
              </p>
            </InputGroupWrapper>
            {featuredSkills.map(({ skill, rating }, idx) => (
              <FeaturedSkillInput
                key={idx}
                className="col-span-3"
                skill={skill}
                rating={rating}
                setSkillRating={(newSkill, newRating) => {
                  handleFeaturedSkillsChange(idx, newSkill, newRating);
                }}
                placeholder={`Featured Skill ${idx + 1}`}
                circleColor={themeColor}
                maxLength={60}
              />
            ))}
          </>
        )}
      </div>
    </Form>
  );
};
