import React, { useState, useEffect } from "react";
import useReactRouter from "use-react-router";
import Container from "react-bootstrap/Container";
import { Table, Image} from "react-bootstrap";
import moment from "moment";
import OrderNavbar from "./component/OrderNavbar";
import empty from '../../image/empty.png'

import Loading from "../../components/Loading";
import { orderStatus } from "../../helpers";
import { END_POINT } from "../../constants";
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
  const [ordersSev, setOrdersSev] = useState([]);
  const [checkedToUpdate, setCheckedToUpdate] = useState([]);
  const newDate = new Date();
  useEffect(() => {
    getData()
  }, [])
  const getData = async (tokken) => {
    await setIsLoading(true);
    await fetch(END_POINT + `/orderItems?status=SERVED&&storeId=${match?.params?.id}&startDate=${moment(moment(newDate)).format("YYYY-MM-DD")}&&endDate=${moment(moment(newDate).add(1, "days")).format("YYYY-MM-DD")}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setOrdersSev(json));
    await setIsLoading(false);
  }
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
      <OrderNavbar />
      {ordersSev?.length > 0 ? <div>
      {isLoading ? <Loading /> : ""}
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
              <th>ຄອມເມັ້ນ</th>

            </tr>
          </thead>
          <tbody>
            {ordersSev &&
              ordersSev?.map((order, index) => (
                <tr key={index}>
                  <td  style={{display: "flex", justifyContent: "center", alignItems: "center", height: 50}} >
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
      </div>
        : <Image src={empty} alt="" width="100%" />}
    </div>
  );
};

export default Order;
