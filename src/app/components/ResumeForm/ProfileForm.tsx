import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { ResumeProfile } from "lib/redux/types";
import { RESUME_LOCALE_LABELS } from "lib/resume-locale";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const { name, email, phone, url, github, summary, location } = profile;
  const labels = RESUME_LOCALE_LABELS[settings.resumeLocale];

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    dispatch(changeProfile({ field, value }));
  };

  return (
    <BaseForm id="section-profile">
      <div className="flex items-center gap-2">
        <UserCircleIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
        <h1 className="text-lg font-semibold tracking-wide text-gray-900">
          Personal Information
        </h1>
      </div>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label="Name"
          labelClassName="col-span-full"
          name="name"
          placeholder="Sal Khan"
          value={name}
          onChange={handleProfileChange}
        />
        <Textarea
          label={labels.profileSummaryLabel}
          labelClassName="col-span-full"
          name="summary"
          placeholder={labels.profileSummaryPlaceholder}
          value={summary}
          onChange={handleProfileChange}
        />
        <Input
          label="Email"
          labelClassName="col-span-4"
          name="email"
          placeholder="hello@khanacademy.org"
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label="Phone"
          labelClassName="col-span-2"
          name="phone"
          placeholder={labels.profilePhonePlaceholder}
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label={labels.profileWebsiteLabel}
          labelClassName="col-span-3"
          name="url"
          placeholder="linkedin.com/in/khanacademy"
          value={url}
          onChange={handleProfileChange}
        />
        <Input
          label={labels.profileGithubLabel}
          labelClassName="col-span-3"
          name="github"
          placeholder={labels.profileGithubPlaceholder}
          value={github}
          onChange={handleProfileChange}
        />
        <Input
          label="Location"
          labelClassName="col-span-full"
          name="location"
          placeholder={labels.profileLocationPlaceholder}
          value={location}
          onChange={handleProfileChange}
        />
      </div>
    </BaseForm>
  );
};
