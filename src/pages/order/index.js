import React, { useState, useEffect } from "react";
import useReactRouter from "use-react-router";
import CustomNav from "./component/CustomNav";
import Container from "react-bootstrap/Container";
import { Table, Button } from "react-bootstrap";
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";
import socketIOClient from "socket.io-client";
import useSound from 'use-sound';
import soundA from '../../sound/message.mp3'

/**
 * import components
 */
import Loading from "../../components/Loading";
import UpdateModal from "./component/UpdateModal";
import CancelModal from "./component/CancelModal";
/**
 * import function
 */
import { getOrders, updateOrderItem } from "../../services/order";
import { orderStatus } from "../../helpers";
import { CANCEL_STATUS, DOING_STATUS, END_POINT, USER_KEY } from "../../constants";

const Order = () => {
  const { match } = useReactRouter();
  const { number } = match?.params;
  const [checkedToUpdate, setCheckedToUpdate] = useState([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [userData, setUserData] = useState({})
  useEffect(() => {
    const ADMIN = localStorage.getItem(USER_KEY)
    const _localJson = JSON.parse(ADMIN)
    setUserData(_localJson)
  }, [])
  const _handleUpdate = async () => {
    await updateOrderItem(checkedToUpdate, DOING_STATUS, userData?.data?.storeId);
    window.location.reload();
  };
  const _handleCancel = async () => {
    await updateOrderItem(checkedToUpdate, CANCEL_STATUS);
    window.location.reload();
  };
  const _handleCheckbox = async (event, id) => {
    if (event.target.checked == true) {
      let _addData = [];
      _addData.push({ id: id, checked: event.target.checked });
      setCheckedToUpdate((checkedToUpdate) => [
        ...checkedToUpdate,
        ..._addData,
      ]);
    } else {
      let _checkValue = checkedToUpdate;
      const _removeId = await _checkValue?.filter((check) => check.id !== id);
      setCheckedToUpdate(_removeId);
    }
  };
  const [DataForPrint, setDataForPrint] = useState()
  useEffect(() => {
    let data = []
    for (let i = 0; i < checkedToUpdate.length; i++) {
      data.push(checkedToUpdate[i]?.id)
    }
    setDataForPrint(data)
  }, [checkedToUpdate])
  const [isLoading, setIsLoading] = useState(false);
  const [orderItems, setorderItems] = useState()
  const [reLoadData, setreLoadData] = useState()
  const socket = socketIOClient(END_POINT);
  socket.on(`createorder${userData?.data?.storeId}`, data => {
    setreLoadData(data)
  });
  useEffect(() => {
    getData()
  }, [])
  useEffect(() => {
    getData()
  }, [reLoadData])
  const getData = async (tokken) => {
    await setIsLoading(true);
    await fetch(END_POINT + `/orderItems?status=WAITING&&storeId=${match?.params?.id}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setorderItems(json));
    await setIsLoading(false);
  }
  return (
    <div>
      <CustomNav
        default={`/orders/pagenumber/${number}`}
        data={DataForPrint}
        handleCancel={() => {
          if (checkedToUpdate.length !== 0) {
            setCancelModal(true);
          }
        }}
        handleUpdate={() => {
          if (checkedToUpdate.length !== 0) {
            setUpdateModal(true);
          }
        }}
        status
      />
      <Container fluid className="mt-3">
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
              <th width="20px"></th>
              <th>ລ/ດ</th>
              <th>ຊື່ເມນູ</th>
              <th>ຈຳນວນ</th>
              <th>ເບີໂຕະ</th>
              <th>ລະຫັດໂຕະ</th>
              <th>ສະຖານະ</th>
              <th>ເວລາ</th>
            </tr>
          </thead>
          <tbody>
            {orderItems &&
              orderItems?.map((order, index) => (
                <tr key={index}>
                  <td>
                    <Checkbox
                      checked={
                        checkedToUpdate && checkedToUpdate[index]?.checked
                      }
                      onChange={(e) => _handleCheckbox(e, order?._id)}
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{order?.menu?.name ?? "-"}</td>
                  <td>{order?.quantity ?? "-"}</td>
                  <td>{order?.orderId?.table_id ?? "-"}</td>
                  <td>{order?.orderId?.code ?? "-"}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>{order?.status ? orderStatus(order?.status) : "-"}</td>
                  <td>
                    {order?.createdAt
                      ? moment(order?.createdAt).format("HH:mm a")
                      : "-"}
                  </td>
                </tr>
              ))}
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
