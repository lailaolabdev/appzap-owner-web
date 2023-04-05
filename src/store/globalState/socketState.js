import { useState, useMemo, useEffect } from "react";
import socketio from "socket.io-client";
import { END_POINT_SOCKET } from "../../constants/api";
const socket = socketio.connect(END_POINT_SOCKET, {
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionDelayMax: 10000,
  reconnectionAttempts: 25,
});
export const useSocketState = ({ storeDetail, orderSound }) => {
  const [socketConneted, setSocketConneted] = useState(false);
  const [newTableTransaction, setNewTableTransaction] = useState(false);
  const [newOrderTransaction, setNewOrderTransaction] = useState(false);
  const [newOrderUpdateStatusTransaction, setNewOrderUpdateStatusTransaction] =
    useState(false);
  const [newOreservationTransaction, setNewOreservationTransaction] =
    useState(false);

  useMemo(() => {
    socket.on("connect", (e) => {
      setSocketConneted(socket.connected);
    });
    socket.on(`TABLE:${storeDetail?._id}`, () => {
      setNewTableTransaction(true);
    });
    socket.on(`ORDER:${storeDetail?._id}`, () => {
      orderSound();
      setNewOrderTransaction(true);
    });
    socket.on(`ORDER_UPDATE_STATUS:${storeDetail?._id}`, () => {
      orderSound();
      setNewOrderUpdateStatusTransaction(true);
    });
    socket.on(`RESERVATION:${storeDetail._id}`, () => {
      orderSound();
      setNewOreservationTransaction(true);
    });
    socket.on("disconnect", () => {
      setSocketConneted(socket.connected);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDetail]);

  // TODO: If socket disconnet set newTransaction is true every 10s >>>>>>>>>>>>>>>>>>>>>>>>
  const [runNT, setRunNT] = useState(false);
  function setNewTransactionAll() {
    // setNewTransaction
    setNewTableTransaction(true);
    setNewOrderTransaction(true);
    setNewOrderUpdateStatusTransaction(true);
  }
  useEffect(() => {
    const startInternal = setInterval(() => {
      if (socketConneted) {
        return;
      }
      setRunNT(true);
    }, 10000);
    return () => {
      clearInterval(startInternal);
    };
  }, [socketConneted]);
  useEffect(() => {
    if (runNT) {
      setNewTransactionAll();
      setRunNT(false);
    }
  }, [runNT]);
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  /**
   * Test function
   */
  // useEffect(() => {
  //   if (newTableTransaction) {
  //     alert("okey socket");
  //     setNewTableTransaction(false);
  //   }
  // }, [newTableTransaction]);

  return {
    newTableTransaction,
    setNewTableTransaction,
    newOrderTransaction,
    setNewOrderTransaction,
    newOrderUpdateStatusTransaction,
    setNewOrderUpdateStatusTransaction,
    newOreservationTransaction,
    setNewOreservationTransaction,
  };
};
