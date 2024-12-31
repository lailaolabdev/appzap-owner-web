import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Button, Tabs, Tab, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { useStore } from "../../store";

import { getCountOrderWaiting, updateOrderItem } from "../../services/order";
import BillForChef80 from "../../components/bill/BillForChef80";
import {
  DOING_STATUS,
  WAITING_STATUS,
  SERVE_STATUS,
  CANCEL_STATUS,
} from "../../constants/index";

// Tab
import WaitingOrderTab from "./WaitingOrderTab";
import DoingOrderTab from "./DoingOrderTab";
import ServedOrderTab from "./ServedOrderTab";
import CanceledOrderTab from "./CanceledOrderTab";
import Loading from "../../components/Loading";
import PopUpPin from "../../components/popup/PopUpPin";
import printFlutter from "../../helpers/printFlutter";
import moment, { lang } from "moment";
import { printItems } from "../table/printItems";
import { fontMap } from "../../utils/font-map";

import { groupItemsByPrinter, convertHtmlToBase64, runPrint } from "./orderHelpers";

// zustand
import { useStoreStore } from "../../zustand/storeStore"
import { useOrderStore } from "../../zustand/orderStore"

export default function OrderPage() {
  const {
    t,
    i18n: { language },
  } = useTranslation(); // translate
  const { printers, selectedTable } = useStore();
  const [countError, setCountError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const billForCher80 = useRef([]);
  const billForCher58 = useRef([]);
  const [popup, setPopup] = useState();
  const [pinStatus, setPinStatus] = useState(false);
  const [workAfterPin, setWorkAfterPin] = useState("");
  const [combinedBillRefs, setCombinedBillRefs] = useState({});
  const [groupedItems, setGroupedItems] = useState({});

  const {
    // storeDetail,
    // orderItems,
    setOrderItems,
    // orderLoading,
    getOrderItemsStore,
    selectOrderStatus,
    setSelectOrderStatus,
    newOrderTransaction,
    setNewOrderTransaction,
    getOrderWaitingAndDoingByStore,
    // orderDoing,
    // orderWaiting,
    setorderItemForPrintBillSelect,
    setCountOrderWaiting,
    printBackground,
    setPrintBackground,
  } = useStore();


  // zustand state store
  const {
    storeDetail, 
    updateStoreDetail} = useStoreStore()
  const {
    orderItems, 
    waitingOrders,
    doingOrders,
    servedOrders,
    canceledOrders, 
    handleNewOrderItems,
    handleUpdateOrderItems,
    handleCheckbox
  } = useOrderStore()

  const [ordersUpdating, setOrdersUpdating] = useState(false)
  const [canceledfromStatus, setCanceledfromStatus] = useState(WAITING_STATUS)


  const handleUpdateOrderStatus = async ({fromStatus, toStatus}) => {
    try {
      // If `fromStatus` is not provided, use the status of the first updated order
      if (!fromStatus || !toStatus) {
        console.log("No fromStatus or toStatus provided!")
        Swal.fire({
          icon: "error",
          title: "Oop!", // Error
          text: "No update status provided!", // Failed to update status
        });
        return
      }

      if (fromStatus === toStatus) {
        console.log("Same status, No need to update!");
        Swal.fire({
          icon: "error",
          title: "Oop!", // Error
          text: "Same status, No need to update!", // Failed to update status
        });
        return; // Return early if no orders to update or invalid toStatus
      }

      setOrdersUpdating(true)
      // Get the orders based on the `fromStatus`
      const ordersToUpdate = getOrdersByStatus(fromStatus).filter((item) => item.isChecked);
  
      console.log("Before update:", ordersToUpdate);
  
      if (ordersToUpdate.length === 0) {
        console.log(`No checked items with the status ${fromStatus}`);
        setOrdersUpdating(false)
        Swal.fire({
          icon: "error",
          title: "Oop!", // Error
          text: `No checked items`, // Failed to update status
        });
        return;
      }
  
      // Prepare the orders to update (with the new `toStatus`)
      const _updateItems = ordersToUpdate.map((item) => ({
        ...item, // Spread the existing fields to keep them unchanged
        status: toStatus, // Update only the `status` field to `toStatus`
      }));

  
      // Update order status in the backend
      const response = await updateOrderItem(_updateItems, storeDetail?._id);
  
      console.log({ response });
  
      if (response?.data?.message === "UPADTE_ORDER_SECCESS") {
        setOrdersUpdating(false)
        // Show success message
        Swal.fire({
          icon: "success",
          title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ", // Status updated successfully
          showConfirmButton: false,
          timer: 2000,
        });
        
        console.log({_updateItems})
        // Update the relevant orders in the store (UI re-render)
        handleUpdateOrderItems({updatedOrders: _updateItems, fromStatus, toStatus})
      }

      setOrdersUpdating(false)
  
      // // Update the count of orders waiting
      // const count = await getCountOrderWaiting(storeDetail?._id);
      // setCountOrderWaiting(count || 0);
    } catch (err) {
      console.error("Error updating order status:", err);
      Swal.fire({
        icon: "error",
        title: "ຄວາມຜິດພາດ", // Error
        text: "ການອັບເດດສະຖານະລົບລາຍ", // Failed to update status
      });
    }
  };
  
  // Helper function to get the orders based on the status
  const getOrdersByStatus = (status) => {
    switch (status) {
      case WAITING_STATUS:
        return waitingOrders;
      case DOING_STATUS:
        return doingOrders;
      case SERVE_STATUS:
        return servedOrders;
      case CANCEL_STATUS:
        return canceledOrders;
      // case "PAID":
      //   return paidOrders;
      // case "PRINTBILL":
      //   return printBillOrders;
      default:
        return []; // Return empty array if no match
    }
  };
  
  

  useEffect(() => {
    const orderSelect = orderItems?.filter((e) => e?.isChecked);
    const refs = {};

    const grouped = groupItemsByPrinter(orderSelect);

    Object.keys(grouped).forEach((printerIp) => {
      refs[printerIp] = React.createRef();
    });
    setCombinedBillRefs(refs);
    setGroupedItems(grouped);
  }, [orderItems]);

  const [onPrinting, setOnPrinting] = useState(false);
  const onPrintForCher = async ({fromStatus}) => {
    try {
      if (!fromStatus) {
        return
      }

      setOnPrinting(true);
      setCountError("");
      const orderSelect = getOrdersByStatus(fromStatus).filter((item) => item.isChecked);

      
      console.log({orderSelect})
      const base64ArrayAndPrinter = convertHtmlToBase64(orderSelect, printers, storeDetail, t("total"), t(storeDetail?.firstCurrency));

      let arrayPrint = [];
      for (var index = 0; index < base64ArrayAndPrinter.length; index++) {
        arrayPrint.push(
          runPrint(
            base64ArrayAndPrinter[index].dataUrl,
            index,
            base64ArrayAndPrinter[index].printer
          )
        );
      }

      // TODO: uncheck the selected orders
      orderSelect.map(order => handleCheckbox(order, fromStatus))

      if (countError == "ERR") {
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "ປິ້ນບໍ່ສຳເລັດ",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await Swal.fire({
          icon: "success",
          title: "ປິ້ນສຳເລັດ",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setOnPrinting(false);
      setPrintBackground((prev) => [...prev, ...arrayPrint]);
    } catch (err) {
      console.log("printing err: ", err)
      setIsLoading(false);
      setOnPrinting(false);
    }
  };

  useEffect(() => {
    const _run = async () => {
      if (!pinStatus) return;
      setPinStatus(false);
      if (workAfterPin == "cancle_order") {
        console.log("update to canceled")
        await handleUpdateOrderStatus({fromStatus: canceledfromStatus,toStatus: CANCEL_STATUS});
        // getOrderWaitingAndDoingByStore();
      }
      setWorkAfterPin("");
    };
    _run();
  }, [pinStatus]);

  useEffect(() => {
    if (!onPrinting) {
      setSelectOrderStatus(WAITING_STATUS);
      setNewOrderTransaction(true);
    }
  }, []);

  useEffect(() => {
    if (!onPrinting) {
      getOrderItemsStore(selectOrderStatus);
      getOrderWaitingAndDoingByStore();
      setNewOrderTransaction(false);
    }
  }, [newOrderTransaction, selectOrderStatus]);

  useEffect(() => {
    if (!onPrinting) {
      if (newOrderTransaction) {
        getOrderItemsStore(selectOrderStatus);
        getOrderWaitingAndDoingByStore();
        setNewOrderTransaction(false);
      }
    }
  }, [onPrinting]);

  // function
  async function waitForPrinting() {
    // alert("gogo");
    while (onPrinting) {
      // alert("wait ");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  const handleToggleAutoPrint = async () => {
    const updatedData = {
      ...storeDetail,
      isStaffAutoPrint: !storeDetail?.isStaffAutoPrint,
      isUserAutoPrint: !storeDetail?.isUserAutoPrint
    };
    console.log({updatedData})
    await updateStoreDetail(updatedData, storeDetail?._id);
  };

  const Tool = ({fromStatus}) => {
    return (
      <div
        style={{
          display: "flex",
          padding: "10px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          className="d-flex align-items-center"
          style={{
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <Button
            className="text-white !bg-gray-500 border-0"
            onClick={async () => {
              onPrintForCher({fromStatus});
              // await handleUpdateOrderStatus(DOING_STATUS);
            }}
            disabled={onPrinting}
          >
            {onPrinting && <Spinner animation="border" size="sm" />}
            <span className={fontMap[language]}>{t("send_to_kitchen")}</span>
          </Button>

          <Button
            className="text-white !bg-orange-500 border-0"
            disabled={ordersUpdating}
            onClick={async () => {
              await handleUpdateOrderStatus({fromStatus, toStatus: DOING_STATUS});
              // getOrderWaitingAndDoingByStore();
            }}
          >
            {/* ສົ່ງໄປຄົວ */}
            <span className={fontMap[language]}>{t("cooking")}</span>
          </Button>

          <Button
            className="text-white !bg-green-500 border-0"
            disabled={ordersUpdating}
            onClick={async () => {
              await handleUpdateOrderStatus({fromStatus, toStatus: SERVE_STATUS});
              // getOrderWaitingAndDoingByStore();
            }}
          >
            {/* ເສີບແລ້ວ */}
            <span className={fontMap[language]}>{t(SERVE_STATUS)}</span>
          </Button>

          <Button
            className="text-white !bg-red-500 border-0"
            disabled={ordersUpdating}
            onClick={async () => {
              setCanceledfromStatus(fromStatus)
              setWorkAfterPin("cancle_order");
              setPopup({ PopUpPin: true });
            }}
          >
            {/* ຍົກເລີກ */}
            <span className={fontMap[language]}>{t("cancel")}</span>
          </Button>
        </div>

        {/* <div className={fontMap[language]}>{t("auto_print")}YO</div> */}
        <div>
          <label className={fontMap[language]}>
            {t("auto_print")}
          </label>
          <input
            type="checkbox"
            checked={storeDetail?.isStaffAutoPrint}
            onChange={() => handleToggleAutoPrint()}
          />
        </div>

      </div>
    );
  };
  return (
    <RootStyle>
      {/* {orderLoading || (isLoading && <Loading />)} */}
      <div style={{ backgroundColor: "white" }}>
        <Tabs
          defaultActiveKey={WAITING_STATUS}
          id="OrderTabs"
          onSelect={(select) => {
            setorderItemForPrintBillSelect([]);
            getOrderItemsStore(select);
            setSelectOrderStatus(select);
            getOrderWaitingAndDoingByStore();
          }}
          className="myClass"
        >
          <Tab
            eventKey={WAITING_STATUS}
            title={
              <span className={fontMap[language]}>{`${t("hasOrder")}(${
                waitingOrders?.length
              })`}</span>
            }
          >
            <Tool fromStatus={WAITING_STATUS} />
            <WaitingOrderTab />
          </Tab>
          <Tab
            eventKey={DOING_STATUS}
            title={
              <span className={fontMap[language]}>{`${t("cooking")}(${
                doingOrders?.length
              })`}</span>
            }
          >
            <Tool fromStatus={DOING_STATUS} />
            <DoingOrderTab />
          </Tab>
          <Tab
            eventKey={SERVE_STATUS}
            title={
              <span className={fontMap[language]}>{`${t(SERVE_STATUS)}(${
                servedOrders?.length
              })`}</span>
            }
          >
            <ServedOrderTab />
          </Tab>
          <Tab
            eventKey={CANCEL_STATUS}
            title={
              <span className={fontMap[language]}>{`${t("cancel")}(${
                canceledOrders?.length
              })`}</span>
            }
          >
            <CanceledOrderTab />
          </Tab>
        </Tabs>
      </div>
      <div style={{ padding: "20px" }}>
        {orderItems
          ?.filter((e) => e?.isChecked)
          .map((val, i) => {
            return (
              <div
                style={{ display: "inline-block", margin: 10 }}
                ref={(el) => (billForCher80.current[i] = el)}
              >
                <BillForChef80
                  storeDetail={storeDetail}
                  selectedTable={selectedTable}
                  val={val}
                />
              </div>
            );
          })}
      </div>
        <PopUpPin
          open={popup?.PopUpPin}
          onClose={() => setPopup()}
          setPinStatus={(e) => {
            setPinStatus(e);
            setPopup();
          }}
        />

    </RootStyle>
  );
}

const RootStyle = styled("div")({
  backgroundColor: "#f9f9f9",
  maxHeight: "calc(100vh - 64px)",
  height: "100%",
  overflow: "auto",
  padding: 10,
  width: "100%",
});
