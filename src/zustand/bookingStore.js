import { create } from "zustand";
import axios from "axios";

import {
  WAITING_STATUS,
  DOING_STATUS,
  SERVE_STATUS,
  CANCEL_STATUS,
} from "../constants";
import { END_POINT_SEVER_BILL_ORDER, getLocalData } from "../constants/api";

export const useBookingStore = create((set) => ({
  // State
  allBooking: [],
  waitingBooking: [],
  approvedBooking: [],
  canceledBooking: [],
  bookingWaitingLength: 0,
  isLoading: false,

  fetchBookingByStatus: async (status) => {
    try {
      const _userData = await getLocalData();
      const response = await axios.get(
        `${END_POINT_SEVER_BILL_ORDER}/v3/reservations?storeId=${_userData?.DATA?.storeId}&status=${status}`
      );

      // Update the respective state based on status
      set((state) => {
        if (status === "WAITING") {
          return {
            waitingBooking: response?.data || [],
            bookingWaitingLength: response?.data?.length,
          };
        }
        if (status === "STAFF_CONFIRM") {
          return { approvedBooking: response?.data || [] };
        }
        if (status === "CANCEL") {
          return { canceledBooking: response?.data || [] };
        }
        return state;
      });
    } catch (err) {
      console.error("Error fetching booking by status:", err);
    }
  },

  setBookingItems: (items) => {
    // Filter the orders based on status and set them in respective state variables
    const allBooking = items;
    const waitingBooking = items.filter((order) => order.status === "WAITING");
    const approvedBooking = items.filter(
      (order) => order.status === "STAFF_CONFIRM"
    );
    const canceledBooking = items.filter((order) => order.status === "CANCEL");

    set({
      allBooking,
      waitingBooking,
      approvedBooking,
      canceledBooking,
      // bookingWaitingLength: waitingBooking.length,
    });
  },

  // handleUpdateOrderItems: ({ updatedOrders, fromStatus, toStatus }) =>
  //   set((state) => {
  //     console.log({ updatedOrders, fromStatus, toStatus })

  //     if (fromStatus === toStatus) {
  //       console.log("Same status, No need to update!");
  //       return; // Return early if no orders to update or invalid toStatus
  //     }
  //     // Validate that updatedOrders and toStatus are not empty
  //     if (!updatedOrders || updatedOrders.length === 0 || !toStatus) {
  //       console.log("No orders to update or invalid toStatus provided");
  //       return; // Return early if no orders to update or invalid toStatus
  //     }

  //     // If `fromStatus` is not provided, use the status of the first updated order
  //     if (!fromStatus && updatedOrders.length > 0) {
  //       fromStatus = updatedOrders[0].status;
  //     }

  //     // Filter the current list of orders based on `fromStatus`
  //     let fromOrderItems = [];
  //     let toOrderItems = [];

  //     switch (fromStatus) {
  //       case "WAITING":
  //         fromOrderItems = [...state.waitingOrders];
  //         break;
  //       case "DOING":
  //         fromOrderItems = [...state.doingOrders];
  //         break;
  //       case "SERVED":
  //         fromOrderItems = [...state.servedOrders];
  //         break;
  //       case "CANCELED":
  //         fromOrderItems = [...state.canceledOrders];
  //         break;
  //       case "PAID":
  //         fromOrderItems = [...state.paidOrders];
  //         break;
  //       case "PRINTBILL":
  //         fromOrderItems = [...state.printBillOrders];
  //         break;
  //       default:
  //         break;
  //     }

  //     // Filter the current list of orders based on `toStatus`
  //     switch (toStatus) {
  //       case "WAITING":
  //         toOrderItems = [...state.waitingOrders];
  //         break;
  //       case "DOING":
  //         toOrderItems = [...state.doingOrders];
  //         break;
  //       case "SERVED":
  //         toOrderItems = [...state.servedOrders];
  //         break;
  //       case "CANCELED":
  //         toOrderItems = [...state.canceledOrders];
  //         break;
  //       case "PAID":
  //         toOrderItems = [...state.paidOrders];
  //         break;
  //       case "PRINTBILL":
  //         toOrderItems = [...state.printBillOrders];
  //         break;
  //       default:
  //         break;
  //     }

  //     // Process each order and update its status
  //     updatedOrders.forEach((updatedOrder) => {
  //       // Remove the item from the `fromStatus` list if it exists
  //       const fromIndex = fromOrderItems.findIndex(
  //         (order) => order._id === updatedOrder._id
  //       );
  //       if (fromIndex > -1) {
  //         fromOrderItems.splice(fromIndex, 1); // Remove the item
  //       }

  //       // Add the item to the `toStatus` list
  //       const unCheckUpdatedOrder = {...updatedOrder, isChecked: false}
  //       toOrderItems.unshift(unCheckUpdatedOrder); // Prepend to the toStatus list
  //     });

  //     // Dynamically update the state by setting the new lists
  //     return {
  //       [fromStatus.toLowerCase() + 'Orders']: fromOrderItems, // Update the fromStatus list
  //       [toStatus.toLowerCase() + 'Orders']: toOrderItems, // Update the toStatus list
  //     };
  //   }),

  // handleNewOrderItems: (newOrders) =>
  //   set((state) => {

  //     // Arrays to store newly filtered orders
  //     const newWaitingOrders = [];
  //     const newDoingOrders = [];
  //     const newServedOrders = [];
  //     const newCanceledOrders = [];
  //     const newPaidOrders = [];
  //     const newPrintBillOrders = [];

  //     // Prepend new orders to their respective status lists and to the updatedOrders array
  //     newOrders.forEach((newOrder) => {

  //       // Filter the new order based on its status and prepend to the appropriate list
  //       switch (newOrder.status) {
  //         case "WAITING":
  //           newWaitingOrders.unshift(newOrder); // Prepend to the waitingOrders list
  //           break;
  //         case "DOING":
  //           newDoingOrders.unshift(newOrder); // Prepend to the doingOrders list
  //           break;
  //         case "SERVED":
  //           newServedOrders.unshift(newOrder); // Prepend to the servedOrders list
  //           break;
  //         case "CANCELED":
  //           newCanceledOrders.unshift(newOrder); // Prepend to the canceledOrders list
  //           break;
  //         case "PAID":
  //           newPaidOrders.unshift(newOrder); // Prepend to the paidOrders list
  //           break;
  //         case "PRINTBILL":
  //           newPrintBillOrders.unshift(newOrder); // Prepend to the printBillOrders list
  //           break;
  //         default:
  //           break;
  //       }
  //     });

  //     // Return updated state with newly prepended orders in respective status arrays
  //     return {
  //       waitingOrders: [...newWaitingOrders, ...state.waitingOrders], // Prepend new orders
  //       doingOrders: [...newDoingOrders, ...state.doingOrders], // Prepend new orders
  //       servedOrders: [...newServedOrders, ...state.servedOrders], // Prepend new orders
  //       canceledOrders: [...newCanceledOrders, ...state.canceledOrders], // Prepend new orders
  //       paidOrders: [...newPaidOrders, ...state.paidOrders], // Prepend new orders
  //       printBillOrders: [...newPrintBillOrders, ...state.printBillOrders], // Prepend new orders
  //     };
  //   }),
}));
