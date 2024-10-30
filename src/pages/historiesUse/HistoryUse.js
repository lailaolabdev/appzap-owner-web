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
  faCertificate,
  faCoins,
  faPeopleArrows,
  faAddressCard,
  faListAlt,
  faPrint,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingAppzap from "../../components/LoadingAppzap";
import PaginationAppzap from "../../constants/PaginationAppzap";
import { useTranslation } from "react-i18next";

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

      let apiUrl = `${END_POINT_SEVER}/v3/logs/skip/${
        page * rowsPerPage
      }/limit/${rowsPerPage}?storeId=${params?.id}&modele=${filtterModele}`;

      if (filtterModele === "historyServiceChange") {
        apiUrl = `${END_POINT_SEVER}/saveservice`;
      }

      const res = await axios.get(apiUrl, { headers });

      if (res?.status < 300) {
        setData(res?.data?.data);
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

  return (
    <div>
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
            <div style={{ width: 8 }}></div> {t("history service change")}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {isLoading ? (
        <LoadingAppzap />
      ) : (
        <div className="col-sm-12" style={{ overflowX: "auto" }}>
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th>{t("no")}</th>
                <th>
                  {filtterModele === "historyServiceChange"
                    ? t("surnameAndLastName")
                    : t("manager_name")}
                </th>
                <th>
                  {filtterModele === "historyServiceChange"
                    ? "ຍອດບິນ"
                    : t("cause")}
                </th>
                <th>
                  {filtterModele === "historyServiceChange"
                    ? `${t("service_charge")} (${serviceChargePercent}%)`
                    : t("detail")}
                </th>
                {filtterModele === "historyServiceChange" && (
                  <th>vat ({taxPercent}%)</th>
                )}
                {filtterModele === "historyServiceChange" && (
                  <th>{t("total_Amount_of_Money")}</th>
                )}
                <th>{t("date_time")}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{page * rowsPerPage + index + 1}</td>
                  <td>
                    {filtterModele === "historyServiceChange"
                      ? `${item.firstName} ${item.lastName}`
                      : item?.user}
                  </td>
                  <td>
                    {filtterModele === "historyServiceChange"
                      ? ` ${formatNumber(item.total)} ກີບ`
                      : item?.reason || "-"}
                  </td>
                  <td>
                    {filtterModele === "historyServiceChange"
                      ? ` ${formatNumber(item.serviceChangeAmount)} ກີບ`
                      : `${item?.eventDetail}`}
                  </td>
                  {filtterModele === "historyServiceChange" && (
                    <td>
                      {formatNumber((item.taxPercent * item.total) / 100)} ກີບ
                    </td>
                  )}
                  {filtterModele === "historyServiceChange" && (
                    <td>{formatNumber(item.totalMustPay)} ກີບ</td>
                  )}
                  <td>
                    {moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
