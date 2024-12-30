import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Button, Tabs, Tab, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { useStore } from "../../store";

import { getCountOrderWaiting, updateOrderItem } from "../../services/order";
import html2canvas from "html2canvas";
import { base64ToBlob, moneyCurrency } from "../../helpers";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import axios from "axios";
import BillForChef58 from "../../components/bill/BillForChef58";
import BillForChef80 from "../../components/bill/BillForChef80";
import {
  DOING_STATUS,
  WAITING_STATUS,
  SERVE_STATUS,
  CANCEL_STATUS,
  ETHERNET_PRINTER_PORT,
  BLUETOOTH_PRINTER_PORT,
  USB_PRINTER_PORT,
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
import { easing } from "@mui/material";
import { printOrderItems } from "./printOrderItem";
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
    handleNewOrderItems} = useOrderStore()

  console.log({storeDetail})
  console.log({orderItems})

  const handleUpdateOrderStatus = async (status) => {
    try {
      const previousStatus = orderItems[0].status;
      let menuId;
      const _updateItems = orderItems
        .filter((item) => item.isChecked)
        .map((i) => {
          return {
            status: status,
            _id: i?._id,
            menuId: i?.menuId,
          };
        });
      const _resOrderUpdate = await updateOrderItem(
        _updateItems,
        storeDetail?._id,
        menuId
      );
      if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
        // let _newOrderItem = orderItems.filter((item) => !item.isChecked);
        Swal.fire({
          icon: "success",
          title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      getOrderItemsStore(selectOrderStatus);
      const count = await getCountOrderWaiting(storeDetail?._id);
      setCountOrderWaiting(count || 0);
      return;
    } catch (err) {}
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
  const onPrintForCher = async () => {
    try {
      setOnPrinting(true);
      setCountError("");
      const orderSelect = orderItems?.filter((e) => e?.isChecked);
      const base64ArrayAndPrinter = convertHtmlToBase64(orderSelect, printers, storeDetail, t("total"), t(storeDetail?.firstCurrency));
      // console.log("base64ArrayAndPrinter: ", base64ArrayAndPrinter);

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
      setIsLoading(false);
      setOnPrinting(false);
    }
  };

  useEffect(() => {
    const _run = async () => {
      if (!pinStatus) return;
      setPinStatus(false);
      if (workAfterPin == "cancle_order") {
        await handleUpdateOrderStatus("CANCELED");
        getOrderWaitingAndDoingByStore();
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

  const Tool = () => {
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
              // const hasNoCut = printers.some((e) => e.cutPaper === "not_cut");
              // if (hasNoCut) {
              //   printOrderItems(
              //     groupedItems,
              //     combinedBillRefs,
              //     printers,
              //     selectedTable
              //   );
              // } else {
              onPrintForCher();
              // }
              // await handleUpdateOrderStatus("DOING");
              getOrderWaitingAndDoingByStore();
            }}
            disabled={onPrinting}
          >
            {onPrinting && <Spinner animation="border" size="sm" />}
            <span className={fontMap[language]}>{t("send_to_kitchen")}</span>
          </Button>

          <Button
            className="text-white !bg-orange-500 border-0"
            onClick={async () => {
              await handleUpdateOrderStatus("DOING");
              getOrderWaitingAndDoingByStore();
            }}
          >
            {/* ສົ່ງໄປຄົວ */}
            <span className={fontMap[language]}>{t("cooking")}</span>
          </Button>

          <Button
            className="text-white !bg-green-500 border-0"
            onClick={async () => {
              await handleUpdateOrderStatus("SERVED");
              getOrderWaitingAndDoingByStore();
            }}
          >
            {/* ເສີບແລ້ວ */}
            <span className={fontMap[language]}>{t("served")}</span>
          </Button>

          <Button
            className="text-white !bg-red-500 border-0"
            onClick={async () => {
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
            <Tool />
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
            <Tool />
            <DoingOrderTab />
          </Tab>
          <Tab
            eventKey={SERVE_STATUS}
            title={
              <span className={fontMap[language]}>{`${t("served")}(${
                servedOrders?.length
              })`}</span>
            }
          >
            {/* <Tool /> */}
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
            {/* <Tool /> */}
            <CanceledOrderTab />
          </Tab>
          {/* <Tab eventKey="contact" title="Contact" disabled>
            <Tool />

            <span>test</span>
          </Tab> */}
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
      {/* <div>
        {orderItems
          ?.filter((e) => e?.isChecked)
          .map((val, i) => {
            return (
              <div
                style={{ display: "inline-block" }}
                ref={(el) => (billForCher58.current[i] = el)}
              >
                <BillForChef58
                  storeDetail={storeDetail}
                  selectedTable={selectedTable}
                  // dataBill={dataBill}
                  val={val}
                />
              </div>
            );
          })}
      </div> */}
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
