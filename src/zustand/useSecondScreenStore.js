import { create } from "zustand";
import { persist } from "zustand/middleware";

const sanitizeData = (data) => {
  const seen = new WeakSet();
  const sanitized = JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return; // Remove circular references
        }
        seen.add(value);
      }
      return value;
    })
  );
  // Ensure isToggledOpenScreen is always an array
  if (Array.isArray(sanitized?.isToggledOpenScreen)) {
    return sanitized;
  }
  return { ...sanitized, isToggledOpenScreen: [] };
};

export const useSecondScreenStore = create(
  persist(
    (set) => ({
      isToggledOpenScreen: [],
      SettoggleOpenScreen: (data) => {
        const sanitizedData = sanitizeData(data);
        set((state) => {
          const currentArray = Array.isArray(state.isToggledOpenScreen)
            ? state.isToggledOpenScreen
            : [];
          const updatedArray = [...currentArray, sanitizedData];
          return { isToggledOpenScreen: updatedArray.slice(-100) }; // Limit size
        });
      },
    }),
    {
      name: "second-screen-store",
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        if (!Array.isArray(state?.isToggledOpenScreen)) {
          console.warn("Invalid state detected. Resetting to default.");
          return { isToggledOpenScreen: [] }; // Reset to default state
        }
      },
    }
  )
);
