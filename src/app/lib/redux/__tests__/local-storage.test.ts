import {
  getHasUsedAppBefore,
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { initialResumeState } from "lib/redux/resumeSlice";
import { initialSettings } from "lib/redux/settingsSlice";

const CURRENT_KEY = "cvforge-state";
const LEGACY_KEY = "open-resume-state";

describe("local storage state compatibility", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads legacy state and migrates it to the current key", () => {
    localStorage.setItem(
      LEGACY_KEY,
      JSON.stringify({
        resume: {
          profile: { name: "Legacy User" },
        },
        settings: {
          resumeLocale: "us",
        },
      })
    );

    const state = loadStateFromLocalStorage();

    expect(state).toBeDefined();
    expect(state?.resume.profile.name).toBe("Legacy User");
    expect(state?.settings.resumeLocale).toBe("us");

    const migratedState = JSON.parse(
      localStorage.getItem(CURRENT_KEY) ?? "null"
    );
    expect(migratedState.resume.profile.name).toBe("Legacy User");
    expect(migratedState.settings.resumeLocale).toBe("us");
  });

  it("ignores invalid persisted state instead of returning unsafe data", () => {
    localStorage.setItem(CURRENT_KEY, JSON.stringify({ foo: "bar" }));

    expect(loadStateFromLocalStorage()).toBeUndefined();
    expect(getHasUsedAppBefore()).toBe(false);
  });

  it("persists the current root state shape", () => {
    saveStateToLocalStorage({
      resume: initialResumeState,
      settings: initialSettings,
    });

    const stored = JSON.parse(localStorage.getItem(CURRENT_KEY) ?? "null");
    expect(stored.resume.profile).toEqual(initialResumeState.profile);
    expect(stored.settings.themeColor).toBe(initialSettings.themeColor);
  });
});
