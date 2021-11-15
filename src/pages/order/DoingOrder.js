import React, { useState, useEffect } from "react";
import useReactRouter from "use-react-router";
import CustomNav from "./component/CustomNav";
import Container from "react-bootstrap/Container";
import { Table, Button} from "react-bootstrap";
import moment from "moment";
import OrderNavbar from "./component/OrderNavbar";
import { Checkbox, FormControlLabel } from "@material-ui/core";

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
import { SERVE_STATUS, END_POINT } from "../../constants";
const Order = () => {
  /**
   * routes
   */
  const { match } = useReactRouter();
  const { number } = match?.params;
  const [cancelModal, setCancelModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [checkedToUpdate, setCheckedToUpdate] = useState([]);
  const [ordersDoing, setOrdersDoing] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [checkBoxAll, setcheckBoxAll] = useState(false);

  useEffect(() => {
    getData()
  }, [])
  const getData = async (tokken) => {
    await setIsLoading(true);
    await fetch(END_POINT + `/orderItems?status=DOING&&storeId=${match?.params?.id}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setOrdersDoing(json));
    await setIsLoading(false);
  }
  const _handleUpdate = async () => {
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
  const _checkAll = (item) => {
    if (item?.target?.checked === true) {
      setcheckBoxAll(true)
      let allData = []
      for (let e = 0; e < ordersDoing?.length; e++) {
        allData.push({ id: ordersDoing[e]?._id })
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
  console.log("object", ordersDoing)
  return (
    <div>
      {isLoading ? <Loading /> : ""}
      <OrderNavbar />
      <div style={{ flexDirection: 'row', justifyContent: "space-between", display: "flex", paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}>
        <div style={{ alignItems: "end", flexDirection: 'column', display: "flex", justifyContent: "center" }}>
          <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => _checkAll(e)}/>} label={<div style={{ fontFamily: "NotoSansLao", fontWeight: "bold" }} >ເລືອກທັງໝົດ</div>} />
        </div>
        <div>
          <Button variant="light" style={{ backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }} onClick={()=>_handleUpdate()}>ເສີບແລ້ວ</Button>
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
              <th>ສະຖານະ</th>
              <th>ເວລາ</th>
              <th>ຄອມເມັ້ນ</th>
            </tr>
          </thead>
          <tbody>
            {ordersDoing &&
              ordersDoing?.map((order, index) => (
                <tr key={index}>
                  <td  >
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}>
                    <Checkbox
                      checked={_onSelectBox(index) ? _onSelectBox(index) : checkBoxAll}
                      onChange={(e) => _handleCheckbox(e, order?._id, index)}
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
                  <td><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{order?.status ? orderStatus(order?.status) : "-"}</p></div></td>
                  
                  <td><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>
                    {order?.createdAt
                      ? moment(order?.createdAt).format("HH:mm a")
                      : "-"}</p></div>
                  </td>
                  <td><div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}><p style={{ margin: 0 }}>{order?.note ?? "-"}</p></div></td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
      {/* <CancelModal
        show={cancelModal}
        hide={() => setCancelModal(false)}
        handleCancel={_handleCancel}
      /> */}
      <UpdateModal
        show={updateModal}
        hide={() => setUpdateModal(false)}
        handleUpdate={_handleUpdate}
      />
    </div>
  );
};

export default Order;
