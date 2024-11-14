import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import { Table, Image } from "react-bootstrap";
import moment from "moment";
import empty from "../../image/empty.png";
import Loading from "../../components/Loading";
import { orderStatus } from "../../helpers";
import { useParams } from "react-router-dom";
import { useStore } from "../../store";
import { useTranslation } from "react-i18next";

const ServedOrderTab = () => {
  const { t } = useTranslation();
  /**
   * routes
   */
  const params = useParams();

  /**
   * states
   */
  const [isLoading, setIsLoading] = useState(false);
  const [ordersSev, setOrdersSev] = useState([]);
  const newDate = new Date();
  const { storeDetail, orderItems } = useStore();
  const storeId = storeDetail?._id;
  const { selectOrderStatus, setSelectOrderStatus } = useStore();

  return (
    <div>
      {/* <OrderNavbar /> */}
      {orderItems?.length > 0 ? (
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
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("no")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("menu_name")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("amount")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("from_table")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("table_code")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("status")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("time")}
                  </th>
                  <th
                    style={{
                      textWrap: "nowrap",
                    }}
                  >
                    {t("commend")}
                  </th>
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
      ) : (
        <Image src={empty} alt="" width="100%" />
      )}
    </div>
  );
};

export default ServedOrderTab;
