import { useEffect, useState, useMemo } from "react";
import { getPrinterCounter, getPrinters } from "../../services/printer";
import socketio from "socket.io-client";
const socket = socketio.connect("http://localhost:9150", {
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionDelayMax: 10000,
  reconnectionAttempts: 25,
});
export const usePrintersState = ({ storeDetail }) => {
  // state
  const [isPrintersLoading, setPrintersLoading] = useState(false);
  const [printers, setPrinters] = useState([]);

  const [isPrinterBillLoading, setIsPrinterBillLoading] = useState(false);
  const [printerBill, setPrinterBill] = useState();

  const [printerCounterLoading, setPrinterCounterLoading] = useState(false);
  const [printerCounter, setPrinterCounter] = useState();

  const [isConnectPrinter, setIsConnectPrinter] = useState(false);

  // function
  const getPrintersState = async () => {
    setPrintersLoading(true);
    let findby = "?";
    findby += `storeId=${storeDetail?._id}`;
    const data = await getPrinters(findby);
    setPrinters(data);
    setPrintersLoading(false);
  };
  const getPrinterCounterState = async () => {
    setPrinterCounterLoading(true);
    let findby = "?";
    findby += `storeId=${storeDetail?._id}`;
    const data = await getPrinterCounter(findby);
    setPrinterCounter(data);
    setPrintersLoading(false);
  };

  // useEffect
  useEffect(() => {
    getPrintersState();
    getPrinterCounterState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDetail]);

  // stocket
  useMemo(() => {
    socket.on("connect", (e) => {
      setIsConnectPrinter(socket.connected);
    });
    socket.on("connect_failed", function () {
      console.log("Connection Failed");
    });
    socket.on("disconnect", () => {
      setIsConnectPrinter(socket.connected); // false
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDetail]);

  return {
    isPrintersLoading,
    setPrintersLoading,
    printers,
    setPrinters,
    isPrinterBillLoading,
    setIsPrinterBillLoading,
    printerBill,
    setPrinterBill,
    printerCounterLoading,
    setPrinterCounterLoading,
    printerCounter,
    setPrinterCounter,
    isConnectPrinter,
    setIsConnectPrinter,
    // functions
    getPrintersState,
    getPrinterCounterState,
  };
};
