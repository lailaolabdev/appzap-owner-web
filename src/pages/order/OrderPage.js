import React, { useEffect, useRef } from "react";
import styled from "styled-components";
// import OrderNavbar from "./component/OrderNavbar";

import { useTranslation } from "react-i18next";
import { Button, Tabs, Tab } from "react-bootstrap";
import Swal from "sweetalert2";
import { useStore } from "../../store";
import { updateOrderItem } from "../../services/order";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import axios from "axios";
import BillForChef58 from "../../components/bill/BillForChef58";
import BillForChef80 from "../../components/bill/BillForChef80";
import {
  DOING_STATUS,
  WAITING_STATUS,
  SERVE_STATUS,
  CANCEL_STATUS,
} from "../../constants";

// Tab
import WaitingOrderTab from "./WaitingOrderTab";
import DoingOrderTab from "./DoingOrderTab";
import ServedOrderTab from "./ServedOrderTab";
import CanceledOrderTab from "./CanceledOrderTab";
import Loading from "../../components/Loading";

export default function OrderPage() {
  const { t } = useTranslation(); // translate
  const { storeDetail } = useStore();
  const { printers, selectedTable } = useStore();
  const billForCher80 = useRef([]);
  const billForCher58 = useRef([]);
  const {
    orderItems,
    setOrderItems,
    orderLoading,
    getOrderItemsStore,
    selectOrderStatus,
    setSelectOrderStatus,
  } = useStore();

  const handleUpdateOrderStatus = async (status) => {
    let previousStatus = orderItems[0].status;
    let menuId;
    let _updateItems = orderItems
      .filter((item) => item.isChecked)
      .map((i) => {
        return {
          status: status,
          _id: i?._id,
          menuId: i?.menuId,
        };
      });
    let _resOrderUpdate = await updateOrderItem(
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
    // fetchData();
    return;
  };

  const onPrintForCher = async () => {
    const orderSelect = orderItems?.filter((e) => e?.isChecked);
    let _index = 0;
    for (const _ref of billForCher80.current) {
      const _printer = printers.find((e) => {
        return e?._id === orderSelect?.[_index]?.printer;
      });

      try {
        let urlForPrinter = "";
        let dataUrl;
        if (_printer?.width === "80mm") {
          dataUrl = await html2canvas(billForCher80?.current[_index], {
            useCORS: true,
            scrollX: 10,
            scrollY: 0,
          });
        }
        if (_printer?.width === "58mm") {
          dataUrl = await html2canvas(billForCher58?.current[_index], {
            useCORS: true,
            scrollX: 10,
            scrollY: 0,
          });
        }

        if (_printer?.type === "ETHERNET") {
          urlForPrinter = "http://localhost:9150/ethernet/image";
        }
        if (_printer?.type === "BLUETOOTH") {
          urlForPrinter = "http://localhost:9150/bluetooth/image";
        }
        if (_printer?.type === "USB") {
          urlForPrinter = "http://localhost:9150/usb/image";
        }

        const _file = await base64ToBlob(dataUrl.toDataURL());
        var bodyFormData = new FormData();
        bodyFormData.append("ip", _printer?.ip);
        if (_index === 0) {
          bodyFormData.append("beep1", 1);
          bodyFormData.append("beep2", 9);
        }
        bodyFormData.append("port", "9100");
        bodyFormData.append("image", _file);
        await axios({
          method: "post",
          url: urlForPrinter,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        await Swal.fire({
          icon: "success",
          title: "ປິ້ນສຳເລັດ",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (err) {
        console.log(err);
        await Swal.fire({
          icon: "error",
          title: "ປິ້ນບໍ່ສຳເລັດ",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      _index++;
    }
  };
  // useEffect
  useEffect(() => {
    // console.log("domain", domain);
  }, []);

  const Tool = () => {
    return (
      <div
        style={{
          display: "flex",
          padding: "10px",
        }}
      >
        <div>
          <Button style={{color:"white", backgroundColor:"#FB6E3B"}} onClick={() => onPrintForCher()}>ພິມບິນໄປຄົວ</Button>
        </div>
        <div style={{ width: "50px" }}></div>
        <div>
          <Button 
          style={{color:"white", backgroundColor:"#FB6E3B"}}
            onClick={() => {
              handleUpdateOrderStatus("CANCEL");
            }}
          >
            {/* ຍົກເລີກ */}
            {t("cancel")}
          </Button>
        </div>
        <div style={{ width: "10px" }}></div>

        <div>
          <Button style={{color:"white", backgroundColor:"#FB6E3B"}} onClick={() => handleUpdateOrderStatus("DOING")}>
            {/* ສົ່ງໄປຄົວ */}
            {t("sendToKitchen")}
          </Button>
        </div>
        <div style={{ width: "10px" }}></div>
        <div>
          <Button style={{color:"white", backgroundColor:"#FB6E3B"}} onClick={() => handleUpdateOrderStatus("SERVED")}>
            {/* ເສີບແລ້ວ */}
            {t("served")}
          </Button>
        </div>
      </div>
    );
  };
  return (
    <RootStyle>
      {orderLoading && <Loading />}
      <div style={{ backgroundColor: "white" }}>
        <Tabs
          defaultActiveKey={WAITING_STATUS}
          id="OrderTabs"
          onSelect={(select) => {
            getOrderItemsStore(select);
            setSelectOrderStatus(select);
          }}
          className="myClass"
        >
          <Tab eventKey={WAITING_STATUS} title={`${t("hasOrder")}`}>
            <Tool />
            <WaitingOrderTab />
          </Tab>
          <Tab eventKey={DOING_STATUS} title={`${t("cooking")}`}>
            <Tool />
            <DoingOrderTab />
          </Tab>
          <Tab eventKey={SERVE_STATUS} title={`${t("served")}`}>
            {/* <Tool /> */}
            <ServedOrderTab />
          </Tab>
          <Tab eventKey={CANCEL_STATUS} title={`${t("cancel")}`}>
            {/* <Tool /> */}
            <CanceledOrderTab />
          </Tab>
          {/* <Tab eventKey="contact" title="Contact" disabled>
            <Tool />

            <span>test</span>
          </Tab> */}
        </Tabs>
      </div>
      <div>
        {orderItems
          ?.filter((e) => e?.isChecked)
          .map((val, i) => {
            return (
              <div
                style={{ width: "80mm", padding: 10 }}
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
      <div>
        {orderItems
          ?.filter((e) => e?.isChecked)
          .map((val, i) => {
            return (
              <div
                style={{ width: "80mm", padding: 10 }}
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
      </div>
    </RootStyle>
  );
}

const RootStyle = styled("div")({
  backgroundColor: "#f9f9f9",
  minHeight: "calc(100vh - 64px)",
  padding: 10,
});
