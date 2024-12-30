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

  // console.log("printers", printers);
  // console.log("orderItems", orderItems);

  const groupItemsByPrinter = (items) => {
    // Early return if no items or printers are provided
    if (!items || !Array.isArray(items) || items.length === 0) return {};
  
    if (!Array.isArray(printers) || printers.length === 0) return {};
  
    // Create a map of printer IPs for efficient lookup
    const printerMap = printers.reduce((acc, printer) => {
      if (printer?._id && printer?.ip) {
        acc[printer._id] = printer.ip; // Map printer ID to IP address
      }
      return acc;
    }, {});
  
    // Reduce the items array into groups
    return items.reduce((printerGroups, item) => {
      const printerIp = printerMap[item.printer] || "unknown"; // Default to "unknown" if no match
  
      // Initialize groups if not already present
      if (!printerGroups[printerIp]) {
        printerGroups[printerIp] = {};
      }
  
      const tableId = item?.tableId;
      const code = item?.code;
  
      // Initialize groups for tableId and code if not present
      if (tableId && !printerGroups[printerIp][tableId]) {
        printerGroups[printerIp][tableId] = {};
      }
      if (code && !printerGroups[printerIp][tableId]?.[code]) {
        printerGroups[printerIp][tableId][code] = [];
      }
  
      // Add the item to the appropriate group
      if (tableId && code) {
        printerGroups[printerIp][tableId][code].push(item);
      }
  
      return printerGroups;
    }, {});
  };
  

  const [onPrinting, setOnPrinting] = useState(false);
  const onPrintForCher = async () => {
    try {
      setOnPrinting(true);
      setCountError("");
      const orderSelect = orderItems?.filter((e) => e?.isChecked);
      const base64ArrayAndPrinter = convertHtmlToBase64(orderSelect);
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

  const runPrint = async (dataUrl, index, printer) => {
    try {
      const printFile = base64ToBlob(dataUrl);
      var bodyFormData = new FormData();

      bodyFormData.append("ip", printer?.ip);
      if (index === 0) {
        bodyFormData.append("beep1", 1);
        bodyFormData.append("beep2", 9);
      }
      bodyFormData.append("isdrawer", false);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", printFile);
      bodyFormData.append("paper", printer?.width === "58mm" ? 58 : 80);

      let urlForPrinter = "";
      if (printer?.type === "ETHERNET") urlForPrinter = ETHERNET_PRINTER_PORT;
      if (printer?.type === "BLUETOOTH") urlForPrinter = BLUETOOTH_PRINTER_PORT;
      if (printer?.type === "USB") urlForPrinter = USB_PRINTER_PORT;

      await printFlutter(
        {
          imageBuffer: dataUrl,
          ip: printer?.ip,
          type: printer?.type,
          port: "9100",
          width: printer?.width === "58mm" ? 400 : 580,
        },
        async () => {
          await axios({
            method: "post",
            url: urlForPrinter,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      );
      return true;
    } catch {
      return false;
    }
  };

  const convertHtmlToBase64 = (orderSelect) => {
    const base64ArrayAndPrinter = [];
    orderSelect.forEach((data, index) => {
      if (data) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Define base dimensions
        const baseHeight = 250;
        const extraHeightPerOption = 30;
        const extraHeightForNote = data?.note ? 40 : 0;
        const dynamicHeight =
          baseHeight +
          (data.options?.length || 0) * extraHeightPerOption +
          extraHeightForNote;
        const width = 510;

        canvas.width = width;
        canvas.height = dynamicHeight;

        // Set white background
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, dynamicHeight);

        // Helper function for text wrapping
        function wrapText(context, text, x, y, maxWidth, lineHeight) {
          const words = text.split(" ");
          let line = "";
          for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + " ";
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
              context.fillText(line, x, y);
              line = words[n] + " ";
              y += lineHeight;
            } else {
              line = testLine;
            }
          }
          context.fillText(line, x, y);
          return y + lineHeight;
        }

        // Header: Table Name and Code
        // Draw the Table ID (left black block)
        context.fillStyle = "#000"; // Black background
        context.fillRect(0, 0, width / 2, 60); // Black block width / 2
        context.fillStyle = "#fff"; // White text
        context.font = "bold 36px NotoSansLao, Arial, sans-serif";
        context.fillText(data?.tableId?.name, 10, 45); // Table ID text

        // Draw the Table Code (right side)
        context.fillStyle = "#000"; // Black text
        context.font = "bold 30px NotoSansLao, Arial, sans-serif";
        context.fillText(data?.code, width - 220, 45); // Code text on the right

        // Divider line below header
        context.strokeStyle = "#ccc";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, 65);
        context.lineTo(width, 65);
        context.stroke();

        // Content: Item Name and Quantity
        context.fillStyle = "#000";
        context.font = "bold 34px NotoSansLao, Arial, sans-serif";
        let yPosition = 100;
        yPosition = wrapText(
          context,
          `${data?.name} (${data?.quantity})`,
          10,
          yPosition,
          width - 20,
          36
        );

        // Content: Item Note
        if (data?.note) {
          const noteLabel = "note: ";
          const noteText = data.note;

          // Draw "Note:" label in bold
          context.fillStyle = "#666";
          context.font = " bold italic bold 24px Arial, sans-serif";
          context.fillText(noteLabel, 10, yPosition);

          // Measure width of the "Note:" label
          const noteLabelWidth = context.measureText(noteLabel).width;

          // Wrap the note text, starting after the "Note:" label
          context.font = "bold italic 24px Arial, sans-serif";
          yPosition = wrapText(
            context,
            noteText,
            10 + noteLabelWidth, // Start after the label width
            yPosition,
            width - 20 - noteLabelWidth, // Adjust wrapping width
            30
          );

          // Add spacing after the note
          yPosition += 10;
        }

        // Options
        if (data.options && data.options.length > 0) {
          context.fillStyle = "#000";
          context.font = "24px NotoSansLao, Arial, sans-serif";
          data.options.forEach((option, idx) => {
            const optionPriceText = option?.price
              ? ` - ${moneyCurrency(option?.price)}`
              : "";
            const optionText = `- ${option?.name}${optionPriceText} x ${
              option?.quantity || 1
            }`;
            yPosition = wrapText(
              context,
              optionText,
              10,
              yPosition,
              width - 20,
              30
            );
          });

          // Divider below options
          context.strokeStyle = "#ccc";
          context.setLineDash([4, 2]);
          context.beginPath();
          context.moveTo(0, yPosition);
          context.lineTo(width, yPosition);
          context.stroke();
          context.setLineDash([]);
          yPosition += 20;
        }

        context.fillStyle = "#000";
        context.font = " 24px NotoSansLao, Arial, sans-serif";
        // let yPosition = 100;
        yPosition = wrapText(
          context,
          `${t("total")} ${moneyCurrency(
            data?.price + (data?.totalOptionPrice ?? 0)
          )} ${t(storeDetail?.firstCurrency)}`,
          10,
          yPosition,
          width - 20,
          46
        );

        // Set text properties
        context.fillStyle = "#000"; // Black text color
        context.font = "28px NotoSansLao, Arial, sans-serif"; // Font style and size
        context.textAlign = "right"; // Align text to the right
        context.textBaseline = "bottom"; // Align text baseline to bottom

        // Draw delivery code at the bottom-right
        context.fillText(
          `${data?.deliveryCode ? `(DC : ${data?.deliveryCode})` : ""}`, // Delivery code text
          width - 10, // Position X: 10px from the right edge
          dynamicHeight - 86 // Position Y: 100px above the bottom edge
        );

        // Add a dotted line above the footer
        context.strokeStyle = "#000"; // Black dotted line
        context.setLineDash([4, 2]); // Dotted line style
        context.beginPath();
        context.moveTo(0, dynamicHeight - 70); // Position 70px above footer
        context.lineTo(width, dynamicHeight - 70); // Full-width dotted line
        context.stroke();
        context.setLineDash([]); // Reset line dash style

        // Footer Section
        context.font = "bold 24px NotoSansLao, Arial, sans-serif";
        context.fillStyle = "#000";

        // Draw "Created By" text at the bottom-left
        context.textAlign = "left"; // Align text to the left
        context.fillText(
          data?.createdBy?.firstname || data?.updatedBy?.firstname || "", // Footer text
          10, // 10px from the left edge
          dynamicHeight - 20 // Position Y: 20px above the bottom
        );

        // Draw date and time at the bottom-right
        context.textAlign = "right"; // Align text to the right
        context.fillStyle = "#6e6e6e"; // Gray color
        context.font = "22px NotoSansLao, Arial, sans-serif"; // Smaller font size
        context.fillText(
          `${moment(data?.createdAt).format("DD/MM/YY")} | ${moment(
            data?.createdAt
          ).format("LT")}`, // Date and time
          width - 10, // 10px from the right edge
          dynamicHeight - 20 // Position Y: 20px above the bottom
        );

        // Convert canvas to base64
        const dataUrl = canvas.toDataURL("image/png");
        const printer = printers.find((e) => e?._id === data?.printer);
        if (printer) base64ArrayAndPrinter.push({ dataUrl, printer });
      }
    });

    return base64ArrayAndPrinter;
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
