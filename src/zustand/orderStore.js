import { create } from "zustand";
import axios from "axios";
import moment from "moment";
import {
  WAITING_STATUS,
  DOING_STATUS,
  SERVE_STATUS,
  CANCEL_STATUS,
} from "../constants";
import { END_POINT_SEVER_BILL_ORDER, getLocalData } from "../constants/api";

export const useOrderStore = create((set) => ({
  // State
  waitingOrders: [], // Orders with status "WAITING"
  doingOrders: [], // Orders with status "DOING"
  servedOrders: [], // Orders with status "SERVED"
  canceledOrders: [], // Orders with status "CANCELED"
  paidOrders: [], // Orders with status "PAID"
  printBillOrders: [], // Orders with status "PRINTBILL"
  orderLoading: false,

  // Fetch function to get orders by status and store them in the zustand state
  fetchOrdersByStatus: async (
    status,
    shiftCurrent,
    profile,
    skip = 0,
    limit = 200
  ) => {
    try {
      const _userData = await getLocalData(); // Assuming getLocalData fetches user data
      let findby = "";
      if (profile?.data?.role === "APPZAP_ADMIN") {
        findby += `status=${status}&`;
        findby += `storeId=${_userData?.DATA?.storeId}&`;
        findby += `startDate=${moment(moment())
          .subtract(2, "days")
          .format("YYYY-MM-DD")}&`;
        findby += `endDate=${moment(moment()).format("YYYY-MM-DD")}&`;
        findby += `skip=${skip}&`;
        findby += `limit=${limit}`;
      } else {
        findby += `status=${status}&`;
        findby += `storeId=${_userData?.DATA?.storeId}&`;
        findby += `startDate=${moment(moment())
          .subtract(2, "days")
          .format("YYYY-MM-DD")}&`;
        findby += `endDate=${moment(moment()).format("YYYY-MM-DD")}&`;
        findby += `shiftId=${shiftCurrent[0]?._id}&`;
        findby += `skip=${skip}&`;
        findby += `limit=${limit}`;
      }

      const response = await axios.get(
        `${END_POINT_SEVER_BILL_ORDER}/v7/orders?${findby}`
      );

      set((state) => {
        if (status === WAITING_STATUS) {
          return { waitingOrders: response?.data || [] };
        }
        if (status === DOING_STATUS) {
          return { doingOrders: response?.data || [] };
        }
        if (status === SERVE_STATUS) {
          return { servedOrders: response?.data || [] };
        }
        if (status === CANCEL_STATUS) {
          return { canceledOrders: response?.data || [] };
        }
        return state; // No change if no matching status
      });
    } catch (err) {
      console.error("Error fetching orders by status:", err);
    }
  },

  // Actions
  setOrderItems: (items) => {
    // Filter the orders based on status and set them in respective state variables
    const waitingOrders = items.filter((order) => order.status === "WAITING");
    const doingOrders = items.filter((order) => order.status === "DOING");
    const servedOrders = items.filter((order) => order.status === "SERVED");
    const canceledOrders = items.filter((order) => order.status === "CANCELED");
    const paidOrders = items.filter((order) => order.status === "PAID");
    const printBillOrders = items.filter(
      (order) => order.status === "PRINTBILL"
    );

    set({
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
      console.log({ updatedOrders, fromStatus, toStatus });

      if (fromStatus === toStatus) {
        console.log("Same status, No need to update!");
        return; // Return early if no orders to update or invalid toStatus
      }
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
        const unCheckUpdatedOrder = { ...updatedOrder, isChecked: false };
        toOrderItems.unshift(unCheckUpdatedOrder); // Prepend to the toStatus list
      });

      // Dynamically update the state by setting the new lists
      return {
        [fromStatus.toLowerCase() + "Orders"]: fromOrderItems, // Update the fromStatus list
        [toStatus.toLowerCase() + "Orders"]: toOrderItems, // Update the toStatus list
      };
    }),

  handleNewOrderItems: (newOrders) =>
    set((state) => {
      // Arrays to store newly filtered orders
      const newWaitingOrders = [];
      const newDoingOrders = [];
      const newServedOrders = [];
      const newCanceledOrders = [];
      const newPaidOrders = [];
      const newPrintBillOrders = [];

      // Prepend new orders to their respective status lists and to the updatedOrders array
      newOrders.forEach((newOrder) => {
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

      // Update the isChecked state for orders with the given status
      const updatedStatusOrders = state[`${statusLower}Orders`].map((item) =>
        item._id === order._id ? { ...item, isChecked: !item.isChecked } : item
      );

      return {
        [`${statusLower}Orders`]: updatedStatusOrders, // Update the status-based array
      };
    }),

  // Handle toggle check all orders based on status
  handleCheckAll: (checked, status) =>
    set((state) => {
      const statusLower = status.toLowerCase(); // Convert status to lowercase

      const updatedStatusOrders = state[`${statusLower}Orders`].map((item) => ({
        ...item,
        isChecked: checked,
      }));

      return {
        [`${statusLower}Orders`]: updatedStatusOrders, // Update the status-based array
      };
    }),
}));
