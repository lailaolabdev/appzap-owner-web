import React, { useEffect, useState } from "react";
import { Col, Container, InputGroup, Nav } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import moment from "moment";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { END_POINT } from "../../constants";
import AnimationLoading from "../../constants/loading";
import { getHeaders } from "../../services/auth";
import { useNavigate, useParams } from "react-router-dom";
import { t } from "i18next";
import { useStore } from "../../store";
export default function History() {
  const navigate = useNavigate();
  const params = useParams();
  const { storeDetail } = useStore();
  const newDate = new Date();
  const [startDate, setSelectedDateStart] = useState("2021-02-01");
  const [endDate, setSelectedDateEnd] = useState(
    moment(moment(newDate)).format("YYYY-MM-DD")
  );
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [findeByCode, setfindeByCode] = useState();
  useEffect(() => {
    if (startDate || endDate) _searchDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);
  useEffect(() => {
    _searchDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findeByCode]);
  useEffect(() => {
    _searchDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const _searchDate = async () => {
    setIsLoading(true);
    let header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    let _resData = await axios.get(
      END_POINT +
        `/v3/bills/?storeId=${params?.id}&status=CHECKOUT&isCheckout=true&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: headers,
      }
    );
    setData(_resData?.data);
    setIsLoading(false);
  };
  const _setSelectedDateStart = (item) => {
    setSelectedDateStart(item.target.value);
  };
  const _setSelectedDateEnd = (item) => {
    setSelectedDateEnd(item.target.value);
  };
  const [amount, setamount] = useState();

  useEffect(() => {
    let Allamount = 0;
    if (data?.length > 0 || startDate || endDate) {
      for (let i = 0; i < data?.length; i++) {
        Allamount += data[i]?.billAmount;
      }
      setamount(Allamount);
    }
  }, [data, startDate, endDate]);

  let _allmonny = (item) => {
    let total = 0;
    for (let i = 0; i < item?.length; i++) {
      if (item[i]?.status === "SERVED") {
        total += item[i]?.price * item[i]?.quantity;
      }
    }
    return total;
  };
  const _historyDetail = (code) =>
    navigate(`/histories/HistoryDetail/${code}/` + params?.id);

  return (
    <div style={{ minHeight: 400 }}>
      <Container fluid>
        <div className="row mt-5">
          <Nav.Item>
            <h5 style={{ marginLeft: 30 }}>
              <strong>ປະຫວັດການຂາຍ</strong>
            </h5>
          </Nav.Item>
          <Nav.Item
            className="ml-auto row mr-5"
            style={{ paddingBottom: "3px" }}
          >
            <InputGroup>
              <div className="col">
                <label>ແຕ່ວັນທີ</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => _setSelectedDateStart(e)}
                ></input>
              </div>
              <div className="col">
                <label>ຫາວັນທີ</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => _setSelectedDateEnd(e)}
                ></input>
              </div>
            </InputGroup>
          </Nav.Item>
        </div>
        <div style={{ height: 20 }}></div>
        {isLoading ? (
          <AnimationLoading />
        ) : (
          <div>
            <Col xs={12}>
              <Table hover responsive className="table">
                <thead style={{ backgroundColor: "#F1F1F1" }}>
                  <tr>
                    <th>ລຳດັບ</th>
                    <th>ລະຫັດໂຕະ</th>
                    <th>ໂຕະ</th>
                    <th>ລາຄາ/ບີນ</th>
                    <th>ສ່ວນຫຼຸດ</th>
                    <th>ເປັນເງິນ</th>
                    <th>ວັນທີ</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 &&
                    data?.map((item, index) => {
                      return (
                        <tr
                          index={item}
                          onClick={() => _historyDetail(item?.code)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{index + 1}</td>
                          <td>{item?.code}</td>
                          <td>{item?.tableId?.name}</td>
                          <td>
                            <b>
                              {new Intl.NumberFormat("ja-JP", {
                                currency: "JPY",
                              }).format(_allmonny(item?.orderId))}{" "}
                              {storeDetail?.firstCurrency}
                            </b>
                          </td>
                          <td>
                            {item?.discountType === "LAK"
                              ? new Intl.NumberFormat("ja-JP", {
                                  currency: "JPY",
                                }).format(item?.discount)
                              : item?.discount}{" "}
                            {item?.discountType === "LAK"
                              ? storeDetail?.firstCurrency
                              : "%"}
                          </td>
                          <td style={{ color: "green" }}>
                            <b>
                              {new Intl.NumberFormat("ja-JP", {
                                currency: "JPY",
                              }).format(item?.billAmount)}{" "}
                              {storeDetail?.firstCurrency}
                            </b>
                          </td>
                          <td>
                            {moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}
                          </td>
                        </tr>
                      );
                    })}
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {t("totalPrice2")} :{" "}
                    </td>
                    <td colSpan={2} style={{ color: "blue" }}>
                      {new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(amount)}{" "}
                      .{storeDetail?.firstCurrency}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </div>
        )}
      </Container>
    </div>
  );
}
