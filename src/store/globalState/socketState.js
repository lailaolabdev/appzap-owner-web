import { useState, useEffect } from "react";
import socketio from "socket.io-client";
import { END_POINT_SOCKET } from "../../constants/api";
const { sendToKitchenPrinter } = require('../../helpers/printerHelper');

const socket = socketio.connect(END_POINT_SOCKET, {
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionDelayMax: 10000,
});

export const useSocketState = ({ storeDetail, setRunSound }) => {
  const [socketConneted, setSocketConneted] = useState(false);
  const [newTableTransaction, setNewTableTransaction] = useState(false);
  const [newOrderTransaction, setNewOrderTransaction] = useState(false);
  const [newOrderUpdateStatusTransaction, setNewOrderUpdateStatusTransaction] = useState(false);
  const [newOreservationTransaction, setNewOreservationTransaction] = useState(false);
  const [checkoutTable, setCheckoutTable] = useState(false);
  const [countOrderWaiting, setCountOrderWaiting] = useState(0);
  const [newNotify, setNewNotify] = useState(null);

  // Track new transactions when disconnected
  const [runNT, setRunNT] = useState(false);

  useEffect(() => {
    if (!storeDetail?._id) return;

    const handleConnect = () => setSocketConneted(true);
    const handleDisconnect = () => setSocketConneted(false);
    const handleTableUpdate = () => setNewTableTransaction(true);
    const handleOrderUpdate = async (data) => {
      // TODO: Create Kitchen Printer Function and pass data here
      console.log("ORDER_DATA: ", data); // This will now run only once
      // Use the kitchen printer function
      if(storeDetail?.isStaffAutoPrint) {
        await sendToKitchenPrinter(data);
      }

      setRunSound({ orderSound: true });
      setNewOrderTransaction(true);
    };
    const handleOrderStatusUpdate = () => {
      setRunSound({ orderSound: true });
      setNewOrderUpdateStatusTransaction(true);
    };
    const handleReservationUpdate = () => {
      setRunSound({ orderSound: true });
      setNewOreservationTransaction(true);
    };
    const handleCheckoutTable = (data) => {
      console.log("data: ", data);
      setRunSound({ orderSound: true });
      setCheckoutTable(true);
    };
    const handleNotifyCreated = (data) => {
      console.log(`APP_NOTIFY_CREATED:${storeDetail._id}`, data);
      setNewNotify(data);
    };

    // Register socket listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(`TABLE:${storeDetail._id}`, handleTableUpdate);
    socket.on(`ORDER:${storeDetail._id}`, handleOrderUpdate);
    socket.on(`ORDER_UPDATE_STATUS:${storeDetail._id}`, handleOrderStatusUpdate);
    socket.on(`RESERVATION:${storeDetail._id}`, handleReservationUpdate);
    socket.on(`CHECKOUT_TABLE:${storeDetail._id}`, handleCheckoutTable);
    socket.on(`APP_NOTIFY_CREATED:${storeDetail._id}`, handleNotifyCreated);

    // Cleanup listeners to prevent duplicates
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(`TABLE:${storeDetail._id}`, handleTableUpdate);
      socket.off(`ORDER:${storeDetail._id}`, handleOrderUpdate);
      socket.off(`ORDER_UPDATE_STATUS:${storeDetail._id}`, handleOrderStatusUpdate);
      socket.off(`RESERVATION:${storeDetail._id}`, handleReservationUpdate);
      socket.off(`CHECKOUT_TABLE:${storeDetail._id}`, handleCheckoutTable);
      socket.off(`APP_NOTIFY_CREATED:${storeDetail._id}`, handleNotifyCreated);
    };
  }, [storeDetail, setRunSound]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!socketConneted) {
        setRunNT(true);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [socketConneted]);

  useEffect(() => {
    if (runNT) {
      setNewTableTransaction(true);
      setNewOrderTransaction(true);
      setNewOrderUpdateStatusTransaction(true);
      setRunNT(false);
    }
  }, [runNT]);

  return {
    newTableTransaction,
    setNewTableTransaction,
    newOrderTransaction,
    setNewOrderTransaction,
    newOrderUpdateStatusTransaction,
    setNewOrderUpdateStatusTransaction,
    newOreservationTransaction,
    setNewOreservationTransaction,
    countOrderWaiting,
    setCountOrderWaiting,
    checkoutTable,
    setCheckoutTable,
    newNotify,
    setNewNotify,
  };
};
