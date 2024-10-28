import React, { useState, useEffect } from "react";
import { getBranchStore } from "../../services/childStore.service";
import {
  Dropdown,
  DropdownButton,
  Spinner,
  Breadcrumb,
  Button,
  Card,
} from "react-bootstrap";
import { moneyCurrency } from "../../helpers";
import { useStore } from "../../store";
import {
  getCategoryReport,
  getMenuReport,
  getMoneyReport,
  getPromotionReport,
  getReports,
  getSalesInformationReport,
  getUserReport,
} from "../../services/report";
import { getLocalData } from "../../constants/api";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import Box from "../../components/Box";
import { COLOR_APP } from "../../constants";
import moment from "moment";
import PopUpChooseTableComponent from "../../components/popup/PopUpChooseTableComponent";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import PopUpBranchStore from "../../components/popup/PopUpAddBranchStore";
import { getManyTables } from "../../services/table";
import { updateStore } from "../../services/store";
import { useTranslation } from "react-i18next";

export default function ChildStores() {
  const { t } = useTranslation();
  const [branchStore, setBranchStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [popup, setPopup] = useState();
  const [tableList, setTableList] = useState([]);
  const [selectedTableIds, setSelectedTableIds] = useState([]);
  const [salesInformationReport, setSalesInformationReport] = useState();
  const [menuReport, setMenuReport] = useState();
  const [moneyReport, setMoneyReport] = useState();
  const [userReport, setUserReport] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [categoryReport, setCategoryReport] = useState();
  const [promotionReport, setPromotionReport] = useState();
  const { storeDetail } = useStore();

  // useEffect(() => {
  //   fetchBranchStore();
  // }, []);
  const fetchBranchStore = async () => {
    const { DATA } = await getLocalData();
    try {
      const data = await getBranchStore(DATA?.storeId);
      setBranchStore(data);
    } catch (err) {
      console.error("Fetch failed: Exception occurred", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchStore();
  }, [endDate, startDate, endTime, startTime, selectedTableIds]);

  const handleSelect = (e) => {
    const selected = branchStore?.childStores.find((store) => store._id === e);
    const childId = selected?._id;

    const getSalesInformationReportData = async () => {
      const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
      const data = await getSalesInformationReport(
        storeDetail?._id,
        findBy,
        selectedTableIds
      );
      setSalesInformationReport(data);
    };

    const getCategoryReportData = async () => {
      const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
      const data = await getCategoryReport(childId, findBy, selectedTableIds);
      setCategoryReport(data);
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

    const getTable = async () => {
      const data = await getManyTables(childId);
      setTableList(data);
    };

    const getMoneyReportData = async () => {
      const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
      const data = await getMoneyReport(childId, findBy, selectedTableIds);
      setMoneyReport(data);
    };

    const getUserReportData = async () => {
      const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
      const data = await getUserReport(childId, findBy, selectedTableIds);

      setUserReport(data);
    };

    const getReportData = async () => {
      const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
      const data = await getReports(childId, findBy, selectedTableIds);
      setReportData(data);
    };

    const getMenuReportData = async () => {
      const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
      const data = await getMenuReport(childId, findBy, selectedTableIds);
      setMenuReport(data);
    };

    useEffect(() => {
      getReportData();
      getSalesInformationReportData();
      getUserReportData();
      getMenuReportData();
      getMoneyReportData();
      getPromotionReportData();
      getCategoryReportData();
    }, [endDate, startDate, endTime, startTime, selectedTableIds]);
  };

  const handleAddBranch = async (values) => {
    try {
      const _localData = await getLocalData();
      const id = _localData?.DATA?.storeId;
      await updateStore(values, id);
      // Handle the submission logic here, e.g., send data to API
      console.log("Branch data submitted:", values);
      setPopup({ popUpBranchStore: false });
      fetchBranchStore();
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  return (
    <>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <div>
          {loading ? (
            <div>
              <center>
                <Spinner animation="border" variant="warning" />
              </center>
            </div>
          ) : error ? (
            <div>Failed to load branch store data.</div>
          ) : (
            <div>
              <Breadcrumb>
                <Breadcrumb.Item>{t("sub_branch")}</Breadcrumb.Item>
                <Breadcrumb.Item active>
                  {t("sub_branch_report")}
                </Breadcrumb.Item>
              </Breadcrumb>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {branchStore?.childStores?.length === 0 ? (
                  <Button onClick={() => setPopup({ popUpBranchStore: true })}>
                    ເພີ່ມເຂົ້າສາຂາຫຼັກ
                  </Button>
                ) : (
                  <DropdownButton
                    style={{ margin: 0 }}
                    id="dropdown-basic-button"
                    title={
                      selectedStore
                        ? selectedStore.name
                        : `${t("select_branch")}`
                    }
                    onSelect={handleSelect}
                  >
                    {branchStore?.childStores?.map((store, index) => (
                      <Dropdown.Item key={index} eventKey={store._id}>
                        {store.name}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                )}

                <Button
                  onClick={() => setPopup({ popUpChooseTableComponent: true })}
                >
                  {t("chose_table")}
                </Button>
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
              </div>
              {selectedStore && (
                <div style={{ marginTop: 20 }}>
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
                            title: `${t("total_sales")}`,
                            amount: `${moneyCurrency(
                              salesInformationReport?.["totalSales"]
                            )}${storeDetail?.firstCurrency}`,
                          },

                          // {
                          //   title: "ລາຍຈ່າຍທັງໝົດ",
                          //   amount: `${moneyCurrency(
                          //     salesInformationReport?.["totalCost"]
                          //   )}${storeDetail?.firstCurrency}`
                          // },

                          {
                            title: `${t("sales_transaction")}`,
                            amount: `${moneyCurrency(
                              salesInformationReport?.["noOfSalesTransactions"]
                            )}`,
                          },
                          {
                            title: `${t("avg_sales")}`,
                            amount: `${moneyCurrency(
                              salesInformationReport?.[
                                "averageSales_Transaction"
                              ]
                            )}${storeDetail?.firstCurrency}`,
                          },
                          {
                            title: `${t("paid_lak")}`,
                            amount: `${moneyCurrency(
                              salesInformationReport?.["totalCostLAK"]
                            )} ${t("lak")}`,
                          },
                          {
                            title: `${t("primary_profit")}`,
                            amount: `${moneyCurrency(
                              salesInformationReport?.["grossProfitLAK"]
                            )}${storeDetail?.firstCurrency}`,
                          },

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
                        {t("bill_info")}
                      </Card.Header>
                      <Card.Body>
                        <table style={{ width: "100%" }}>
                          <tr>
                            <th>{t("bill_type")}</th>
                            <th style={{ textAlign: "center" }}>
                              {t("bill_amount")}
                            </th>
                            <th style={{ textAlign: "right" }}>
                              {t("total_price")}
                            </th>
                          </tr>
                          {[
                            {
                              method: `${t("cash_bill")}`,
                              qty: moneyReport?.cash?.count,
                              amount: moneyReport?.cash?.totalBill,
                            },
                            {
                              method: `${t("transfer_bill")}`,
                              qty: moneyReport?.transfer?.count,
                              amount: moneyReport?.transfer?.totalBill,
                            },
                            {
                              method: `${t("transfer_cash")}`,
                              qty: moneyReport?.transferCash?.count,
                              amount: moneyReport?.transferCash?.totalBill,
                            },
                            {
                              method: `${t("include_bill")}`,
                              qty:
                                (moneyReport?.cash?.count || 0) +
                                (moneyReport?.transferCash?.count || 0) +
                                moneyReport?.transfer?.count,
                              amount:
                                (moneyReport?.cash?.totalBill || 0) +
                                (moneyReport?.transferCash?.totalBill || 0) +
                                (moneyReport?.transfer?.totalBill || 0),
                            },
                          ].map((e) => (
                            <tr>
                              <td style={{ textAlign: "left" }}>{e?.method}</td>
                              <td>{moneyCurrency(e?.qty)}</td>
                              <td style={{ textAlign: "right" }}>
                                {moneyCurrency(e?.amount)}
                                {/* {storeDetail?.firstCurrency} */}
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
                        {t("staff_info")}
                      </Card.Header>
                      <Card.Body>
                        <table style={{ width: "100%" }}>
                          <tr>
                            <th style={{ textAlign: "left" }}>
                              {t("user_name")}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {t("order")}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {t("order_cancel")}
                            </th>
                            <th style={{ textAlign: "right" }}>
                              {t("total_balance")}
                            </th>
                          </tr>
                          {userReport?.length > 0 &&
                            userReport?.map((e) => (
                              <tr>
                                <td style={{ textAlign: "left" }}>
                                  {e?.userId?.userId}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e?.served}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e?.canceled}
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
                        {t("dialy_sales")}
                      </Card.Header>
                      <Card.Body>
                        <table style={{ width: "100%" }}>
                          <tr>
                            <th style={{ textAlign: "left" }}>{t("date")}</th>
                            <th style={{ textAlign: "center" }}>
                              {t("orders")}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {t("bill_balance")}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {t("discount")}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {t("last_balance")}
                            </th>
                            <th style={{ textAlign: "right" }}>
                              {t("total_balance")}
                            </th>
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
                            <th style={{ textAlign: "left" }}>
                              {t("menu_type")}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {t("order_success")}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {t("cancel")}
                            </th>
                            <th style={{ textAlign: "right" }}>
                              {t("total_sale")}
                            </th>
                          </tr>
                          {categoryReport
                            ?.sort((x, y) => {
                              return y.served - x.served;
                            })
                            ?.map((e) => (
                              <tr>
                                <td style={{ textAlign: "left" }}>{e?.name}</td>
                                <td style={{ textAlign: "center" }}>
                                  {e?.served}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {e?.cenceled}
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
                        {t("menu_info")}
                      </Card.Header>
                      <Card.Body>
                        <table style={{ width: "100%" }}>
                          <tr>
                            <th style={{ textAlign: "left" }}>{t("menu")}</th>
                            <th style={{ textAlign: "center" }}>
                              {t("order_success")}
                            </th>
                            <th style={{ textAlign: "center" }}>
                              {t("cancel")}
                            </th>
                            <th style={{ textAlign: "right" }}>{t("sales")}</th>
                          </tr>
                          {menuReport
                            ?.sort((x, y) => {
                              return y.served - x.served;
                            })
                            ?.map((e) => (
                              <tr>
                                <td style={{ textAlign: "left" }}>{e?.name}</td>
                                <td style={{ textAlign: "center" }}>
                                  {e?.served || 0}
                                </td>
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
                </div>
              )}
            </div>
          )}
        </div>
      </Box>
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
      <PopUpChooseTableComponent
        open={popup?.popUpChooseTableComponent}
        onClose={() => setPopup()}
        tableList={tableList || []}
        setSelectedTable={setSelectedTableIds}
      />
      <PopUpBranchStore
        open={popup?.popUpBranchStore}
        onClose={() => setPopup()}
        onSubmit={handleAddBranch}
      />
    </>
  );
}
