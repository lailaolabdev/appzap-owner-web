import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { COLOR_APP, END_POINT } from "../../constants";
import { getLocalData } from "../../constants/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { cn } from "../../utils/cn";
import {
  BsFillCalendarWeekFill,
  BsFillCalendarEventFill,
} from "react-icons/bs";
import {
  MdOutlineCloudDownload,
  MdOutlinePieChartOutline,
  MdDining,
} from "react-icons/md";
import { FaChartLine } from "react-icons/fa";

import { AiFillPrinter } from "react-icons/ai";
import Box from "../../components/Box";
import theme from "../../theme";
import { useStore } from "../../store";
import {
  getBankReport,
  getCategoryReport,
  getCurrencyReport,
  getMenuReport,
  getMoneyReportChart,
  getDebtReport,
  getPromotionReport,
  getReports,
  getSalesInformationReport,
  getUserReport,
  getDeliveryReport,
} from "../../services/report";
import { getAllShift } from "../../services/shift";
import { getManyTables } from "../../services/table";
import PopupDaySplitView from "../../components/popup/report/PopupDaySplitView";
import { moneyCurrency } from "../../helpers";
import PopUpSetStartAndEndDateFilterExport from "../../components/popup/PopUpSetStartAndEndDateFilterExport";
import moment from "moment";
import PopUpPrintReport from "../../components/popup/PopUpPrintReport";
import PopUpPrintComponent from "../../components/popup/PopUpPrintComponent";
import BillForReport80 from "../../components/bill/BillForReport80";
import { base64ToBlob } from "../../helpers";
import PopUpPrintStaffHistoryComponent from "../../components/popup/PopUpPrintStaffHistoryComponent";
import PopUpPrintMenuHistoryComponent from "../../components/popup/PopUpPrintMenuHistoryComponent";
import PopUpPrintMenuCategoryHistoryComponent from "../../components/popup/PopUpPrintMenuCategoryHistoryComponent";
import PopUpChooseTableComponent from "../../components/popup/PopUpChooseTableComponent";
import PopUpPrintMenuAndCategoryHistoryComponent from "../../components/popup/PopUpPrintMenuAndCategoryHistoryComponent";
import { getBilldebts } from "../../services/debt";
import Loading from "../../components/Loading";
import { useTranslation } from "react-i18next";
import PopUpReportExportExcel from "../../components/popup/PopUpReportExportExcel";
import { Button, Form, Modal, Nav, Pagination } from "react-bootstrap";
import { useStoreStore } from "../../zustand/storeStore";
import { useShiftStore } from "../../zustand/ShiftStore";
import SellChart from "./SellChart";
import PromotionChart from "./PromotionChart";
import DataBillChart from "./DataBillChart";
import BankChart from "./BankChart";
import StaftChart from "./StaftChart";
import DailyChart from "./DailyChart";
import TypeMenuChart from "./TypeMenuChart";
import { data } from "browserslist";
import MenuChart from "./MenuChart";
import CurrencyChart from "./CurrencyChart";
import DeliveryChart from "./DeliveryChart";

