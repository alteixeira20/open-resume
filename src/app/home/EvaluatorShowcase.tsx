"use client";
import { AtsScoreCard } from "resume-parser/AtsScoreCard";
import { ResumeTable } from "resume-parser/ResumeTable";
import type { AtsScoreResult } from "lib/ats-score";
import type { Resume } from "lib/redux/types";
import { Heading, Paragraph } from "components/documentation";

const demoScore: AtsScoreResult = {
  score: 97,
  breakdown: {
    parsing: 40,
    structure: 18,
    readability: 10,
    keywords: 29,
  },
  issues: [],
};

const demoResume: Resume = {
  profile: {
    name: "John Doe",
    email: "hello@openresume.com",
    phone: "123-456-7890",
    location: "NYC, NY",
    url: "linkedin.com/in/john-doe",
    github: "",
    summary:
      "Software engineer obsessed with building exceptional products that people love",
  },
  educations: [
    {
      school: "XYZ University",
      degree: "Bachelor of Science in Computer Science",
      gpa: "3.8 GPA",
      date: "Sep 2019 - May 2023",
      descriptions: [
        "Won 1st place in 2022 Education Hackathon, 2nd place in 2023 Health Tech Competition",
        "Teaching Assistant for Programming for the Web (2022 - 2023)",
        "Coursework: Object-Oriented Programming (A+), Programming for the Web (A+), Cloud Computing (A), Introduction to Machine Learning (A-), Algorithms Analysis (A-)",
      ],
    },
  ],
  workExperiences: [
    {
      company: "ABC Company",
      jobTitle: "Software Engineer",
      date: "May 2023 - Present",
      descriptions: [
        "Lead a cross-functional team of 5 engineers in developing a search bar, which enables thousands of daily active users to search content across the entire platform",
        "Create stunning home page product demo animations that drives up sign up rate by 20%",
        "Write clean code that is modular and easy to maintain while ensuring 100% test coverage",
      ],
    },
    {
      company: "DEF Organization",
      jobTitle: "Software Engineer Intern",
      date: "Summer 2022",
      descriptions: [
        "Re-architected the existing content editor to be mobile responsive that led to a 10% increase in mobile user engagement",
        "Created a progress bar to help users track progress that drove up user retention by 15%",
        "Discovered and fixed 5 bugs in the existing codebase to enhance user experience",
      ],
    },
    {
      company: "XYZ University",
      jobTitle: "Research Assistant",
      date: "Summer 2021",
      descriptions: [
        "Devised a new NLP algorithm in text classification that results in 10% accuracy increase",
        "Compiled and presented research findings to a group of 20+ faculty and students",
      ],
    },
  ],
  projects: [
    {
      project: "OpenResume",
      link: "",
      date: "Spring 2023",
      descriptions: [
        "Created and launched a free resume builder web app that allows thousands of users to create professional resumes and land their dream jobs",
      ],
    },
  ],
  skills: {
    featuredSkills: [],
    descriptions: [
      "HTML, TypeScript, CSS, React, Python, C++",
      "Tech: React Hooks, GraphQL, Node.js, SQL, Postgres, NoSql, Redis, REST API, Git",
      "Soft: Teamwork, Creative Problem Solving, Communication, Learning Mindset, Agile",
    ],
  },
  languages: [],
  custom: { descriptions: [] },
};

export const EvaluatorShowcase = () => {
  return (
    <section className="mx-auto max-w-5xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="text-center">
        <Heading className="!mt-0 !mb-3">
          ATS Resume Scoring System
        </Heading>
        <Paragraph>
          Free ATS resume scoring with local parsing, structure, and readability checks—diagnostic only, not a guarantee.
        </Paragraph>
      </div>
      <div className="mt-6">
        <AtsScoreCard result={demoScore} />
      </div>
      <div className="mt-6">
        <ResumeTable resume={demoResume} />
      </div>
    </section>
  );
};
