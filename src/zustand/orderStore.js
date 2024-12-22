import { create } from "zustand";

export const useOrderStore = create((set) => ({
  // State
  orderItems: [],
  orderLoading: false,

  // Actions
  setOrderItems: (items) => set({ orderItems: items }),

  handleNewOrderItems: (newOrders) =>
    set((state) => {
      const updatedOrders = [...state.orderItems];
      newOrders.forEach((newOrder) => {
        const existingOrderIndex = updatedOrders.findIndex(
          (order) => order._id === newOrder._id
        );

        if (existingOrderIndex > -1) {
          // Update existing order
          updatedOrders[existingOrderIndex] = {
            ...updatedOrders[existingOrderIndex],
            ...newOrder,
          };
        } else {
          // Add new order
          updatedOrders.push(newOrder);
        }
      });
      return { orderItems: updatedOrders };
    }),

  setOrderLoading: (loading) => set({ orderLoading: loading }),
}));
