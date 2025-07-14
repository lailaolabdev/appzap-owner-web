import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      selectLanguage: null,

      setSelectLanguage: (language) =>
        set({ selectLanguage: language }),

      getSelectLanguage: () => get().selectLanguage,
      clearEmployee: () => set({ selectLanguage: null }),
    }),
    {
      name: "language_local",
      getStorage: () => localStorage,
    }
  )
);
