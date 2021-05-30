import React, { useState, useEffect } from "react";
import useReactRouter from "use-react-router";
import CustomNav from "./component/CustomNav";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";

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
  return (
    <div>
      {isLoading ? <Loading /> : ""}
      <CustomNav
        default={`/orders/doing/pagenumber/${number}`}
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
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {ordersDoing &&
              ordersDoing?.map((order, index) => (
                <tr key={index}>
                  <td>
                    <Checkbox
                      checked={
                        checkedToUpdate && checkedToUpdate[index]?.checked
                      }
                      onChange={(e) => _handleCheckbox(e, order?._id)}
                      style={{ color: "#FB6E3B" }}
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{order?.menu?.name ?? "-"}</td>
                  <td>{order?.quantity ?? "-"}</td>
                  <td>{order?.orderId?.table_id ?? "-"}</td>
                  <td>{order?.orderId?.code ?? "-"}</td>
                  <td style={{ color: "blue", fontWeight: "bold" }}>{order?.status ? orderStatus(order?.status) : "-"}</td>
                  <td>
                    {order?.createdAt
                      ? moment(order?.createdAt).format("HH:mm a")
                      : "-"}
                  </td>
                  <td>{order?.note ?? "-"}</td>
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
