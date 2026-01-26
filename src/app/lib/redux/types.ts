export interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  url: string;
  github: string;
  summary: string;
  location: string;
}

export interface ResumeWorkExperience {
  company: string;
  jobTitle: string;
  date: string;
  descriptions: string[];
}

export interface ResumeEducation {
  school: string;
  degree: string;
  date: string;
  descriptions: string[];
}

export interface ResumeProject {
  project: string;
  link: string;
  date: string;
  descriptions: string[];
}

export interface ResumeLanguage {
  language: string;
  proficiency: string;
}

export interface FeaturedSkill {
  skill: string;
  rating: number;
}

export interface ResumeSkills {
  featuredSkills: FeaturedSkill[];
  descriptions: string[];
}

export interface ResumeCustom {
  descriptions: string[];
}

export interface Resume {
  profile: ResumeProfile;
  workExperiences: ResumeWorkExperience[];
  educations: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkills;
  languages: ResumeLanguage[];
  custom: ResumeCustom;
}

export type ResumeKey = keyof Resume;
