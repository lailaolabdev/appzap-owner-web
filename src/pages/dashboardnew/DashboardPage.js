import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Button } from "react-bootstrap";
import { COLOR_APP, END_POINT } from "../../constants";
import {
  BsFillCalendarWeekFill,
  BsFillCalendarEventFill,
} from "react-icons/bs";
import { MdOutlineCloudDownload } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import Box from "../../components/Box";
import { useStore } from "../../store";
import {
  getBankReport,
  getCategoryReport,
  getCurrencyReport,
  getMenuReport,
  getMoneyReport,
  getPromotionReport,
  getReports,
  getSalesInformationReport,
  getUserReport,
} from "../../services/report";
import fileDownload from "js-file-download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
import { errorAdd } from "../../helpers/sweetalert";
import Axios from "axios";
import { END_POINT_EXPORT } from "../../constants/api";
import { useTranslation } from "react-i18next";
import PopUpReportExportExcel from "../../components/popup/PopUpReportExportExcel";

export default function DashboardPage() {
  const { t } = useTranslation();
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

  // provider
  const { storeDetail, setStoreDetail } = useStore();

  // useEffect
  useEffect(() => {
    getTable();
  }, []);
  useEffect(() => {
    getReportData();
    getSalesInformationReportData();
    getUserReportData();
    getMenuReportData();
    getMoneyReportData();
    getPromotionReportData();
    getCurrencyName();
    getCategoryReportData();
    getBankBillName();
  }, [endDate, startDate, endTime, startTime, selectedTableIds]);

  // function
  const getTable = async () => {
    const data = await getManyTables(storeDetail?._id);
    setTableList(data);
  };

  const onExportData = async () => {
    setStoreDetail({
      ...storeDetail,
      startDateReportExport: startDate,
      endDateReportExport: endDate,
      startTimeReportExport: startTime,
      endTimeReportExport: endTime,
    });
    setPopup({ ReportExport: true });
  };

  const getReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getReports(storeDetail?._id, findBy, selectedTableIds);
    setReportData(data);
  };
  const getSalesInformationReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getSalesInformationReport(
      storeDetail?._id,
      findBy,
      selectedTableIds
    );
    setSalesInformationReport(data);
  };
  const getUserReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getUserReport(
      storeDetail?._id,
      findBy,
      selectedTableIds
    );
    setUserReport(data);
  };
  const getMenuReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getMenuReport(
      storeDetail?._id,
      findBy,
      selectedTableIds
    );
    setMenuReport(data);
  };
  const getCategoryReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getCategoryReport(
      storeDetail?._id,
      findBy,
      selectedTableIds
    );
    setCategoryReport(data);
  };
  const getMoneyReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getMoneyReport(
      storeDetail?._id,
      findBy,
      selectedTableIds
    );
    setMoneyReport(data);
  };

  const getPromotionReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getPromotionReport(
      storeDetail?._id,
      findBy,
      selectedTableIds
    );
    setPromotionReport(data);
  };
  const downloadCsv = async () => {
    try {
      const findBy = `&dateFrom=${startDate}&dateTo=${endDate}&timeTo=${endTime}&timeFrom=${startTime}`;
      setLoadingExportCsv(true);
      const url =
        END_POINT_EXPORT + "/export/bill?storeId=" + storeDetail?._id + findBy;
      const _res = await Axios.get(url);
      // fileDownload(_res.data, storeDetail?.name + ".csv" || "export.csv");
      setLoadingExportCsv(false);
    } catch (err) {
      setLoadingExportCsv(false);
      errorAdd(`${t("export_fail")}`);
    }
  };

  const downloadExcel = async () => {
    try {
      const findBy = `&dateFrom=${startDate}&dateTo=${endDate}&timeTo=${endTime}&timeFrom=${startTime}`;
      setLoadingExportCsv(true);
      const url =
        END_POINT_EXPORT + "/export/bill?storeId=" + storeDetail?._id + findBy;
      const _res = await Axios.get(url);

      if (_res?.data?.exportUrl) {
        const response = await Axios.get(_res?.data?.exportUrl, {
          responseType: "blob", // Important to get the response as a Blob
        });

        // Create a Blob from the response data
        console.log("response", response.data);
        const fileBlob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Use the file-saver library to save the file with a new name
        saveAs(fileBlob, storeDetail?.name + ".xlsx" || "export.xlsx");
      }

      setLoadingExportCsv(false);
    } catch (err) {
      setLoadingExportCsv(false);
      errorAdd(`${t("export_fail")}`);
    }
  };
  return (
    <>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        {/* <Breadcrumb>
          <Breadcrumb.Item>ລາຍງານ</Breadcrumb.Item>
          <Breadcrumb.Item active>ລາຍງານຍອດຂາຍ</Breadcrumb.Item>
        </Breadcrumb> */}
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
            <Button
              onClick={() => setPopup({ popUpChooseTableComponent: true })}
            >
              {t("chose_table")}
            </Button>
          </div>
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
            gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
            gap: 20,
            gridTemplateRows: "masonry",
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
                    method: `${t("service_charge")}`,
                    qty: moneyReport?.serviceAmount?.count,
                    amount: Math.floor(
                      moneyReport?.serviceAmount?.totalServiceCharge
                    ),
                  },
                  {
                    method: `${t("tax")}`,
                    qty: moneyReport?.taxAmount?.count,
                    amount: Math.floor(moneyReport?.taxAmount?.totalTax),
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
                  {
                    method: (
                      <div style={{ fontWeight: 700 }}>
                        {t("total_tax_service_charge")}
                      </div>
                    ),
                    qty:
                      (moneyReport?.serviceAmount?.count || 0) +
                      (moneyReport?.taxAmount?.count || 0),
                    amount:
                      (Math.floor(
                        moneyReport?.serviceAmount?.totalServiceCharge
                      ) || 0) +
                      (Math.floor(moneyReport?.taxAmount?.totalTax) || 0),
                  },
                ].map((e) => (
                  <tr>
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
              {t("bank_total")}
            </Card.Header>
            <Card.Body>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>{t("no")}</th>
                  <th style={{ textAlign: "center" }}>{t("bank_Name")}</th>
                  <th style={{ textAlign: "right" }}>{t("amount")}</th>
                </tr>
                {bankList?.data?.map((e, index) => (
                  <tr>
                    <td style={{ textAlign: "left" }}>{index + 1}</td>
                    <td style={{ textAlign: "center" }}>
                      {e?.bankDetails.bankName}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {moneyCurrency(e?.bankTotalAmount)}
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
                    <tr>
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
                  <tr>
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
                    <tr>
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
                    <tr>
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
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {t("all_curency")}
            </Card.Header>
            <Card.Body>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>{t("no")}</th>
                  <th style={{ textAlign: "center" }}>{t("code")}</th>
                  <th style={{ textAlign: "center" }}>{t("ccrc")}</th>
                  <th style={{ textAlign: "right" }}>{t("amount")}</th>
                </tr>
                {currencyList?.data?.map((e, index) => (
                  <tr>
                    <td style={{ textAlign: "left" }}>{index + 1}</td>
                    <td style={{ textAlign: "center" }}>
                      {e?.currency.currencyCode}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {e?.currency.currencyName}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {moneyCurrency(Math.floor(e?.currencyTotal))}
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
      <PopUpChooseTableComponent
        open={popup?.popUpChooseTableComponent}
        onClose={() => setPopup()}
        tableList={tableList || []}
        setSelectedTable={setSelectedTableIds}
      />
    </>
  );
}
