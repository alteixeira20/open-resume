import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import type { ResumeWorkExperience } from "lib/redux/types";
import {
  changeShowBulletPoints,
  selectShowBulletPoints,
} from "lib/redux/settingsSlice";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();

  const showDelete = workExperiences.length > 1;
  const form = "workExperiences";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));

  return (
    <Form form="workExperiences" addButtonText="Add Job">
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          // TS doesn't support passing union type to single call signature
          // https://github.com/microsoft/TypeScript/issues/54027
          // any is used here as a workaround
          dispatch(changeWorkExperiences({ idx, field, value } as any));
        };
        const handleShowBulletPoints = (value: boolean) => {
          dispatch(changeShowBulletPoints({ field: form, value }));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;

        return (
          <FormSection
            key={idx}
            form="workExperiences"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete job"
          >
            <Input
              label="Company"
              labelClassName="col-span-full"
              name="company"
              placeholder="Khan Academy"
              value={company}
              maxLength={120}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label="Job Title"
              labelClassName="col-span-4"
              name="jobTitle"
              placeholder="Software Engineer"
              value={jobTitle}
              maxLength={100}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label="Date"
              labelClassName="col-span-2"
              name="date"
              placeholder="Jun 2022 - Present"
              value={date}
              maxLength={60}
              onChange={handleWorkExperienceChange}
            />
            <BulletListTextarea
              label="Description"
              labelClassName="col-span-full"
              labelAction={
                <BulletListIconButton
                  showBulletPoints={showBulletPoints}
                  onClick={handleShowBulletPoints}
                />
              }
              name="descriptions"
              placeholder="Bullet points"
              value={descriptions}
              maxLength={200}
              onChange={handleWorkExperienceChange}
              showBulletPoints={showBulletPoints}
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
