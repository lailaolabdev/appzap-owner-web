import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getStore, updateStore } from "../services/store"; // Import necessary API helpers

export const useStoreStore = create(
  devtools(
    persist(
      (set) => ({
        // Initial store state
        storeDetail: null,
        loading: false,
        error: null,

        // Action to set loading state
        setLoading: (isLoading) => set({ loading: isLoading }),

        // Action to set error state
        setError: (error) => set({ error }),

        // Action to fetch store data by ID
        fetchStoreDetail: async (storeId) => {
          set({ loading: true, error: null });
          try {
            const data = await getStore(storeId);

            if (!data || data.error) {
              throw new Error(data.error || "Failed to fetch store details");
            }

            set({ storeDetail: data, loading: false });
            return data;
          } catch (error) {
            console.error("Fetch store detail error:", error.message);
            set((state) => ({
                ...state, // Preserve the previous state
                error: error.message || "An error occurred while fetching store details.",
                loading: false,
              }));
          }
        },

        // Action to update store data
        updateStoreDetail: async (data, storeId) => {
          set({ loading: true, error: null });
          try {
            if (!storeId) {
              throw new Error("Store ID is required to update the store");
            }

            const updatedStore = await updateStore(data, storeId);

            if (!updatedStore || updatedStore.error) {
              throw new Error(
                updatedStore.error || "Failed to update store details"
              );
            }

            console.log("updatedStoreError: ", updatedStore)

            set({ storeDetail: updatedStore.data, loading: false });
            return updatedStore.data;
          } catch (error) {
            console.error("Update store detail error:", error.message);
            set((state) => ({
                ...state, // Preserve the previous state
                error: error.message || "An error occurred while fetching store details.",
                loading: false,
            }));
          }
        },

        // Local action to update specific fields in storeDetail without an API call
        updateStoreField: (key, value) =>
          set((state) => ({
            storeDetail: {
              ...state.storeDetail,
              [key]: value,
            },
          })),

        // Action to clear store details and reset to empty
        clearStoreDetail: () => set({ storeDetail: null,loading: false, error: null }),

      }),
      {
        name: "storeDetail", // Name of the item in localStorage
        getStorage: () => localStorage, // Use localStorage as the storage method
      }
    )
  )
);
