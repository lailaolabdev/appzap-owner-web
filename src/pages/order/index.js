import React, { useState } from "react";
import useReactRouter from "use-react-router";
import CustomNav from "./component/CustomNav";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";
import { getOrders } from "../../services/order";
import { getHeaders } from "../../services/auth";

const Order = () => {
  const { history, location, match } = useReactRouter();

  const [orders, setOrders] = useState([]);
  React.useEffect(() => {
    const fetchOrder = async () => {
      const res = await getOrders();
      setOrders(res);
    };
    fetchOrder();
  }, []);
  if (orders) {
    console.log("12345: ", orders);
  }
  getHeaders();
  return (
    <div>
      <CustomNav default="/orders/pagenumber/1" />
      <Container fluid className="mt-3">
        <Table responsive className="staff-table-list borderless table-hover">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr>
              <th></th>
              <th>ລຳດັບ</th>
              <th>ຊື່ເມນູ</th>
              <th>ຈຳນວນ</th>
              <th>ເບີໂຕະ</th>
              <th>ສະຖານະ</th>
              <th>ເວລາ</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((value, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Checkbox
                      // hidden={isAdmin}
                      color="primary"
                      name="selectAll"
                      // onChange={(e) => _checkAll(e)}
                    />
                  </td>
                  <td>{index + 1 || "-"}</td>
                  <td>
                    {value?.order_item?.map((data, key) => {
                      return <p>{data?.menu?.name}</p>;
                    }) || "-"}
                  </td>
                  <td>
                    {value?.order_item?.map((data, key) => {
                      return <p>{data?.quantity}</p>;
                    }) || "-"}
                  </td>
                  <td>
                    {value?.order_item?.map((data, key) => {
                      return <p>{value?.table_id}</p>;
                    }) || "-"}
                  </td>
                  <td>
                    {value?.order_item?.map((data, key) => {
                      return <p>{data?.status}</p>;
                    }) || "-"}
                  </td>
                  <td>
                    {value?.createdAt
                      ? moment(value.createdAt).format("h:mm a")
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Order;
