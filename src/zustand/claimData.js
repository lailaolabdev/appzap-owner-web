import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useClaimDataStore = create(
  persist(
    (set) => ({
      // Initial store state
      TotalAmountClaim: 0,

      setTotalAmountClaim: (amount) => {
        // console.log("Setting menus data:", menusData);
        set({ TotalAmountClaim: amount });
      },
      // Action to clear menu data
      clearClaim: () =>
        set({
          TotalAmountClaim: 0,
        }),
    }),
    {
      name: "ClaimStore", // Name of the key in localStorage
      getStorage: () => localStorage, // Use localStorage as the storage method
    }
  )
);
