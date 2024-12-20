import create from "zustand";
import { devtools } from "zustand/middleware";
import { getStore, updateStore } from "../services/store"; // Import necessary API helpers

export const useStoreStore = create(
  devtools((set) => ({
    // Initial store state
    storeData: null,
    loading: false,
    error: null,

    // Action to set loading state
    setLoading: (isLoading) => set({ loading: isLoading }),

    // Action to set error state
    setError: (error) => set({ error }),

    // Action to fetch store data by ID
    fetchStoreData: async (storeId) => {
      set({ loading: true, error: null });
      try {
        const data = await getStore(storeId);
        set({ storeData: data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    // Action to update store data
    updateStoreData: async (data) => {
      set({ loading: true, error: null });
      try {
        if (!data?.id) {
          throw new Error("Store ID is required to update the store");
        }
        const updatedStore = await updateStore(data.data, data.id);
        set({ storeData: updatedStore.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    // Local action to update specific fields in storeData without an API call
    updateStoreField: (key, value) =>
      set((state) => ({
        storeData: {
          ...state.storeData,
          [key]: value,
        },
      })),
  }))
);
