import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCountStore = create(
  persist(
    (set) => ({
      countNumber: 0,

      // Fixed: Removed the post-increment operator (number++) as it was causing issues
      setCountNumber: (number) => set({ countNumber: number }),

      incrementCount: () => set((state) => ({ countNumber: state.countNumber + 1 })),

      clearCountNumber: () => set({ countNumber: 0 }),
    }),
    {
      name: "count-storage",
    }
  )
);