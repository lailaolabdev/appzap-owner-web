import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { Nav, Button, Card } from "react-bootstrap";
import Box from "../../components/Box";
import { useTranslation } from "react-i18next";
import axios from "axios";

import {
  faCertificate,
  faCoins,
  faPeopleArrows,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DashboardMenu from "./DashboardMenu";
import DashboardCategory from "./DashboardCategory";
import DashboardFinance from "./DashboardFinance";
import MoneyChart from "./MoneyChart";
import DashboardUser from "./DashboardUser";
import "./index.css";
import useQuery from "../../helpers/useQuery";
import { COLOR_APP } from "../../constants";
import ButtonDownloadCSV from "../../components/button/ButtonDownloadCSV";
import { END_POINT_SEVER } from "../../constants/api";
import { useStore } from "../../store";
import { MdOutlineCloudDownload } from "react-icons/md";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import {
  getMoneyReport,
  getPromotionReport,
  getReports,
  getSalesInformationIgnoreCheckoutReport,
  getSalesInformationReport,
  getTotalBillActiveReport,
} from "../../services/report";
import { getCountBills } from "../../services/bill";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import convertNumber from "../../helpers/convertNumber";
import { fontMap } from "../../utils/font-map";

import { useStoreStore } from "../../zustand/storeStore";
import theme from "../../theme";

export default function Dashboard() {
  const { accessToken } = useQuery();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const newDate = new Date();

  // state
  const [reportData, setReportData] = useState([]); // ຂໍ້ມູນລາຍງານ
  const [salesInformationReport, setSalesInformationReport] = useState();
  const [totalBillActiveReport, setTotalBillActiveReport] = useState();
  const [promotionReport, setPromotionReport] = useState();
  const [countAllBillReport, setCountAllBillReport] = useState();
  const [countBillActiveReport, setCountBillActiveReport] = useState();
  const [moneyReport, setMoneyReport] = useState();
  const [currency, setcurrency] = useState([]);
  const [popup, setPopup] = useState();
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [selectedCurrency, setSelectedCurrency] = useState("LAK");
  const [changeUi, setChangeUi] = useState("CHECKBILL");
  const [changeText, setChangeText] = useState("CLICK1");

  const { storeDetail } = useStoreStore();

  // useEffect
  useEffect(() => {
    getReportData();
    getSalesInformationReportData();
    getMoneyReportData();
    getPromotionReportData();
    getCountAllBillReportData();
    getCountBillActiveReportData();
    getTotalBillActiveReportData();
  }, [endDate, startDate, endTime, startTime]);

  // function
  const _click1day = () => {
    setStartDate(moment(moment(newDate).add(-1, "days")).format("YYYY-MM-DD"));
    setEndDate(moment(moment(newDate)).format("YYYY-MM-DD"));
  };
  const _click7days = () => {
    setStartDate(moment(moment(newDate).add(-7, "days")).format("YYYY-MM-DD"));
    setEndDate(moment(moment(newDate)).format("YYYY-MM-DD"));
  };
  const _click30days = () => {
    setStartDate(moment(moment(newDate).add(-30, "days")).format("YYYY-MM-DD"));
    setEndDate(moment(moment(newDate)).format("YYYY-MM-DD"));
  };
  const getReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getReports(storeDetail?._id, findBy);
    setReportData(data);
  };
  const getSalesInformationReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getSalesInformationReport(storeDetail?._id, findBy);
    setSalesInformationReport(data);
  };
  const getMoneyReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getMoneyReport(storeDetail?._id, findBy);
    setMoneyReport(data);
  };
  const getPromotionReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getPromotionReport(storeDetail?._id, findBy);
    setPromotionReport(data);
  };
  const getCountAllBillReportData = async () => {
    const findBy = `?storeId=${storeDetail?._id}&dateFrom=${startDate}&dateTo=${endDate}&timeTo=${endTime}&timeFrom=${startTime}`;
    const data = await getCountBills(findBy);
    setCountAllBillReport(data);
  };

  const getCountBillActiveReportData = async () => {
    const findBy = `?storeId=${storeDetail?._id}&isCheckout=false&dateFrom=${startDate}&dateTo=${endDate}&timeTo=${endTime}&timeFrom=${startTime}`;
    const data = await getCountBills(findBy);
    setCountBillActiveReport(data);
  };

  const getTotalBillActiveReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getTotalBillActiveReport(storeDetail?._id, findBy);

    setTotalBillActiveReport(data);
  };

  return (
    <div
      style={{
        overflow: "auto",
        maxHeight: "100vh",
        padding: "10px 10px 80px 10px",
      }}
    >
      <Box
        sx={{
          fontWeight: "bold",
          backgroundColor: "#f8f8f8",
          border: "none",
          display: "grid",
          gridTemplateColumns: {
            md: "repeat(5,1fr)",
            sm: "repeat(3,1fr)",
            xs: "repeat(2,1fr)",
          },
        }}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="/home"
            style={{
              color: COLOR_APP,
              backgroundColor: changeUi === "CHECKBILL" ? theme.mutedColor : "",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setChangeUi("CHECKBILL")}
          >
            <FontAwesomeIcon icon={faTable}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div>
            <span className={fontMap[language]}>{t("tableStatus")}</span>
          </Nav.Link>
        </Nav.Item>
        {/* <Nav.Item>
          <Nav.Link
            eventKey="/finance"
            style={{
              color: "#FB6E3B",
              backgroundColor: changeUi === "MONEY_CHART" ? "#FFDBD0" : "",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setChangeUi("MONEY_CHART")}
          >
            <FontAwesomeIcon icon={faCoins}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div> {t("financialStatic")}
          </Nav.Link>
        </Nav.Item> */}
      </Box>
      <div style={{ height: 10 }}></div>
      <div>
        <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
          <Button
            variant="outline-primary"
            size="small"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setPopup({ popupfiltter: true })}
          >
            <BsFillCalendarWeekFill />
            <div>
              {startDate} {startTime}
            </div>{" "}
            ~{" "}
            <div>
              {endDate} {endTime}
            </div>
          </Button>
          {/* <Button
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setPopup({ PopupDaySplitView: true })}
          >
            <BsFillCalendarEventFill /> DAY SPLIT VIEW
          </Button> */}
          <div style={{ flex: 1 }} />
        </div>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              md: "1fr 1fr 1fr",
              sm: "1fr 1fr",
              xs: "1fr",
            },
            gap: 10,
          }}
        >
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
              className={fontMap[language]}
            >
              {t("all_amount")}
            </Card.Header>
            <Card.Body>
              <div className={fontMap[language]}>
                {t("numberOfBill")}
                {" : "}
                {countAllBillReport?.count} ບິນ
              </div>
              <div className={fontMap[language]}>
                {t("total_will_get")}
                {" : "}
                {convertNumber(
                  totalBillActiveReport?.total +
                    salesInformationReport?.totalSales
                )}
              </div>
              <div className={fontMap[language]}>
                {t("outstandingDebt")}
                {" : "}
                {convertNumber(countBillActiveReport?.count)} ບິນ
              </div>
              <div className={fontMap[language]}>
                {t("money_crash")}
                {" : "}
                {convertNumber(totalBillActiveReport?.total)}
              </div>
            </Card.Body>
          </Card>

          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
              className={fontMap[language]}
            >
              {t("success_amount")}
            </Card.Header>
            <Card.Body>
              <div className={fontMap[language]}>
                {t("numberOfBill")}
                {" : "}
                {convertNumber(moneyReport?.successAmount?.numberOfBills)} ບິນ
              </div>
              <div className={fontMap[language]}>
                {t("totalBalance")}
                {" : "}
                {convertNumber(moneyReport?.successAmount?.totalBalance)}
              </div>
              <div className={fontMap[language]}>
                {t("payBycash")}
                {" : "}
                {convertNumber(moneyReport?.successAmount?.payByCash)}
              </div>
              <div className={fontMap[language]}>
                {t("transferPayment")}
                {" : "}
                {convertNumber(moneyReport?.successAmount?.transferPayment)}
              </div>
              {moneyReport?.delivery[0]?.totalRevenue[0]?.totalRevenue > 0 && (
                <div>
                  {"Delivery"}
                  {" : "}
                  {convertNumber(
                    moneyReport?.delivery[0]?.totalRevenue[0]?.totalRevenue || 0
                  )}
                </div>
              )}

              {moneyReport?.successAmount?.point > 0 && (
                <div>
                  {t("point")}
                  {" : "}
                  {convertNumber(moneyReport?.successAmount?.point || 0)}
                </div>
              )}

              <div>
                {t("cashDiscount")}
                {" : "}
                {convertNumber(promotionReport?.[0]?.totalSaleAmount)}|
                {convertNumber(promotionReport?.[0]?.count)}ບິນ
              </div>
            </Card.Body>
          </Card>
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
              className={fontMap[language]}
            >
              {t("bill_crash")}
            </Card.Header>
            <Card.Body>
              <div className={fontMap[language]}>
                {t("numberOfBill")}
                {" : "}
                {convertNumber(countBillActiveReport?.count)} ບິນ
              </div>
              <div className={fontMap[language]}>
                {t("money_crash")}
                {" : "}
                {convertNumber(totalBillActiveReport?.total)}
              </div>
            </Card.Body>
          </Card>
        </Box>
      </div>
      {changeUi === "MONEY_CHART" && (
        <MoneyChart
          startDate={startDate}
          endDate={endDate}
          selectedCurrency={selectedCurrency}
        />
      )}
      {changeUi === "CHECKBILL" && (
        <DashboardFinance
          startDate={startDate}
          endDate={endDate}
          startTime={startTime}
          endTime={endTime}
          selectedCurrency={selectedCurrency}
        />
      )}
      {changeUi === "MENUS" && (
        <DashboardMenu
          startDate={startDate}
          endDate={endDate}
          selectedCurrency={selectedCurrency}
        />
      )}
      {changeUi === "CATEGORY" && (
        <DashboardCategory
          startDate={startDate}
          endDate={endDate}
          selectedCurrency={selectedCurrency}
        />
      )}
      {changeUi === "STAFF" && (
        <DashboardUser
          startDate={startDate}
          endDate={endDate}
          selectedCurrency={selectedCurrency}
        />
      )}
      <PopUpSetStartAndEndDate
        open={popup?.popupfiltter}
        onClose={() => setPopup()}
        startDate={startDate}
        setStartDate={setStartDate}
        setStartTime={setStartTime}
        startTime={startTime}
        setEndDate={setEndDate}
        setEndTime={setEndTime}
        endTime={endTime}
        endDate={endDate}
      />
    </div>
  );
}

const Option = styled.option`
  cursor: pointer;
  padding: 10px;
  &:hover {
    background-color: #ffffff !important;
  }
`;
