import { create } from "zustand";
import { createCustomerCount } from "../services/customer";

export const useCustomerStore = create(
  (set) => ({
    customer: 0,
    customerCount: [],
    setCustomer: (customer) => set({ customer }),
    createCustomerCount: async (data) => {
      const res = await createCustomerCount(data);
      set({ customerCount: res.data });
      return res.data;
    },
  }),
  {
    name: "customerStore", // Name of the key in localStorage
    getStorage: () => localStorage, // Use localStorage as the storage method
  }
);
