import React, { useState, useEffect } from "react";
import useReactRouter from "use-react-router";
import Container from "react-bootstrap/Container";
import { Table, Button, Image } from "react-bootstrap";
import moment from "moment";
import OrderNavbar from "./component/OrderNavbar";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import * as _ from "lodash"
import empty from '../../image/empty.png'

/**
 * import components
 */
import UpdateModal from "./component/UpdateModal";
/**
 * import function
 */
// import { getOrders, updateOrderItem } from "../../services/order";
import { orderStatus } from "../../helpers";
import { SERVE_STATUS, END_POINT, DOING_STATUS } from "../../constants";
import { useStore } from "../../store";
const Order = () => {
/**
   * routes
   */
 const { match } = useReactRouter();

  const { 
    orderItems,
    getOrderItemsStore, 
    handleCheckbox,
    checkAllOrders,
    handleUpdateOrderStatus
  } = useStore();

  
  const [updateModal, setUpdateModal] = useState(false);
  useEffect(() => {
    getOrderItemsStore(DOING_STATUS)
  }, [])
  return (
    <div>
      {orderItems?.length > 0 ? <div>
      <OrderNavbar />
      <div style={{ flexDirection: 'row', justifyContent: "space-between", display: "flex", paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}>
        <div style={{ alignItems: "end", flexDirection: 'column', display: "flex", justifyContent: "center" }}>
          {/* <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => checkAllOrders(e)} />} label={<div style={{ fontFamily: "NotoSansLao", fontWeight: "bold" }} >ເລືອກທັງໝົດ</div>} /> */}
        </div>
        <div>
          <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => handleUpdateOrderStatus(SERVE_STATUS, match?.params?.id)}>ເສີບແລ້ວ</Button>
        </div>
      </div>
      <Container fluid className="mt-3">
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
              <th>
                <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => checkAllOrders(e)} style={{marginLeft:10}}/>} />
              </th>
              <th>ລ/ດ</th>
              <th>ຊື່ເມນູ</th>
              <th>ຈຳນວນ</th>
              <th>ເບີໂຕະ</th>
              <th>ລະຫັດໂຕະ</th>
              <th>ສະຖານະ</th>
              <th>ເວລາ</th>
              <th>ຄອມເມັ້ນ</th>
            </tr>
          </thead>
          <tbody>
            {orderItems &&
              orderItems?.map((order, index) => (
                <tr key={index}>
                  <td  >
                    
                      <Checkbox
                        checked={order?.isChecked ? true : false}
                        onChange={(e) => handleCheckbox(order)}
                        color="primary"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    
                  </td>
                  <td><p style={{ margin: 0 }}>{index + 1}</p></td>
                  <td><p style={{ margin: 0 }}>{order?.name ?? "-"}</p></td>
                  <td><p style={{ margin: 0 }}>{order?.quantity ?? "-"}</p></td>
                  <td><p style={{ margin: 0 }}>{order?.orderId?.table_id ?? "-"}</p></td>
                  <td><p style={{ margin: 0 }}>{order?.orderId?.code ?? "-"}</p></td>
                  <td><p style={{ margin: 0 }}>{order?.status ? orderStatus(order?.status) : "-"}</p></td>

                  <td><p style={{ margin: 0 }}>
                    {order?.createdAt
                      ? moment(order?.createdAt).format("HH:mm a")
                      : "-"}</p>
                  </td>
                  <td><p style={{ margin: 0 }}>{order?.note ?? "-"}</p></td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
      <UpdateModal
        show={updateModal}
        hide={() => setUpdateModal(false)}
        // handleUpdate={_handleUpdate}
      />
    </div>
       : <Image src={empty} alt="" width="100%" />}
    </div>
  );
};

export default Order;
