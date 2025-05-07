import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getOpenShift } from "../services/shift";

export const useShiftStore = create(
  persist(
    (set) => ({
      // Action to fetch shift by store ID
      shift: [],
      shiftList: [],
      shiftCurrent: [],
      OpenShiftForCounter: false,
      setOpenShiftForCounter: (value) => set({ OpenShiftForCounter: value }),
      setShiftList: (Data) => set({ shiftList: Data }),
      setShiftListCurrent: (Data) => set({ shiftCurrent: Data }),

      getShift: async (findby) => {
        try {
          const data = await getOpenShift(findby);
          set({ shift: data });
          return data;
        } catch (error) {
          console.error("Fetch shift error:", error.message);
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
