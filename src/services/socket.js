import io from "socket.io-client";
import { END_POINT_SOCKET_CUSTOMER } from "../constants/api";

let customerSocketInstance = null;

export const initCustomerSocket = () => {
  if (!customerSocketInstance) {
    console.log("Initializing customer socket...");
    customerSocketInstance = io(`${END_POINT_SOCKET_CUSTOMER}`, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    customerSocketInstance.on("connect", () => {
      console.log("Socket connected:", customerSocketInstance.id);
    });

    customerSocketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    customerSocketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  } else {
    console.log("Customer socket already initialized.");
  }
  return customerSocketInstance;
};

export const getCustomerSocketInstance = () => {
  return customerSocketInstance;
};
