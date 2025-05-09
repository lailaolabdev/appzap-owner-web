import { useState, useEffect } from "react";
import socketio from "socket.io-client";
import {
  END_POINT_SERVER_JUSTCAN,
  END_POINT_SOCKET,
  getLocalData,
} from "../../constants/api";
import { useStoreStore } from "../../zustand/storeStore";
import { useOrderStore } from "../../zustand/orderStore";
import { useShiftStore } from "../../zustand/ShiftStore";
import { useClaimDataStore } from "../../zustand/claimData";
import {
  useSlideImageStore,
  useCombinedToggleSlide,
} from "../../zustand/slideImageStore";
import { data } from "browserslist";
import { set } from "lodash";
import Axios from "axios";
const { sendToKitchenPrinter } = require("../../helpers/printerHelper");

const socket = socketio.connect(END_POINT_SOCKET, {
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionDelayMax: 10000,
});

export const useSocketState = ({ setRunSound }) => {
  const [socketConneted, setSocketConneted] = useState(false);
  const [newTableTransaction, setNewTableTransaction] = useState(false);
  const [newOrderTransaction, setNewOrderTransaction] = useState(false);
  const [newOrderUpdateStatusTransaction, setNewOrderUpdateStatusTransaction] =
    useState(false);
  const [newOreservationTransaction, setNewOreservationTransaction] =
    useState(false);
  const [checkoutTable, setCheckoutTable] = useState(false);
  const [countOrderWaiting, setCountOrderWaiting] = useState(0);
  const [newNotify, setNewNotify] = useState(null);

  // Track new transactions when disconnected
  const [runNT, setRunNT] = useState(false);

  const { storeDetail, fetchStoreDetail } = useStoreStore();
  const { setShiftList, setShiftListCurrent, setOpenShiftForCounter } =
    useShiftStore();
  const { setUseSlideImage, setUseSlideImageData } = useSlideImageStore();
  const { Settoggle, SettoggleTable, SettoggleSlide, SettoggleOpenTwoScreen } =
    useCombinedToggleSlide();
  const { handleNewOrderItems } = useOrderStore();
  const { setTotalAmountClaim, TotalAmountClaim } = useClaimDataStore();

  useEffect(() => {
    if (!storeDetail?._id) return;

    const handleConnect = () => setSocketConneted(true);
    const handleDisconnect = () => setSocketConneted(false);
    const handleTableUpdate = () => setNewTableTransaction(true);
    const handleOrderUpdate = async (data) => {
      try {
        // Ensure data and orders are properly defined
        if (data && Array.isArray(data.orders)) {
          // console.log("ORDER_DATA: ", data);

          // Call handleNewOrderItems with the orders data
          handleNewOrderItems(data.orders);
          // Trigger sound or any other actions as needed
          setRunSound({ orderSound: true });

          // Use the kitchen printer function if necessary
          if (storeDetail?.isStaffAutoPrint) {
            await sendToKitchenPrinter(data);
          }

          // You can uncomment this line if you need to set new order transaction state
          // setNewOrderTransaction(true);
          setTimeout(() => {
            setNewOrderTransaction(true);
            setNewOrderUpdateStatusTransaction(true);
          }, 1000);
        } else {
          console.error("Invalid order data received:", data);
        }
      } catch (error) {
        console.error("Error handling order update:", error);
        // Optionally, set error state or notify the user
      }
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
      // console.log("data: ", data);
      setRunSound({ orderSound: true });
      setCheckoutTable(true);
    };
    const handleNotifyCreated = (data) => {
      // console.log(`APP_NOTIFY_CREATED:${storeDetail._id}`, data);
      setNewNotify(data);
    };

    const getDataShift = (data) => {
      // console.log("data shift with socket: ", data);
      setShiftList(data?.data);
    };

    const getDataShiftOpenAndClose = async (data) => {
      await fetchStoreDetail(data?.data?._id);
      // setShiftList(data?.data);
    };
    const getDataShiftCurentOpen = async (data) => {
      setShiftListCurrent(data?.data);
    };
    const useSlideImage = async (data) => {
      setUseSlideImage(data?.data);
      // console.log("useSlideImage socket", data?.data);
    };
    const showTable = async (data) => {
      // console.log("socket showTable", data?.data?.showTable);
      SettoggleTable(data?.data?.showTable);
    };
    const showSlide = async (data) => {
      // console.log("socket showSlide", data?.data?.showSlide);
      SettoggleSlide(data?.data?.showSlide);
    };
    const showTitle = async (data) => {
      // console.log("socket showTitle", data?.data?.showTitle);
      Settoggle(data?.data?.showTitle);
    };
    const OpenTwoScreen = async (data) => {
      // console.log("socket OpenTwoScreen", data?.data?.isOpenSecondScreen);
      SettoggleOpenTwoScreen(data?.data?.isOpenSecondScreen);
    };
    const ImageSlidData = async (data) => {
      setUseSlideImageData(data?.data);
    };
    const updateCounterFilterShift = async (data) => {
      // console.log("updateCounterFilterShift", data?.data?.isCounterFilterShift);
      setOpenShiftForCounter(data?.data?.isCounterFilterShift);
    };

    const getClaimAmountData = async () => {
      try {
        const { DATA } = await getLocalData();
        if (!DATA?.storeId) {
          console.error("No storeId found in local data");
          return;
        }

        const response = await Axios.get(
          `${END_POINT_SERVER_JUSTCAN}/v5/checkout-total-amount?storeId=${DATA.storeId}`
        );

        if (response?.data?.totalAmount !== undefined) {
          setTotalAmountClaim(response.data.totalAmount);
          setTimeout(() => {
            setNewTableTransaction(true);
            setNewOrderTransaction(true);
            setNewOrderUpdateStatusTransaction(true);
          }, 1000);
        } else {
          console.warn("Total amount not found in response", response.data);
        }
      } catch (err) {
        console.error("Error fetching claim amount data:", err);
      }
    };

    // Register socket listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(`TABLE:${storeDetail._id}`, handleTableUpdate);
    socket.on(`ORDER:${storeDetail._id}`, handleOrderUpdate);
    socket.on(
      `ORDER_UPDATE_STATUS:${storeDetail._id}`,
      handleOrderStatusUpdate
    );
    socket.on(`RESERVATION:${storeDetail._id}`, handleReservationUpdate);
    socket.on(`CHECKOUT_TABLE:${storeDetail._id}`, handleCheckoutTable);
    socket.on(`APP_NOTIFY_CREATED:${storeDetail._id}`, handleNotifyCreated);
    socket.on(`SHIFT_ALL:${storeDetail._id}`, getDataShift);
    socket.on(`CLOSE_OPEN_SHIFT:${storeDetail._id}`, getDataShiftOpenAndClose);
    socket.on(`SHIFT_UPDATE_OPEN:${storeDetail._id}`, getDataShiftCurentOpen);
    // socket.on(`UPDATE_USE_SLIDE:${storeDetail._id}`, useSlideImage);
    socket.on(`IMAGE_SLIDE_USED:${storeDetail._id}`, useSlideImage);
    socket.on(`SHOW_TABLE:${storeDetail._id}`, showTable);
    socket.on(`SHOW_TITLE:${storeDetail._id}`, showTitle);
    socket.on(`SHOW_SLIDE:${storeDetail._id}`, showSlide);
    socket.on(`OPEN_TWO_SCREEN:${storeDetail._id}`, OpenTwoScreen);
    socket.on(`IMAGE_SLIDE:${storeDetail._id}`, ImageSlidData);
    socket.on(`CHECKOUT_UPDATED:${storeDetail._id}`, getClaimAmountData);
    socket.on(
      `OPEN_COUNTER_FILTER_SHIFT:${storeDetail._id}`,
      updateCounterFilterShift
    );

    // Cleanup listeners to prevent duplicates
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(`TABLE:${storeDetail._id}`, handleTableUpdate);
      socket.off(`ORDER:${storeDetail._id}`, handleOrderUpdate);
      socket.off(
        `ORDER_UPDATE_STATUS:${storeDetail._id}`,
        handleOrderStatusUpdate
      );
      socket.off(`RESERVATION:${storeDetail._id}`, handleReservationUpdate);
      socket.off(`CHECKOUT_TABLE:${storeDetail._id}`, handleCheckoutTable);
      socket.off(`APP_NOTIFY_CREATED:${storeDetail._id}`, handleNotifyCreated);
      socket.off(`SHIFT_ALL:${storeDetail._id}`, getDataShift);
      socket.off(
        `CLOSE_OPEN_SHIFT:${storeDetail._id}`,
        getDataShiftOpenAndClose
      );
      socket.off(
        `SHIFT_UPDATE_OPEN:${storeDetail._id}`,
        getDataShiftCurentOpen
      );
      socket.off(`SHOW_TABLE:${storeDetail._id}`, showTable);
      socket.off(`SHOW_TITLE:${storeDetail._id}`, showTitle);
      socket.off(`SHOW_SLIDE:${storeDetail._id}`, showSlide);
      socket.off(`OPEN_TWO_SCREEN:${storeDetail._id}`, OpenTwoScreen);
      socket.off(`IMAGE_SLIDE:${storeDetail._id}`, ImageSlidData);
      socket.off(`CHECKOUT_UPDATED:${storeDetail._id}`, getClaimAmountData);
      socket.off(
        `OPEN_COUNTER_FILTER_SHIFT:${storeDetail._id}`,
        updateCounterFilterShift
      );
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
