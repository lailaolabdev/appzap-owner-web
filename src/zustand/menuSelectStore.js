import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMenuSelectStore = create(
  persist(
    (set) => ({
      SelectedMenus: [],
      setSelectedMenus: (updateFunctionOrArray) =>
        set((state) => ({
          SelectedMenus:
            typeof updateFunctionOrArray === "function"
              ? updateFunctionOrArray(state.SelectedMenus)
              : updateFunctionOrArray,
        })),
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
