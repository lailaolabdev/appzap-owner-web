import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import {
  BsFillCalendarWeekFill,
  BsFillCalendarEventFill,
} from "react-icons/bs";
import { MdOutlineCloudDownload } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import Box from "../../components/Box";
import { useStore } from "../../store";
import {
  getMenuReport,
  getMoneyReport,
  getPromotionReport,
  getReports,
  getSalesInformationReport,
  getUserReport,
} from "../../services/report";
import PopupDaySplitView from "../../components/popup/report/PopupDaySplitView";
import { moneyCurrency } from "../../helpers";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import moment from "moment";

export default function DashboardPage() {
  // state
  const [reportData, setReportData] = useState([]);
  const [salesInformationReport, setSalesInformationReport] = useState();
  const [userReport, setUserReport] = useState();
  const [menuReport, setMenuReport] = useState();
  const [moneyReport, setMoneyReport] = useState();
  const [promotionReport, setPromotionReport] = useState();
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [popup, setPopup] = useState();

  // provider
  const { storeDetail } = useStore();

  // useEffect
  useEffect(() => {
    getReportData();
    getSalesInformationReportData();
    getUserReportData();
    getMenuReportData();
    getMoneyReportData();
    getPromotionReportData();
  }, [endDate, startDate,endTime,startTime]);

  // function
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
  const getUserReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getUserReport(storeDetail?._id, findBy);
    setUserReport(data);
  };

  const getMenuReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getMenuReport(storeDetail?._id, findBy);
    setMenuReport(data);
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

  return (
    <>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
            Library
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Data</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
          <Button
            variant="outline-primary"
            size="small"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setPopup({ popupfiltter: true })}
          >
            <BsFillCalendarWeekFill />
            <div>{startDate} {startTime}</div> ~ <div>{endDate} {endTime}</div>
          </Button>
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
          >
            <AiFillPrinter /> PRINT
          </Button>
          <Button
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <MdOutlineCloudDownload /> EXPORT
          </Button>
        </div>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
            gap: 20,
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
              ຂໍ້ມູນການຂາຍ (Sales Information)
            </Card.Header>
            <Card.Body>
              {[
                {
                  title: "ຍອດຂາຍທັງໝົດ",
                  amount: `${moneyCurrency(
                    salesInformationReport?.["totalSales"]
                  )}₭`,
                },

                {
                  title: "ລາຍຈ່າຍທັງໝົດ",
                  amount: `${moneyCurrency(
                    salesInformationReport?.["totalCost"]
                  )}₭`,
                },
                {
                  title: "ກຳໄລ",
                  amount: `${moneyCurrency(
                    salesInformationReport?.["grossProfit"]
                  )}₭`,
                },
                {
                  title: "ຈຳນວນທຸລະກຳການຂາຍ",
                  amount: `${moneyCurrency(
                    salesInformationReport?.["noOfSalesTransactions"]
                  )}`,
                },
                {
                  title: "ຍອດຂາຍສະເລ່ຍ ຕໍ່ ທຸລະກຳ",
                  amount: `${moneyCurrency(
                    salesInformationReport?.["averageSales_Transaction"]
                  )}₭`,
                },
                {
                  title: "ຈຳນວນເງິນທີ່ຖືກຍົກເລີກທັງໝົດ",
                  amount: `${moneyCurrency(
                    salesInformationReport?.["unpaidTransaction"]
                  )}₭`,
                },
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
              ໂປຣໂມຊັ້ນ
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
                <div>ສ່ວນຫຼຸດທັງໝົດ</div>
                <div>{promotionReport?.[0]?.count}</div>
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
                <div>ຈຳນວນບິນສ່ວນຫຼຸດ</div>
                <div>{promotionReport?.[0]?.totalSaleAmount}</div>
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
              ຂໍ້ມູນບິນ
            </Card.Header>
            <Card.Body>
              <table style={{ width: "100%" }}>
                <tr>
                  <th>ປະເພດບິນ</th>
                  <th style={{ textAlign: "center" }}>ຈຳນວນບິນ</th>
                  <th style={{ textAlign: "right" }}>ລາຄາລວມ</th>
                </tr>
                {[
                  {
                    method: "ບິນເງິນສົດ",
                    qty: moneyReport?.cash?.count,
                    amount: moneyReport?.cash?.totalBill,
                  },
                  {
                    method: "ບິນເງິນໂອນ",
                    qty: moneyReport?.transfer?.count,
                    amount: moneyReport?.transfer?.totalBill,
                  },
                  {
                    method: "ບິນເງິນສົດແລະເງິນໂອນ",
                    qty: moneyReport?.transferCash?.count,
                    amount: moneyReport?.transferCash?.totalBill,
                  },
                  {
                    method: "ລວມບິນທັງໝົດ",
                    qty:
                      moneyReport?.cash?.count +
                      moneyReport?.transferCash?.count +
                      moneyReport?.transfer?.count,
                    amount:
                      moneyReport?.cash?.totalBill +
                      moneyReport?.transferCash?.totalBill +
                      moneyReport?.transfer?.totalBill,
                  },
                ].map((e) => (
                  <tr>
                    <td style={{ textAlign: "left" }}>{e?.method}</td>
                    <td>{e?.qty}</td>
                    <td style={{ textAlign: "right" }}>{e?.amount}</td>
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
              ຂໍ້ມູນພະນັກງານ
            </Card.Header>
            <Card.Body>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>ຊື່ຜູ້ໃຊ້</th>
                  <th style={{ textAlign: "center" }}>ອໍເດີສັ່ງ</th>
                  <th style={{ textAlign: "center" }}>ອໍເດີຍົກເລີກ</th>
                  <th style={{ textAlign: "right" }}>ລວມຍອດ</th>
                </tr>
                {userReport?.map((e) => (
                  <tr>
                    <td style={{ textAlign: "left" }}>{e?.userId?.userId}</td>
                    <td style={{ textAlign: "center" }}>{e?.served}</td>
                    <td style={{ textAlign: "center" }}>{e?.canceled}</td>
                    <td style={{ textAlign: "right" }}>
                      {moneyCurrency(e?.totalSaleAmount)}₭
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
              ຂໍ້ມູນເມນູ
            </Card.Header>
            <Card.Body>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>ເມນູ</th>
                  <th style={{ textAlign: "center" }}>ອໍເດີສຳເລັດ</th>
                  <th style={{ textAlign: "center" }}>ຍົກເລີກ</th>
                  <th style={{ textAlign: "right" }}>ຍອດຂາຍ</th>
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
                        {moneyCurrency(e?.totalSaleAmount)}₭
                      </td>
                    </tr>
                  ))}
              </table>
            </Card.Body>
          </Card>
        </Box>
      </Box>
      {/* popup */}
      <PopupDaySplitView
        open={popup?.PopupDaySplitView}
        onClose={() => setPopup()}
        reportData={reportData}
      />
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
    </>
  );
}
