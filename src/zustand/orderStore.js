import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrderStore = create(
  persist(
    (set) => ({
      // State
      orderItems: [],
      waitingOrders: [], // Orders with status "WAITING"
      doingOrders: [],   // Orders with status "DOING"
      servedOrders: [],  // Orders with status "SERVED"
      canceledOrders: [], // Orders with status "CANCELED"
      paidOrders: [],    // Orders with status "PAID"
      printBillOrders: [], // Orders with status "PRINTBILL"
      orderLoading: false,

      // Actions
      setOrderItems: (items) => {
        // Filter the orders based on status and set them in respective state variables
        const waitingOrders = items.filter((order) => order.status === "WAITING");
        const doingOrders = items.filter((order) => order.status === "DOING");
        const servedOrders = items.filter((order) => order.status === "SERVED");
        const canceledOrders = items.filter((order) => order.status === "CANCELED");
        const paidOrders = items.filter((order) => order.status === "PAID");
        const printBillOrders = items.filter((order) => order.status === "PRINTBILL");

        set({
          orderItems: items,
          waitingOrders,
          doingOrders,
          servedOrders,
          canceledOrders,
          paidOrders,
          printBillOrders,
        });
      },

      handleUpdateOrderItems: ({ updatedOrders, fromStatus, toStatus }) =>
        set((state) => {
          console.log({ updatedOrders, fromStatus, toStatus })
          // Validate that updatedOrders and toStatus are not empty
          if (!updatedOrders || updatedOrders.length === 0 || !toStatus) {
            console.log("No orders to update or invalid toStatus provided");
            return; // Return early if no orders to update or invalid toStatus
          }
      
          // If `fromStatus` is not provided, use the status of the first updated order
          if (!fromStatus && updatedOrders.length > 0) {
            fromStatus = updatedOrders[0].status;
          }
      
          // Filter the current list of orders based on `fromStatus`
          let fromOrderItems = [];
          let toOrderItems = [];
      
          switch (fromStatus) {
            case "WAITING":
              fromOrderItems = [...state.waitingOrders];
              break;
            case "DOING":
              fromOrderItems = [...state.doingOrders];
              break;
            case "SERVED":
              fromOrderItems = [...state.servedOrders];
              break;
            case "CANCELED":
              fromOrderItems = [...state.canceledOrders];
              break;
            case "PAID":
              fromOrderItems = [...state.paidOrders];
              break;
            case "PRINTBILL":
              fromOrderItems = [...state.printBillOrders];
              break;
            default:
              break;
          }
      
          // Filter the current list of orders based on `toStatus`
          switch (toStatus) {
            case "WAITING":
              toOrderItems = [...state.waitingOrders];
              break;
            case "DOING":
              toOrderItems = [...state.doingOrders];
              break;
            case "SERVED":
              toOrderItems = [...state.servedOrders];
              break;
            case "CANCELED":
              toOrderItems = [...state.canceledOrders];
              break;
            case "PAID":
              toOrderItems = [...state.paidOrders];
              break;
            case "PRINTBILL":
              toOrderItems = [...state.printBillOrders];
              break;
            default:
              break;
          }
      
          // Process each order and update its status
          updatedOrders.forEach((updatedOrder) => {
            // Remove the item from the `fromStatus` list if it exists
            const fromIndex = fromOrderItems.findIndex(
              (order) => order._id === updatedOrder._id
            );
            if (fromIndex > -1) {
              fromOrderItems.splice(fromIndex, 1); // Remove the item
            }
      
            // Add the item to the `toStatus` list
            toOrderItems.unshift(updatedOrder); // Prepend to the toStatus list
          });
      
          // Dynamically update the state by setting the new lists
          console.log({
            [fromStatus.toLowerCase() + 'Orders']: fromOrderItems, // Update the fromStatus list
            [toStatus.toLowerCase() + 'Orders']: toOrderItems, // Update the toStatus list
          })
          return {
            [fromStatus.toLowerCase() + 'Orders']: fromOrderItems, // Update the fromStatus list
            [toStatus.toLowerCase() + 'Orders']: toOrderItems, // Update the toStatus list
          };
        }),      
            


      handleNewOrderItems: (newOrders) =>
        set((state) => {
          const updatedOrders = [...state.orderItems]; // Copy the current orderItems

          // Arrays to store newly filtered orders
          const newWaitingOrders = [];
          const newDoingOrders = [];
          const newServedOrders = [];
          const newCanceledOrders = [];
          const newPaidOrders = [];
          const newPrintBillOrders = [];

          // Prepend new orders to their respective status lists and to the updatedOrders array
          newOrders.forEach((newOrder) => {
            const existingOrderIndex = updatedOrders.findIndex(
              (order) => order._id === newOrder._id
            );

            if (existingOrderIndex > -1) {
              // Update the existing order
              updatedOrders[existingOrderIndex] = {
                ...updatedOrders[existingOrderIndex],
                ...newOrder,
              };
            } else {
              // Add the new order at the front
              updatedOrders.unshift(newOrder);
            }

            // Filter the new order based on its status and prepend to the appropriate list
            switch (newOrder.status) {
              case "WAITING":
                newWaitingOrders.unshift(newOrder); // Prepend to the waitingOrders list
                break;
              case "DOING":
                newDoingOrders.unshift(newOrder); // Prepend to the doingOrders list
                break;
              case "SERVED":
                newServedOrders.unshift(newOrder); // Prepend to the servedOrders list
                break;
              case "CANCELED":
                newCanceledOrders.unshift(newOrder); // Prepend to the canceledOrders list
                break;
              case "PAID":
                newPaidOrders.unshift(newOrder); // Prepend to the paidOrders list
                break;
              case "PRINTBILL":
                newPrintBillOrders.unshift(newOrder); // Prepend to the printBillOrders list
                break;
              default:
                break;
            }
          });

          // Return updated state with newly prepended orders in respective status arrays
          return {
            orderItems: updatedOrders,
            waitingOrders: [...newWaitingOrders, ...state.waitingOrders], // Prepend new orders
            doingOrders: [...newDoingOrders, ...state.doingOrders], // Prepend new orders
            servedOrders: [...newServedOrders, ...state.servedOrders], // Prepend new orders
            canceledOrders: [...newCanceledOrders, ...state.canceledOrders], // Prepend new orders
            paidOrders: [...newPaidOrders, ...state.paidOrders], // Prepend new orders
            printBillOrders: [...newPrintBillOrders, ...state.printBillOrders], // Prepend new orders
          };
        }),

      // Handle checkbox toggle for individual order based on status
      handleCheckbox: (order, status) =>
        set((state) => {
          const statusLower = status.toLowerCase(); // Convert status to lowercase

          // Update the isChecked state of the specific order in the orderItems list
          const updatedOrders = state.orderItems.map((item) =>
            item._id === order._id
              ? { ...item, isChecked: !item.isChecked }
              : item
          );

          // Update the isChecked state for orders with the given status
          const updatedStatusOrders = state[`${statusLower}Orders`].map((item) =>
            item._id === order._id
              ? { ...item, isChecked: !item.isChecked }
              : item
          );

          return {
            orderItems: updatedOrders,
            [`${statusLower}Orders`]: updatedStatusOrders, // Update the status-based array
          };
        }),

      // Handle toggle check all orders based on status
      handleCheckAll: (checked, status) =>
        set((state) => {
          const statusLower = status.toLowerCase(); // Convert status to lowercase

          // Update all orders with the given status
          const updatedOrders = state.orderItems.map((item) => ({
            ...item,
            isChecked: checked,
          }));

          const updatedStatusOrders = state[`${statusLower}Orders`].map((item) => ({
            ...item,
            isChecked: checked,
          }));

          return {
            orderItems: updatedOrders,
            [`${statusLower}Orders`]: updatedStatusOrders, // Update the status-based array
          };
        }),

      setOrderLoading: (loading) => set({ orderLoading: loading }),
    }),
    {
      name: "orderStore", // Name of the storage key in localStorage
      getStorage: () => localStorage, // Use localStorage as the storage method
    }
  )
);
