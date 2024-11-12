import React, { useState, useRef, useMemo, useEffect } from "react";
import { Image } from "react-bootstrap";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import moment from "moment";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import Swal from "sweetalert2";
import axios from "axios";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

/**
 * import components
 */
// import OrderNavbar from "./component/OrderNavbar";
import BillForChef58 from "../../components/bill/BillForChef58";
import BillForChef80 from "../../components/bill/BillForChef80";

import { orderStatus } from "../../helpers";
import { WAITING_STATUS } from "../../constants";
import { useStore } from "../../store";
import empty from "../../image/empty.png";
import ReactAudioPlayer from "react-audio-player";
import Notification from "../../vioceNotification/ding.mp3";
// import { socket } from "../../services/socket";

export default function WaitingOrderTab() {
  const { t } = useTranslation();
  const {
    soundPlayer,
    orderItems,
    getOrderItemsStore,
    handleCheckbox,
    checkAllOrders,
    setNewOrderTransaction,
    setNewOrderUpdateStatusTransaction,
    newOrderTransaction,
    newOrderUpdateStatusTransaction,
    getOrderWaitingAndDoingByStore,
  } = useStore();
  /**
   * Initial Component
   */
  const { storeDetail, selectOrderStatus, setSelectOrderStatus } = useStore();
  const { printers, selectedTable } = useStore();
  const billForCher80 = useRef([]);
  const billForCher58 = useRef([]);

  return (
    <RootStyle>
      <div className="p-2.5">
        <div>
          <div>
            <ReactAudioPlayer src={Notification} ref={soundPlayer} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-lg">
              <thead className="  border-b-2 ">
                <tr>
                  <th className="w-10 max-w-[40px] p-0">
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="checkedC"
                          onChange={(e) => checkAllOrders(e)}
                        />
                      }
                      className="ml-0.5"
                    />
                  </th>
                  <th className="p-0 whitespace-nowrap">{t("no")}</th>
                  <th className="p-0 whitespace-nowrap">{t("menu_name")}</th>
                  <th className="p-0 whitespace-nowrap">{t("amount")}</th>
                  <th className="p-0 whitespace-nowrap">{t("from_table")}</th>
                  <th className="p-0 whitespace-nowrap">{t("table_code")}</th>
                  <th className="p-0 whitespace-nowrap">{t("status")}</th>
                  <th className="p-0 whitespace-nowrap">{t("status")}</th>
                  <th className="p-0 whitespace-nowrap">{t("commend")}</th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.map((order, index) => (
                  <tr key={index} className="border-b">
                    <td className="w-10 max-w-[40px] p-0">
                      <Checkbox
                        checked={order?.isChecked ? true : false}
                        onChange={(e) => handleCheckbox(order)}
                        color="primary"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    </td>
                    <td className="p-0">{index + 1}</td>
                    <td className="p-0 font-bold whitespace-nowrap">
                      {order?.name ?? "-"}
                    </td>
                    <td className="p-0 whitespace-nowrap">
                      {order?.quantity ?? "-"}
                    </td>
                    <td className="p-0 whitespace-nowrap">
                      {order?.tableId?.name ?? "-"}
                    </td>
                    <td className="p-0 whitespace-nowrap">
                      {order?.code ?? "-"}
                    </td>
                    <td className="p-0 whitespace-nowrap text-red-500 font-bold">
                      {order?.status ? orderStatus(order?.status) : "-"}
                    </td>
                    <td className="p-0 whitespace-nowrap">
                      {order?.createdAt
                        ? moment(order?.createdAt).format("HH:mm ")
                        : "-"}
                    </td>
                    <td className="p-0 whitespace-nowrap">
                      {order?.note ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RootStyle>
  );
}

const RootStyle = styled("div")({
  padding: 10,
});

const TableCustom = styled("table")({
  width: "100%",
  fontSize: 18,
  ["th,td"]: {
    padding: 0,
  },
  ["th:first-child"]: {
    maxWidth: 40,
    width: 40,
  },
  ["td:first-child"]: {
    maxWidth: 40,
    width: 40,
  },

});
