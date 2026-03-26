import { useEffect, useRef } from "react";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { store, type RootState, type AppDispatch } from "lib/redux/store";
import {
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { initialResumeState, setResume } from "lib/redux/resumeSlice";
import {
  initialSettings,
  setSettings,
  type Settings,
} from "lib/redux/settingsSlice";
import { deepMerge } from "lib/deep-merge";
import type { Resume } from "lib/redux/types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to save store to local storage on store change
 */
export const useSaveStateToLocalStorageOnChange = () => {
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      saveStateToLocalStorage(store.getState());
    });
    return unsubscribe;
  }, []);
};

export const useDebouncedPreviewRefreshOnChange = ({
  delay = 450,
  enabled = true,
}: {
  delay?: number;
  enabled?: boolean;
} = {}) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousResumeRef = useRef(store.getState().resume);
  const previousSettingsRef = useRef(store.getState().settings);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    const cancelPendingRefresh = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const resumeChanged = state.resume !== previousResumeRef.current;
      const settingsChanged = state.settings !== previousSettingsRef.current;

      if (!resumeChanged && !settingsChanged) {
        return;
      }

      previousResumeRef.current = state.resume;
      previousSettingsRef.current = state.settings;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
        timeoutRef.current = null;
      }, delay);
    });

    window.addEventListener("resume:refresh-preview", cancelPendingRefresh);

    return () => {
      unsubscribe();
      window.removeEventListener(
        "resume:refresh-preview",
        cancelPendingRefresh
      );
      cancelPendingRefresh();
    };
  }, [delay, enabled]);
};

export const useSetInitialStore = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const state = loadStateFromLocalStorage();
    if (!state) return;
    if (state.resume) {
      // We merge the initial state with the stored state to ensure
      // backward compatibility, since new fields might be added to
      // the initial state over time.
      const mergedResumeState = deepMerge(
        initialResumeState,
        state.resume
      ) as Resume;
      dispatch(setResume(mergedResumeState));
    }
    if (state.settings) {
      const mergedSettingsState = deepMerge(
        initialSettings,
        state.settings
      ) as Settings;
      dispatch(setSettings(mergedSettingsState));
    }
  }, [dispatch]);
};
