import React, { useEffect } from "react";
import styled from "styled-components";
// import OrderNavbar from "./component/OrderNavbar";

import { useTranslation } from "react-i18next";
import { Button, Tabs, Tab } from "react-bootstrap";
import Swal from "sweetalert2";
import { useStore } from "../../store";
import { updateOrderItem } from "../../services/order";
import { getLocalData } from "../../constants/api";
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
    // fetchData();
    return;
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
          <Button
          // onClick={() => onPrintForCher()}
          >
            ພິມບິນໄປຄົວ
          </Button>
        </div>
        <div style={{ width: "50px" }}></div>
        <div>
          <Button
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
          <Button onClick={() => handleUpdateOrderStatus("DOING")}>
            {/* ສົ່ງໄປຄົວ */}
            {t("sendToKitchen")}
          </Button>
        </div>
        <div style={{ width: "10px" }}></div>
        <div>
          <Button onClick={() => handleUpdateOrderStatus("SERVED")}>
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
        >
          <Tab eventKey={WAITING_STATUS} title={`${t("hasOrder")} (6)`}>
            <Tool />
            <WaitingOrderTab />
          </Tab>
          <Tab eventKey={DOING_STATUS} title={`${t("cooking")} (9)`}>
            <Tool />
            <DoingOrderTab />
          </Tab>
          <Tab eventKey={SERVE_STATUS} title={`${t("served")} (9)`}>
            <Tool />
            <ServedOrderTab />
          </Tab>
          <Tab eventKey={CANCEL_STATUS} title={`${t("cancel")} (9)`}>
            <Tool />
            <CanceledOrderTab />
          </Tab>
          {/* <Tab eventKey="contact" title="Contact" disabled>
            <Tool />

            <span>test</span>
          </Tab> */}
        </Tabs>
      </div>
    </RootStyle>
  );
}

const RootStyle = styled("div")({
  backgroundColor: "#f9f9f9",
  minHeight: "calc(100vh - 64px)",
  padding: 10,
});
