import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Card, Breadcrumb, Button, Modal } from "react-bootstrap";
import { COLOR_APP, END_POINT } from "../../constants";
import { getLocalData } from "../../constants/api";
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
  getDebtReport,
  getPromotionReport,
  getReports,
  getSalesInformationReport,
  getUserReport,
  getDeliveryReport,
  getPromotionReportDisCountAndFree,
} from "../../services/report";
import { getAllShift } from "../../services/shift";
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
import { getBilldebts } from "../../services/debt";

import { BsArrowDownRightSquare } from "react-icons/bs";
import Loading from "../../components/Loading";
import { errorAdd } from "../../helpers/sweetalert";
import Axios from "axios";
import { END_POINT_EXPORT } from "../../constants/api";
import { useTranslation } from "react-i18next";
import PopUpReportExportExcel from "../../components/popup/PopUpReportExportExcel";

import { useStoreStore } from "../../zustand/storeStore";
import { useShiftStore } from "../../zustand/ShiftStore";
import PopUpPrintPromotion from "../../components/popup/PopUpPrintPromotion";

import matchRoundNumber from "../../helpers/matchRound";

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
  const [promotionDiscountAndFreeReport, setPromotionDiscountAndFreeReport] =
    useState();
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

  const [dataFreeItems, setDataFreeItems] = useState([]);
  const [dataDiscountItems, setDataDiscountItems] = useState([]);
  const [openModalFree, setOpenModalFree] = useState(false);
  const [openModalDiscount, setOpenModalDiscount] = useState(false);
  const [openModalExchange, setOpenModalExchange] = useState(false);

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
    getPromotionDiscountAndFreeReportData();
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
      if (shiftCurrent?.[0]) {
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
    const data = await getMoneyReport(
      storeDetail?._id,
      findByData(),
      selectedTableIds
    );
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
      const data = await getDebtReport(findByData());
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
  const getPromotionDiscountAndFreeReportData = async () => {
    setLoading(true);
    const data = await getPromotionReportDisCountAndFree(
      storeDetail?._id,
      findByData(),
      selectedTableIds
    );
    setPromotionDiscountAndFreeReport(data);
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
        // console.log("response", response.data);
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

  const deliveryReports = moneyReport?.delivery[0]?.revenueByPlatform?.map(
    (e) => {
      return {
        name: e?._id,
        qty: e?.totalOrders,
        amount: e?.totalRevenue,
      };
    }
  );
  const delivery = moneyReport?.delivery[0];

  const totalRevenues = delivery && delivery?.totalRevenue && delivery?.totalRevenue[0]
  ? delivery?.totalRevenue[0]?.totalRevenue || 0 
  : 0;


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
      getPromotionDiscountAndFreeReportData();
    } else {
      setShiftId(option?.value?.shiftID);
    }
  };
  // const optionsData = shiftData?.map((item) => {
  //   // console.log(item);
  //   return {
  //     value: {
  //       startTime: item.startTime,
  //       endTime: item.endTime,
  //       id: item._id,
  //     },
  //     label: item.shiftName,
  //   };
  // });

  // const handleSearchInput = (option) => {
  //   setShiftId(option?.value?.id);
  // };

  // console.log("promotionDiscountAndFreeReport", promotionDiscountAndFreeReport);

  const handleGetDataFree = (data) => {
    setOpenModalFree(true);
    setDataFreeItems(data);
  };
  const handleGetDataDiscount = (data) => {
    setOpenModalDiscount(true);
    setDataDiscountItems(data);
  };

  const handleGetDataExchangePoint = (data) => {
    setOpenModalExchange(true);
    // setDataDiscountItems(data);
  };

  const TotalPriceFreeItems = () => {
    return dataFreeItems?.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.price;
    }, 0);
  };

  const TotalPriceDicount = () => {
    return dataDiscountItems?.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.priceDiscount;
    }, 0);
  };

  const calculateTotals = () => {
    // Check if exchangePointDetails exists and is an array before reducing
    if (
      !moneyReport?.exchangePointDetails ||
      moneyReport?.exchangePointDetails.length === 0
    ) {
      return { totalExchangePoint: 0, totalPrice: 0 }; // Return default values if no data
    }

    return moneyReport.exchangePointDetails.reduce(
      (totals, store) => {
        // Sum up the exchangePoint
        totals.totalExchangePoint += store.exchangePoint;

        // Sum up the price for menuDetails (price * quantity)
        store.menuDetails.forEach((menuItem) => {
          totals.totalPrice += menuItem.price * menuItem.quantity;
        });

        return totals;
      },
      { totalExchangePoint: 0, totalPrice: 0 } // Initial values
    );
  };

  const { totalExchangePoint, totalPrice } = calculateTotals();

  return (
    <div>
      {loading ? <Loading /> : ""}
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
          {profile?.data?.role === "APPZAP_ADMIN"
            ? storeDetail?.isShift && (
                <div className="flex items-center gap-2 whitespace-nowrap">
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
                  <div>{e?.amount || 0}</div>
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
              <>
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
                    {moneyCurrency(promotionReport?.[0]?.totalSaleAmount || 0)}
                    {storeDetail?.firstCurrency}
                  </div>
                </div>
              </>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: `1px dotted ${COLOR_APP}`,
                }}
              >
                <div>{t("total_amount_menu_discount")}</div>
                <div
                  className="flex gap-2 items-center text-orange-500 cursor-pointer"
                  onClick={() =>
                    handleGetDataDiscount(
                      promotionDiscountAndFreeReport?.discountedMenus
                    )
                  }
                >
                  {moneyCurrency(
                    promotionDiscountAndFreeReport?.totalDiscountedItemCount ||
                      0
                  )}
                  <BsArrowDownRightSquare />
                </div>
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
                <div>{t("total_money") + `(${t("menu_discount")})`}</div>
                <div>
                  {moneyCurrency(
                    promotionDiscountAndFreeReport?.totalDiscountValue || 0
                  )}
                  {storeDetail?.firstCurrency}
                </div>
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
                <div>{t("total_money") + t("menu_free")}</div>
                <div
                  className="flex gap-2 items-center text-orange-500 cursor-pointer"
                  onClick={() =>
                    handleGetDataFree(promotionDiscountAndFreeReport?.freeMenus)
                  }
                >
                  {moneyCurrency(
                    promotionDiscountAndFreeReport?.totalFreeItemCount || 0
                  )}
                  <BsArrowDownRightSquare />
                </div>
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
                <div>{t("total_money") + `(${t("menu_free")})`}</div>
                <div>
                  {moneyCurrency(
                    promotionDiscountAndFreeReport?.totalFreeMenuPrice || 0
                  )}
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
                <thead>
                  <tr>
                    <th>{t("bill_type")}</th>
                    <th style={{ textAlign: "center" }}>{t("bill_amount")}</th>
                    <th style={{ textAlign: "right" }}>{t("total_price")}</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    {
                      method: (
                        <div style={{ fontWeight: 700 }}>{t("total")}</div>
                      ),
                      qty: moneyReport?.successAmount?.numberOfBills || 0,
                      amount:
                        (moneyReport?.successAmount?.payByCash || 0) +
                        (moneyReport?.successAmount?.transferPayment || 0) +
                        (moneyReport?.successAmount?.point || 0),
                      // amount: moneyReport?.successAmount?.totalBalance || 0,
                    },
                    {
                      method: (
                        <div style={{ fontWeight: 700 }}>{t("total_cash")}</div>
                      ),
                      qty: moneyReport?.successAmount?.cashCount || 0,
                      amount: moneyReport?.successAmount?.payByCash || 0,
                    },

                    {
                      method: (
                        <div style={{ fontWeight: 700 }}>{t("total_tsf")}</div>
                      ),
                      qty: moneyReport?.successAmount?.transferCount || 0,
                      amount: moneyReport?.successAmount?.transferPayment || 0,
                    },
                    {
                      method: (
                        <div style={{ fontWeight: 700 }}>
                          {t("money_from_appzap")}
                        </div>
                      ),
                      qty:
                        moneyReport?.successAmount?.moneyFromOrderingCount || 0,
                      amount:
                        moneyReport?.successAmount?.moneyFromOrdering || 0,
                    },
                    {
                      method: (
                        <div style={{ fontWeight: 700 }}>{t("total_debt")}</div>
                      ),
                      qty: debtReport?.count || 0,
                      amount: debtReport?.totalRemainingAmount || 0,
                    },

                    ...(deliveryReports?.length > 0
                      ? deliveryReports.map((e, idx) => ({
                          method: (
                            <div style={{ fontWeight: 700 }}>
                              {`delivery (${e?.name || "Unknown"})`}
                            </div>
                          ),
                          qty: e?.qty || 0,
                          amount: Math.floor(e?.amount || 0),
                        }))
                      : []),
                    // Insert the point section after the "total_tsf"

                    {
                      method: (
                        <div style={{ fontWeight: 700 }}>{t("point")}</div>
                      ),
                      qty:
                        moneyReport?.successAmount?.transferCashPointCount || 0,
                      amount: moneyReport?.successAmount?.point || 0,
                      unit: t("point"),
                    },
                    {
                      method: `${t("service_charge")}`,
                      qty: moneyReport?.serviceChargeCount || 0,
                      amount: Math.floor(moneyReport?.serviceAmount) || 0,
                    },
                    {
                      method: `${t("tax")}`,
                      qty: moneyReport?.taxCount || 0,
                      amount: Math.floor(moneyReport?.taxAmount) || 0,
                    },
                    {
                      method: (
                        <div style={{ fontWeight: 700 }}>
                          {t("total_tax_service_charge")}
                        </div>
                      ),
                      qty:
                        (moneyReport?.serviceChargeCount || 0) +
                        (moneyReport?.taxCount || 0),
                      amount:
                        (Math.floor(moneyReport?.serviceAmount) || 0) +
                        (Math.floor(moneyReport?.taxAmount) || 0),
                    },
                  ]
                    .filter(Boolean) // Filter out undefined or null values
                    .map((e, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: "left" }}>{e?.method}</td>
                        <td>{moneyCurrency(e?.qty)}</td>
                        <td className="flex gap-2 items-center justify-end">
                          {moneyCurrency(e?.amount)}{" "}
                          {e?.unit || storeDetail?.firstCurrency}
                          {e?.unit && (
                            <div
                              className=" text-orange-500 cursor-pointer"
                              onKeyDown={() => {}}
                              onClick={() =>
                                handleGetDataExchangePoint(
                                  promotionDiscountAndFreeReport?.discountedMenus
                                )
                              }
                            >
                              <BsArrowDownRightSquare />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
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
                {bankList?.data?.map((data, index) => {
                  return (
                    <tr>
                      <td style={{ textAlign: "left" }}>{index + 1}</td>
                      <td style={{ textAlign: "center" }}>
                        {data?.bankDetails?.bankName}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {moneyCurrency(data?.bankTotalAmount)}
                        {storeDetail?.firstCurrency}
                      </td>
                    </tr>
                  );
                })}
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
                  <th style={{ textAlign: "center" }}>{t("order_paid")}</th>
                  <th style={{ textAlign: "center" }}>{t("Delivery")}</th>
                  <th style={{ textAlign: "right" }}>{t("total")}</th>
                </tr>
                {userReport?.length > 0 &&
                  userReport?.map((e) => (
                    <tr>
                      <td style={{ textAlign: "left" }}>{e?.userId?.userId}</td>
                      <td style={{ textAlign: "center" }}>{e?.served || 0}</td>
                      <td style={{ textAlign: "center" }}>{e?.canceled || 0}</td>
                      <td style={{ textAlign: "center" }}>{e?.paid || 0}</td>
                      <td style={{ textAlign: "center" }}>{moneyCurrency(e?.totalSaleDeliveryAmount)}</td>
                      <td style={{ textAlign: "right" }}>
                        {moneyCurrency(
                          (
                            e?.totalSaleAmount +
                              moneyReport?.serviceAmount +
                              moneyReport?.taxAmount -
                              promotionDiscountAndFreeReport?.totalDiscountValue -
                              e?.totalSaleDeliveryAmount
                          )
                        )}
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
                  <th style={{ textAlign: "center" }}>{"Delivery"}</th>
                  {storeDetail?.isCRM && (
                    <th style={{ textAlign: "center" }}>{t("point")}</th>
                  )}
                  <th style={{ textAlign: "center" }}>{t("discount")}</th>
                  <th style={{ textAlign: "center" }}>{t("debt")}</th>
                  {/* <th style={{ textAlign: "center" }}>{t("last_amount")}</th> */}
                  <th style={{ textAlign: "right" }}>{t("total")}</th>
                </tr>
                {reportData.map((e) => (
                  <tr>
                    <td style={{ textAlign: "left" }}>{e?.date}</td>
                    <td>{e?.order}</td>
                    <td>{e?.bill}</td>
                    <td>
                      {moneyCurrency(e?.deliveryAmount)}{" "}
                      {storeDetail?.firstCurrency}
                    </td>
                    <td>{moneyCurrency(e?.point)}</td>
                    <td>
                      {moneyCurrency(e?.discount)}
                      {storeDetail?.firstCurrency}
                    </td>
                    <td>
                      {moneyCurrency(debtReport?.totalRemainingAmount)}
                      {storeDetail?.firstCurrency}
                    </td>
                    {/* <td>
                      {moneyCurrency(e?.billBefore)}
                      {storeDetail?.firstCurrency}
                    </td> */}
                    <td style={{ textAlign: "right" }}>
                      {moneyCurrency(e?.billAmount + moneyReport?.taxAmount)}
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
                  <th style={{ textAlign: "center" }}>{t("order_paid")}</th>
                  <th style={{ textAlign: "right" }}>{t("sale_amount")}</th>
                </tr>
                {categoryReport
                  ?.sort((x, y) => {
                    return y.served - x.served;
                  })
                  ?.map((e) => (
                    <tr>
                      <td style={{ textAlign: "left" }}>{e?.name}</td>
                      <td style={{ textAlign: "center" }}>{e?.served || 0}</td>
                      <td style={{ textAlign: "center" }}>
                        {e?.cenceled || 0}
                      </td>
                      <td style={{ textAlign: "center" }}>{e?.paid || 0}</td>
                      <td style={{ textAlign: "right" }}>
                        {moneyCurrency(matchRoundNumber(e?.totalSaleAmount))}
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
                  <th style={{ textAlign: "center" }}>{t("order_paid")}</th>
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
                      <td style={{ textAlign: "center" }}>{e?.paid || 0}</td>
                      <td style={{ textAlign: "right" }}>
                        {moneyCurrency(matchRoundNumber(e?.totalSaleAmount))}
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
                  <th className="text-left">{t("no")}</th>
                  <th className="text-center">{t("code")}</th>
                  <th className="text-center">{t("ccrc")}</th>
                  <th className="text-right">{t("amount")}</th>
                </tr>
                {currencyList?.data?.map((e, index) => (
                  <tr key={e?._id}>
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

      <Modal
        show={openModalFree}
        size="md"
        onHide={() => setOpenModalFree(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("ລາຍການເມນູແຖມ")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table style={{ width: "100%" }}>
            <tr className="border-b">
              <th className="text-left">{t("no")}</th>
              <th className="text-left">{t("name")}</th>
              <th className="text-right">{t("price")}</th>
            </tr>
            {dataFreeItems.length > 0 ? (
              dataFreeItems?.map((m, index) => (
                <tr key={m?._id} className="border-b">
                  <td className="text-left">{index + 1}</td>
                  <td className="text-left">{m?.name}</td>
                  <td className="text-right">{moneyCurrency(m?.price)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>
                  <div className="flex justify-center">
                    <p className="text-[16px] font-bold text-gray-900">
                      ບໍ່ມີລາຍການ
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </table>
          <div className="flex justify-end mt-2">
            <p className="text-orange-500 text-[18px] pt-3 font-bold">
              ລວມຈຳນວນລາຄາແຖມທັງໝົດ : {moneyCurrency(TotalPriceFreeItems())}{" "}
              {storeDetail?.firstCurrency}
            </p>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openModalDiscount}
        size="lg"
        onHide={() => setOpenModalDiscount(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("ລາຍການເມນູສ່ວນຫຼຸດ")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table style={{ width: "100%" }}>
            <tr className="border-b">
              <th className="text-left">{t("no")}</th>
              <th className="text-left">{t("name")}</th>
              <th className="text-right">{t("ລາຄາປົກກະຕິ")}</th>
              <th className="text-right">{t("ລາຄາສ່ວນຫຼຸດ")}</th>
              <th className="text-right">{t("ຈຳນວນທີ່ຫຼຸດ")}</th>
            </tr>
            {dataDiscountItems?.length > 0 ? (
              dataDiscountItems?.map((m, index) => (
                <tr key={m?._id} className="border-b">
                  <td className="text-left">{index + 1}</td>
                  <td className="text-left">{m?.name}</td>
                  <td className="text-right">{moneyCurrency(m?.price)}</td>
                  <td className="text-right">
                    {moneyCurrency(Math.max(m?.price - m?.priceDiscount), 0)}
                  </td>
                  <td className="text-right">
                    {moneyCurrency(m?.priceDiscount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <div className="flex justify-center">
                    <p className="text-[16px] font-bold text-gray-900">
                      ບໍ່ມີລາຍການ
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </table>
          <div className="flex justify-end mt-2">
            <p className="text-orange-500 text-[18px] pt-3 font-bold">
              ລວມຈຳນວນທີ່ຫຼຸດທັງໝົດ : {moneyCurrency(TotalPriceDicount())}{" "}
              {storeDetail?.firstCurrency}
            </p>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openModalExchange}
        size="lg"
        onHide={() => setOpenModalExchange(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("ລາຍລະອຽດການແລກພ໋ອຍ")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table style={{ width: "100%" }}>
            <tr className="border-b">
              <th className="text-left">{t("no")}</th>
              <th className="text-left">{t("point")}</th>
              <th className="text-left">{t("name")}</th>
              <th className="text-right">{t("quantity")}</th>
              <th className="text-right">{t("price")}</th>
            </tr>
            {moneyReport?.exchangePointDetails?.length > 0 ? (
              moneyReport?.exchangePointDetails?.map((m, index) => (
                <tr key={m?._id} className="border-b">
                  <td className="text-left">{index + 1}</td>
                  <td className="text-left">{m?.exchangePoint}</td>
                  <td className="text-left">
                    {m?.menuDetails?.map((i) => i.name)}
                  </td>
                  <td className="text-right">
                    {m?.menuDetails?.map((i) => i.quantity)}
                  </td>
                  <td className="text-right">
                    {moneyCurrency(m?.menuDetails?.map((i) => i.price))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <div className="flex justify-center">
                    <p className="text-[16px] font-bold text-gray-900">
                      ບໍ່ມີລາຍການ
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </table>
          <div className="flex justify-between mt-2">
            <p className="text-orange-500 text-[18px] pt-3 font-bold">
              ລວມຄະແນນ : {moneyCurrency(totalExchangePoint)}
            </p>
            <p className="text-orange-500 text-[18px] pt-3 font-bold">
              ລວມຈຳນວນເງິນທັງໝົດ : {moneyCurrency(totalPrice)}{" "}
              {storeDetail?.firstCurrency}
            </p>
          </div>
        </Modal.Body>
      </Modal>

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
        selectedTableIds={selectedTableIds}
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