export default function ChartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // state
  const [reportData, setReportData] = useState([]);
  const [salesInformationReport, setSalesInformationReport] = useState();
  const [userReport, setUserReport] = useState([]);
  const [menuReport, setMenuReport] = useState();
  const [categoryReport, setCategoryReport] = useState();
  const [moneyReport, setMoneyReport] = useState();
  const [promotionReport, setPromotionReport] = useState();
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [popup, setPopup] = useState();
  const [tableList, setTableList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [selectedTableIds, setSelectedTableIds] = useState([]);
  const [loadingExportCsv, setLoadingExportCsv] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deliveryReport, setDeliveryReport] = useState([]);
  const [debtReport, setDebtReport] = useState(null);
  const [showChart, setShowChart] = useState(0);

  const [shiftData, setShiftData] = useState([]);
  const [shiftId, setShiftId] = useState([]);

  // provider
  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();
  const { profile } = useStore();
  const { shiftCurrent } = useShiftStore();

  // useEffect
  useEffect(() => {
    getTable();
    fetchShift();
  }, []);

  const fetchShift = async () => {
    await getAllShift()
      .then((res) => {
        setShiftData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getReportData();
    getSalesInformationReportData();
    getUserReportData();
    getMenuReportData();
    getMoneyReportData();
    getDebtReportData();
    getPromotionReportData();
    getCurrencyName();
    getCategoryReportData();
    getBankBillName();
    getDeliveryReports();
  }, [endDate, startDate, endTime, startTime, selectedTableIds, shiftId]);

  // function
  const getTable = async () => {
    const data = await getManyTables(storeDetail?._id);
    setTableList(data);
  };

  const onExportData = async () => {
    setStoreDetail({
      startDateReportExport: startDate,
      endDateReportExport: endDate,
      startTimeReportExport: startTime,
      endTimeReportExport: endTime,
    });
    setPopup({ ReportExport: true });
  };

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

  const getReportData = async () => {
    setLoading(true);
    const data = await getReports(
      storeDetail?._id,
      findByData(),
      selectedTableIds
    );
    setReportData(data);
    setLoading(false);
  };
  const getSalesInformationReportData = async () => {
    setLoading(true);
    const data = await getSalesInformationReport(
      storeDetail?._id,
      findByData(),
      selectedTableIds
    );
    setSalesInformationReport(data);
    setLoading(false);
  };
  const getUserReportData = async () => {
    setLoading(true);
    const data = await getUserReport(
      storeDetail?._id,
      findByData(),
      selectedTableIds
    );
    setUserReport(data);
    setLoading(false);
  };
  const getMenuReportData = async () => {
    setLoading(true);
    const data = await getMenuReport(
      storeDetail?._id,
      findByData(),
      selectedTableIds
    );
    setMenuReport(data);
    setLoading(false);
  };
  const getCategoryReportData = async () => {
    setLoading(true);
    const data = await getCategoryReport(
      storeDetail?._id,
      findByData(),
      selectedTableIds
    );
    setCategoryReport(data);
    setLoading(false);
  };
  const getMoneyReportData = async () => {
    setLoading(true);
    const data = await getMoneyReportChart(
      storeDetail?._id,
      findByData(),
      selectedTableIds
    );
    console.log("getMoneyReportData", data);
    setMoneyReport(data);
    setLoading(false);
  };

  const getDebtReportData = async () => {
    try {
      let findBy = `?storeId=${storeDetail?._id}`;
      if (startDate && endDate) {
        findBy = `${findBy}&startDate=${encodeURIComponent(
          startDate
        )}&startTime=${encodeURIComponent(
          startTime || "00:00:00"
        )}&endDate=${encodeURIComponent(endDate)}&endTime=${encodeURIComponent(
          endTime || "23:59:59"
        )}`;
      }
      const data = await getDebtReport(findBy);
      setDebtReport(data?.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setDebtReport(0);
    }
  };

  const getPromotionReportData = async () => {
    setLoading(true);
    const data = await getPromotionReport(
      storeDetail?._id,
      findByData(),
      selectedTableIds
    );

    setPromotionReport(data);
    setLoading(false);
  };
  const getCurrencyName = async () => {
    setLoading(true);
    // const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getCurrencyReport(
      storeDetail?._id,
      findByData(),
      selectedTableIds
    );
    setCurrencyList(data);
    setLoading(false);
  };
  const getBankBillName = async () => {
    setLoading(true);
    const data = await getBankReport(storeDetail?._id, findByData());
    setBankList(data);
    setLoading(false);
  };

  const getDeliveryReports = async () => {
    setLoading(true);
    const findBy = `?startDate=${startDate}&endDate=${endDate}`;
    const data = await getDeliveryReport(storeDetail?._id, findBy);
    setDeliveryReport(data);
    setLoading(false);
  };
  // console.log("BANK", bankList);

  const deliveryReports = moneyReport?.delivery?.revenueByPlatform?.map((e) => {
    return {
      name: e?._id,
      qty: e?.totalOrders,
      amount: e?.totalRevenue,
    };
  });

  const optionsData = [
    {
      value: {
        shiftID: "ALL",
      },
      label: t("all_shifts"),
    },
    ...(shiftData ?? []).map((item) => {
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
      getUserReportData();
      getMenuReportData();
      getMoneyReportData();
      getPromotionReportData();
      getCurrencyName();
      getCategoryReportData();
      getBankBillName();
      getDeliveryReports();
    } else {
      setShiftId(option?.value?.shiftID);
    }
  };

  const optionChart = [
    {
      value: 0,
      label: t("all_shifts"),
    },
    {
      value: 1,
      label: t("sales_info"),
    },
    {
      value: 2,
      label: t("bill_detial"),
    },
    {
      value: 3,
      label: `${t("sales_info")} ${t("every_day")}`,
    },
    {
      value: 4,
      label: `${t("promotion")}`,
    },
    {
      value: 5,
      label: `${t("menu_type")}`,
    },
    {
      value: 6,
      label: `${t("menu_info")}`,
    },
    {
      value: 7,
      label: `${t("bank_total")}, ${t("staf_info")}, ${t("report_currency")}`,
    },
  ];

  const handleShowChart = (option) => {
    setShowChart(option?.value);
  };

  return (
    <div>
      {loading ? <Loading /> : ""}
      <div className={`${storeDetail?.isStatusCafe ? "p-4 bg-gray-50" : ""}`}>
        <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
          <div style={{ display: "flex", gap: 10 }}>
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
            <div className="flex gap-1 items-center">
              <Select
                placeholder={t("ເລຶອກສະແດງລາຍງານ")}
                className="w-[200px] border-1 border-orange-500"
                options={optionChart}
                onChange={handleShowChart}
              />
            </div>
            {/* <Button
              onClick={() => setPopup({ popUpChooseTableComponent: true })}
            >
              {t("chose_table")}
            </Button> */}
          </div>
          {profile?.data?.role === "APPZAP_ADMIN"
            ? storeDetail?.isShift && (
                <div className="flex gap-1 items-center">
                  {/* <span>{t("chose_shift")} : </span> */}
                  <Select
                    placeholder={t("chose_shift")}
                    className="w-40 border-1 border-orange-500"
                    options={optionsData}
                    onChange={handleSearchInput}
                  />
                </div>
              )
            : ""}
          {/* <Button
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setPopup({ PopupDaySplitView: true })}
          >
            <BsFillCalendarEventFill /> DAY SPLIT VIEW
          </Button> */}
          <div style={{ flex: 1 }} />
          <Button
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setPopup({ printReport: true })}
          >
            <AiFillPrinter /> PRINT
          </Button>
          <Button
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => onExportData()}
          >
            <MdOutlineCloudDownload /> EXPORT
          </Button>
        </div>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr", xs: "1fr" },
            gap: 20,
            gridTemplateRows: "masonry",
          }}
        >
          {showChart === 1 && (
            <Card
              className={cn(
                "flex flex-col overflow-hidden bg-white rounded-xl"
              )}
            >
              {/* <CardHeader className="items-center pb-0 ">
              <CardTitle className="text-2xl">{t("sales_info")}</CardTitle> 
              </CardHeader>*/}
              <CardContent className="flex-1 p-0 ">
                <SellChart data={salesInformationReport} />
              </CardContent>
            </Card>
          )}

          {showChart === 2 &&
            (storeDetail?.isStatusCafe ? (
              <Card className="flex flex-col overflow-hidden bg-white rounded-xl">
                <CardContent className="flex-1 p-0">
                  <DataBillChart data={moneyReport} />
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-2 md:flex-row dmd:flex-row lg:flex-row 2xl:flex-row">
                <Card className="flex flex-col overflow-hidden bg-white rounded-xl w-[850px]">
                  <CardContent className="flex-1 p-0">
                    <DataBillChart data={moneyReport} />
                  </CardContent>
                </Card>
                <Card className="flex flex-col overflow-hidden bg-white rounded-xl w-[400px]">
                  <CardHeader className="items-center pb-0">
                    <CardTitle className="text-xl"> {t("Delivery")}</CardTitle>
                    <CardDescription />
                  </CardHeader>
                  <CardContent className="flex-1 p-0">
                    <DeliveryChart data={deliveryReport} />
                  </CardContent>
                </Card>
              </div>
            ))}

          {showChart === 3 && (
            <Card
              className={cn(
                "flex flex-col overflow-hidden bg-white rounded-xl"
              )}
            >
              {/* <CardHeader className="items-center pb-0">
                <CardTitle className="text-2xl">
                  {" "}
                  {t("sales_info")}
                  {t("every_day")}{" "}
                </CardTitle>
                <CardDescription />
              </CardHeader> */}
              <CardContent className="flex-1 p-0">
                <DailyChart data={reportData} />
              </CardContent>
            </Card>
          )}

          {showChart === 4 && (
            <Card
              className={cn(
                "flex flex-col overflow-hidden bg-white rounded-xl"
              )}
            >
              {/* <CardHeader className="items-center pb-0">
                <CardTitle className="text-2xl"> {t("promotion")}</CardTitle>
                <CardDescription />
              </CardHeader> */}
              <CardContent className="flex-1 p-0">
                <PromotionChart data={promotionReport} />
              </CardContent>
            </Card>
          )}

          {showChart === 5 && (
            <Card
              className={cn(
                "flex flex-col overflow-hidden bg-white rounded-xl"
              )}
            >
              {/* <CardHeader className="items-center pb-0">
                <CardTitle className="text-2xl"> {t("menu_type")}</CardTitle>
                <CardDescription />
              </CardHeader> */}
              <CardContent className="flex-1 p-0">
                <TypeMenuChart data={categoryReport} />
              </CardContent>
            </Card>
          )}
          {showChart === 6 && (
            <Card
              className={cn(
                "flex flex-col overflow-hidden bg-white rounded-xl"
              )}
            >
              {/* <CardHeader className="items-center pb-0">
                <CardTitle className="text-2xl"> {t("menu_info")}</CardTitle>
                <CardDescription />
              </CardHeader> */}
              <CardContent className="flex-1 p-0">
                <MenuChart data={menuReport} />
              </CardContent>
            </Card>
          )}
          {showChart === 7 && (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3 dmd:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3">
              <Card
                className={cn(
                  "flex flex-col overflow-hidden bg-white rounded-xl"
                )}
              >
                <CardHeader className="items-center pb-0">
                  <CardTitle className="text-xl"> {t("bank_total")}</CardTitle>
                  <CardDescription />
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <BankChart data={bankList} />
                </CardContent>
              </Card>
              <Card
                className={cn(
                  "flex flex-col overflow-hidden bg-white rounded-xl"
                )}
              >
                <CardHeader className="items-center pb-0">
                  <CardTitle className="text-xl"> {t("staf_info")}</CardTitle>
                  <CardDescription />
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <StaftChart data={userReport} />
                </CardContent>
              </Card>
              <Card
                className={cn(
                  "flex flex-col overflow-hidden bg-white rounded-xl"
                )}
              >
                <CardHeader className="items-center pb-0">
                  <CardTitle className="text-xl">
                    {" "}
                    {t("report_currency")}
                  </CardTitle>
                  <CardDescription />
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <CurrencyChart data={currencyList} />
                </CardContent>
              </Card>
            </div>
          )}
        </Box>
        {showChart === 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { md: "1fr", xs: "1fr" },
              gap: 20,
              gridTemplateRows: "masonry",
            }}
          >
            <Card
              className={cn(
                "flex flex-col overflow-hidden bg-white rounded-xl"
              )}
            >
              {/* <CardHeader className="items-center pb-0 ">
              <CardTitle className="text-2xl">{t("sales_info")}</CardTitle> 
              </CardHeader>*/}
              <CardContent className="flex-1 p-0 ">
                <SellChart data={salesInformationReport} />
              </CardContent>
            </Card>
            {storeDetail?.isStatusCafe ? (
              <Card className="flex flex-col overflow-hidden bg-white rounded-xl">
                <CardContent className="flex-1 p-0">
                  <DataBillChart data={moneyReport} />
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-2 md:flex-row dmd:flex-row lg:flex-row 2xl:flex-row">
                <Card className="flex flex-col overflow-hidden bg-white rounded-xl w-[850px]">
                  <CardContent className="flex-1 p-0">
                    <DataBillChart data={moneyReport} />
                  </CardContent>
                </Card>
                <Card className="flex flex-col overflow-hidden bg-white rounded-xl w-[400px]">
                  <CardHeader className="items-center pb-0">
                    <CardTitle className="text-xl"> {t("Delivery")}</CardTitle>
                    <CardDescription />
                  </CardHeader>
                  <CardContent className="flex-1 p-0">
                    <DeliveryChart data={deliveryReport} />
                  </CardContent>
                </Card>
              </div>
            )}
            <Card
              className={cn(
                "flex flex-col overflow-hidden bg-white rounded-xl"
              )}
            >
              {/* <CardHeader className="items-center pb-0">
                <CardTitle className="text-2xl">
                  {" "}
                  {t("sales_info")}
                  {t("every_day")}{" "}
                </CardTitle>
                <CardDescription />
              </CardHeader> */}
              <CardContent className="flex-1 p-0">
                <DailyChart data={reportData} />
              </CardContent>
            </Card>

            <Card
              className={cn(
                "flex flex-col overflow-hidden bg-white rounded-xl"
              )}
            >
              {/* <CardHeader className="items-center pb-0">
                <CardTitle className="text-2xl"> {t("promotion")}</CardTitle>
                <CardDescription />
              </CardHeader> */}
              <CardContent className="flex-1 p-0">
                <PromotionChart data={promotionReport} />
              </CardContent>
            </Card>

            <Card
              className={cn(
                "flex flex-col overflow-hidden bg-white rounded-xl"
              )}
            >
              {/* <CardHeader className="items-center pb-0">
                <CardTitle className="text-2xl"> {t("menu_type")}</CardTitle>
                <CardDescription />
              </CardHeader> */}
              <CardContent className="flex-1 p-0">
                <TypeMenuChart data={categoryReport} />
              </CardContent>
            </Card>

            <Card
              className={cn(
                "flex flex-col overflow-hidden bg-white rounded-xl"
              )}
            >
              {/* <CardHeader className="items-center pb-0">
                <CardTitle className="text-2xl"> {t("menu_info")}</CardTitle>
                <CardDescription />
              </CardHeader> */}
              <CardContent className="flex-1 p-0">
                <MenuChart data={menuReport} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-3 dmd:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3">
              <Card
                className={cn(
                  "flex flex-col overflow-hidden bg-white rounded-xl"
                )}
              >
                <CardHeader className="items-center pb-0">
                  <CardTitle className="text-xl"> {t("bank_total")}</CardTitle>
                  <CardDescription />
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <BankChart data={bankList} />
                </CardContent>
              </Card>
              <Card
                className={cn(
                  "flex flex-col overflow-hidden bg-white rounded-xl"
                )}
              >
                <CardHeader className="items-center pb-0">
                  <CardTitle className="text-xl"> {t("staf_info")}</CardTitle>
                  <CardDescription />
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <StaftChart data={userReport} />
                </CardContent>
              </Card>
              <Card
                className={cn(
                  "flex flex-col overflow-hidden bg-white rounded-xl"
                )}
              >
                <CardHeader className="items-center pb-0">
                  <CardTitle className="text-xl">
                    {" "}
                    {t("report_currency")}
                  </CardTitle>
                  <CardDescription />
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <CurrencyChart data={currencyList} />
                </CardContent>
              </Card>
            </div>
          </Box>
        )}
      </div>
      {/* popup */}
      <PopUpPrintComponent
        open={popup?.printReportSale}
        onClose={() => setPopup()}
      >
        <BillForReport80 />
      </PopUpPrintComponent>

      <PopUpPrintStaffHistoryComponent
        open={popup?.printReportStaffSale}
        onClose={() => setPopup()}
      >
        <BillForReport80 />
      </PopUpPrintStaffHistoryComponent>

      <PopUpPrintMenuHistoryComponent
        open={popup?.printReportMenuSale}
        onClose={() => setPopup()}
      >
        <BillForReport80 />
      </PopUpPrintMenuHistoryComponent>

      <PopUpPrintMenuCategoryHistoryComponent
        open={popup?.printReportMenuCategorySale}
        onClose={() => setPopup()}
      >
        <BillForReport80 />
      </PopUpPrintMenuCategoryHistoryComponent>

      <PopUpPrintMenuAndCategoryHistoryComponent
        open={popup?.printReportMenuAndCategorySale}
        onClose={() => setPopup()}
      >
        <BillForReport80 />
      </PopUpPrintMenuAndCategoryHistoryComponent>

      <PopUpPrintReport
        open={popup?.printReport}
        setPopup={setPopup}
        onClose={() => setPopup()}
      />
      <PopUpReportExportExcel
        open={popup?.ReportExport}
        setPopup={setPopup}
        onClose={() => setPopup()}
        shiftId={shiftId}
        shiftData={shiftCurrent[0]}
      />

      <PopUpSetStartAndEndDateFilterExport
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
      <PopUpChooseTableComponent
        open={popup?.popUpChooseTableComponent}
        onClose={() => setPopup()}
        tableList={tableList || []}
        setSelectedTable={setSelectedTableIds}
      />
    </div>
  );
}
