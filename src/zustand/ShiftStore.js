import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getOpenShift } from "../services/shift";

export const useShiftStore = create(
  persist(
    (set) => ({
      // Action to fetch shift by store ID
      shift: [],
      getShift: async (findby) => {
        set({ isMenuLoading: true });
        try {
          const data = await getOpenShift(findby);
          set({ shift: data, isMenuLoading: false });
          return data;
        } catch (error) {
          console.error("Fetch shift error:", error.message);
          set({ isMenuLoading: false });
        }
      },
      // Action to clear menu data
      clearShit: () => set({ shift: [] }),
    }),
    {
      name: "shifttore", // Name of the key in localStorage
      getStorage: () => localStorage, // Use localStorage as the storage method
    }
  )
);
