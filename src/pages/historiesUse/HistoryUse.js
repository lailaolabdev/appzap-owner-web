import React, { useCallback, useEffect, useState } from "react";
// import useReactRouter from "use-react-router"
import { Nav, Table, Modal, Button } from "react-bootstrap";
import moment from "moment";
import { getHeaders } from "../../services/auth";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import AnimationLoading from "../../constants/loading";
import { orderStatus } from "./../../helpers";
import { COLOR_APP } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCertificate,
  faCoins,
  faPeopleArrows,
  faPrint,
  faTable,
  faHistory,
  faAddressCard,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingAppzap from "../../components/LoadingAppzap";
import PaginationAppzap from "../../constants/PaginationAppzap";
import { useTranslation } from "react-i18next";
import { BsBank2 } from "react-icons/bs";

export default function HistoryUse() {
  const { t } = useTranslation();
  const params = useParams();
  const [data, setData] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [filtterModele, setFiltterModele] = useState("checkBill");
  const [selectedCurrency, setSelectedCurrency] = useState("LAK");
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [dataModal, setDataModal] = useState([]);
  const rowsPerPage = 100;
  const [page, setPage] = useState(0);
  const pageAll = totalLogs > 0 ? Math.ceil(totalLogs / rowsPerPage) : 1;

  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const [taxPercent, setTaxPercent] = useState(0);
  const [serviceChargePercent, setServiceChargePercent] = useState(0);

  const getDataTax = async () => {
    const { DATA } = await getLocalData();
    const _res = await axios.get(`${END_POINT_SEVER}/v4/tax/${DATA?.storeId}`);
    setTaxPercent(_res?.data?.taxPercent);
  };

  const getDataServiceCharge = async () => {
    const { DATA } = await getLocalData();
    const _res = await axios.get(
      `${END_POINT_SEVER}/v4/service-charge/${DATA?.storeId}`
    );
    setServiceChargePercent(_res?.data?.serviceCharge);
  };

  useEffect(() => {
    _getdataHistories();
    getDataTax();
    getDataServiceCharge();
  }, []);

  useEffect(() => {
    _getdataHistories();
  }, [page, filtterModele]);

  const _getdataHistories = async () => {
    try {
      const headers = await getHeaders();
      setIsLoading(true);
      let apiUrl;

      if (filtterModele === "historyServiceChange") {
        apiUrl = `${END_POINT_SEVER}/saveservice`;
      } else if (filtterModele === "billPayBefore") {
        apiUrl =
          END_POINT_SEVER +
          `/v3/bills-split/skip/${
            page * rowsPerPage
          }/limit/${rowsPerPage}?storeId=${params?.id}`;
      } else if (filtterModele === "bankTransfer") {
        apiUrl = `${END_POINT_SEVER}/v4/pos/get-call-to-checkouts/skip/${
          page * rowsPerPage
        }/limit/${rowsPerPage}?storeId=${
          params?.id
        }&paymentMethod=BANK_TRANSFER`;
      } else {
        apiUrl = `${END_POINT_SEVER}/v3/logs/skip/${
          page * rowsPerPage
        }/limit/${rowsPerPage}?storeId=${params?.id}&modele=${filtterModele}`;
      }

      const res = await axios.get(apiUrl, { headers });

      if (res?.status < 300) {
        if (filtterModele === "billPayBefore") {
          setData(res?.data);
        } else if (filtterModele === "historyServiceChange") {
          setData(res?.data?.data);
        } else if (filtterModele === "bankTransfer") {
          setData(res?.data);
        } else {
          setData(res?.data?.data);
        }
        setTotalLogs(res?.data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formatNumber = (num) => {
    if (typeof num !== "number" || isNaN(num)) {
      return "-";
    }
    return num.toLocaleString("en-US").replace(/,/g, ".");
  };

  const formatMenuName = (name, options) => {
    const optionNames =
      options?.map((option) => `[${option.name}]`).join(" ") || "";
    return `${name} ${optionNames}`;
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
  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setShow(true);
    setDataModal(item);
  };

  return (
    <div
      style={{
        maxHeight: "100vh",
        height: "100%",
        overflow: "auto",
        padding: "0px 0px 80px 0px",
      }}
    >
      <Nav
        fill
        variant="tabs"
        defaultActiveKey="/checkBill"
        style={{
          fontWeight: "bold",
          backgroundColor: "#f8f8f8",
          border: "none",
          marginBottom: 5,
          overflowX: "scroll",
          display: "flex",
        }}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="/checkBill"
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setFiltterModele("checkBill")}
          >
            <FontAwesomeIcon icon={faTable} /> <div style={{ width: 8 }}></div>{" "}
            {t("calculate_money")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/canceled"
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setFiltterModele("canceled")}
          >
            <FontAwesomeIcon icon={faCoins} /> <div style={{ width: 8 }}></div>{" "}
            {t("order_history")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/print"
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setFiltterModele("print")}
          >
            <FontAwesomeIcon icon={faPrint} /> <div style={{ width: 8 }}></div>{" "}
            {t("printer")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/resetBill"
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setFiltterModele("resetBill")}
          >
            <FontAwesomeIcon icon={faCertificate} />{" "}
            <div style={{ width: 8 }}></div> {t("edit_bill")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/transferTable"
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setFiltterModele("transferTable")}
          >
            <FontAwesomeIcon icon={faPeopleArrows} />{" "}
            <div style={{ width: 8 }}></div> {t("change_combine_table")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/historyServiceChange"
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setFiltterModele("historyServiceChange")}
          >
            <FontAwesomeIcon icon={faHistory} />{" "}
            <div style={{ width: 8 }}></div> {t("history_service_charge")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/billPayBefore"
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setFiltterModele("billPayBefore")}
          >
            <FontAwesomeIcon icon={faListAlt}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div>
            {t("bill_paid")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/bankTransfer"
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setFiltterModele("bankTransfer")}
          >
            <BsBank2 /> <div style={{ width: 8 }}></div>
            {t("bank_transfer_history")}
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {isLoading ? (
        <LoadingAppzap />
      ) : (
        <div className="col-sm-12" style={{ overflowX: "auto" }}>
          {filtterModele === "billPayBefore" ? (
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
                      {t("price")}
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
                  {data?.map((item, index) => (
                    <tr
                      key={"finance-" + index}
                      onClick={() => {
                        // setSelectOrder(item);
                        handleShow(item?.orderId);
                      }}
                    >
                      <td>{page * rowsPerPage + index + 1}</td>
                      <td>{item?.tableId?.name ?? "-"}</td>
                      <td>{item?.code}</td>
                      <td>
                        {["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
                          ? new Intl.NumberFormat("ja-JP", {
                              currency: "JPY",
                            }).format(_countAmount(item?.orderId))
                          : new Intl.NumberFormat("ja-JP", {
                              currency: "JPY",
                            }).format(
                              item?.payAmount +
                                item?.taxAmount +
                                item?.serviceChargeAmount
                            )}{" "}
                        {selectedCurrency}
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
              ></div>
            </div>
          ) : filtterModele === "bankTransfer" ? (
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("no")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("tableNumber")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("tableCode")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("amount")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("detail")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("status")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("date_time")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ textWrap: "nowrap" }}>
                        {page * rowsPerPage + index + 1}
                      </td>
                      <td style={{ textWrap: "nowrap" }}>
                        {item?.tableName ?? "-"}
                      </td>
                      <td style={{ textWrap: "nowrap" }}>
                        {item?.code ?? "-"}
                      </td>
                      <td style={{ textWrap: "nowrap" }}>
                        {item?.totalAmount
                          ? `${item?.totalAmount.toLocaleString()} ${
                              item?.currency ?? "LAK"
                            }`
                          : "-"}
                      </td>
                      <td style={{ textWrap: "nowrap" }}>
                        {t("checkout") ?? "-"}
                      </td>
                      <td style={{ textWrap: "nowrap" }}>
                        {t(item.status) ?? "-"}
                      </td>
                      <td style={{ textWrap: "nowrap" }}>
                        {moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("no")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {filtterModele === "historyServiceChange"
                      ? t("surnameAndLastName")
                      : t("manager_name")}
                  </th>
                  {/* <th scope="col">ສະຖານະ</th> */}
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {filtterModele === "historyServiceChange"
                      ? `${t("service_charge")} (${serviceChargePercent}%)`
                      : t("detail")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {filtterModele === "historyServiceChange"
                      ? t("billamount")
                      : t("cause")}
                  </th>
                  {filtterModele === "historyServiceChange" && (
                    <th>VAT ({taxPercent}%)</th>
                  )}
                  {filtterModele === "historyServiceChange" && (
                    <th>{t("total_Amount_of_Money")}</th>
                  )}

                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("date_time")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ textWrap: "nowrap" }}>
                        {page * rowsPerPage + index + 1}
                      </td>
                      <td style={{ textWrap: "nowrap" }}>
                        {filtterModele === "historyServiceChange"
                          ? `${item.firstName} ${item.lastName}`
                          : item?.user}
                      </td>
                      {/* <td
                      style={{
                        color: item?.event === "INFO" ? "green" : "red",
                      }}
                    >
                      {item?.event}
                    </td> */}
                      <td style={{ textWrap: "nowrap" }}>
                        {filtterModele === "historyServiceChange"
                          ? ` ${formatNumber(item.serviceChangeAmount)} ກີບ`
                          : `${item?.eventDetail}`}
                      </td>
                      <td style={{ textWrap: "nowrap" }}>
                        {filtterModele === "historyServiceChange"
                          ? ` ${formatNumber(item.total)} ກີບ`
                          : item?.reason === null ||
                            item?.reason === "" ||
                            item?.reason === undefined ||
                            item?.reason === "undefined" ||
                            item?.reason === "null"
                          ? "-"
                          : item?.reason}
                      </td>
                      {filtterModele === "historyServiceChange" && (
                        <td>
                          {formatNumber((item.taxPercent * item.total) / 100)}{" "}
                          ກີບ
                        </td>
                      )}
                      {filtterModele === "historyServiceChange" && (
                        <td>{formatNumber(item.totalMustPay)} ກີບ</td>
                      )}

                      <td style={{ textWrap: "nowrap" }}>
                        {moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <PaginationAppzap
            rowsPerPage={rowsPerPage}
            page={page}
            pageAll={pageAll}
            onPageChange={handleChangePage}
          />
        </div>
      )}
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("menuModal")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover size="sm" style={{ fontSize: 15 }}>
            <thead>
              <tr>
                <th>{t("no")}</th>
                <th>{t("menuname")}</th>
                <th>{t("amount")}</th>
                <th>{t("statusOfFood")}</th>
                <th>{t("servedBy")}</th>
                <th>{t("price")}</th>
                <th>{t("time")}</th>
                <th>{t("updated_at")}</th>
              </tr>
            </thead>
            <tbody>
              {dataModal.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.name}</td>
                  <td>{item?.quantity}</td>
                  <td>{item?.status}</td>
                  <td>{item?.createdBy?.firstname || "-"}</td>
                  <td>
                    {new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
                      item?.totalPrice ||
                        (item?.price + (item?.totalOptionPrice || 0)) *
                          item?.quantity
                    )}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShow(false)}>
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
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
          ></div>
          <Table striped bordered hover size="sm" style={{ fontSize: 15 }}>
            <thead>
              <tr>
                <th>{t("no")}</th>
                <th>{t("menuname")}</th>
                <th>{t("amount")}</th>
                <th>{t("statusOfFood")}</th>
                <th>{t("servedBy")}</th>
                <th>{t("price")}</th>
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
