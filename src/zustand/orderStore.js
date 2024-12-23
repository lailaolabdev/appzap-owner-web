import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrderStore = create(
  persist(
    (set) => ({
      // State
      orderItems: [],
      orderLoading: false,

      // Actions
      setOrderItems: (items) => set({ orderItems: items }),

      handleNewOrderItems: (newOrders) =>
        set((state) => {
          const updatedOrders = [...state.orderItems]; // Copy the current orderItems

          newOrders.forEach((newOrder) => {
            const existingOrderIndex = updatedOrders.findIndex(
              (order) => order._id === newOrder._id
            );

            if (existingOrderIndex > -1) {
              // Update the existing order at the front of the list
              updatedOrders[existingOrderIndex] = {
                ...updatedOrders[existingOrderIndex],
                ...newOrder,
              };
            } else {
              // Add the new order at the front
              updatedOrders.unshift(newOrder);
            }
          });

          return { orderItems: updatedOrders };
        }),

      setOrderLoading: (loading) => set({ orderLoading: loading }),
    }),
    {
      name: "orderStore", // Name of the storage key in localStorage
      getStorage: () => localStorage, // Use localStorage as the storage method
    }
  )
);
