import { render, screen, fireEvent } from "@testing-library/react";
import { ResumeDropzone } from "components/ResumeDropzone";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("lib/parse-resume-from-pdf", () => ({
  parseResumeFromPdf: jest.fn(async () => ({
    profile: {
      name: "",
      email: "",
      phone: "",
      url: "",
      github: "",
      summary: "",
      location: "",
    },
    workExperiences: [],
    educations: [],
    projects: [],
    skills: { featuredSkills: [], descriptions: [] },
    languages: [],
    custom: { descriptions: [] },
  })),
}));

describe("ResumeDropzone", () => {
  const createObjectUrl = jest.fn(() => "blob:resume");
  const revokeObjectUrl = jest.fn();

  beforeAll(() => {
    (global.URL as typeof URL).createObjectURL = createObjectUrl;
    (global.URL as typeof URL).revokeObjectURL = revokeObjectUrl;
  });

  it("shows error for non-pdf input", () => {
    const onFileUrlChange = jest.fn();
    render(<ResumeDropzone onFileUrlChange={onFileUrlChange} />);

    const input = screen.getByLabelText("Browse file") as HTMLInputElement;
    const file = new File(["hello"], "resume.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });

    expect(
      screen.getByText("Only pdf file is supported")
    ).toBeInTheDocument();
  });

  it("accepts pdf input and shows file name", () => {
    const onFileUrlChange = jest.fn();
    render(<ResumeDropzone onFileUrlChange={onFileUrlChange} />);

    const input = screen.getByLabelText("Browse file") as HTMLInputElement;
    const file = new File(["dummy"], "resume.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText(/resume.pdf/i)).toBeInTheDocument();
    expect(onFileUrlChange).toHaveBeenCalledWith("blob:resume");
  });
});
