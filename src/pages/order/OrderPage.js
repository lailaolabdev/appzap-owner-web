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
import moment from "moment";

export default function OrderPage() {
  const { t } = useTranslation(); // translate
  const { storeDetail } = useStore();
  const { printers, selectedTable } = useStore();
  const [countError, setCountError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const billForCher80 = useRef([]);
  const billForCher58 = useRef([]);
  const [popup, setPopup] = useState();
  const [pinStatus, setPinStatus] = useState(false);
  const [workAfterPin, setWorkAfterPin] = useState("");

  const {
    orderItems,
    setOrderItems,
    orderLoading,
    getOrderItemsStore,
    selectOrderStatus,
    setSelectOrderStatus,
    newOrderTransaction,
    setNewOrderTransaction,
    getOrderWaitingAndDoingByStore,
    orderDoing,
    orderWaiting,
    setorderItemForPrintBillSelect,
    setCountOrderWaiting,
    printBackground,
    setPrintBackground,
  } = useStore();

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

  const [onPrinting, setOnPrinting] = useState(false);
  const onPrintForCher = async () => {
    try {
      setOnPrinting(true);
      setCountError("");
      const orderSelect = orderItems?.filter((e) => e?.isChecked);
      console.log("orderSelect", orderSelect);
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

        // Define canvas dimensions
        const width = 510;
        const height = 350; // Slightly increased height to accommodate content spacing
        canvas.width = width;
        canvas.height = height;

        // Set white background
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, height);

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
        }

        // Table ID Block
        context.fillStyle = "#000";
        context.fillRect(0, 0, width / 2, 60);
        context.fillStyle = "#fff";
        context.font = "bold 36px NotoSansLao, Arial, sans-serif";
        context.fillText(data?.tableId?.name || selectedTable?.name, 10, 45);

        // Table Code on the right
        context.fillStyle = "#000";
        context.font = "bold 30px NotoSansLao, Arial, sans-serif";
        context.fillText(data?.code || selectedTable?.code, width - 150, 44); // Adjusted position for better alignment

        // Item Name and Quantity
        context.fillStyle = "#000";
        context.font = "bold 35px NotoSansLao, Arial, sans-serif";
        wrapText(
          context,
          `${data?.name} (${data?.quantity})`,
          10,
          100,
          width - 20,
          40
        );

        // Item Note
        context.font = "24px NotoSansLao, Arial, sans-serif";
        wrapText(context, `${data?.note || ""}`, 10, 160, width - 20, 30);

        // Options with prices
        context.fillStyle = "#000"; // Black text for options
        context.font = "24px NotoSansLao, Arial, sans-serif";
        const baseY = 190; // Starting Y position for options
        const lineHeight = 25; // Space between each option line

        // Draw options with incremental Y positions
        data.options.forEach((option, idx) => {
          const optionPriceText = option?.price
            ? ` - ${moneyCurrency(option.price)}`
            : "";
          context.fillText(
            `- ${option?.name}${optionPriceText} x ${option?.quantity}`,
            15,
            baseY + idx * lineHeight // Incremental positioning for each option line
          );
        });

        // Calculate position for Price and Quantity below options
        const totalY = baseY + data.options.length * lineHeight + 20; // 20px padding below options
        context.font = "28px NotoSansLao, Arial, sans-serif";
        context.fillText(
          `${moneyCurrency(data.price + (data.totalOptionPrice ?? 0))} x ${
            data.quantity
          }`,
          15,
          totalY
        );

        // Dotted Line Position below Price and Quantity
        const dottedLineY = totalY + 30; // 30px padding below price and quantity
        context.strokeStyle = "#000";
        context.setLineDash([4, 2]);
        context.beginPath();
        context.moveTo(0, dottedLineY);
        context.lineTo(width, dottedLineY);
        context.stroke();

        // Footer Position: Created By and Date below Dotted Line
        const footerY = dottedLineY + 30; // Position footer 30px below the dotted line
        context.setLineDash([]); // Reset line style for solid text
        context.font = "bold 24px NotoSansLao, Arial, sans-serif";
        context.fillText(
          data?.createdBy?.firstname ||
            data?.updatedBy?.firstname ||
            "lailaolab",
          10,
          footerY
        );

        // Date and Time in Footer with 10px additional margin
        const dateY = footerY + 10;
        context.fillStyle = "#6e6e6e";
        context.font = "22px NotoSansLao, Arial, sans-serif";
        context.fillText(
          `${moment(data.createdAt).format("DD/MM/YY")} | ${moment(
            data.createdAt
          ).format("LT")}`,
          width - 180,
          dateY
        );

        // Convert canvas to base64 and store in array for printing
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
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          <Button
            style={{ color: "white", backgroundColor: "#FB6E3B" }}
            onClick={async () => {
              await onPrintForCher();
              // await handleUpdateOrderStatus("DOING");
              getOrderWaitingAndDoingByStore();
            }}
            disabled={onPrinting}
          >
            {onPrinting && <Spinner animation="border" size="sm" />}
            {t("send_to_kitchen")}
          </Button>

          <Button
            style={{ color: "white", backgroundColor: "#FB6E3B" }}
            onClick={async () => {
              setWorkAfterPin("cancle_order");
              setPopup({ PopUpPin: true });
            }}
          >
            {/* ຍົກເລີກ */}
            {t("cancel")}
          </Button>

          <Button
            style={{ color: "white", backgroundColor: "#FB6E3B" }}
            onClick={async () => {
              await handleUpdateOrderStatus("DOING");
              getOrderWaitingAndDoingByStore();
            }}
          >
            {/* ສົ່ງໄປຄົວ */}
            {t("cooking")}
          </Button>

          <Button
            style={{ color: "white", backgroundColor: "#FB6E3B" }}
            onClick={async () => {
              await handleUpdateOrderStatus("SERVED");
              getOrderWaitingAndDoingByStore();
            }}
          >
            {/* ເສີບແລ້ວ */}
            {t("served")}
          </Button>
        </div>

        <div>{t("auto_print")}</div>
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
            title={`${t("hasOrder")}(${orderWaiting?.length})`}
          >
            <Tool />
            {orderLoading && (
              <div>
                <Spinner
                  animation="border"
                  style={{ marginLeft: 20 }}
                  size="sm"
                />{" "}
                <span>Load new data...</span>
              </div>
            )}
            <WaitingOrderTab />
          </Tab>
          <Tab
            eventKey={DOING_STATUS}
            title={`${t("cooking")}(${orderDoing?.length})`}
          >
            <Tool />
            {orderLoading && (
              <div>
                <Spinner
                  animation="border"
                  style={{ marginLeft: 20 }}
                  size="sm"
                />{" "}
                <span>Load new data...</span>
              </div>
            )}
            <DoingOrderTab />
          </Tab>
          <Tab eventKey={SERVE_STATUS} title={`${t("served")}`}>
            {/* <Tool /> */}
            {orderLoading && (
              <div>
                <Spinner
                  animation="border"
                  style={{ marginLeft: 20 }}
                  size="sm"
                />{" "}
                <span>Load new data...</span>
              </div>
            )}
            <ServedOrderTab />
          </Tab>
          <Tab eventKey={CANCEL_STATUS} title={`${t("cancel")}`}>
            {/* <Tool /> */}
            {orderLoading && (
              <div>
                <Spinner
                  animation="border"
                  style={{ marginLeft: 20 }}
                  size="sm"
                />{" "}
                <span>Load new data...</span>
              </div>
            )}
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
