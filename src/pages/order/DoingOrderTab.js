import React, { useState, useMemo, useRef, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Table, Button, Image } from "react-bootstrap";
import moment from "moment";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import * as _ from "lodash";
import empty from "../../image/empty.png";
import axios from "axios";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

/**
 * import components
 */

import BillForChef58 from "../../components/bill/BillForChef58";
import BillForChef80 from "../../components/bill/BillForChef80";
// import BillForCheckOut58 from "../../components/bill/BillForCheckOut58";
// import BillForCheckOut80 from "../../components/bill/BillForCheckOut80";
/**
 * import function
 */
// import { getOrders, updateOrderItem } from "../../services/order";
import { orderStatus } from "../../helpers";
import { SERVE_STATUS, END_POINT, DOING_STATUS } from "../../constants";
import { useStore } from "../../store";
import { socket } from "../../services/socket";

const DoingOrderTab = () => {
  const { t } = useTranslation();
  // if (billForCher80.current.length !== arrLength) {
  //   // add or remove refs
  //   billForCher80.current = Array(arrLength)
  //     .fill()
  //     .map((_, i) => billForCher80.current[i]);
  // }
  // if (billForCher58.current.length !== arrLength) {
  //   // add or remove refs
  //   billForCher58.current = Array(arrLength)
  //     .fill()
  //     .map((_, i) => billForCher58?.current[i]);
  // }
  const { storeDetail } = useStore();
  const storeId = storeDetail._id;
  /**
   * routes
   */

  const {
    orderItems,
    getOrderItemsStore,
    handleCheckbox,
    checkAllOrders,
    handleUpdateOrderStatus,
    newOrderTransaction,
    getOrderWaitingAndDoingByStore,
  } = useStore();

  return (
    <div className="p-2.5">
      {orderItems?.length > 0 ? (
        <div>
          <div className="flex flex-row justify-between px-4 ">
            <div className="flex flex-col items-end justify-center"></div>
          </div>

          <Container fluid className="p-0">
            <Table
              responsive
              className="staff-table-list borderless table-hover"
            >
              <thead style={{ backgroundColor: "#F1F1F1" }}>
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
                  <th className="p-0 whitespace-nowrap py-3">{t("no")}</th>
                  <th className="p-0 whitespace-nowrap py-3">
                    {t("menu_name")}
                  </th>
                  <th className="p-0 whitespace-nowrap py-3">{t("amount")}</th>
                  <th className="p-0 whitespace-nowrap py-3">
                    {t("from_table")}
                  </th>
                  <th className="p-0 whitespace-nowrap py-3">
                    {t("table_code")}
                  </th>
                  <th className="p-0 whitespace-nowrap py-3">{t("status")}</th>
                  <th className="p-0 whitespace-nowrap py-3">{t("status")}</th>
                  <th className="p-0 whitespace-nowrap py-3">{t("commend")}</th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.map((order, index) => (
                  <tr key={index} className=" border-b">
                    <td className="w-10 max-w-[40px] p-0">
                      <Checkbox
                        checked={order?.isChecked ? true : false}
                        onChange={(e) => handleCheckbox(order)}
                        color="primary"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    </td>
                    <td className="p-0 ">{index + 1}</td>
                    <td className="p-0 whitespace-nowrap">
                      <p>{order?.name ?? "-"}</p>
                    </td>
                    <td className="whitespace-nowrap p-0">
                      <p>{order?.quantity ?? "-"}</p>
                    </td>
                    <td className="whitespace-nowrap p-0">
                      <p>{order?.tableId?.name ?? "-"}</p>
                    </td>
                    <td className="whitespace-nowrap p-0">
                      <p>{order?.status ? orderStatus(order?.status) : "-"}</p>
                    </td>
                    <td className="whitespace-nowrap p-0">
                      <p>
                        {order?.createdAt
                          ? moment(order?.createdAt).format("HH:mm a")
                          : "-"}
                      </p>
                    </td>
                    <td className="whitespace-nowrap p-0">
                      <p>{order?.note ?? "-"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </div>
      ) : (
        <img src={empty} alt="" className="w-full" />
      )}
    </div>
  );
};

export default DoingOrderTab;
