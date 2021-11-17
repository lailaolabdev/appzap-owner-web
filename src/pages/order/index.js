import React, { useState, useEffect, useContext } from "react";
import useReactRouter from "use-react-router";
import Container from "react-bootstrap/Container";
import { Table, Button, Nav, ButtonGroup, Form, Col } from "react-bootstrap";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import moment from "moment";
import Swal from 'sweetalert2'

/**
 * import components
 */
import UpdateModal from "./component/UpdateModal";
import OrderNavbar from "./component/OrderNavbar";
import CancelModal from "./component/CancelModal";

/**
 * import function
 */
import { updateOrderItem } from "../../services/order";
import { orderStatus } from "../../helpers";
import { CANCEL_STATUS, DOING_STATUS, SERVE_STATUS, END_POINT, USER_KEY, TITLE_HEADER, WAITING_STATUS } from "../../constants";
import { SocketContext } from '../../services/socket';
import { useStore } from "../../store";

const Order = () => {
  const { match } = useReactRouter();

  const { 
    userData, 
    orderItems,
    getOrderItemsStore, 
  } = useStore();

  const [checkedToUpdate, setCheckedToUpdate] = useState([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  // const [userData, setUserData] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  // const [orderItems, setOrderItems] = useState()

  /**
  * useContext
  */
  const socket = useContext(SocketContext);


  /**
   * Initial Component
   */
  useEffect(() => {
    getOrderItemsStore(WAITING_STATUS)
  }, [])



  /**
   * Subscribe Order Event
   */
  // useEffect(() => {
  //   socket.on(`ORDER:${userData?.data?.storeId}`, (data) => {
  //     setOrderItems(data)
  //   });
  //   return () => {
  //     socket.off(`ORDER:${userData?.data?.storeId}`, () => {
  //       console.log(`BYE BYE ORDER:${match?.params?.storeId}`)
  //     });
  //   };
  // }, [socket, userData])


  // const getData = async () => {
  //   await setIsLoading(true);
  //   await fetch(END_POINT + `/orderItems?status=WAITING&&storeId=${match?.params?.id}`, {
  //     method: "GET",
  //   }).then(response => response.json())
  //     .then(json => setOrderItems(json));
  //   await setIsLoading(false);
  // }


  const _handleUpdateOrderStatus = async (status) => {
    let _updateItems = orderItems.filter((item) => item.isChecked).map((i) => {
      return {
        ...i,
        status,
        id: i._id
      }
    })
    let _resOrderUpdate = await updateOrderItem(_updateItems,match?.params?.id);
    if(_resOrderUpdate?.data?.message=="UPADTE_ORDER_ITEM_SECCESS"){
      let _newOrderItem = orderItems.filter((item) => !item.isChecked);
      // setOrderItems(_newOrderItem)
      Swal.fire({
       icon: 'success',
       title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
       showConfirmButton: false,
       timer: 10000
     })
   }
  };


  const _handleCheckbox = async (order) => {
    let _orderItems = [...orderItems]
    let _newOrderItems = _orderItems.map((item) => {
      if (item._id == order._id) {
        return {
          ...item,
          isChecked: !item.isChecked
        }
      } else return item
    })

    // setOrderItems(_newOrderItems)
  };




  /**
   * ພິມບິນ
   */
  const _prinbill = async () => {
    let billId = []
    for (let i = 0; i < checkedToUpdate?.length; i++) {
      billId.push(checkedToUpdate[i]?.id)
    }
    await window.open(`/BillForChef/?id=${billId}`);
    // _handleUpdate()
  }

  /**
   * ເລືອກທຸກອັນ
   */
  const _checkAll = (item) => {
    let _orderItems = [...orderItems]
    let _newOrderItems;
    if (item?.target?.checked) {
      _newOrderItems = _orderItems.map((item) => {
        return {
          ...item,
          isChecked: true
        }
      })
    } else {
      _newOrderItems = _orderItems.map((item) => {
        return {
          ...item,
          isChecked: false
        }
      }) 
    }
    // setOrderItems(_newOrderItems)
  }



  return (
    <div style={{}}>
      <OrderNavbar />
      <div style={{ flexDirection: 'row', justifyContent: "space-between", display: "flex", paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}>
        <div style={{ alignItems: "end", flexDirection: 'column', display: "flex", justifyContent: "center" }}>
          <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => _checkAll(e)} />} label={<div style={{ fontFamily: "NotoSansLao", fontWeight: "bold" }}>ເລືອກທັງໝົດ</div>} />
        </div>
        <div>
          <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => _handleUpdateOrderStatus(CANCEL_STATUS)}>ຍົກເລີກ</Button>
          <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _handleUpdateOrderStatus(DOING_STATUS)}>ສົ່ງໄປຄົວ</Button>
          <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _handleUpdateOrderStatus(SERVE_STATUS)}>ເສີບແລ້ວ</Button>
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
                          onChange={(e) => _handleCheckbox(order)}
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
      {/* <CancelModal
        show={cancelModal}
        hide={() => setCancelModal(false)}
        handleCancel={_handleCancel}
      />
      <UpdateModal
        show={updateModal}
        hide={() => setUpdateModal(false)}
        handleUpdate={_handleUpdate}
      /> */}
    </div>
  );
};

export default Order;
