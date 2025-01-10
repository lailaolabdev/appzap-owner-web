import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import {
  Button,
  Form,
  Card,
  Pagination,
  Breadcrumb,
  Tab,
  Tabs,
  Spinner,
  Modal,
} from "react-bootstrap";
import { FaCoins } from "react-icons/fa";
import Box from "../../components/Box";
import { getLocalData } from "../../constants/api";
import { getAllDebts, getBilldebts } from "../../services/debt";
import { getdebtHistory } from "../../services/debt";
import { useStore } from "../../store";
import moment from "moment";
import ReactPaginate from "react-paginate";
import PopUpDetaillBillDebt from "../../components/popup/PopUpDetaillBillDebt";
import PopUpDebtExport from "../../components/popup/PopUpDebtExport";
import { moneyCurrency } from "../../helpers";
import ImageEmpty from "../../image/empty.png";
import { IoBeerOutline } from "react-icons/io5";
import { MdAssignmentAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { convertBillDebtStatus } from "../../helpers/convertBillDebtStatus";
import { useStoreStore } from "../../zustand/storeStore";
import {
  BsFillCalendarWeekFill,
  BsFillCalendarEventFill,
} from "react-icons/bs";
import PopUpSetStartAndEndDateDebt from "../../components/popup/PopUpSetStartAndEndDateDebt";

export default function DebtPage() {
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore()
  const navigate = useNavigate(); // Initialize navigate
  const [isHovered, setIsHovered] = useState(false);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState(0);
  const [billDebtData, setBillDebtData] = useState([]);
  const [selectBillDebt, setSelectBillDebt] = useState();
  const [selectDebtData, setSelectDebtData] = useState();
  const [popup, setPopup] = useState();
  const [debtHistoryData, setDebtHistoryData] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showData, setShowData] = useState([])
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");

  const limitData = 50;
  
  // useEffect
  useEffect(() => {
    getData();
    getDataHistory();
  }, [pagination]);

  // Function to fetch data
  const getData = async () => {
    setIsLoading(true);
    try {
      const { TOKEN } = await getLocalData();
      let findby = `?skip=${(pagination - 1) * limitData
        }&limit=${limitData}&storeId=${storeDetail?._id}`;

      if (searchCode) {
        const isPhoneNumber = /^\d+$/.test(searchCode);

        if (isPhoneNumber) {
          findby += `&customerPhone=${searchCode}`;
        } else {
          findby += `&code=${searchCode}`;
        }
      }

      const data = await getBilldebts(findby, TOKEN);
      setBillDebtData(data?.data || []);

      //console.log("setBillDebtData =-=-=>", billDebtData);
      setTotalPagination(Math.ceil(data?.totalCount / limitData));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllDataDebts();
  }, [billDebtData])


  const getAllDataDebts = async () => {
    try {
      const data = await getAllDebts();
      setShowData(data);
    } catch (error) {
      console.log("error getAlldata", error)
    }
  }


  // ຈຳນວນເງິນທັງຫມົດ
  const amount = showData.reduce((total, item) => {
    return total + (item.amount || 0);
  }, 0);


  //ເງິນທີຍັງຕິດ
  const remainingAmount = showData.reduce((total, item) => {
    return total + (item.remainingAmount || 0);
  }, 0);

  //ເງິນທີຈ່າຍໄປແລ້ວ
  const totalPayment = showData.reduce((total, item) => {
    return total + (item.totalPayment || 0);
  }, 0);



  const getDataHistory = async () => {
    setIsLoading(true);
    try {
      const { TOKEN } = await getLocalData();
      let findby = `?skip=${(pagination - 1) * limitData
        }&limit=${limitData}&storeId=${storeDetail?._id}`;

      if (searchCode) {
        const isPhoneNumber = /^\d+$/.test(searchCode);

        if (isPhoneNumber) {
          findby += `&customerPhone=${searchCode}`;
        } else {
          findby += `&code=${searchCode}`;
        }
      }

      const data = await getdebtHistory(findby, TOKEN);
      setDebtHistoryData(data);
      setTotalPagination(Math.ceil(data?.totalCount / limitData));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={{ padding: 20 }}>
      <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "0.5fr 0.5fr 0.5fr 0.5fr", xs: "1fr" },
            gap: 20,
            gridTemplateRows: "masonry",
            marginBottom: 20,
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
              {t("ຈຳນວນລາຍການທັງຫມົດ")}
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  // fontWeight: 700
                }}
              >
                {showData?.length  || 0}
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
              {t("ເງິນທັງຫມົດທີລູກຄ້າຕິດຫນີ້")}
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  // fontWeight: 700
                }}
              >

                {moneyCurrency(amount)} ກີບ
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
              {t("ຈ່າຍໄປແລ້ວ")}
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  // fontWeight: 700
                }}
              >
                {/* {moneyCurrency(totalPayment)} ກີບ */}
                {moneyCurrency(amount - remainingAmount)} ກີບ
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
              }}
            >
              <span>{t("ເງິນທີຍັງຕິດ")}</span>
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  fontWeight: 400,
                }}
              >
                {moneyCurrency(remainingAmount)} ກີບ
              </div>
            </Card.Body>
          </Card>
        </Box>
        {/* <Breadcrumb>
          <Breadcrumb.Item>{t("debt_deposit")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("debt_list")}</Breadcrumb.Item>
        </Breadcrumb> */}
        <Tabs defaultActiveKey="billDebt-list">
          <Tab
            eventKey="billDebt-list"
            title={t("debt_list_all")}
            style={{ paddingTop: 20, color: "red" }}
          >
            <div style={{ display: "flex", gap: 10, padding: "10px 0", justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display: "flex", gap: 10, padding: "10px 0", alignItems:'center' }}>
                <Form.Control
                  style={{ maxWidth: 220 }}
                  placeholder={t("search_bill_code")}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
                <Button
                  variant="primary"
                  onClick={getData}
                  style={{ color: "white" }}
                >
                  {t("search")}
                </Button>
              </div>

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

            <Card border="primary" style={{ margin: 0 }}>
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <span>
                  <IoBeerOutline /> {t("debt_list")}
                </span>
                <Button
                  style={{
                    background: isHovered ? "Moccasin" : "SandyBrown",
                    color: isHovered ? "Black" : "White",
                    fontSize: "17px",
                  }}
                  variant="dark"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => {
                    setBillDebtData(searchCode);
                    setPopup({
                      PopUpDebtExport: true,
                    });
                  }}
                >
                  {t("debt_Export")}
                </Button>
              </Card.Header>
              <Card.Body>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{t("bill_no")}</th>
                      <th>{t("name")}</th>
                      <th>{t("phoneNumber")}</th>
                      <th>{t("money_remaining")}</th>
                      <th>{t("status")}</th>
                      <th>{t("date_add")}</th>
                      <th>{t("expired")}</th>
                      <th>{t("payment_date_debt")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center" }}>
                          <Spinner animation="border" variant="warning" />
                        </td>
                      </tr>
                    ) : billDebtData.length > 0 ? (
                      billDebtData.map((e, i) => (
                        <tr
                          key={e?._id}
                          onClick={() => {
                            setPopup({ PopUpDetaillBillDebt: true });
                            setSelectBillDebt(e);
                          }}
                        >
                          <td>{(pagination - 1) * limitData + i + 1}</td>
                          <td>{e?.code}</td>
                          <td>{e?.customerName}</td>
                          <td>{e?.customerPhone}</td>
                          <td>{moneyCurrency(e?.remainingAmount)}</td>
                          <td>
                            {t ? convertBillDebtStatus(e?.status, t) : ""}
                          </td>
                          <td>{moment(e?.createdAt).format("DD/MM/YYYY")}</td>
                          <td>{moment(e?.endDate).format("DD/MM/YYYY")}</td>
                          <td>
                            {e?.outStockDate
                              ? moment(e?.outStockDate).format("DD/MM/YYYY")
                              : ""}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center" }}>
                          <img
                            src={ImageEmpty}
                            alt=""
                            style={{ width: 300, height: 200 }}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  bottom: 20,
                }}
              >
                <ReactPaginate
                  previousLabel={<span>Previous</span>}
                  nextLabel={<span>Next</span>}
                  breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
                  pageCount={totalPagination}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={(e) => setPagination(e.selected + 1)}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  activeClassName={"active"}
                  previousClassName={"page-item"}
                  nextClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextLinkClassName={"page-link"}
                />
              </div>
            </Card>
          </Tab>

          <Tab
            eventKey="Pay-debt-list"
            title={t("PayDebt_list_history")}
            style={{ paddingTop: 20 }}
          >
            <div style={{ display: "flex", gap: 10, padding: "10px 0", justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display: "flex", gap: 10, padding: "10px 0", alignItems:'center' }}>
                <Form.Control
                  style={{ maxWidth: 220 }}
                  placeholder={t("search_bill_code")}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
                <Button
                  variant="primary"
                  onClick={getDataHistory}
                  style={{ color: "white" }}
                >
                  {t("search")}
                </Button>
              </div>

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
            <Card border="primary" style={{ margin: 0 }}>
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <span>
                  <IoBeerOutline /> {t("PayDebt_list_history")}
                </span>
                <Button
                  style={{
                    background: isHovered ? "Moccasin" : "SandyBrown",
                    color: isHovered ? "Black" : "White",
                    fontSize: "17px",
                  }}
                  variant="dark"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => {
                    setPopup({ PopUpDebtExport: true });
                  }}
                >
                  {t("debt_Export")}
                </Button>
              </Card.Header>
              <Card.Body>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{t("bill_no")}</th>
                      <th>{t("name")}</th>
                      <th>{t("phoneNumber")}</th>
                      <th>{t("money_remaining")}</th>
                      <th>{t("debt_pay_remaining")}</th>
                      <th>{t("payment_datetime_debt")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center" }}>
                          <Spinner animation="border" variant="warning" />
                        </td>
                      </tr>
                    ) : debtHistoryData && debtHistoryData.length > 0 ? (
                      debtHistoryData
                        .filter((e) => e?.totalPayment > 0)
                        .sort(
                          (a, b) =>
                            new Date(b.updatedAt) - new Date(a.updatedAt)
                        )
                        .map((e, i) => (
                          <tr key={i}>
                            <td>{(pagination - 1) * limitData + i + 1}</td>
                            <td>{e.code}</td>
                            <td>{e.customerName}</td>
                            <td>{e.customerPhone}</td>
                            <td>{moneyCurrency(e?.remainingAmount)}</td>
                            <td style={{ color: "MediumSeaGreen" }}>
                              {moneyCurrency(e?.totalPayment)}
                            </td>
                            <td>
                              {e?.updatedAt
                                ? moment(e?.updatedAt).format(
                                    "DD/MM/YYYY - HH:mm:SS : a"
                                  )
                                : ""}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center" }}>
                          <img
                            src={ImageEmpty}
                            alt=""
                            style={{ width: 300, height: 200 }}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  bottom: 20,
                }}
              ></div>
            </Card>
          </Tab>

          <Tab
            eventKey="Incress-debt-list"
            title={t("IncressDebt_list_history")}
            style={{ paddingTop: 20 }}
          >
            <div style={{ display: "flex", gap: 10, padding: "10px 0", justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display: "flex", gap: 10, padding: "10px 0", alignItems:'center' }}>
                <Form.Control
                  style={{ maxWidth: 220 }}
                  placeholder={t("search_bill_code")}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
                <Button
                  variant="primary"
                  onClick={getDataHistory}
                  style={{ color: "white" }}
                >
                  {t("search")}
                </Button>
              </div>

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
            <Card border="primary" style={{ margin: 0 }}>
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <span>
                  <IoBeerOutline /> {t("IncressDebt_list_history")}
                </span>
                <Button
                  style={{
                    background: isHovered ? "Moccasin" : "SandyBrown",
                    color: isHovered ? "Black" : "White",
                    fontSize: "17px",
                  }}
                  variant="dark"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => {
                    setPopup({ PopUpDebtExport: true });
                  }}
                >
                  {t("debt_Export")}
                </Button>
              </Card.Header>
              <Card.Body>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{t("bill_no")}</th>
                      <th>{t("name")}</th>
                      <th>{t("phoneNumber")}</th>
                      <th>{t("money_remaining")}</th>
                      <th>{t("debt_add_remaining")}</th>
                      <th>{t("payment_datetime_debt")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center" }}>
                          <Spinner animation="border" variant="warning" />
                        </td>
                      </tr>
                    ) : debtHistoryData && debtHistoryData.length > 0 ? (
                      debtHistoryData
                        .filter((e) => e.amountIncrease > 0)
                        .sort(
                          (a, b) =>
                            new Date(b.updatedAt) - new Date(a.updatedAt)
                        )
                        .map((e, i) => (
                          <tr key={i}>
                            <td>{(pagination - 1) * limitData + i + 1}</td>
                            <td>{e?.code}</td>
                            <td>{e?.customerName}</td>
                            <td>{e?.customerPhone}</td>
                            <td>{moneyCurrency(e?.remainingAmount)}</td>
                            <td style={{ color: "Coral" }}>
                              {moneyCurrency(e?.amountIncrease)}
                            </td>
                            <td>
                              {e?.updatedAt
                                ? moment(e?.updatedAt).format(
                                    "DD/MM/YYYY - HH:mm:SS : a"
                                  )
                                : ""}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center" }}>
                          <img
                            src={ImageEmpty}
                            alt=""
                            style={{ width: 300, height: 200 }}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  bottom: 20,
                }}
              ></div>
            </Card>
          </Tab>
        </Tabs>
        {popup?.PopUpDetaillBillDebt && (
          <PopUpDetaillBillDebt
            open={popup?.PopUpDetaillBillDebt}
            onClose={() => {
              setPopup();
              setSelectBillDebt();
            }}
            billDebtData={selectBillDebt}
            callback={async () => {
              setPopup();
              setSelectBillDebt();
              await getData();
              await getDataHistory();
            }}
          />
        )}
        {popup?.PopUpDebtExport && (
          <PopUpDebtExport
            open={popup?.PopUpDebtExport}
            onClose={() => {
              setPopup();
              setSelectDebtData();
            }}
            billDebtData={selectDebtData}
            callback={async () => {
              setPopup();
              setSelectDebtData();
              await getData();
              await getDataHistory();
            }}
          />
        )}
        <PopUpSetStartAndEndDateDebt
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
    </>
  );
}
