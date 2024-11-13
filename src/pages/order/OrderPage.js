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
      console.log("base64ArrayAndPrinter: ", base64ArrayAndPrinter);

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

        // Define canvas dimensions based on the image layout you want to replicate
        const width = 510;
        const height = 290;
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

        // Draw the Table ID (left black block)
        context.fillStyle = "#000"; // Black background
        context.fillRect(0, 0, width / 2, 60); // Black block width / 2
        context.fillStyle = "#fff"; // White text
        context.font = "bold 36px NotoSansLao, Arial, sans-serif";
        context.fillText(data?.tableId?.name || selectedTable?.name, 10, 45); // Table ID text

        // Draw the Table Code (right side)
        context.fillStyle = "#000"; // Black text
        context.font = "bold 30px NotoSansLao, Arial, sans-serif";
        context.fillText(data?.code || selectedTable?.code, width - 220, 44); // Code text on the right

        // Draw Item Name and Quantity
        context.fillStyle = "#000"; // Black text
        context.font = "bold 35px NotoSansLao, Arial, sans-serif";
        wrapText(
          context,
          `${data?.name} (${data?.quantity})`,
          10,
          110,
          width - 20,
          40
        ); // Item name with wrapping

        // Draw Item Note
        context.fillStyle = "#000"; // Black text
        context.font = "24px NotoSansLao, Arial, sans-serif";
        wrapText(context, `${data?.note}`, 10, 150, width - 20, 30); // Item note with wrapping

        // Draw Price and Quantity
        context.font = "28px NotoSansLao, Arial, sans-serif";
        context.fillText(
          `${moneyCurrency(data?.price + (data?.totalOptionPrice ?? 0))} x ${
            data?.quantity
          }`,
          20,
          210
        ); // Price and quantity

        // Draw the dotted line
        context.strokeStyle = "#000"; // Black dotted line
        context.setLineDash([4, 2]); // Dotted line style
        context.beginPath();
        context.moveTo(0, 230); // Start at (0, 230)
        context.lineTo(width, 230); // End at (width, 230)
        context.stroke();

        // Draw Footer (Created By and Date)
        context.setLineDash([]); // Reset line style
        context.font = "bold 24px NotoSansLao, Arial, sans-serif";
        context.fillText(
          data?.createdBy?.firstname ||
            data?.updatedBy?.firstname ||
            "lailaolab",
          20,
          260
        ); // Created by name

        context.fillStyle = "#6e6e6e"; // Gray text for date and time
        context.font = "22px NotoSansLao, Arial, sans-serif";
        context.fillText(
          `${moment(data?.createdAt).format("DD/MM/YY")} | ${moment(
            data?.createdAt
          ).format("LT")}`,
          width - 180,
          260
        ); // Date and time

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

  const Tool = () => {
    return (
      <div className="flex items-center justify-between p-2.5">
        <div className="flex items-center flex-wrap gap-1.5">
          <button
            type="button"
            className="flex items-center justify-center px-4 py-2 bg-[#FB6E3B] text-white rounded hover:bg-[#e85d2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={async () => {
              await onPrintForCher();
              getOrderWaitingAndDoingByStore();
            }}
            disabled={onPrinting}
          >
            {onPrinting && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {t("send_to_kitchen")}
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-[#FB6E3B] text-white rounded hover:bg-[#e85d2a] transition-colors"
            onClick={() => {
              setWorkAfterPin("cancle_order");
              setPopup({ PopUpPin: true });
            }}
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-[#FB6E3B] text-white rounded hover:bg-[#e85d2a] transition-colors"
            onClick={async () => {
              await handleUpdateOrderStatus("DOING");
              getOrderWaitingAndDoingByStore();
            }}
          >
            {t("cooking")}
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-[#FB6E3B] text-white rounded hover:bg-[#e85d2a] transition-colors"
            onClick={async () => {
              await handleUpdateOrderStatus("SERVED");
              getOrderWaitingAndDoingByStore();
            }}
          >
            {t("served")}
          </button>
        </div>
      </div>
    );
  };

  const [activeTab, setActiveTab] = useState(WAITING_STATUS);

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setorderItemForPrintBillSelect([]);
    getOrderItemsStore(tabKey);
    setSelectOrderStatus(tabKey);
    getOrderWaitingAndDoingByStore();
  };

  return (
    <RootStyle>
      {/* {orderLoading || (isLoading && <Loading />)} */}

      <div className="bg-white">
        <nav className="flex gap-8 border-b border-gray-200">
          <button
            type="button"
            onClick={() => handleTabClick(WAITING_STATUS)}
            className={`px-4 py-4 text-sm font-medium transition-colors relative
            ${
              activeTab === WAITING_STATUS
                ? "text-[#FB6E3B]"
                : "text-gray-500 hover:text-gray-700"
            }
          `}
          >
            {t("hasOrder")}({orderWaiting?.length || 0})
            {activeTab === WAITING_STATUS && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FB6E3B]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick(DOING_STATUS)}
            className={`px-4 py-4 text-sm font-medium transition-colors relative
            ${
              activeTab === DOING_STATUS
                ? "text-[#FB6E3B]"
                : "text-gray-500 hover:text-gray-700"
            }
          `}
          >
            {t("cooking")}({orderDoing?.length || 0})
            {activeTab === DOING_STATUS && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FB6E3B]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick(SERVE_STATUS)}
            className={`px-4 py-4 text-sm font-medium transition-colors relative
            ${
              activeTab === SERVE_STATUS
                ? "text-[#FB6E3B]"
                : "text-gray-500 hover:text-gray-700"
            }
          `}
          >
            {t("served")}
            {activeTab === SERVE_STATUS && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FB6E3B]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick(CANCEL_STATUS)}
            className={`px-4 py-4 text-sm font-medium transition-colors relative
            ${
              activeTab === CANCEL_STATUS
                ? "text-[#FB6E3B]"
                : "text-gray-500 hover:text-gray-700"
            }
          `}
          >
            {t("cancel")}
            {activeTab === CANCEL_STATUS && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FB6E3B]" />
            )}
          </button>
        </nav>

        <div className="mt-4">
          {activeTab === WAITING_STATUS && (
            <>
              <Tool />
              {orderLoading && (
                <div className="flex items-center gap-2">
                  <div className="ml-5 h-4 w-4 animate-spin rounded-full border-2 border-[#FB6E3B] border-t-transparent" />
                  <span>Load new data...</span>
                </div>
              )}
              <WaitingOrderTab />
            </>
          )}

          {activeTab === DOING_STATUS && (
            <>
              <Tool />
              {orderLoading && (
                <div className="flex items-center gap-2">
                  <div className="ml-5 h-4 w-4 animate-spin rounded-full border-2 border-[#FB6E3B] border-t-transparent" />
                  <span>Load new data...</span>
                </div>
              )}
              <DoingOrderTab />
            </>
          )}

          {activeTab === SERVE_STATUS && (
            <>
              {orderLoading && (
                <div className="flex items-center gap-2">
                  <div className="ml-5 h-4 w-4 animate-spin rounded-full border-2 border-[#FB6E3B] border-t-transparent" />
                  <span>Load new data...</span>
                </div>
              )}
              <ServedOrderTab />
            </>
          )}

          {activeTab === CANCEL_STATUS && (
            <>
              {orderLoading && (
                <div className="flex items-center gap-2">
                  <div className="ml-5 h-4 w-4 animate-spin rounded-full border-2 border-[#FB6E3B] border-t-transparent" />
                  <span>Load new data...</span>
                </div>
              )}
              <CanceledOrderTab />
            </>
          )}
        </div>
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
  minHeight: "calc(100vh - 64px)",
  padding: 10,
  width: "100%",
});
