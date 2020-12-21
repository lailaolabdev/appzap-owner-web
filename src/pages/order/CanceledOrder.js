import React, { useState } from "react";
import useReactRouter from "use-react-router";
import CustomNav from "./component/CustomNav";
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
  /**
   * use effect
   */
  React.useEffect(() => {
    const fetchOrder = async () => {
      await setIsLoading(true);
      const res = await getOrders(ACTIVE_STATUS, CANCEL_STATUS);
      await setOrders(res);
      await setIsLoading(false);
    };
    fetchOrder();
  }, []);


  return (
    <div>
      {isLoading ? <Loading /> : ""}
      <CustomNav default={`/orders/canceled/pagenumber/${number}`} cantUpdate />
      <Container fluid className="mt-3">
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
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
                  <td style={{color: "green", fontWeight: "bold"}}>{order?.status ? orderStatus(order?.status) : "-"}</td>
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

export default Order;
