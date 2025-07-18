import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      selectLanguage: "la",

      setSelectLanguage: (language) =>
        set({ selectLanguage: language }),

      getSelectLanguage: () => get().selectLanguage,
      clearEmployee: () => set({ selectLanguage: 'la' }),
    }),
    {
      name: "language_local",
      getStorage: () => localStorage,
    }
  )
);
