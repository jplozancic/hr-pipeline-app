import { useEffect } from "react";
import { useBlocker } from "react-router";

/**
 * Global router and window hook that intercepts navigation events when a form has unsaved data.
 * Displays warning prompts to prevent accidental data loss.
 * 
 * @param isDirty - A boolean reflecting whether there are unsaved local modifications.
 * @returns React Router blocker instance for driving custom blocking UI modals.
 */
export function useUnsavedChanges(isDirty: boolean) {
  // 1. Handle native browser events (refresh, closing tab, typing new URL)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // 2. Handle React Router SPA navigation (clicking links within the app)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  return blocker;
}