import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCounterRoleStore = create(
  persist(
    (set) => ({
      counterRoleEditBill: true,
      counterRoleEditMenu: true,
      setCounterRoleEditBill: (counterRole) =>
        set({ counterRoleEditBill: counterRole }),
      setCounterRoleEditMenu: (counterRole) =>
        set({ counterRoleEditMenu: counterRole }),
    }),
    {
      name: "counterRole",
      getStorage: () => localStorage,
    }
  )
);
