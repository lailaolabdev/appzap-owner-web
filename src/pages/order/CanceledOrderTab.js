import React, { useState } from "react";
// import CustomNav from "./component/CustomNav";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import moment from "moment";

/**
 * import function
 */

import Loading from "../../components/Loading";
import { getOrders } from "../../services/order";
import { orderStatus } from "../../helpers";
import { ACTIVE_STATUS, CANCEL_STATUS } from "../../constants";
import { useParams } from "react-router-dom";
const CanceledOrderTab = () => {
  /**
   * routes
   */
  const params = useParams();
  const { number } = params;

  // const {
  //   handleCheckbox,
  //   checkAllOrders,
  // } = useStore();

  /**
   * states
   */
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  /**
   * use effect
   */

  return (
    <div>
      {isLoading ? <Loading /> : ""}
      {/* <CustomNav default={`/orders/canceled/pagenumber/${number}`} cantUpdate /> */}
      <Container fluid className="mt-3">
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
              {/* <th>
                  <FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => checkAllOrders(e)} style={{ marginLeft: 10 }} />} />
                </th> */}
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
                  <td>{index + 1}</td>
                  <td>{order?.menu?.name ?? "-"}</td>
                  <td>{order?.quantity ?? "-"}</td>
                  <td>{order?.table_id ?? "-"}</td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {order?.status ? orderStatus(order?.status) : "-"}
                  </td>
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
    </div>
  );
};

export default CanceledOrderTab;
