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
import { CANCEL_STATUS, DOING_STATUS } from "../../constants";

const Order = () => {
  /**
   * routes
   */
  const { match } = useReactRouter();
  const { number } = match?.params;

  /**
   * states
   */
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [checkedToUpdate, setCheckedToUpdate] = useState([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  /**
   * use effect
   */
  React.useEffect(() => {
    const fetchOrder = async () => {
      await setIsLoading(true);
      const res = await getOrders();
      await setOrders(res);
      await setIsLoading(false);
    };
    fetchOrder();
  }, []);
  const _handleUpdate = async () => {
    await updateOrderItem(checkedToUpdate, DOING_STATUS);
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
  return (
    <div>
      {isLoading ? <Loading /> : ""}
      <CustomNav
        default={`/orders/pagenumber/${number}`}
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
              <th>ສະຖານະ</th>
              <th>ເວລາ</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders?.map((order, index) => (
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
                  <td>{order?.table_id ?? "-"}</td>
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
