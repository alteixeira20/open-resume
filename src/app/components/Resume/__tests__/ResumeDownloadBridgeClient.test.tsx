import { act, render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { ResumeDownloadBridgeClient } from "components/Resume/ResumeDownloadBridgeClient";
import { changeProfile, initialResumeState, setResume } from "lib/redux/resumeSlice";
import { initialSettings, setSettings } from "lib/redux/settingsSlice";
import { store } from "lib/redux/store";

const pushMock = jest.fn();
const writeBuilderParserHandoffMock = jest.fn();
const blobToDataUrlMock = jest.fn(async () => "data:application/pdf;base64,AAA");
const toBlobMock = jest.fn(async () => new Blob(["pdf"], { type: "application/pdf" }));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock("@react-pdf/renderer", () => ({
  pdf: jest.fn(() => ({ toBlob: toBlobMock })),
}));

jest.mock("components/Resume/ResumePDF", () => ({
  ResumePDF: () => null,
}));

jest.mock("components/fonts/hooks", () => ({
  useRegisterReactPDFFont: jest.fn(),
  useRegisterReactPDFHyphenationCallback: jest.fn(),
}));

jest.mock("lib/parser-handoff", () => ({
  blobToDataUrl: blobToDataUrlMock,
  writeBuilderParserHandoff: writeBuilderParserHandoffMock,
  BUILDER_TO_PARSER_QUERY: "source=builder",
}));

describe("ResumeDownloadBridgeClient", () => {
  beforeEach(() => {
    pushMock.mockClear();
    writeBuilderParserHandoffMock.mockClear();
    blobToDataUrlMock.mockClear();
    toBlobMock.mockClear();
    act(() => {
      store.dispatch(setResume(initialResumeState));
      store.dispatch(setSettings(initialSettings));
    });
  });

  afterEach(() => {
    act(() => {
      store.dispatch(setResume(initialResumeState));
      store.dispatch(setSettings(initialSettings));
    });
  });

  it("creates a local parser handoff and navigates to the parser", async () => {
    act(() => {
      store.dispatch(changeProfile({ field: "name", value: "Alex Teixeira" }));
    });

    render(
      <Provider store={store}>
        <ResumeDownloadBridgeClient />
      </Provider>
    );

    await act(async () => {
      window.dispatchEvent(new CustomEvent("resume:evaluate-in-parser"));
    });

    await waitFor(() => {
      expect(toBlobMock).toHaveBeenCalled();
      expect(blobToDataUrlMock).toHaveBeenCalled();
      expect(writeBuilderParserHandoffMock).toHaveBeenCalledWith(
        expect.objectContaining({
          source: "builder",
          fileName: expect.stringContaining("Alex Teixeira"),
          resumeLocale: "eu",
        })
      );
      expect(pushMock).toHaveBeenCalledWith("/parser?source=builder");
    });
  });
});
