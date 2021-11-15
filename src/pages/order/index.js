import React, { useState, useEffect,useContext } from "react";
import useReactRouter from "use-react-router";
import OrderNavbar from "./component/OrderNavbar";
import Container from "react-bootstrap/Container";
import { Table, Button, Nav, ButtonGroup, Form, Col } from "react-bootstrap";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import moment from "moment";
// import socketIOClient from "socket.io-client";

/**
 * import components
 */
import UpdateModal from "./component/UpdateModal";
import CancelModal from "./component/CancelModal";
/**
 * import function
 */
import { updateOrderItem } from "../../services/order";
import { orderStatus } from "../../helpers";
import { CANCEL_STATUS, DOING_STATUS, SERVE_STATUS, END_POINT, USER_KEY } from "../../constants";
import { SocketContext } from '../../services/socket';

const Order = () => {
  const { match } = useReactRouter();
  const { number } = match?.params;
  const [checkedToUpdate, setCheckedToUpdate] = useState([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [checkBoxAll, setcheckBoxAll] = useState(false);
  const [userData, setUserData] = useState({})

  /**
  * useContext
  */
  const socket = useContext(SocketContext);


  useEffect(() => {
    const ADMIN = localStorage.getItem(USER_KEY)
    const _localJson = JSON.parse(ADMIN)
    setUserData(_localJson)
  }, [])
  const _handleCancel = async () => {
    await updateOrderItem(checkedToUpdate, CANCEL_STATUS);
    window.location.reload();
  };
  const _handleUpdate = async () => {
    await updateOrderItem(checkedToUpdate, DOING_STATUS, userData?.data?.storeId);
    window.location.reload();
  };
  const _handleUpdateServe = async () => {
    await updateOrderItem(checkedToUpdate, SERVE_STATUS);
    window.location.reload();
  };
  const _handleCheckbox = async (event, id, index) => {
    if (event?.target?.checked === true) {
      let _addData = [];
      _addData.push({ id: id, checked: event.target.checked, number: index });
      setCheckedToUpdate([
        ...checkedToUpdate,
        ..._addData,
      ]);
    } else {
      const _removeId = await checkedToUpdate?.filter((item) => item.id !== id);
      setCheckedToUpdate(_removeId);
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [orderItems, setorderItems] = useState()
  const [reLoadData, setreLoadData] = useState()
  // const socket = socketIOClient(END_POINT_SEVER);
  // socket.on(`createorder${userData?.data?.storeId}`, data => {
  //   setreLoadData(data)
  // });
  useEffect(() => {
    getData()
  }, [])
  useEffect(() => {
    getData()
  }, [reLoadData])


  /**
   * Subscribe Order Event
   */
   useEffect(() => {
    // as soon as the component is mounted, do the following tasks:
    // emit USER_ONLINE event
    console.log("ORDER WELCOME")

    // // subscribe to socket events
    socket.on(`ORDER:${userData?.data?.storeId}`, (data)=>{
      console.log({data})
    }); 
  })



  const getData = async (tokken) => {
    await setIsLoading(true);
    await fetch(END_POINT + `/orderItems?status=WAITING&&storeId=${match?.params?.id}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setorderItems(json));
    await setIsLoading(false);
  }
  const _prinbill = async () => {
    let billId = []
    for (let i = 0; i < checkedToUpdate?.length; i++) {
      billId.push(checkedToUpdate[i]?.id)
    }
    await window.open(`/BillForChef/?id=${billId}`);
    _handleUpdate()
  }
  const _checkAll = (item) => {
    if (item?.target?.checked === true) {
      setcheckBoxAll(true)
      let allData = []
      for (let e = 0; e < orderItems?.length; e++) {
        allData.push({ id: orderItems[e]?._id })
      }
      setCheckedToUpdate(allData)
    } else {
      setcheckBoxAll(false)
      setCheckedToUpdate()
      setCheckedToUpdate([])
    }
  }
  const _onSelectBox = (index) => {
    for (let i = 0; i < checkedToUpdate?.length; i++) {
      if (checkedToUpdate[i]?.number === index) {
        return "true"
      }
    }
  }
  return (
    <div>
      <OrderNavbar />
      <div style={{ flexDirection: 'row', justifyContent: "space-between", display: "flex", paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}>
        <div style={{ alignItems: "end", flexDirection: 'column', display: "flex", justifyContent: "center" }}>
          <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => _checkAll(e)} />} label={<div style={{ fontFamily: "NotoSansLao", fontWeight: "bold" }}>ເລືອກທັງໝົດ</div>} />
        </div>
        <div>
          <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => _handleCancel()}>ຍົກເລີກ</Button>
          <Button variant="light" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _prinbill()}>ສົ່ງໄປຄົວ</Button>
          <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={() => _handleUpdateServe()}>ເສີບແລ້ວ</Button>
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
                      <Checkbox
                        checked={_onSelectBox(index) ? _onSelectBox(index) : checkBoxAll}
                        onChange={(e) => _handleCheckbox(e, order?._id, index)}
                        color="primary"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{order?.name ?? "-"}</td>
                    <td>{order?.quantity ?? "-"}</td>
                    <td>{order?.orderId?.table_id ?? "-"}</td>
                    <td>{order?.orderId?.code ?? "-"}</td>
                    <td>{order?.note ?? "-"}</td>
                    <td style={{ color: "red", fontWeight: "bold" }}>{order?.status ? orderStatus(order?.status) : "-"}</td>
                    <td>
                      {order?.createdAt
                        ? moment(order?.createdAt).format("HH:mm ")
                        : "-"} ໂມງ
                    </td>
                  </tr>
                )
              })

            }
          </tbody>
        </Table>
      </Container>
      <CancelModal
        show={cancelModal}
        hide={() => setCancelModal(false)}
        handleCancel={_handleCancel}
      />
      <UpdateModal
        show={updateModal}
        hide={() => setUpdateModal(false)}
        handleUpdate={_handleUpdate}
      />
    </div>
  );
};

export default Order;
