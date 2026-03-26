import { act, cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { changeProfile, initialResumeState, setResume } from "lib/redux/resumeSlice";
import { initialSettings, setSettings } from "lib/redux/settingsSlice";
import { useDebouncedPreviewRefreshOnChange } from "lib/redux/hooks";
import { store } from "lib/redux/store";

const HookHarness = ({
  delay = 450,
  enabled = true,
}: {
  delay?: number;
  enabled?: boolean;
}) => {
  useDebouncedPreviewRefreshOnChange({ delay, enabled });
  return null;
};

const getRefreshEvents = (dispatchSpy: jest.SpyInstance) =>
  dispatchSpy.mock.calls.filter(
    ([event]) =>
      event instanceof CustomEvent && event.type === "resume:refresh-preview"
  );

describe("useDebouncedPreviewRefreshOnChange", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    store.dispatch(setResume(initialResumeState));
    store.dispatch(setSettings(initialSettings));
  });

  afterEach(() => {
    cleanup();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    store.dispatch(setResume(initialResumeState));
    store.dispatch(setSettings(initialSettings));
  });

  it("debounces rapid resume edits into a single preview refresh", () => {
    const dispatchSpy = jest.spyOn(window, "dispatchEvent");

    render(
      <Provider store={store}>
        <HookHarness delay={300} />
      </Provider>
    );

    act(() => {
      store.dispatch(changeProfile({ field: "name", value: "A" }));
      store.dispatch(changeProfile({ field: "name", value: "Al" }));
      store.dispatch(changeProfile({ field: "name", value: "Alex" }));
    });

    expect(getRefreshEvents(dispatchSpy)).toHaveLength(0);

    act(() => {
      jest.advanceTimersByTime(299);
    });

    expect(getRefreshEvents(dispatchSpy)).toHaveLength(0);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(getRefreshEvents(dispatchSpy)).toHaveLength(1);
  });

  it("cancels a pending debounce after an immediate manual refresh", () => {
    const dispatchSpy = jest.spyOn(window, "dispatchEvent");

    render(
      <Provider store={store}>
        <HookHarness delay={300} />
      </Provider>
    );

    act(() => {
      store.dispatch(changeProfile({ field: "name", value: "Alex" }));
    });

    act(() => {
      window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(getRefreshEvents(dispatchSpy)).toHaveLength(1);
  });
});
