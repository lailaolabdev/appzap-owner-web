import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Button, Tabs, Tab, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { useStore } from "../../store";
import { getCountOrderWaiting, updateOrderItem } from "../../services/order";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
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
      // fetchData();
      return;
    } catch (err) { }
  };
  const [onPrinting, setOnPrinting] = useState(false);
  const onPrintForCher = async () => {
    setOnPrinting(true);
    try {
      setCountError("");
      const orderSelect = orderItems?.filter((e) => e?.isChecked);
      let _index = 0;
      const printDate = [...billForCher80.current].filter((e) => e != null);
      console.log(billForCher80.current);
      console.log(printDate.length);
      let array2canvas = [];
      let array2blob = [];
      for (const _ref of printDate) {
        // array2canvas.push(
        //   html2canvas(_ref, {
        //     useCORS: true,
        //     scrollX: 10,
        //     scrollY: 0,
        //   })
        // );
        array2blob.push(_ref);
      }

      // const dataUrls = await Promise.all(array2canvas);
      console.log("array2blob", array2blob);
      const dataUrls = array2blob;
      console.log("dataUrls", dataUrls);

      let arrayPrint = [];
      for (const _ref of printDate) {
        const _printer = printers.find((e) => {
          return e?._id === orderSelect?.[_index]?.printer;
        });

        try {
          let urlForPrinter = "";
          const dataUrl = dataUrls[_index];
          // if (_printer?.width === "80mm") {
          //   dataUrl = await html2canvas(printDate[_index], {
          //     useCORS: true,
          //     scrollX: 10,
          //     scrollY: 0,
          //   });
          // }
          // if (_printer?.width === "58mm") {
          //   dataUrl = await html2canvas(printDate[_index], {
          //     useCORS: true,
          //     scrollX: 10,
          //     scrollY: 0,
          //   });
          // }

          if (_printer?.type === "ETHERNET") {
            urlForPrinter = ETHERNET_PRINTER_PORT;
          }
          if (_printer?.type === "BLUETOOTH") {
            urlForPrinter = BLUETOOTH_PRINTER_PORT;
          }
          if (_printer?.type === "USB") {
            urlForPrinter = USB_PRINTER_PORT;
          }
          const runPrint = async () => {
            try {
              // const _file = await base64ToBlob(await dataUrl.toDataURL());
              const _file = await toBlob(dataUrl, { cacheBust: true });
              // const _file = dataUrl;
              console.log("_file", _file);
              var bodyFormData = new FormData();

              bodyFormData.append("ip", _printer?.ip);
              if (_index === 0) {
                bodyFormData.append("beep1", 1);
                bodyFormData.append("beep2", 9);
              }
              bodyFormData.append("isdrawer", false);
              bodyFormData.append("port", "9100");
              bodyFormData.append("image", _file);
              bodyFormData.append("paper", _printer?.width === "58mm" ? 58 : 80);

              // await printFlutter(
              //   {
              //     imageBuffer: dataUrl.toDataURL(),
              //     ip: _printer?.ip,
              //     type: _printer?.type,
              //     port: "9100",
              //     beep: 1,
              //     width: _printer?.width === "58mm" ? 400 : 580,
              //   },
              //   async () => {
              await axios({
                method: "post",
                url: urlForPrinter,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
              });
              //   }
              // );
              return true;
            } catch {
              return false;
            }
          };
          arrayPrint.push(runPrint());
          // await axios({
          //   method: "post",
          //   url: urlForPrinter,
          //   data: bodyFormData,
          //   headers: { "Content-Type": "multipart/form-data" },
          // });

          // if (_index === 0) {
          //   await Swal.fire({
          //     icon: "success",
          //     title: "ປິ້ນສຳເລັດ",
          //     showConfirmButton: false,
          //     timer: 1500,
          //   });
          // }
        } catch (err) {
          if (err) {
            setCountError("ERR");
            setIsLoading(false);
            console.log("err::::", err);
          }
        }
        _index++;
      }
      setPrintBackground((prev) => [...prev, ...arrayPrint]);
      setOnPrinting(false);
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
    } catch (err) {
      setIsLoading(false);
      setOnPrinting(false);
    }
  };
  // useEffect

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
            {orderLoading && <div><Spinner animation="border" style={{ marginLeft: 20 }} size="sm" /> <span>Loading new data...</span></div>}
            <WaitingOrderTab />
          </Tab>
          <Tab
            eventKey={DOING_STATUS}
            title={`${t("cooking")}(${orderDoing?.length})`}
          >
            <Tool />
            {orderLoading && <div><Spinner animation="border" style={{ marginLeft: 20 }} size="sm" /> <span>Loading new data...</span></div>}
            <DoingOrderTab />
          </Tab>
          <Tab eventKey={SERVE_STATUS} title={`${t("served")}`}>
            {/* <Tool /> */}
            {orderLoading && <div><Spinner animation="border" style={{ marginLeft: 20 }} size="sm" /> <span>Loading new data...</span></div>}
            <ServedOrderTab />
          </Tab>
          <Tab eventKey={CANCEL_STATUS} title={`${t("cancel")}`}>
            {/* <Tool /> */}
            {orderLoading && <div><Spinner animation="border" style={{ marginLeft: 20 }} size="sm" /> <span>Loading new data...</span></div>}
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
                  // dataBill={dataBill}
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
