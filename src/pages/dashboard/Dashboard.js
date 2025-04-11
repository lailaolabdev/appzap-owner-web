import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { Nav, Button, Card } from "react-bootstrap";
import Box from "../../components/Box";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Select from "react-select";
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
import {
  billCancelCafe,
  getCountBills,
  getCountBillsV7,
} from "../../services/bill";
import { getAllShift } from "../../services/shift";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import convertNumber from "../../helpers/convertNumber";
import { fontMap } from "../../utils/font-map";

import { useStoreStore } from "../../zustand/storeStore";
import { useShiftStore } from "../../zustand/ShiftStore";
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
  const [countIsDebtTrue, setCountIsDebtTrue] = useState(0);

  const [shifts, setShift] = useState([]);
  const [shiftId, setShiftId] = useState(null);

  const { storeDetail } = useStoreStore();
  const { shiftCurrent } = useShiftStore();
  const { profile } = useStore();

  const fetchShift = async () => {
    await getAllShift()
      .then((res) => {
        setShift(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchShift();
  }, []);

  // useEffect
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getReportData();
    getSalesInformationReportData();
    getMoneyReportData();
    getPromotionReportData();
    getCountAllBillReportData();
    getCountBillActiveReportData();
    getTotalBillActiveReportData();
  }, [endDate, startDate, endTime, startTime, shiftId]);

  const findByData = () => {
    let findBy = "?";

    if (profile?.data?.role === "APPZAP_ADMIN") {
      findBy += `startDate=${startDate}&`;
      findBy += `endDate=${endDate}&`;
      findBy += `startTime=${startTime}&`;
      findBy += `endTime=${endTime}&`;

      if (shiftId) {
        findBy += `shiftId=${shiftId}&`;
      }
    } else {
      findBy += `startDate=${startDate}&`;
      findBy += `endDate=${endDate}&`;
      findBy += `startTime=${startTime}&`;
      findBy += `endTime=${endTime}&`;
      if (shiftCurrent[0]) {
        findBy += `shiftId=${shiftCurrent[0]?._id}&`;
      }
    }

    return findBy;
  };

  // function
  const getReportData = async () => {
    // const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getReports(storeDetail?._id, findByData());
    setReportData(data);
  };
  const getSalesInformationReportData = async () => {
    const data = await getSalesInformationReport(
      storeDetail?._id,
      findByData()
    );
    setSalesInformationReport(data);
  };

  const getMoneyReportData = async () => {
    const data = await getMoneyReport(storeDetail?._id, findByData());
    setMoneyReport(data);
  };

  const getPromotionReportData = async () => {
    // const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getPromotionReport(storeDetail?._id, findByData());
    setPromotionReport(data);
  };
  const getCountAllBillReportData = async () => {
    const data = await getCountBillsV7(storeDetail?._id, findByData());
    setCountAllBillReport(data);
  };

  const getCountBillActiveReportData = async () => {
    let findBy = "?";
    if (profile?.data?.role === "APPZAP_ADMIN") {
      findBy += `storeId=${storeDetail?._id}&`;
      findBy += `isCheckout=${"false"}&`;
      findBy += `dateFrom=${startDate}&`;
      findBy += `dateTo=${endDate}&`;
      findBy += `timeFrom=${startTime}&`;
      findBy += `timeTo=${endTime}&`;

      if (shiftId) {
        findBy += `shiftId=${shiftId}&`;
      }
    } else {
      findBy += `storeId=${storeDetail?._id}&`;
      findBy += `isCheckout=${"false"}&`;
      findBy += `dateFrom=${startDate}&`;
      findBy += `dateTo=${endDate}&`;
      findBy += `timeFrom=${startTime}&`;
      findBy += `timeTo=${endTime}&`;
      if (shiftCurrent[0]) {
        findBy += `shiftId=${shiftCurrent[0]?._id}&`;
      }
    }

    const data = await getCountBills(findBy);
    setCountBillActiveReport(data);
  };

  const getTotalBillActiveReportData = async () => {
    // const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getTotalBillActiveReport(storeDetail?._id, findByData());

    setTotalBillActiveReport(data);
  };

  const optionsData = [
    {
      value: {
        shiftID: "ALL",
      },
      label: t("all_shifts"),
    },
    ...(shifts ?? []).map((item) => {
      return {
        value: {
          shiftID: item._id,
        },
        label: item.shiftName,
      };
    }),
  ];

  const handleSearchInput = (option) => {
    if (option?.value?.shiftID === "ALL") {
      setShiftId(null);
      getReportData();
      getSalesInformationReportData();
      getMoneyReportData();
      getPromotionReportData();
      getCountAllBillReportData();
      getCountBillActiveReportData();
      getTotalBillActiveReportData();
    } else {
      setShiftId(option?.value?.shiftID);
    }
  };

  const confrimCancelBill = async (body) => {
    try {
      const _res = await billCancelCafe(body);
      if (_res?.status === 200) {
        getReportData();
        getSalesInformationReportData();
        getMoneyReportData();
        getPromotionReportData();
        getCountAllBillReportData();
        getCountBillActiveReportData();
        getTotalBillActiveReportData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const optionsData = shifts?.map((item) => {
  //   // console.log(item);
  //   return {
  //     value: {
  //       startTime: item.startTime,
  //       endTime: item.endTime,
  //       shiftID: item._id,
  //     },
  //     label: item.shiftName,
  //   };
  // });

  // const handleSearchInput = (option) => {
  //   setShiftId(option?.value?.shiftID);
  // };

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
            <FontAwesomeIcon icon={faTable} /> <div style={{ width: 8 }} />
            <span className={fontMap[language]}>{t("tableStatus")}</span>
          </Nav.Link>
        </Nav.Item>
      </Box>
      <div style={{ height: 10 }} />
      <div>
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
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
          {profile?.data?.role === "APPZAP_ADMIN"
            ? storeDetail?.isShift && (
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span>{t("chose_shift")} : </span>
                  <Select
                    placeholder={`${t("plachoder_shift")}...`}
                    className="min-w-[170px] w-full border-orange-500"
                    options={optionsData}
                    onChange={handleSearchInput}
                  />
                </div>
              )
            : ""}
          {/* <div style={{ flex: 1 }} /> */}
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
                {countAllBillReport?.count - countIsDebtTrue || 0} {t("bill")}
              </div>
              <div className={fontMap[language]}>
                {t("total_will_get")}
                {" : "}
                {convertNumber(
                  totalBillActiveReport?.total || 0 +
                    salesInformationReport?.totalSales || 0
                )}
              </div>
              <div className={fontMap[language]}>
                {t("outstandingDebt")}
                {" : "}
                {convertNumber(countBillActiveReport?.count)} {t("bill")}
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
                {convertNumber(moneyReport?.successAmount?.numberOfBills)}{" "}
                {t("bill")}
              </div>
              <div className={fontMap[language]}>
                {t("totalBalance")}
                {" : "}
                {convertNumber(
                  (moneyReport?.successAmount?.payByCash || 0) +
                    (moneyReport?.successAmount?.transferPayment || 0) +
                    (moneyReport?.successAmount?.point || 0)
                )}
                {/* {convertNumber(moneyReport?.successAmount?.totalBalance)} */}
              </div>
              <div className={fontMap[language]}>
                {t("payBycash")}
                {" : "}
                {convertNumber(moneyReport?.successAmount?.payByCash || 0)}
              </div>
              <div className={fontMap[language]}>
                {t("transferPayment")}
                {" : "}
                {convertNumber(moneyReport?.successAmount?.transferPayment || 0)}
              </div>
              <div className={fontMap[language]}>
                {t("money_from_appzap")}
                {" : "}
                {convertNumber(moneyReport?.successAmount?.moneyFromOrdering || 0)}
              </div>

              <div>
                {"Delivery"}
                {" : "}
                {convertNumber(
                  moneyReport?.delivery[0]?.totalRevenue[0]?.totalRevenue || 0
                )}
              </div>
              <div>
                {t("point")}
                {" : "}
                {convertNumber(moneyReport?.successAmount?.point || 0)}
              </div>

              <div>
                {t("cashDiscount")}
                {" : "}
                {convertNumber(promotionReport?.[0]?.totalSaleAmount)}|
                {convertNumber(promotionReport?.[0]?.count)}
                {t("bill")}
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
              {t("bill_not_pay")}
            </Card.Header>
            <Card.Body>
              <div className={fontMap[language]}>
                {t("numberOfBill")}
                {" : "}
                {convertNumber(countBillActiveReport?.count)} {t("bill")}
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
          confrimCancelBill={confrimCancelBill}
          startDate={startDate}
          endDate={endDate}
          startTime={startTime}
          endTime={endTime}
          shiftId={shiftId}
          selectedCurrency={selectedCurrency}
          setCountIsDebtTrue={setCountIsDebtTrue}
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
