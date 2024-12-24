import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Table, Modal, Button, Pagination } from "react-bootstrap";
import * as _ from "lodash";
import { FaCheckDouble, FaCircleCheck } from "react-icons/fa6";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import { _statusCheckBill, orderStatus, moneyCurrency } from "./../../helpers";
import { useTranslation } from "react-i18next";
import { stringify } from "query-string";
import AnimationLoading from "../../constants/loading";
import Box from "../../components/Box";
import { getHeaders } from "../../services/auth";
import { useStore } from "../../store";
import useQuery from "../../helpers/useQuery";
import ButtonDownloadCSV from "../../components/button/ButtonDownloadCSV";
import ButtonDownloadExcel from "../../components/button/ButtonDownloadExcel";
import Loading from "../../components/Loading";
import { getCountBills } from "../../services/bill";
import { COLOR_APP } from "../../constants";

const limitData = 50;

export default function DashboardFinance({
  startDate,
  endDate,
  startTime,
  endTime,
  selectedCurrency,
}) {
  const [currency, setCurrency] = useState();
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
  const [dataModal, setDataModal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disabledEditBill, setDisabledEditBill] = useState(false);

  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState();

  const handleClose = () => setShow(false);
  const { storeDetail, profile } = useStore();

  // console.log("data", data);

  const getPaginationCountData = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      const query =
        "?storeId=" +
        params?.storeId +
        "&dateFrom=" +
        startDate +
        "&dateTo=" +
        endDate +
        "&timeFrom=" +
        startTime +
        "&timeTo=" +
        endTime;
      const _data = await getCountBills(query, TOKEN);
      if (_data.error) throw new Error("error");
      setTotalPagination(Math.ceil(_data?.count / limitData));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditBill = async () => {
    try {
      setDisabledEditBill(true);
      if (disabledEditBill) return;
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
    setDataModal(item);

    console.log("item", item);
  };

  const getCurrency = async () => {
    try {
      const x = await fetch(
        END_POINT_SEVER + `/v4/currencies?storeId=${storeDetail?._id}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => setCurrency(json));
    } catch (err) {
      console.log(err);
    }
  };

  const exportJsonToExceltyty = () => {
    const _export = data?.checkOut.map((item, index) => ({
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
      ຍອດລວມທັງໝົດ:
        data?.checkOut?.length === index + 1
          ? new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
              data?.amount + dataNotCheckBill?.amount
            )
          : "",
    }));
    return _export;
  };

  useEffect(() => {
    getCurrency();
    _fetchFinanceData();
  }, []);

  useEffect(() => {
    getPaginationCountData();
  }, [endDate, startDate, selectedCurrency]);

  useEffect(() => {
    _fetchFinanceData();
  }, [endDate, startDate, selectedCurrency, pagination, totalPagination]);

  const _fetchFinanceData = async () => {
    setIsLoading(true);
    const headers = await getHeaders(accessToken);
    const getDataDashBoard = await axios.get(
      END_POINT_SEVER +
        "/v3/bills?storeId=" +
        params?.storeId +
        "&startDate=" +
        startDate +
        "&endDate=" +
        endDate +
        "&startTime=" +
        startTime +
        "&endTime=" +
        endTime +
        "&skip=" +
        (pagination - 1) * limitData +
        "&limit=" +
        limitData,
      {
        headers: headers,
      }
    );

    const _checkOut = getDataDashBoard.data;
    const totalPrice = _.sumBy(_checkOut, (o) => o.billAmount);
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
    const _notCheckBill = {
      total: 0,
      amount: 0,
      discountCash: 0,
      discountPercent: 0,
    };
    const _checkBill = {
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
          _checkBill.amount += data?.checkOut[i]?.billAmount;
          if (data?.checkOut[i]?.paymentMethod === "CASH") {
            _checkBill.cash += data?.checkOut[i]?.billAmount;
          }
          if (data?.checkOut[i]?.paymentMethod === "TRANSFER") {
            _checkBill.transfer += data?.checkOut[i]?.billAmount;
          }
          if (data?.checkOut[i]?.paymentMethod === "TRANSFER_CASH") {
            _checkBill.transfer +=
              data?.checkOut[i]?.billAmount - data?.checkOut[i]?.payAmount;
            _checkBill.cash += data?.checkOut[i]?.payAmount;
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
        if (item[i]?.status === "PAID") _countOrderSuccess += item[i]?.quantity;
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
        const totalOptionPrice = item[i]?.totalOptionPrice ?? 0;
        const totalPrice =
          item[i]?.totalPrice ??
          (item[i]?.price + totalOptionPrice) * item[i]?.quantity;
        _amount += totalPrice;
      }
    }
    return _amount;
  };

  const formatMenuName = (name, options) => {
    const optionNames =
      options?.map((option) => `[${option.name}]`).join(" ") || "";
    return `${name} ${optionNames}`;
  };

  const renderDiscount = (value) => {
    const formattedValue = moneyCurrency(value);
    const currency =
      dataModal?.discountType !== "LAK" ? "%" : storeDetail?.firstCurrency;
    return `${formattedValue} ${currency}`;
  };

  const TotalAmount =
    (dataModal?.point ?? 0) +
    (dataModal?.transferAmount ?? 0) +
    (dataModal?.payAmount ?? 0) -
    (dataModal?.discount ?? 0);

  const TotalBefore =
    (dataModal?.billAmount ?? 0) +
    (dataModal?.taxAmount ?? 0) +
    (dataModal?.serviceChargeAmount ?? 0);

  const baseTotal =
    (dataModal?.point ?? 0) +
    (dataModal?.transferAmount ?? 0) +
    (dataModal?.change ?? 0) +
    (dataModal?.payAmount ?? 0) -
    (dataModal?.discount ?? 0) -
    (dataModal?.change ?? 0);

  const totalAfter =
    dataModal?.paymentMethod === "CASH" ||
    dataModal?.paymentMethod === "TRANSFER"
      ? baseTotal +
        (dataModal?.taxAmount ?? 0) +
        (dataModal?.serviceChargeAmount ?? 0)
      : baseTotal;

  return (
    <div style={{ padding: 0 }}>
      {isLoading && <Loading />}
      <div style={{ padding: 10, overflowX: "auto" }}>
        <Table striped hover size="sm" style={{ fontSize: 15 }}>
          <thead>
            <tr>
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
                {t("tableNumber")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("tableCode")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("tableDiscount")}
              </th>

              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("point")}
              </th>

              <>
                <th
                  style={{
                    textWrap: "nowrap",
                  }}
                >
                  delivery
                </th>
                <th
                  style={{
                    textWrap: "nowrap",
                  }}
                >
                  {t("name")} platform
                </th>
              </>

              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("price")} / {t("bill")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("served")} / {t("cancel")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("tableStatus")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("paymentType")}
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
                {t("staffCheckBill")}
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.checkOut?.map((item, index) => (
              <tr
                key={item?._id}
                onClick={() => {
                  setSelectOrder(item);
                  handleShow(item);
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
                <td>{(pagination - 1) * limitData + index + 1}</td>
                <td>{item?.tableId?.name ?? "-"}</td>
                <td>{item?.code}</td>
                <td>
                  {item?.discountType === "LAK"
                    ? new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(item?.discount) + t("lak")
                    : `${item?.discount}%`}
                </td>
                <td>{item?.point ? item?.point : 0}</td>

                <>
                  <td>
                    {item?.orderId[0]?.deliveryCode
                      ? ["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
                        ? new Intl.NumberFormat("ja-JP", {
                            currency: "JPY",
                          }).format(_countAmount(item?.orderId))
                        : new Intl.NumberFormat("ja-JP", {
                            currency: "JPY",
                          }).format(item?.deliveryAmount)
                      : 0}{" "}
                    {selectedCurrency}
                  </td>
                  <td>
                    {item?.deliveryName
                      ? item?.deliveryName
                      : item?.orderId[0]?.platform
                      ? item?.orderId[0]?.platform
                      : "-"}
                  </td>
                </>

                <td>
                  {item?.orderId[0]?.deliveryCode
                    ? 0
                    : ["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
                    ? new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(_countAmount(item?.orderId))
                    : new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(
                        item?.billAmount +
                          item?.taxAmount +
                          item?.serviceChargeAmount -
                          item?.point
                      )}{" "}
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
                      item?.paymentMethod === "CASH" ? "#00496e" : "#0D47A1",
                  }}
                >
                  {item?.paymentMethod === "CASH"
                    ? t("payBycash")
                    : item?.paymentMethod === "TRANSFER"
                    ? t("transferPayment")
                    : item?.paymentMethod === "DELIVERY"
                    ? `${t("transferPayment")} (delivery)`
                    : item?.paymentMethod === "POINT"
                    ? t("point")
                    : item?.paymentMethod === "CASH_TRANSFER_POINT"
                    ? t("transfercashpoint")
                    : t("transfercash")}
                </td>
                <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                <td>{item?.fullnameStaffCheckOut ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            bottom: 20,
          }}
        >
          <ReactPaginate
            previousLabel={
              <span className="glyphicon glyphicon-chevron-left">{`ກ່ອນໜ້າ`}</span>
            }
            nextLabel={
              <span className="glyphicon glyphicon-chevron-right">{`ຕໍ່ໄປ`}</span>
            }
            breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
            breakClassName={"break-me"}
            pageCount={totalPagination} // Replace with the actual number of pages
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={(e) => {
              console.log(e);
              setPagination(e?.selected + 1);
            }}
            containerClassName={"pagination justify-content-center"} // Bootstrap class for centering
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            activeClassName={"active"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
          />
        </div>
      </div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("menuModal")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex justify-between my-4">
            <div>
              {totalAfter && TotalBefore > 0 ? (
                totalAfter === TotalBefore ? (
                  <span className="flex items-center text-green-500 gap-2">
                    <FaCircleCheck className="text-green-500 text-5xl" />{" "}
                    ບິນຖຶກຕ້ອງ{" "}
                    {`${new Intl.NumberFormat("ja-JP", {
                      currency: "JPY",
                    }).format(TotalBefore)} ${
                      storeDetail?.firstCurrency
                    } = ${new Intl.NumberFormat("ja-JP", {
                      currency: "JPY",
                    }).format(totalAfter)} ${storeDetail?.firstCurrency}`}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-red-500">
                    <BsFillExclamationTriangleFill className="text-red-500 text-5xl" />{" "}
                    ບິນບໍ່ຖຶກຕ້ອງ{" "}
                    {`${new Intl.NumberFormat("ja-JP", {
                      currency: "JPY",
                    }).format(TotalBefore)} ${
                      storeDetail?.firstCurrency
                    } = ${new Intl.NumberFormat("ja-JP", {
                      currency: "JPY",
                    }).format(totalAfter)} ${storeDetail?.firstCurrency}`}{" "}
                    (ປ້ອນເງິນໂອນ ຫຼື ເງິນສົດເກີນ)
                  </span>
                )
              ) : dataModal?.deliveryAmount ? (
                dataModal?.deliveryAmount > 0 ? (
                  <span className="flex items-center text-green-500 gap-2">
                    <FaCircleCheck className="text-green-500 text-5xl" />{" "}
                    ບິນຖຶກຕ້ອງ{" "}
                    {`${new Intl.NumberFormat("ja-JP", {
                      currency: "JPY",
                    }).format(dataModal?.deliveryAmount)}`}{" "}
                    {storeDetail?.firstCurrency}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-red-500">
                    <BsFillExclamationTriangleFill className="text-red-500 text-5xl" />{" "}
                    ບິນບໍ່ຖຶກຕ້ອງ{" "}
                    {`${new Intl.NumberFormat("ja-JP", {
                      currency: "JPY",
                    }).format(dataModal?.deliveryAmount)}`}{" "}
                    {storeDetail?.firstCurrency}
                  </span>
                )
              ) : (
                ""
              )}
            </div>
            <Button
              disabled={
                disabledEditBill ||
                selectOrder?.status === "ACTIVE" ||
                profile?.data?.role != "APPZAP_ADMIN"
              }
              onClick={handleEditBill}
            >
              {selectOrder?.status === "ACTIVE"
                ? t("editingTheBill")
                : t("billEditing")}
            </Button>
          </div>
          <Table striped bordered hover size="sm" style={{ fontSize: 15 }}>
            <thead>
              <tr>
                <th>{t("no")}</th>
                <th>{t("menuname")}</th>
                <th>{t("amount")}</th>
                <th>{t("statusOfFood")}</th>
                <th>{t("servedBy")}</th>
                <th>{t("price")}</th>
                {storeDetail?.isDelivery && <th>DC Code</th>}
                <th>{t("time")}</th>
                <th>ເວລາອັບເດດ</th>
              </tr>
            </thead>
            <tbody>
              {dataModal?.orderId?.map((item, index) => (
                <tr key={1 + index}>
                  <td>{index + 1}</td>
                  <td>{formatMenuName(item?.name, item?.options)}</td>
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
                          : item?.status === "PAID"
                          ? COLOR_APP
                          : item?.status === "PRINTBILL"
                          ? "blue"
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
                    {new Intl.NumberFormat("ja-JP", {
                      currency: "JPY",
                    }).format(
                      item?.totalPrice ??
                        (item?.price + (item?.totalOptionPrice ?? 0)) *
                          item?.quantity
                    )}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    {item?.deliveryCode ? item?.deliveryCode : "-"}
                  </td>

                  <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                  <td>
                    {item?.updatedAt
                      ? moment(item?.updatedAt).format("DD/MM/YYYY HH:mm")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {!dataModal?.deliveryAmount ? (
            <div className="flex justify-end items-center mt-3">
              <div className="w-[260px]">
                <div className="flex justify-between ">
                  <div className="flex flex-col">
                    <span>{t("discount")} : </span>
                    <span>{t("vat")} : </span>
                    <span>{t("cash")} :</span>
                    <span>{t("transferAmount")} :</span>
                    <span>{t("point")}</span>
                    <span>{t("totalPrice2")} :</span>
                    <span>{t("change")} :</span>
                    <span>{t("total_Amount_of_Money")} :</span>
                  </div>
                  <div className="flex flex-col">
                    <span>{renderDiscount(dataModal?.discount)}</span>
                    <span>
                      {moneyCurrency(dataModal?.taxAmount)}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                    <span>
                      {moneyCurrency(
                        dataModal?.payAmount > 0
                          ? dataModal?.payAmount - dataModal?.taxAmount
                          : 0
                      )}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                    <span>
                      {moneyCurrency(
                        dataModal?.transferAmount > 0
                          ? dataModal?.transferAmount - dataModal?.taxAmount
                          : 0
                      )}{" "}
                      {storeDetail?.firstCurrency}
                    </span>

                    <span>
                      {dataModal?.point > 0
                        ? moneyCurrency(dataModal?.point - dataModal?.taxAmount)
                        : 0}
                      {""}
                      {t("point")}
                    </span>

                    <span>
                      {moneyCurrency(TotalAmount)} {storeDetail?.firstCurrency}
                    </span>
                    <span>
                      {moneyCurrency(dataModal?.change)}{" "}
                      {storeDetail?.firstCurrency}{" "}
                    </span>
                    <span>
                      {moneyCurrency(totalAfter)} {storeDetail?.firstCurrency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-end items-center mt-3">
              <div className="w-[260px]">
                <div className="flex justify-between ">
                  <div className="flex flex-col">
                    <span>{t("total_Amount_of_Money")} :</span>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`${
                        dataModal?.deliveryAmount <= 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {moneyCurrency(dataModal?.deliveryAmount)}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
