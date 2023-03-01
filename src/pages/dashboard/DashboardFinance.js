import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { Table, Modal, Button } from "react-bootstrap";
import { END_POINT_SEVER } from "../../constants/api";
import { _statusCheckBill, orderStatus } from "./../../helpers";
import AnimationLoading from "../../constants/loading";
import { useNavigate, useParams } from "react-router-dom";
import Box from "../../components/Box";
import * as _ from "lodash";
import { getHeaders } from "../../services/auth";
import { useStore } from "../../store";
import useQuery from "../../helpers/useQuery";
import ButtonDownloadCSV from "../../components/button/ButtonDownloadCSV";
import ButtonDownloadExcel from "../../components/button/ButtonDownloadExcel";
import { useTranslation } from "react-i18next";
import { stringify } from "query-string";
export default function DashboardFinance({ startDate, endDate, selectedCurrency }) {
  const [currency, setcurrency] = useState()
  const navigate = useNavigate();
  const { accessToken } = useQuery();
  const params = useParams();
  const [data, setData] = useState();
  const [disCountDataKib, setDisCountDataKib] = useState(0);
  const [disCountDataPercent, setDisCountDataPercent] = useState(0);
  const [dataNotCheckBill, setDataNotCheckBill] = useState({});
  const [dataCheckBill, setDataCheckBill] = useState({});
  const [selectOrder, setSelectOrder] = useState();
  const [moneyCash, setMoneyCash] = useState(0);
  const [moneyAon, setMoneyAon] = useState(0);
  const [show, setShow] = useState(false);
  const [dataModale, setDataModale] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleClose = () => setShow(false);
  const { storeDetail } = useStore();

  const handleEditBill = async () => {
    try {
      const url = END_POINT_SEVER + "/v3/bill-reset";
      const _body = {
        id: selectOrder?._id,
        storeId: storeDetail?._id,
      };
      const res = await axios.post(url, _body, {
        headers: await getHeaders(accessToken),
      });
      if (res.status < 300) {
        navigate("/tables");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleShow = (item) => {
    setShow(true);
    setDataModale(item);
  };

  const getcurrency = async () => {
    try {
      let x = await fetch(
        END_POINT_SEVER + `/v3/currencies?storeId=${storeDetail?._id}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => setcurrency(json));
    } catch (err) {
      console.log(err);
    }
  };

  const exportJsonToExcel = () => {
    let _export = data?.checkOut.map((item, index) => ({
      ລຳດັບ: index + 1,
      ເລກບິນ: item?.code,
      ວັນທີ: moment(item?.createdAt).format("DD/MM/YYYY HH:mm"),
      ຈຳນວນເງິນ: ["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
        ? new Intl.NumberFormat("ja-JP", {
          currency: "JPY",
        }).format(_countAmount(item?.orderId))
        : new Intl.NumberFormat("ja-JP", {
          currency: "JPY",
        }).format(item?.billAmount),
      ຈ່າຍເງິນສົດ: item?.payAmount,
      ຈ່າຍເງິນໂອນ: item?.transferAmount,
      ສ່ວນຫຼຸດ: item?.discount + " " + item?.discountType,
      ກ່ອນຫັກສ່ວນຫຼຸດ: item?.billAmountBefore,
      ຍອດລວມທັງໝົດ: data?.checkOut?.length === index + 1 ?
        new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
          data?.amount + dataNotCheckBill?.amount
        ) : "",
    }))
    return _export
  }

  useEffect(() => {
    getcurrency();
    _fetchFinanceData();
  }, []);
  useEffect(() => {
    _fetchFinanceData();
  }, [endDate, startDate, selectedCurrency
  ]);
  const _fetchFinanceData = async () => {
    setIsLoading(true);
    // const url =
    //   "/v3/bills?storeId=61d8019f9d14fc92d015ee8e&status=CHECKOUT&isCheckout=true&startDate=2023-01-06&endDate=2023-01-06";
    const headers = await getHeaders(accessToken);
    const getDataDashBoard = await axios.get(
      END_POINT_SEVER +
      "/v3/bills?storeId=" +
      params?.storeId +
      "&currencyType=" +
      selectedCurrency +
      "&startDate=" +
      startDate +
      "&endDate=" +
      endDate,
      {
        headers: headers,
      }
    );

    // const _checkOut = getDataDashBoard.data.filter(
    //   (e) => e?.isCheckout && e?.status === "CHECKOUT"
    // );
    const _checkOut = getDataDashBoard.data;
    const totalPrice = _.sumBy(_checkOut, function (o) {
      return o.billAmount;
    });
    const _formatJson = {
      checkOut: _checkOut,
      amount: totalPrice,
    };
    setData(_formatJson);
    setIsLoading(false);
  };

  useEffect(() => {
    let _disCountDataKib = 0;
    let _disCountDataAon = 0;
    let _cash = 0;
    let _aon = 0;
    let _notCheckBill = {
      total: 0,
      amount: 0,
      discountCash: 0,
      discountPercent: 0,
    };
    let _checkBill = {
      total: 0,
      amount: 0,
      discountCash: 0,
      discountPercent: 0,
      cash: 0,
      transfer: 0,
    };
    if (data?.checkOut?.length > 0) {
      for (let i = 0; i < data?.checkOut.length; i++) {
        if (["CALLTOCHECKOUT", "ACTIVE"].includes(data?.checkOut[i]?.status)) {
          _notCheckBill.total += 1;
          if (data?.checkOut[i]?.discountType === "LAK")
            _notCheckBill.discountCash += data?.checkOut[i]?.discount;
          if (data?.checkOut[i]?.discountType !== "LAK")
            _notCheckBill.discountPercent += data?.checkOut[i]?.discount;
          _notCheckBill.amount += _countAmount(data?.checkOut[i]?.orderId);
        }
        if (["CHECKOUT"].includes(data?.checkOut[i]?.status)) {
          _checkBill.total += 1;
          if (data?.checkOut[i]?.discountType === "LAK")
            _checkBill.discountCash += data?.checkOut[i]?.discount;
          if (data?.checkOut[i]?.discountType !== "LAK")
            _checkBill.discountPercent += data?.checkOut[i]?.discount;
          _checkBill.amount += _countAmount(data?.checkOut[i]?.orderId);
          if (data?.checkOut[i]?.paymentMethod === "CASH")
            _checkBill.cash += data?.checkOut[i]?.billAmount;
          if (data?.checkOut[i]?.paymentMethod !== "CASH") {
            if (
              data?.checkOut[i]?.transferAmount > data?.checkOut[i]?.billAmount
            ) {
              _checkBill.cash +=
                data?.checkOut[i]?.billAmount -
                data?.checkOut[i]?.transferAmount;
            } else if (
              data?.checkOut[i]?.transferAmount + data?.checkOut[i]?.payAmount >
              data?.checkOut[i]?.billAmount
            ) {
              _checkBill.cash +=
                data?.checkOut[i]?.billAmount -
                data?.checkOut[i]?.transferAmount;
            } else {
              _checkBill.cash += data?.checkOut[i]?.payAmount;
            }
            _checkBill.transfer += data?.checkOut[i]?.transferAmount;
          }
        }
        if (data?.checkOut[i]?.discountType === "LAK")
          _disCountDataKib += data?.checkOut[i]?.discount;
        if (data?.checkOut[i]?.discountType !== "LAK")
          _disCountDataAon += data?.checkOut[i]?.discount;
        if (data?.checkOut[i]?.paymentMethod === "CASH")
          _cash += data?.checkOut[i]?.billAmount;
        if (data?.checkOut[i]?.paymentMethod !== "CASH")
          _aon += data?.checkOut[i]?.billAmount;
      }
    }
    setDataCheckBill(_checkBill);
    setDataNotCheckBill(_notCheckBill);
    setMoneyAon(_aon);
    setMoneyCash(_cash);
    setDisCountDataKib(_disCountDataKib);
    setDisCountDataPercent(_disCountDataAon);
  }, [data]);
  const { t } = useTranslation();

  const _countOrder = (item) => {
    let _countOrderCancel = 0;
    let _countOrderSuccess = 0;
    if (item?.length > 0) {
      for (let i = 0; i < item.length; i++) {
        if (item[i]?.status === "SERVED")
          _countOrderSuccess += item[i]?.quantity;
        if (item[i]?.status === "CANCELED")
          _countOrderCancel += item[i]?.quantity;
      }
    }
    return { _countOrderSuccess, _countOrderCancel };
  };

  const _countAmount = (item) => {
    let _amount = 0;
    if (item?.length > 0) {
      for (let i = 0; i < item.length; i++) {
        _amount += item[i]?.price * item[i]?.quantity;
      }
    }
    return _amount;
  };
  return (
    <div style={{ padding: 0 }}>
      <div
        style={{
          marginRight: "30px",
          backgroundColor: "orange",
          boxShadow: "2px 2px 2px 4px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* <select onChange={(e) => setSelectedCurrency(e.target.value)}>
          <option selected value="">ກີບ</option>
          {
            currency?.map((La, index) => (
              <option value={La?.currencyCode}>{La?.currencyName}</option>
            ))
          }
        </select> */}
      </div>
      {isLoading && <AnimationLoading />}
      <div className="row">
        <div style={{ width: "100%" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                md: "1fr 1fr 1fr",
                sm: "1fr 1fr",
                xs: "1fr",
              },
              padding: 10,
            }}
          >
            <div
              style={{
                border: "solid 1px #FB6E3B",
                borderRadius: "0px 0px 8px 8px",
                flex: 2,
                margin: 5,
              }}
            >
              <div
                style={{
                  height: 50,
                  color: "#fff",
                  backgroundColor: "#FB6E3B",
                  display: "flex",
                  // justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p style={{ margin: 0, fontSize: 20 }}>{t('totalCirculation')}</p>
              </div>
              <div style={{ padding: 15 }}>
                <div>{t('numberOfBill')} : {data?.checkOut?.length} {t('bill')}</div>
                <div>
                  {t('totalBalance')} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    // data?.discountType === "LAK" && data?.discount > 0 ? data?.amount - disCountDataKib : data?.amount * (1 + disCountDataPercent / 100)

                  // data?.discount > 0 ? (data?.discountType === "LAK" ? data?.amount - disCountDataKib :
                  // data?.amount * (1 + disCountDataPercent / 100)
                  // )
                  // : data?.amount
                  data?.amount
                    // dataNotCheckBill?.amount
                  )}{" "}
                  {selectedCurrency}
                  {/* {selectedCurrency} */}
                </div>
                <div>
                  {/* ສ່ວນຫຼຸດເປັນເງິນ :{" "} */}
                  {t('cashDiscount')} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    disCountDataKib
                  )}{" "}
                  {selectedCurrency}
                </div>
                <div>
                  {t('percentageDiscount')} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    disCountDataPercent
                  )}{" "}
                  %
                </div>
                <div>
                  {t("payBycash")} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    dataCheckBill?.cash
                  )}{" "}
                  {selectedCurrency}
                </div>
                <div>
                  {t("transferPayment")} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    dataCheckBill?.transfer
                  )}{" "}
                  {selectedCurrency}
                </div>
                <div>
                  {t('outstandingDebt')} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    dataNotCheckBill?.amount
                  )}{" "}
                  {selectedCurrency}
                </div>
              </div>
            </div>
            <div
              style={{
                border: "solid 1px #FB6E3B",
                borderRadius: "0px 0px 8px 8px",
                flex: 1,
                margin: 5,
              }}
            >
              <div
                style={{
                  height: 50,
                  color: "#fff",
                  backgroundColor: "#FB6E3B",
                  display: "flex",
                  // justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p style={{ margin: 0, fontSize: 20 }}>{t('totalCompeleteBill')}</p>
              </div>
              <div style={{ padding: 15 }}>
                <div>{t('numberOfBill')} : {dataCheckBill?.total} {t('bill')}</div>
                <div>
                  {t('totalBalance')} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    dataCheckBill?.cash + dataCheckBill?.transfer
                  )}{" "}
                  {selectedCurrency}
                </div>
                <div>
                  {t('cashDiscount')} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    dataCheckBill?.discountCash
                  )}{" "}
                  {selectedCurrency}
                </div>
                <div>
                  {t('percentageDiscount')} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    dataCheckBill?.discountPercent
                  )}{" "}
                  %
                </div>
                <div>
                  {t("payBycash")} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    dataCheckBill?.cash
                  )}{" "}
                  {selectedCurrency}
                </div>
                <div>
                  {t("transferPayment")} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    dataCheckBill?.transfer
                  )}{" "}
                  {selectedCurrency}
                </div>
              </div>
            </div>
            <div
              style={{
                border: "solid 1px #FB6E3B",
                borderRadius: "0px 0px 8px 8px",
                flex: 1,
                margin: 5,
              }}
            >
              <div
                style={{
                  height: 50,
                  color: "#fff",
                  backgroundColor: "#FB6E3B",
                  display: "flex",
                  // justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p style={{ margin: 0, fontSize: 20 }}>{t('outstandingBillAmount')}</p>
              </div>
              <div style={{ padding: 15 }}>
                <div>{t('numberOfBill')} : {dataNotCheckBill?.total} {t('bill')}</div>
                <div>
                  {t('totalBalance')} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    dataNotCheckBill?.amount
                  )}{" "}
                  {selectedCurrency}
                </div>
                <div>
                  {t('cashDiscount')} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    dataNotCheckBill?.discountCash
                  )}{" "}
                  {selectedCurrency}
                </div>
                <div>
                  {t('percentageDiscount')} :{" "}
                  {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    dataNotCheckBill?.discountPercent
                  )}{" "}
                  %
                </div>
              </div>
            </div>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", padding: 10 }}
          >
            <ButtonDownloadExcel
              // jsonData={() => {
              //   let _export = data?.checkOut.map((item, index) => ({
              //     ລຳດັບ: index + 1,
              //     ເລກບິນ: item?.code,
              //     ວັນທີ: moment(item?.createdAt).format("DD/MM/YYYY HH:mm"),
              //     ຈຳນວນເງິນ: ["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
              //       ? new Intl.NumberFormat("ja-JP", {
              //         currency: "JPY",
              //       }).format(_countAmount(item?.orderId))
              //       : new Intl.NumberFormat("ja-JP", {
              //         currency: "JPY",
              //       }).format(item?.billAmount),
              //     ຈ່າຍເງິນສົດ: item?.payAmount,
              //     ຈ່າຍເງິນໂອນ: item?.transferAmount,
              //     ສ່ວນຫຼຸດ: item?.discount + " " + item?.discountType,
              //     ກ່ອນຫັກສ່ວນຫຼຸດ: item?.billAmountBefore,
              //     ຍອດລວມທັງໝົດ: data?.checkOut?.length === index + 1 ?
              //       new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
              //         data?.amount + dataNotCheckBill?.amount
              //       ) : "",
              //   }))
              //   return _export
              // }}

              jsonData={data?.checkOut.map((item, index) => ({
                ລຳດັບ: index + 1,
                ເລກບິນ: item?.code,
                ວັນທີ: moment(item?.createdAt).format("DD/MM/YYYY HH:mm"),
                ຈຳນວນເງິນ: ["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
                  ? _countAmount(item?.orderId)
                  : item?.billAmount,
                ຈ່າຍເງິນສົດ: item?.payAmount,
                ຈ່າຍເງິນໂອນ: item?.transferAmount,
                ສ່ວນຫຼຸດ: item?.discount + " " + item?.discountType,
                ກ່ອນຫັກສ່ວນຫຼຸດ: item?.billAmountBefore,
                ຍອດລວມທັງໝົດ: data?.checkOut?.length === index + 1 ?
                  new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                    data?.amount + dataNotCheckBill?.amount
                  ) : "",
              }))}
            // jsonData={exportJsonToExcel}
            />
          </Box>
          <div style={{ padding: 10 }}>
            <Table striped hover size="sm" style={{ fontSize: 15 }}>
              <thead>
                <tr>
                  <th>{t('no')}</th>
                  <th>{t('tableNumber')}</th>
                  <th>{t('tableCode')}</th>
                  <th>{t('tableDiscount')}</th>
                  <th>{t('price')} / {t('bill')}</th>
                  <th>{t('served')} / {t('cancel')}</th>
                  <th>{t("tableStatus")}</th>
                  <th>{t("paymentType")}</th>
                  <th>{t("time")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.checkOut?.map((item, index) => (
                  <tr
                    key={"finance-" + index}
                    onClick={() => {
                      setSelectOrder(item);
                      handleShow(item?.orderId);
                    }}
                    style={{
                      backgroundColor: ["CALLTOCHECKOUT", "ACTIVE"].includes(
                        item?.status
                      )
                        ? "#FB6E3B"
                        : "",
                      color: ["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
                        ? "#ffffff"
                        : "#616161",
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{item?.tableId?.name ?? "-"}</td>
                    <td>{item?.code}</td>
                    <td>
                      {item?.discountType === "LAK"
                        ? new Intl.NumberFormat("ja-JP", {
                          currency: "JPY",
                        }).format(item?.discount) + t("lak")
                        : item?.discount + "%"}
                    </td>
                    <td>
                      {["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
                        ? new Intl.NumberFormat("ja-JP", {
                          currency: "JPY",
                        }).format(_countAmount(item?.orderId))
                        : new Intl.NumberFormat("ja-JP", {
                          currency: "JPY",
                        }).format(item?.billAmount)}{" "}
                      {selectedCurrency}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "row",
                        }}
                      >
                        <p style={{ marginLeft: 5 }}>
                          {_countOrder(item?.orderId)?._countOrderSuccess}{" "}
                        </p>
                        <p style={{ marginLeft: 5 }}> / </p>
                        <p
                          style={{
                            color:
                              _countOrder(item?.orderId)?._countOrderCancel > 0
                                ? "red"
                                : "",
                            marginLeft: 5,
                          }}
                        >
                          {" "}
                          {_countOrder(item?.orderId)?._countOrderCancel}
                        </p>
                      </div>
                    </td>
                    <td
                      style={{
                        color:
                          item?.status === "CHECKOUT"
                            ? "green"
                            : item?.status === "CALLTOCHECKOUT"
                              ? "red"
                              : item?.status === "ACTIVE"
                                ? "#00496e"
                                : "",
                      }}
                    >
                      {_statusCheckBill(item?.status)}
                    </td>
                    <td
                      style={{
                        color:
                          item?.paymentMethod === "CASH"
                            ? "#00496e"
                            : "#0D47A1",
                      }}
                    >
                      {item?.paymentMethod === "CASH"
                        ? t("payBycash")
                        : item?.paymentMethod === "TRANSFER"
                          ? t("transferPayment")
                          : t("transfercash")}
                    </td>
                    <td>
                      {moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
        <div style={{ width: "50%", padding: 20 }}></div>
      </div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t('menuModal')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 10,
            }}
          >
            <Button onClick={handleEditBill}>{selectOrder?.status === "ACTIVE" ? t('editingTheBill') : t('billEditing')}</Button>
          </div>
          <Table striped bordered hover size="sm" style={{ fontSize: 15 }}>
            <thead>
              <tr>
                <th>{t('no')}</th>
                <th>{t('menuname')}</th>
                <th>{t('amount')}</th>
                <th>{t('statusOfFood')}</th>
                <th>{t('servedBy')}</th>
                <th>{t('price')}</th>
                <th>{t('time')}</th>
              </tr>
            </thead>
            <tbody>
              {dataModale?.map((item, index) => (
                <tr key={1 + index}>
                  <td>{index + 1}</td>
                  <td>{item?.name ?? "-"}</td>
                  <td>{item?.quantity}</td>
                  <td
                    style={{
                      color:
                        item?.status === "WAITING"
                          ? "#2d00a8"
                          : item?.status === "DOING"
                            ? "#c48a02"
                            : item?.status === "SERVED"
                              ? "green"
                              : item?.status === "CART"
                                ? "#00496e"
                                : item?.status === "FEEDBACK"
                                  ? "#00496e"
                                  : "#bd0d00",
                    }}
                  >
                    {orderStatus(item?.status)}
                  </td>
                  <td>{item?.createdBy ? item?.createdBy?.firstname : "-"}</td>
                  <td>
                    {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                      item?.price
                    )}
                  </td>
                  <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            {t('close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
