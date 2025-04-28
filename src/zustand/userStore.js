import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      selectUserEmployee: null,

      setSelectUserEmployee: (employee) =>
        set({ selectUserEmployee: employee }),

      getSelectUserEmployee: () => get().selectUserEmployee,
      clearEmployee: () => set({ selectUserEmployee: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
