import React, { useState, useEffect, useMemo } from "react";
import Container from "react-bootstrap/Container";
import { Table, Image } from "react-bootstrap";
import moment from "moment";
import OrderNavbar from "./component/OrderNavbar";
import empty from "../../image/empty.png";

import {
  CANCEL_STATUS,
  DOING_STATUS,
  SERVE_STATUS,
  WAITING_STATUS,
} from "../../constants";

import Loading from "../../components/Loading";
import { orderStatus } from "../../helpers";
import { END_POINT } from "../../constants";
import { useParams } from "react-router-dom";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { socket } from "../../services/socket";
import { useStore } from "../../store";

const ServedOrder = () => {
  /**
   * routes
   */
  const params = useParams();
  const { number } = params;

  /**
   * states
   */
  const [isLoading, setIsLoading] = useState(false);
  const [ordersSev, setOrdersSev] = useState([]);
  const newDate = new Date();
  const { storeDetail, orderItems } = useStore();
  const storeId = storeDetail?._id;
  const { getOrderItemsStore, selectOrderStatus, setSelectOrderStatus } =
    useStore();
  useEffect(() => {
    getOrderItemsStore(SERVE_STATUS);
    setSelectOrderStatus(SERVE_STATUS);
  }, []);

  return (
    <div>
      <OrderNavbar />
      {ordersSev?.length > 0 ? (
        (

          <div>
            {isLoading ? <Loading /> : ""}
            <Container fluid className="mt-3">
              <Table
                responsive
                className="staff-table-list borderless table-hover"
              >
                <thead style={{ backgroundColor: "#F1F1F1" }}>
                  <tr>
                    <th width="20px"></th>
                    <th>ລ/ດ</th>
                    <th>ຊື່ເມນູ</th>
                    <th>ຈຳນວນ</th>
                    <th>ຈາກໂຕະ</th>
                    <th>ລະຫັດໂຕະ</th>
                    <th>ສະຖານະ</th>
                    <th>ເວລາ</th>
                    <th>ຄອມເມັ້ນ</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems &&
                    orderItems?.map((order, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 50,
                          }}
                        ></td>
                        <td>
                          <p style={{ margin: 0 }}>{index + 1}</p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>{order?.name ?? "-"}</p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>{order?.quantity ?? "-"}</p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>
                            {order?.tableId?.name ?? "-"}
                          </p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>{order?.code ?? "-"}</p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>
                            {order?.status ? orderStatus(order?.status) : "-"}
                          </p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>
                            {order?.createdAt
                              ? moment(order?.createdAt).format("HH:mm a")
                              : "-"}
                          </p>
                        </td>
                        <td>
                          <p style={{ margin: 0 }}>{order?.note ?? "-"}</p>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Container>
          </div>
        )
      ) : (
        <Image src={empty} alt="" width="100%" />
      )}
    </div>
  );
};

export default ServedOrder;
