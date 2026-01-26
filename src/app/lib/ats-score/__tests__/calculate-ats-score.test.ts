import { calculateAtsScore } from "lib/ats-score";
import type {
  Lines,
  ResumeSectionToLines,
  TextItem,
  TextItems,
} from "lib/parse-resume-from-pdf/types";
import type { Resume } from "lib/redux/types";

const baseTextItem = (overrides: Partial<TextItem>): TextItem => ({
  text: "",
  x: 0,
  y: 0,
  width: 10,
  height: 10,
  fontName: "Helvetica",
  hasEOL: false,
  page: 1,
  ...overrides,
});

describe("calculateAtsScore", () => {
  it("returns a strong score for a well structured resume with JD", () => {
    const textItems: TextItems = [
      baseTextItem({ text: "John Doe", x: 60, y: 720 }),
      baseTextItem({ text: "john@example.com", x: 60, y: 700 }),
      baseTextItem({ text: "+1 555 123 4567", x: 60, y: 680 }),
      baseTextItem({ text: "San Francisco, CA", x: 60, y: 660 }),
      baseTextItem({ text: "https://example.com", x: 60, y: 640 }),
      baseTextItem({ text: "Improved uptime by 30%", x: 60, y: 620 }),
      baseTextItem({ text: "Reduced latency by 60%", x: 60, y: 600 }),
      baseTextItem({ text: "Automated builds to achieve 2x throughput", x: 60, y: 580 }),
    ];

    const lines: Lines = [
      [baseTextItem({ text: "JOHN DOE", x: 60, y: 720 })],
      [baseTextItem({ text: "San Francisco, CA", x: 60, y: 710 })],
      [baseTextItem({ text: "PROFILE", x: 60, y: 700 })],
      [
        baseTextItem({
          text: "Built automation to optimize linux docker pipelines and git workflows",
          x: 60,
          y: 690,
        }),
      ],
      [baseTextItem({ text: "WORK EXPERIENCE", x: 60, y: 680 })],
      [baseTextItem({ text: "- Implemented CI/CD with bash scripting and containers", x: 62, y: 670 })],
      [baseTextItem({ text: "- Debugged services with gdb and valgrind", x: 62, y: 660 })],
      [baseTextItem({ text: "EDUCATION", x: 60, y: 650 })],
      [baseTextItem({ text: "- B.S. Computer Science", x: 62, y: 640 })],
      [baseTextItem({ text: "PROJECTS", x: 60, y: 630 })],
      [
        baseTextItem({
          text: "- Designed ubuntu monitoring stack and reduced incidents by 30%",
          x: 62,
          y: 620,
        }),
      ],
    ];

    const sections: ResumeSectionToLines = {
      profile: [lines[0], lines[1], lines[2]],
      "WORK EXPERIENCE": [lines[3], lines[4], lines[5]],
      EDUCATION: [lines[6], lines[7]],
      PROJECTS: [lines[8], lines[9]],
    };

    const resume: Resume = {
      profile: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 555 123 4567",
        url: "https://example.com",
        summary:
          "Built and optimized linux docker pipelines; automated testing across ubuntu",
        location: "San Francisco, CA",
      },
      workExperiences: [
        {
          company: "Acme Corp",
          jobTitle: "Site Reliability Engineer",
          date: "2020-2023",
          descriptions: [
            "Implemented CI/CD pipelines with git, bash, and docker automation",
            "Debugged services using gdb and valgrind; reduced incidents by 60%",
          ],
        },
      ],
      educations: [
        {
          school: "State University",
          degree: "B.S. Computer Science",
          date: "2019",
          descriptions: ["C systems programming and automation projects"],
        },
      ],
      projects: [
        {
          project: "Automation Platform",
          link: "",
          date: "2022",
          descriptions: [
            "Designed ubuntu observability stack with kubernetes containers and scripting",
          ],
        },
      ],
      skills: {
        featuredSkills: [],
        descriptions: ["Linux", "Testing", "Automation", "CI/CD"],
      },
      custom: {
        descriptions: [],
      },
    };

    const jobDescription = `We need engineers who have built and implemented automation for linux systems.
      Must know git, docker, bash, CI/CD pipelines, automation in C, and debugging with gdb or valgrind.
      Ideal candidates designed solutions, optimized performance, reduced incidents, automated workflows,
      debugged complex services, and built resilient infrastructure. Familiarity with ubuntu or other distro,
      scripting, containers, kubernetes, version control, and testing environments is required.`;

    const result = calculateAtsScore({
      textItems,
      lines,
      sections,
      resume,
      jobDescription,
    });

    expect(result.score).toBe(100);
    expect(result.breakdown.parsing).toBe(40);
    expect(result.breakdown.structure).toBe(20);
    expect(result.breakdown.readability).toBe(10);
    expect(result.breakdown.keywords).toBe(30);
    expect(result.issues).toHaveLength(0);
  });

  it("rescales score without JD and reports gaps", () => {
    const textItems: TextItems = [];
    const lines: Lines = [];

    for (let i = 0; i < 10; i++) {
      const left = i % 2 === 0 ? 60 : 320;
      const line: TextItem[] = [
        baseTextItem({ text: `Line ${i + 1}`, x: left, y: 700 - i * 10 }),
      ];
      lines.push(line);
      textItems.push(...line);
    }

    const sections: ResumeSectionToLines = {
      profile: [lines[0]],
    };

    const resume: Resume = {
      profile: {
        name: "",
        email: "",
        phone: "",
        url: "",
        summary: "",
        location: "",
      },
      workExperiences: [],
      educations: [],
      projects: [],
      skills: {
        featuredSkills: [],
        descriptions: [],
      },
      custom: {
        descriptions: [],
      },
    };

    const result = calculateAtsScore({ textItems, lines, sections, resume });

    expect(result.breakdown.keywords).toBeUndefined();
    expect(result.issues).toEqual(
      expect.arrayContaining([
        "Name not found",
        "Email not found",
        "Phone number missing",
        "Location not detected",
        "No links detected",
        "Education section missing",
        "Work experience section missing",
        "Likely multi-column layout",
        "Section headings not found",
        "Few bullet points detected",
        "Few metrics detected",
        "Consider adding raw URLs",
      ])
    );

    const subtotal =
      result.breakdown.parsing +
      result.breakdown.structure +
      result.breakdown.readability;
    const expected = Math.round((subtotal / 70) * 100);
    expect(result.score).toBe(expected);
  });
});
