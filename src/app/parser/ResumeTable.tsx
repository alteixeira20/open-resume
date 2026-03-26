import { Fragment } from "react";
import type { Resume } from "lib/redux/types";
import { initialEducation, initialWorkExperience } from "lib/redux/resumeSlice";
import { deepClone } from "lib/deep-clone";
import { cx } from "lib/cx";

const TableRowHeader = ({ children }: { children: React.ReactNode }) => (
  <tr className="divide-x border-[color:var(--color-surface-border)] bg-[color:var(--color-forge-100)]/85">
    <th
      className="px-3 py-2 font-semibold text-[color:var(--color-text-primary)]"
      scope="colgroup"
      colSpan={2}
    >
      {children}
    </th>
  </tr>
);

const TableRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | string[];
  className?: string | false;
}) => (
  <tr className={cx("divide-x", className)}>
    <th
      className="px-3 py-2 font-medium text-[color:var(--color-text-primary)]"
      scope="row"
    >
      {label}
    </th>
    <td className="w-full px-3 py-2 text-[color:var(--color-text-secondary)]">
      {typeof value === "string"
        ? value
        : value.map((x, idx) => (
            <Fragment key={idx}>
              • {x}
              <br />
            </Fragment>
          ))}
    </td>
  </tr>
);

export const ResumeTable = ({ resume }: { resume: Resume }) => {
  const educations =
    resume.educations.length === 0
      ? [deepClone(initialEducation)]
      : resume.educations;
  const workExperiences =
    resume.workExperiences.length === 0
      ? [deepClone(initialWorkExperience)]
      : resume.workExperiences;
  const skills = [...resume.skills.descriptions];
  const featuredSkills = resume.skills.featuredSkills
    .filter((item) => item.skill.trim())
    .map((item) => item.skill)
    .join(", ")
    .trim();
  if (featuredSkills) {
    skills.unshift(featuredSkills);
  }
  return (
    <table className="w-full border border-[color:var(--color-surface-border)] text-sm">
      <tbody className="divide-y divide-[color:var(--color-surface-border)] text-left align-top">
        <TableRowHeader>Profile</TableRowHeader>
        <TableRow label="Name" value={resume.profile.name} />
        <TableRow label="Email" value={resume.profile.email} />
        <TableRow label="Phone" value={resume.profile.phone} />
        <TableRow label="Location" value={resume.profile.location} />
        <TableRow label="Link" value={resume.profile.url} />
        <TableRow label="GitHub" value={resume.profile.github} />
        <TableRow label="Summary" value={resume.profile.summary} />
        <TableRowHeader>Education</TableRowHeader>
        {educations.map((education, idx) => (
          <Fragment key={idx}>
            <TableRow label="School" value={education.school} />
            <TableRow label="Degree" value={education.degree} />
            {education.gpa && <TableRow label="GPA" value={education.gpa} />}
            <TableRow label="Date" value={education.date} />
            <TableRow
              label="Descriptions"
              value={education.descriptions}
              className={
                educations.length - 1 !== 0 &&
                idx !== educations.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>Work Experience</TableRowHeader>
        {workExperiences.map((workExperience, idx) => (
          <Fragment key={idx}>
            <TableRow label="Company" value={workExperience.company} />
            <TableRow label="Job Title" value={workExperience.jobTitle} />
            <TableRow label="Date" value={workExperience.date} />
            <TableRow
              label="Descriptions"
              value={workExperience.descriptions}
              className={
                workExperiences.length - 1 !== 0 &&
                idx !== workExperiences.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        {resume.projects.length > 0 && (
          <TableRowHeader>Projects</TableRowHeader>
        )}
        {resume.projects.map((project, idx) => (
          <Fragment key={idx}>
            <TableRow label="Project" value={project.project} />
            <TableRow label="Link" value={project.link} />
            <TableRow label="Date" value={project.date} />
            <TableRow
              label="Descriptions"
              value={project.descriptions}
              className={
                resume.projects.length - 1 !== 0 &&
                idx !== resume.projects.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>Skills</TableRowHeader>
        <TableRow label="Descriptions" value={skills} />
        {resume.languages.length > 0 && (
          <TableRowHeader>Languages</TableRowHeader>
        )}
        {resume.languages.map((language, idx) => (
          <Fragment key={idx}>
            <TableRow label="Language" value={language.language} />
            <TableRow label="Proficiency" value={language.proficiency} />
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};
