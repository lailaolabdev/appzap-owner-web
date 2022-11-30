import React, { useEffect, useRef, useMemo } from "react";
import Container from "react-bootstrap/Container";
import { Table, Button, Image } from "react-bootstrap";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import moment from "moment";
/**
 * import components
 */
import OrderNavbar from "./component/OrderNavbar";
import { BillForChef } from "../../components/bill/BillForChef80";
/**
 * import function
 */
import ReactToPrint from "react-to-print";
import { orderStatus } from "../../helpers";
import {
  CANCEL_STATUS,
  DOING_STATUS,
  SERVE_STATUS,
  WAITING_STATUS,
} from "../../constants";
import { useStore } from "../../store";
import empty from "../../image/empty.png";
import ReactAudioPlayer from "react-audio-player";
import Notification from "../../vioceNotification/ding.mp3";
import { socket } from "../../services/socket";


const Order = () => {
  const componentRef = useRef();

  const {
    soundPlayer,
    orderItemForPrintBillSelect,
    orderItems,
    getOrderItemsStore,
    handleCheckbox,
    checkAllOrders,
    handleUpdateOrderStatus,
  } = useStore();
  /**
   * Initial Component
   */
   const { storeDetail } = useStore();
   const storeId = storeDetail._id; 
  useEffect(() => {
    getOrderItemsStore(WAITING_STATUS);
  }, []);
  useMemo(
    () =>
      socket.on(`ORDER:${storeDetail._id}`, (data) => {
        getOrderItemsStore(WAITING_STATUS);
      }),
    []
  );
  useMemo(
    () =>
      socket.on(`ORDER_UPDATE_STATUS:${storeDetail._id}`, (data) => {
        getOrderItemsStore(WAITING_STATUS);
      }),
    []
  );
  
  return (
    <div>
      <OrderNavbar />
      {orderItems?.length > 0 ? (
        <div>
          {/* <div style={{ flexDirection: 'row', justifyContent: "space-between", display: "flex", paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}>
          <div style={{ alignItems: "end", flexDirection: 'column', display: "flex", justifyContent: "center" }}>
            <ReactToPrint
              trigger={() => <Button
                variant="light"
                style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }}
              >ພີມບີນສົ່ງໄປຄົວ</Button>}
              content={() => componentRef.current}
            />
          </div>
          <div>
            <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateOrderStatus(CANCEL_STATUS, match?.params?.id)}>ຍົກເລີກ</Button>
            <div style={{ display: 'none' }}>
              <BillForChef ref={componentRef} newData={orderItemForPrintBillSelect?.length === 0 ? orderItems : orderItemForPrintBillSelect} />
            </div>
            <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => handleUpdateOrderStatus(DOING_STATUS, match?.params?.id)}>ສົ່ງໄປຄົວ</Button>
            <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => handleUpdateOrderStatus(SERVE_STATUS, match?.params?.id)}>ເສີບແລ້ວ</Button>
          </div>
        </div> */}
          <div>
            <ReactAudioPlayer src={Notification} ref={soundPlayer} />
          </div>
          <Container fluid className="mt-3">
            <Table
              responsive
              className="staff-table-list borderless table-hover"
            >
              <thead style={{ backgroundColor: "#F1F1F1" }}>
                <tr>
                  <th><FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => checkAllOrders(e)} />} style={{ marginLeft: 2 }} /></th>
                  <th>ລ/ດ</th>
                  <th>ຊື່ເມນູ</th>
                  <th>ຈຳນວນ</th>
                  <th>ຈາກໂຕະ</th>
                  <th>ລະຫັດໂຕະ</th>
                  <th>ສະຖານະ</th>
                  <th>ເວລາ</th>
                  <th>ຄອມເມັ້ນ</th>
                </tr>
              </thead>
              <tbody>
                {orderItems &&
                  orderItems?.map((order, index) => {
                    return (
                      <tr key={index}>
                        <td>
                      <Checkbox
                        checked={order?.isChecked ? true : false}
                        onChange={(e) => handleCheckbox(order)}
                        color="primary"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    </td>
                        <td>
                          <p style={{ margin: 0 }}>{index + 1}</p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>{order?.name ?? "-"}</p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>{order?.quantity ?? "-"}</p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>
                            {order?.tableId?.name ?? "-"}
                          </p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>{order?.code ?? "-"}</p>
                        </td>
                        <td style={{ color: "red", fontWeight: "bold" }}>
                          <p style={{ margin: 0 }}>
                            {order?.status ? orderStatus(order?.status) : "-"}
                          </p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>
                            {order?.createdAt
                              ? moment(order?.createdAt).format("HH:mm ")
                              : "-"}{" "}
                            ໂມງ
                          </p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>{order?.note ?? "-"}</p>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Container>
        </div>
      ) : (
        <Image src={empty} alt="" width="100%" />
      )}
    </div>
  );
};

export default Order;
