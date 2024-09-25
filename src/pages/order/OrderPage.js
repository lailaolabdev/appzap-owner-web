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
    } catch (err) { }
  };

  const [onPrinting, setOnPrinting] = useState(false);
  const onPrintForCher = async () => {
    try {
      setOnPrinting(true);
      setCountError("");
      const orderSelect = orderItems?.filter((e) => e?.isChecked);
      const printDate = [...billForCher80.current].filter((e) => e != null);
      const base64Array = convertHtmlToBase64(printDate)
      console.log("base64Array: ", base64Array)

      let arrayPrint = [];
      for (var index = 0; index < base64Array.length; index++) {
        const printer = printers.find((e) => e?._id === orderSelect[index].printer);
        arrayPrint.push(runPrint(base64Array, index, printer));
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

  const runPrint = async (base64Array, index, printer) => {
    try {
      const printFile = base64ToBlob(base64Array[index]);
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
          imageBuffer: base64Array[index],
          ip: printer?.ip,
          type: printer?.type,
          port: "9100",
          beep: 1,
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

  const convertHtmlToBase64 = (printDate) => {
    const base64Array = [];

    printDate.forEach((element, index) => {
      if (element) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Define canvas dimensions based on the image layout you want to replicate
        const width = 510;
        const height = 290;
        canvas.width = width;
        canvas.height = height;

        const val = orderItems[index];

        // Set white background
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, height);

        // Draw the Table ID (left black block)
        context.fillStyle = "#000"; // Black background
        context.fillRect(0, 0, width / 2, 60); // Black block width / 2
        context.fillStyle = "#fff"; // White text
        context.font = "bold 36px Arial";
        context.fillText(val?.tableId?.name || selectedTable?.name, 10, 45); // Table ID text

        // Draw the Table Code (right side)
        context.fillStyle = "#000"; // Black text
        context.font = "bold 30px Arial";
        context.fillText(val?.code || selectedTable?.code, width - 220, 44); // Code text on the right

        // Draw Item Name and Quantity
        context.fillStyle = "#000"; // Black text
        context.font = "bold 40px Arial";
        context.fillText(`${val?.name} (${val?.quantity})`, 10, 110); // Item name

        // Draw Price and Quantity
        context.font = "28px Arial";
        context.fillText(`${moneyCurrency(val?.price + (val?.totalOptionPrice ?? 0))} x ${val?.quantity}`, 20, 190); // Price and quantity

        // Draw the dotted line
        context.strokeStyle = "#000"; // Black dotted line
        context.setLineDash([4, 2]); // Dotted line style
        context.beginPath();
        context.moveTo(0, 210); // Start at (20, 150)
        context.lineTo(width, 210); // End at (width - 20, 150)
        context.stroke();

        // Draw Footer (Created By and Date)
        context.setLineDash([]); // Reset line style
        context.font = "bold 24px Arial";
        context.fillText(val?.createdBy?.firstname || 'lailaolab', 20, 250); // Created by name

        context.fillStyle = "#6e6e6e"; // Black text
        context.font = "22px Arial";
        context.fillText(`${moment(val?.createdAt).format("DD/MM/YY")} | ${moment(val?.createdAt).format("LT")}`, width - 180, 250); // Date and time

        // Convert canvas to base64
        const dataUrl = canvas.toDataURL("image/png");
        base64Array.push(dataUrl);
      }
    });

    return base64Array;
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

        <div>ປຸ່ມພິມບິນອັດຕະໂນມັດ</div>
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
        {orderItems?.filter((e) => e?.isChecked).map((val, i) => {
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
