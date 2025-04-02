import React, { useEffect, useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { Card, Button } from "react-bootstrap";
import { AiFillPrinter } from "react-icons/ai";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import { MdOutlineCloudDownload } from "react-icons/md";

import { COLOR_APP } from "../../constants";
import Box from "../../components/Box";
import {
  getCategoryReport,
  getMenuReport,
  getMoneyReport,
  getPromotionReport,
  getReports,
  getSalesInformationReport,
  getUserReport,
} from "../../services/report";
import { moneyCurrency } from "../../helpers";
import PopUpSetStartAndEndDateFilterExport from "../../components/popup/PopUpSetStartAndEndDateFilterExport";
import PopUpPrintReport from "../../components/popup/PopUpPrintReport";
import PopUpPrintComponent from "../../components/popup/PopUpPrintComponent";
import BillForReport80 from "../../components/bill/BillForReport80";
import PopUpPrintStaffHistoryComponent from "../../components/popup/PopUpPrintStaffHistoryComponent";
import PopUpPrintMenuHistoryComponent from "../../components/popup/PopUpPrintMenuHistoryComponent";
import PopUpPrintMenuCategoryHistoryComponent from "../../components/popup/PopUpPrintMenuCategoryHistoryComponent";
import PopUpPrintMenuAndCategoryHistoryComponent from "../../components/popup/PopUpPrintMenuAndCategoryHistoryComponent";
import PopUpReportExportExcel from "../../components/popup/PopUpReportExportExcel";
import Loading from "../../components/Loading";

import { useStoreStore } from "../../zustand/storeStore";
import PopUpPrintPromotion from "../../components/popup/PopUpPrintPromotion";

export default function DetailBrancPage() {
  const { t } = useTranslation();
  const { state } = useLocation();

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
  const [loading, setLoading] = useState(false);

  const {
    storeDetail, 
    setStoreDetail,
    updateStoreDetail} = useStoreStore()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getReportData();
    getSalesInformationReportData();
    getUserReportData();
    getMenuReportData();
    getMoneyReportData();
    getPromotionReportData();
    getCategoryReportData();
  }, [
    endDate,
    startDate,
    endTime,
    startTime,
    storeDetail?.branchStartDate,
    storeDetail?.branchEndDate,
    storeDetail?.branchStartTime,
    storeDetail?.branchEndTime,
  ]);

  // function

  const onExportData = async () => {
    setStoreDetail({
      startDateReportExport: startDate,
      endDateReportExport: endDate,
      startTimeReportExport: startTime,
      endTimeReportExport: endTime,
    });
    setPopup({ ReportExport: true });
  };

  const getReportData = async () => {
    setLoading(true);
    let findBy = "";
    if (
      storeDetail?.branchStartDate !== undefined &&
      storeDetail?.branchEndDate !== undefined &&
      storeDetail?.branchStartTime !== undefined &&
      storeDetail?.branchEndTime !== undefined
    ) {
      findBy = `?startDate=${storeDetail?.branchStartDate}&endDate=${storeDetail?.branchEndDate}&endTime=${storeDetail?.branchEndTime}&startTime=${storeDetail?.branchStartTime}`;
    } else {
      findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    }
    const data = await getReports(state?.storeId, findBy);

    if (data.error) {
      setLoading(false);
      return;
    }
    if (data) {
      setLoading(false);
      setReportData(data);
      return;
    }
  };
  const getSalesInformationReportData = async () => {
    setLoading(true);
    let findBy = "";
    if (
      storeDetail?.branchStartDate !== undefined &&
      storeDetail?.branchEndDate !== undefined &&
      storeDetail?.branchStartTime !== undefined &&
      storeDetail?.branchEndTime !== undefined
    ) {
      findBy = `?startDate=${storeDetail?.branchStartDate}&endDate=${storeDetail?.branchEndDate}&endTime=${storeDetail?.branchEndTime}&startTime=${storeDetail?.branchStartTime}`;
    } else {
      findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    }
    const data = await getSalesInformationReport(state?.storeId, findBy);
    if (data.error) {
      setLoading(false);
      return;
    }
    if (data) {
      setSalesInformationReport(data);
      setLoading(false);
      return;
    }
  };
  const getUserReportData = async () => {
    setLoading(true);
    let findBy = "";
    if (
      storeDetail?.branchStartDate !== undefined &&
      storeDetail?.branchEndDate !== undefined &&
      storeDetail?.branchStartTime !== undefined &&
      storeDetail?.branchEndTime !== undefined
    ) {
      findBy = `?startDate=${storeDetail?.branchStartDate}&endDate=${storeDetail?.branchEndDate}&endTime=${storeDetail?.branchEndTime}&startTime=${storeDetail?.branchStartTime}`;
    } else {
      findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    }
    const data = await getUserReport(state?.storeId, findBy);
    if (data.error) {
      setLoading(false);
      return;
    }
    if (data) {
      setLoading(false);
      setUserReport(data);
      return;
    }
  };
  const getMenuReportData = async () => {
    setLoading(true);
    let findBy = "";
    if (
      storeDetail?.branchStartDate !== undefined &&
      storeDetail?.branchEndDate !== undefined &&
      storeDetail?.branchStartTime !== undefined &&
      storeDetail?.branchEndTime !== undefined
    ) {
      findBy = `?startDate=${storeDetail?.branchStartDate}&endDate=${storeDetail?.branchEndDate}&endTime=${storeDetail?.branchEndTime}&startTime=${storeDetail?.branchStartTime}`;
    } else {
      findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    }
    const data = await getMenuReport(state?.storeId, findBy);
    if (data.error) {
      setLoading(false);
      return;
    }
    if (data) {
      setLoading(false);
      setMenuReport(data);
      return;
    }
  };
  const getCategoryReportData = async () => {
    setLoading(true);
    let findBy = "";
    if (
      storeDetail?.branchStartDate !== undefined &&
      storeDetail?.branchEndDate !== undefined &&
      storeDetail?.branchStartTime !== undefined &&
      storeDetail?.branchEndTime !== undefined
    ) {
      findBy = `?startDate=${storeDetail?.branchStartDate}&endDate=${storeDetail?.branchEndDate}&endTime=${storeDetail?.branchEndTime}&startTime=${storeDetail?.branchStartTime}`;
    } else {
      findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    }
    const data = await getCategoryReport(state?.storeId, findBy);
    if (data.error) {
      setLoading(false);
      return;
    }
    if (data) {
      setCategoryReport(data);
      setLoading(false);
      return;
    }
  };
  const getMoneyReportData = async () => {
    setLoading(true);
    let findBy = "";
    if (
      storeDetail?.branchStartDate !== undefined &&
      storeDetail?.branchEndDate !== undefined &&
      storeDetail?.branchStartTime !== undefined &&
      storeDetail?.branchEndTime !== undefined
    ) {
      findBy = `?startDate=${storeDetail?.branchStartDate}&endDate=${storeDetail?.branchEndDate}&endTime=${storeDetail?.branchEndTime}&startTime=${storeDetail?.branchStartTime}`;
    } else {
      findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    }
    const data = await getMoneyReport(state?.storeId, findBy);
    if (data.error) {
      setLoading(false);
      return;
    }
    if (data) {
      setMoneyReport(data);
      setLoading(false);
      return;
    }
  };

  // console.log("moneyReport", moneyReport);

  const getPromotionReportData = async () => {
    setLoading(true);
    let findBy = "";
    if (
      storeDetail?.branchStartDate !== undefined &&
      storeDetail?.branchEndDate !== undefined &&
      storeDetail?.branchStartTime !== undefined &&
      storeDetail?.branchEndTime !== undefined
    ) {
      findBy = `?startDate=${storeDetail?.branchStartDate}&endDate=${storeDetail?.branchEndDate}&endTime=${storeDetail?.branchEndTime}&startTime=${storeDetail?.branchStartTime}`;
    } else {
      findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    }
    const data = await getPromotionReport(state?.storeId, findBy);
    if (data.error) {
      setLoading(false);
      return;
    }
    if (data) {
      setLoading(false);
      setPromotionReport(data);

      return;
    }
  };

  return (
    <>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        {/* <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
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
            {/* <Button
              onClick={() => setPopup({ popUpChooseTableComponent: true })}
            >
              {t("chose_table")}
            </Button> 
          </div>
           <Button
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setPopup({ PopupDaySplitView: true })}
          >
            <BsFillCalendarEventFill /> DAY SPLIT VIEW
          </Button> 
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
        </div> */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
            gap: 20,
            gridTemplateRows: "masonry",
          }}
        >
          {loading && <Loading />}
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {t("sales_info")}
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: `${t("total_sale")}`,
                  amount: `${moneyCurrency(
                    salesInformationReport?.["totalSales"]
                  )}${storeDetail?.firstCurrency}`,
                },

                // {
                //   title: "ລາຍຈ່າຍທັງໝົດ",
                //   amount: `${moneyCurrency(
                //     salesInformationReport?.["totalCost"]
                //   )}${storeDetail?.firstCurrency}`,
                // },

                {
                  title: `${t("business_amount")}`,
                  amount: `${moneyCurrency(
                    salesInformationReport?.["noOfSalesTransactions"]
                  )}`,
                },
                {
                  title: `${t("per_bsn")}`,
                  amount: `${moneyCurrency(
                    salesInformationReport?.["averageSales_Transaction"]
                  )}${storeDetail?.firstCurrency}`,
                },

                // {
                //   title: `${t("paid_lak")}`,
                //   amount: `${moneyCurrency(
                //     salesInformationReport?.["totalCostLAK"]
                //   )} ${t("lak")}`,
                // },
                // {
                //   title: `${t("defult_profit")}`,
                //   amount: `${moneyCurrency(
                //     salesInformationReport?.["grossProfitLAK"]
                //   )}${storeDetail?.firstCurrency}`,
                // },
                // {
                //   title: "ຈຳນວນເງິນທີ່ຖືກຍົກເລີກທັງໝົດ",
                //   amount: `${moneyCurrency(
                //     salesInformationReport?.["unpaidTransaction"]
                //   )}${storeDetail?.firstCurrency}`,
                // },
              ].map((e) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: `1px dotted ${COLOR_APP}`,
                  }}
                  key={e}
                >
                  <div>{e?.title}</div>
                  <div>{e?.amount}</div>
                </div>
              ))}
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
            >
              {t("promotion")}
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: `1px dotted ${COLOR_APP}`,
                }}
              >
                <div>{t("discount_bill")}</div>
                <div>{promotionReport?.[0]?.count || 0}</div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: `1px dotted ${COLOR_APP}`,
                }}
              >
                <div>{t("all_discount")}</div>
                <div>
                  {promotionReport?.[0]?.totalSaleAmount || 0}
                  {storeDetail?.firstCurrency}
                </div>
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
            >
              {t("bill_detial")}
            </Card.Header>
            <Card.Body>
              <table style={{ width: "100%" }}>
                <tr>
                  <th>{t("bill_type")}</th>
                  <th style={{ textAlign: "center" }}>{t("bill_amount")}</th>
                  <th style={{ textAlign: "right" }}>{t("total_price")}</th>
                </tr>
                {[
                  {
                    method: `${t("bill_crash")}`,
                    qty: moneyReport?.cash?.count,
                    amount: moneyReport?.cash?.totalBill,
                  },
                  {
                    method: `${t("tsf_bill")}`,
                    qty: moneyReport?.transfer?.count,
                    amount: moneyReport?.transfer?.totalBill,
                  },
                  {
                    method: (
                      <div>
                        {t("tsf_cash")}
                        <br />
                        {t("cash")}{" "}
                        {moneyCurrency(moneyReport?.transferCash?.cash || 0)} ||
                        {t("transfer")}{" "}
                        {moneyCurrency(
                          moneyReport?.transferCash?.transfer || 0
                        )}
                      </div>
                    ),
                    qty: moneyReport?.transferCash?.count,
                    amount: moneyReport?.transferCash?.totalBill,
                  },
                  {
                    method: (
                      <div style={{ fontWeight: 700 }}>{t("total_cash")}</div>
                    ),
                    qty:
                      (moneyReport?.transferCash?.count || 0) +
                      (moneyReport?.cash?.count || 0),
                    amount:
                      (moneyReport?.transferCash?.cash || 0) +
                      (moneyReport?.cash?.totalBill || 0),
                  },
                  {
                    method: (
                      <div style={{ fontWeight: 700 }}>{t("total_tsf")}</div>
                    ),
                    qty:
                      (moneyReport?.transferCash?.count || 0) +
                      (moneyReport?.transfer?.count || 0),
                    amount:
                      (moneyReport?.transferCash?.transfer || 0) +
                      (moneyReport?.transfer?.totalBill || 0),
                  },
                  {
                    method: <div style={{ fontWeight: 700 }}>{t("total")}</div>,
                    qty:
                      (moneyReport?.cash?.count || 0) +
                      (moneyReport?.transferCash?.count || 0) +
                      (moneyReport?.transfer?.count || 0),
                    amount:
                      (moneyReport?.cash?.totalBill || 0) +
                      (moneyReport?.transferCash?.totalBill || 0) +
                      (moneyReport?.transfer?.totalBill || 0),
                  },
                ].map((e) => (
                  <tr key={e}>
                    <td style={{ textAlign: "left" }}>{e?.method}</td>
                    <td>{moneyCurrency(e?.qty)}</td>
                    <td style={{ textAlign: "right" }}>
                      {moneyCurrency(e?.amount)}
                      {storeDetail?.firstCurrency}
                    </td>
                  </tr>
                ))}
              </table>
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
            >
              {t("staf_info")}
            </Card.Header>
            <Card.Body>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>{t("user")}</th>
                  <th style={{ textAlign: "center" }}>{t("order")}</th>
                  <th style={{ textAlign: "center" }}>{t("order_cancel")}</th>
                  <th style={{ textAlign: "right" }}>{t("total")}</th>
                </tr>
                {userReport?.length > 0 &&
                  userReport?.map((e) => (
                    <tr key={e}>
                      <td style={{ textAlign: "left" }}>{e?.userId?.userId}</td>
                      <td style={{ textAlign: "center" }}>{e?.served}</td>
                      <td style={{ textAlign: "center" }}>{e?.canceled}</td>
                      <td style={{ textAlign: "right" }}>
                        {moneyCurrency(e?.totalSaleAmount)}
                        {storeDetail?.firstCurrency}
                      </td>
                    </tr>
                  ))}
              </table>
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
            >
              {t("sales_info")}
              {t("every_day")}
            </Card.Header>
            <Card.Body>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>{t("date")}</th>
                  <th style={{ textAlign: "center" }}>{t("order")}</th>
                  <th style={{ textAlign: "center" }}>{t("bill_amount")}</th>
                  <th style={{ textAlign: "center" }}>{t("discount")}</th>
                  <th style={{ textAlign: "center" }}>{t("last_amount")}</th>
                  <th style={{ textAlign: "right" }}>{t("total")}</th>
                </tr>
                {reportData.map((e) => (
                  <tr key={e}>
                    <td style={{ textAlign: "left" }}>{e?.date}</td>
                    <td>{e?.order}</td>
                    <td>{e?.bill}</td>
                    <td>
                      {moneyCurrency(e?.discount)}
                      {storeDetail?.firstCurrency}
                    </td>
                    <td>
                      {moneyCurrency(e?.billBefore)}
                      {storeDetail?.firstCurrency}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {moneyCurrency(e?.billAmount)}
                      {storeDetail?.firstCurrency}
                    </td>
                  </tr>
                ))}
              </table>
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
            >
              {t("menu_type")}
            </Card.Header>
            <Card.Body>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>{t("menu_type")}</th>
                  <th style={{ textAlign: "center" }}>{t("order_success")}</th>
                  <th style={{ textAlign: "center" }}>{t("cancel")}</th>
                  <th style={{ textAlign: "right" }}>{t("sale_amount")}</th>
                </tr>
                {categoryReport
                  ?.sort((x, y) => {
                    return y.served - x.served;
                  })
                  ?.map((e) => (
                    <tr key={e}>
                      <td style={{ textAlign: "left" }}>{e?.name}</td>
                      <td style={{ textAlign: "center" }}>{e?.served}</td>
                      <td style={{ textAlign: "center" }}>{e?.cenceled}</td>
                      <td style={{ textAlign: "right" }}>
                        {moneyCurrency(e?.totalSaleAmount)}
                        {storeDetail?.firstCurrency}
                      </td>
                    </tr>
                  ))}
              </table>
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
            >
              {t("menu_info")}
            </Card.Header>
            <Card.Body>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>{t("menu")}</th>
                  <th style={{ textAlign: "center" }}>{t("order_success")}</th>
                  <th style={{ textAlign: "center" }}>{t("cancel")}</th>
                  <th style={{ textAlign: "right" }}>{t("sale_amount")}</th>
                </tr>
                {menuReport
                  ?.sort((x, y) => {
                    return y.served - x.served;
                  })
                  ?.map((e) => (
                    <tr key={e}>
                      <td style={{ textAlign: "left" }}>{e?.name}</td>
                      <td style={{ textAlign: "center" }}>{e?.served || 0}</td>
                      <td style={{ textAlign: "center" }}>
                        {e?.canceled || 0}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {moneyCurrency(e?.totalSaleAmount)}
                        {storeDetail?.firstCurrency}
                      </td>
                    </tr>
                  ))}
              </table>
            </Card.Body>
          </Card>
        </Box>
      </Box>
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

      <PopUpPrintPromotion
        open={popup?.printReportPromotion}
        onClose={() => setPopup()}
      >
        <BillForReport80 />
      </PopUpPrintPromotion>

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
    </>
  );
}
