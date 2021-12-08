import React, { useEffect, useRef } from "react";
import useReactRouter from "use-react-router";
import Container from "react-bootstrap/Container";
import { Table, Button } from "react-bootstrap";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import moment from "moment";
import ReactToPrint from 'react-to-print';
/**
 * import components
 */
import OrderNavbar from "./component/OrderNavbar";
import { BillForChef } from "../bill/BillForChef";
/**
 * import function
 */
import { orderStatus } from "../../helpers";
import { CANCEL_STATUS, DOING_STATUS, SERVE_STATUS, WAITING_STATUS } from "../../constants";
import { useStore } from "../../store";

const Order = () => {
  const { match } = useReactRouter();
  const componentRef = useRef();

  const {
    orderItemForPrintBillSelect,
    orderItems,
    getOrderItemsStore,
    handleCheckbox,
    checkAllOrders,
    handleUpdateOrderStatus
  } = useStore();
  /**
   * Initial Component
   */
  useEffect(() => {
    getOrderItemsStore(WAITING_STATUS)
  }, [])
  console.log("orderItemForPrintBillSelect==>", orderItemForPrintBillSelect)
  return (
    <div style={{}}>
      <OrderNavbar />
      <div style={{ flexDirection: 'row', justifyContent: "space-between", display: "flex", paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}>
        <div style={{ alignItems: "end", flexDirection: 'column', display: "flex", justifyContent: "center" }}>
          <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => checkAllOrders(e)} />} label={<div style={{ fontFamily: "NotoSansLao", fontWeight: "bold" }}>ເລືອກທັງໝົດ</div>} />
        </div>
        <div>
          <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateOrderStatus(CANCEL_STATUS, match?.params?.id)}>ຍົກເລີກ</Button>
          <ReactToPrint
            trigger={() => <Button
              variant="light"
              style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }}
            >ພີມບີນສົ່ງໄປຄົວ</Button>}
            content={() => componentRef.current}
          />
          <div style={{ display: 'none' }}>
            <BillForChef ref={componentRef} newData={orderItemForPrintBillSelect?.length === 0 ? orderItems : orderItemForPrintBillSelect} />
          </div>
          <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => handleUpdateOrderStatus(DOING_STATUS, match?.params?.id)}>ສົ່ງໄປຄົວ</Button>
          <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => handleUpdateOrderStatus(SERVE_STATUS, match?.params?.id)}>ເສີບແລ້ວ</Button>
        </div>
      </div>
      <Container fluid className="mt-3">
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
              <th width="20px"></th>
              <th>ລ/ດ</th>
              <th>ຊື່ເມນູ</th>
              <th>ຈຳນວນ</th>
              <th>ເບີຕູບ</th>
              <th>ລະຫັດຕູບ</th>
              <th>ຄອມເມັ້ນ</th>
              <th>ສະຖານະ</th>
              <th>ເວລາ</th>
            </tr>
          </thead>
          <tbody>
            {orderItems &&
              orderItems?.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}>
                        <Checkbox
                          checked={order?.isChecked ? true : false}
                          onChange={(e) => handleCheckbox(order)}
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </div>
                    </td>
                    <td><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{index + 1}</p></div></td>
                    <td><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{order?.name ?? "-"}</p></div></td>
                    <td><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{order?.quantity ?? "-"}</p></div></td>
                    <td><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{order?.orderId?.table_id ?? "-"}</p></div></td>
                    <td><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{order?.orderId?.code ?? "-"}</p></div></td>
                    <td><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{order?.note ?? "-"}</p></div></td>
                    <td style={{ color: "red", fontWeight: "bold" }}><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{order?.status ? orderStatus(order?.status) : "-"}</p></div></td>
                    <td>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{order?.createdAt
                        ? moment(order?.createdAt).format("HH:mm ")
                        : "-"} ໂມງ</p></div>
                    </td>
                  </tr>
                )
              })

            }
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Order;
