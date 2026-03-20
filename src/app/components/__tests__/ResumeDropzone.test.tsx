import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ResumeDropzone } from "components/ResumeDropzone";
import { initialResumeState } from "lib/redux/resumeSlice";
import { initialSettings } from "lib/redux/settingsSlice";

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
  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
  const confirmMock = jest
    .spyOn(window, "confirm")
    .mockImplementation(() => true);

  beforeAll(() => {
    (global.URL as typeof URL).createObjectURL = createObjectUrl;
    (global.URL as typeof URL).revokeObjectURL = revokeObjectUrl;
  });

  beforeEach(() => {
    localStorage.clear();
    alertMock.mockClear();
    confirmMock.mockClear();
  });

  it("shows error for non-pdf input", () => {
    const onFileUrlChange = jest.fn();
    render(<ResumeDropzone onFileUrlChange={onFileUrlChange} />);

    const input = screen.getByLabelText("Browse file") as HTMLInputElement;
    const file = new File(["hello"], "resume.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText(/Only PDF file is supported/i)).toBeInTheDocument();
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

  it("does not overwrite existing saved state when json import is invalid", async () => {
    localStorage.setItem(
      "cvforge-state",
      JSON.stringify({
        resume: {
          ...initialResumeState,
          profile: {
            ...initialResumeState.profile,
            name: "Keep Me",
          },
        },
        settings: initialSettings,
      })
    );

    render(
      <ResumeDropzone onFileUrlChange={jest.fn()} allowJsonImport={true} />
    );

    const input = screen.getByLabelText("Browse file") as HTMLInputElement;
    const file = new File(["{\"invalid\":true}"], "resume.json", {
      type: "application/json",
    });
    Object.defineProperty(file, "text", {
      value: jest.fn(async () => "{\"invalid\":true}"),
    });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: /import json and continue/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "Invalid JSON format. Please use a compatible CVForge export file."
      );
    });

    const storedState = JSON.parse(localStorage.getItem("cvforge-state") ?? "null");
    expect(storedState.resume.profile.name).toBe("Keep Me");
    expect(confirmMock).not.toHaveBeenCalled();
  });
});
