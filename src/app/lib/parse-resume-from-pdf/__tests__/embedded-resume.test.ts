import {
  buildEmbeddedResumeSubject,
  parseEmbeddedResumeSubject,
} from "lib/parse-resume-from-pdf/embedded-resume";
import type { Resume } from "lib/redux/types";

const sampleResume: Resume = {
  profile: {
    name: "Alexandre Teixeira",
    email: "alexandremagteixeira@gmail.com",
    phone: "+351915762282",
    url: "https://www.linkedin.com/in/alexandreteixeira20/",
    github: "https://github.com/alteixeira20",
    summary: "Backend-focused software engineer.",
    location: "Guimaraes, Portugal",
  },
  workExperiences: [
    {
      company: "CVForge",
      jobTitle: "Builder",
      date: "2025",
      descriptions: ["Built a precise PDF import/export flow."],
    },
  ],
  educations: [],
  projects: [],
  skills: {
    featuredSkills: [],
    descriptions: ["TypeScript", "C"],
  },
  languages: [
    {
      language: "Portuguese",
      proficiency: "Native",
    },
  ],
  custom: {
    descriptions: [],
  },
};

describe("embedded CVForge resume metadata", () => {
  it("round-trips a resume through the PDF subject metadata format", () => {
    const subject = buildEmbeddedResumeSubject(sampleResume);

    expect(parseEmbeddedResumeSubject(subject)).toEqual(sampleResume);
  });

  it("ignores non-CVForge metadata", () => {
    expect(parseEmbeddedResumeSubject("Resume subject")).toBeNull();
  });
});

