import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getStore, updateStore } from "../services/store"; // Import necessary API helpers

export const useStoreStore = create(
  devtools((set) => ({
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
        console.log("storeDetail zustand: ", data)
        set({ storeDetail: data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    // Action to update store data
    updateStoreDetail: async (data, storeId) => {
      set({ loading: true, error: null });
      try {
        if (!storeId) {
          throw new Error("Store ID is required to update the store");
        }
        const updatedStore = await updateStore(data.data, data.id);
        set({ storeDetail: updatedStore.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
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
  }))
);
