import type { RootState } from "lib/redux/store";

// Reference: https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67

const LOCAL_STORAGE_KEY = "cvforge-state";
const LEGACY_LOCAL_STORAGE_KEY = "open-resume-state";

export const loadStateFromLocalStorage = () => {
  try {
    const stringifiedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    const legacyStringifiedState =
      stringifiedState ?? localStorage.getItem(LEGACY_LOCAL_STORAGE_KEY);
    if (!legacyStringifiedState) return undefined;
    return JSON.parse(legacyStringifiedState);
  } catch (e) {
    return undefined;
  }
};

export const saveStateToLocalStorage = (state: RootState) => {
  try {
    const stringifiedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, stringifiedState);
  } catch (e) {
    // Ignore
  }
};

export const getHasUsedAppBefore = () => Boolean(loadStateFromLocalStorage());

export const clearStateFromLocalStorage = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
  } catch (e) {
    // Ignore
  }
};
