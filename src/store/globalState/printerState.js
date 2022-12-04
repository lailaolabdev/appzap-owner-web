import { useEffect, useState } from "react";
import { getPrinterCounter, getPrinters } from "../../services/printer";

export const usePrintersState = ({ storeDetail }) => {
  // state
  const [isPrintersLoading, setPrintersLoading] = useState(false);
  const [printers, setPrinters] = useState([]);

  const [isPrinterBillLoading, setIsPrinterBillLoading] = useState(false);
  const [printerBill, setPrinterBill] = useState();

  const [printerCounterLoading, setPrinterCounterLoading] = useState(false);
  const [printerCounter, setPrinterCounter] = useState();

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
    // functions
    getPrintersState,
    getPrinterCounterState,
  };
};
