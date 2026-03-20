import type { RootState } from "lib/redux/store";
import { normalizeRootState } from "lib/redux/persisted-state";

// Reference: https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67

const LOCAL_STORAGE_KEY = "cvforge-state";
const LEGACY_LOCAL_STORAGE_KEY = "open-resume-state";

export const loadStateFromLocalStorage = () => {
  try {
    const currentState = localStorage.getItem(LOCAL_STORAGE_KEY);
    const legacyState = localStorage.getItem(LEGACY_LOCAL_STORAGE_KEY);
    const stringifiedState = currentState ?? legacyState;
    if (!stringifiedState) return undefined;

    const normalizedState = normalizeRootState(JSON.parse(stringifiedState));
    if (!normalizedState) {
      return undefined;
    }

    if (!currentState) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalizedState));
    }

    return normalizedState;
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
