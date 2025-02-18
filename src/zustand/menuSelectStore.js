import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMenuSelectStore = create(
  persist(
    (set) => ({
      SelectedMenus: [],
      setSelectedMenus: (menus) => {
        set({ SelectedMenus: menus });
      },
      clearSelectedMenus: () => {
        set({ SelectedMenus: [] });
      },
    }),
    {
      name: "menuSlected",
      getStorage: () => localStorage,
    }
  )
);
