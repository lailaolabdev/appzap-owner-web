import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePointStore = create(
  persist(
    (set) => ({
      PointStore: [],
      setPointStore: (updateFunctionOrArray) =>
        set((state) => ({
          PointStore:
            typeof updateFunctionOrArray === "function"
              ? updateFunctionOrArray(state.PointStore)
              : updateFunctionOrArray,
        })),
      clearPointStore: [],
    }),
    {
      name: "pointStore",
      getStorage: () => localStorage,
    }
  )
);
