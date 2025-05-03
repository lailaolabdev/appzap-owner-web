import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePaymentStore = create(
  persist(
    (set) => ({
      // Initial store state
      paymentMethods: "",
      receivedMoney: 0,
      changeMoney: 0,

      // Action to set payment methods
      setPaymentMethods: (methods) => set({ paymentMethods: methods }),

      // Action to set received money
      setReceivedMoney: (amount) => set({ receivedMoney: amount }),

      // Action to manually set change money
      setChangeMoney: (amount) => set({ changeMoney: amount }),

      SelectedDataBill: [],
      setSelectedDataBill: (updateFunctionOrArray) =>
        set((state) => ({
          SelectedDataBill:
            typeof updateFunctionOrArray === "function"
              ? updateFunctionOrArray(state.SelectedDataBill)
              : updateFunctionOrArray,
        })),
      clearSelectedDataBill: () => {
        set({
          SelectedDataBill: {
            moneyReceived: 0,
            moneyChange: 0,
            paymentMethod: "OTHER",
            memberId: "",
            memberPhone: "",
            memberName: "",
            Name: "",
            Point: 0,
            ExpireDateForPoint: "",
            pointRecived: 0,
            pointToMoney: 0,
          },
        });
      },
    }),
    {
      name: "paymentStore", // Name of the key in localStorage
      getStorage: () => localStorage, // Use localStorage as the storage method
    }
  )
);
