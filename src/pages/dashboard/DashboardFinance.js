import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { Table, Modal, Button, Pagination } from "react-bootstrap";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
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
import Loading from "../../components/Loading";
import ReactPaginate from "react-paginate";
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
                delivery
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("name")} platform
              </th>
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
                <td>
                  {["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
                    ? new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(_countAmount(item?.orderId))
                    : new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(item?.deliveryAmount)}{" "}
                  {storeDetail?.firstCurrency}
                </td>
                <td>{item?.deliveryName ? item?.deliveryName : "--"}</td>
                <td>
                  {["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
                    ? new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(_countAmount(item?.orderId))
                    : new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(
                        item?.billAmount +
                          item?.taxAmount +
                          item?.serviceChargeAmount
                      )}{" "}
                  {storeDetail?.firstCurrency}
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
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 10,
            }}
          >
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
                <th>DC Code</th>
                <th>{t("time")}</th>
                <th>ເວລາອັບເດດ</th>
              </tr>
            </thead>
            <tbody>
              {dataModal
                // ?.filter((item) => item?.status !== "PAID")
                .map((item, index) => (
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
                    <td>
                      {item?.createdBy ? item?.createdBy?.firstname : "-"}
                    </td>
                    <td>
                      {new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(
                        item?.totalPrice ??
                          (item?.price + (item?.totalOptionPrice ?? 0)) *
                            item?.quantity
                      )}
                    </td>
                    <td>{item?.deliveryCode ? `${item?.deliveryCode}` : ""}</td>
                    <td>
                      {moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td>
                      {item?.updatedAt
                        ? moment(item?.updatedAt).format("DD/MM/YYYY HH:mm")
                        : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
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
