import { Form, FormSection } from "components/ResumeForm/Form";
import { Input } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeLanguages,
  selectLanguages,
} from "lib/redux/resumeSlice";
import type { ResumeLanguage } from "lib/redux/types";

export const LanguagesForm = () => {
  const languages = useAppSelector(selectLanguages);
  const dispatch = useAppDispatch();
  const showDelete = languages.length > 1;

  return (
    <Form form="languages" addButtonText="Add Language">
      {languages.map(({ language, proficiency }, idx) => {
        const handleLanguageChange = (
          field: keyof ResumeLanguage,
          value: string
        ) => {
          dispatch(changeLanguages({ idx, field, value }));
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== languages.length - 1;

        return (
          <FormSection
            key={idx}
            form="languages"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete language"
          >
            <Input
              name="language"
              label="Language"
              placeholder="English"
              value={language}
              onChange={handleLanguageChange}
              labelClassName="col-span-3"
            />
            <Input
              name="proficiency"
              label="Proficiency"
              placeholder="Native / C2 / Fluent"
              value={proficiency}
              onChange={handleLanguageChange}
              labelClassName="col-span-3"
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
