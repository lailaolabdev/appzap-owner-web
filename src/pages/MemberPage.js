import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Button, ButtonGroup, Form } from "react-bootstrap";
import {
  BsArrowCounterclockwise,
  BsFillCalendarWeekFill,
  BsInfoCircle,
} from "react-icons/bs";
import { MdOutlineCloudDownload } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import Box from "../components/Box";
import ReportChartWeek from "../components/report_chart/ReportChartWeek";
import { useStore } from "../store";
import moment from "moment";
import { COLOR_APP } from "../constants";
import ButtonDropdown from "../components/button/ButtonDropdown";
import { FaSearch } from "react-icons/fa";
import { getMembers } from "../services/member.service";
import { getLocalData } from "../constants/api";

export default function MemberPage() {
  // state
  const [reportData, setReportData] = useState([]);
  const [salesInformationReport, setSalesInformationReport] = useState();
  const [userReport, setUserReport] = useState();
  const [menuReport, setMenuReport] = useState();
  const [categoryReport, setCategoryReport] = useState();
  const [moneyReport, setMoneyReport] = useState();
  const [promotionReport, setPromotionReport] = useState();
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [popup, setPopup] = useState();
  const [membersData, setMembersData] = useState();

  // provider
  const { storeDetail } = useStore();

  // useEffect
  useEffect(() => {
    getMembersData();
    // getSalesInformationReportData();
    // getUserReportData();
    // getMenuReportData();
    // getMoneyReportData();
    // getPromotionReportData();
    // getCategoryReportData();
  }, [endDate, startDate, endTime, startTime]);

  // function
  const getMembersData = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      console.log(
        `%cP%c ${"tests"}`,
        "color:#fff;background:#E60023;font-weight:bold;border-radius:2px;display:inline-block;padding:0 4px;",
        ""
      );
      console.log("DATA", DATA);
      const _data = await getMembers(DATA?._id);
      setMembersData(_data)
    } catch (err) {}
  };

  return (
    <>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>ລາຍງານ</Breadcrumb.Item>
          <Breadcrumb.Item active>ລາຍງານສະມາຊິກ</Breadcrumb.Item>
        </Breadcrumb>
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
          <Button
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setPopup({ printReport: true })}
          >
            <AiFillPrinter /> ສະມາຊີກທຸກຄົນ
          </Button>
          <Button
            variant="outline-primary"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <MdOutlineCloudDownload /> ທຸກເມນູ
          </Button>
        </div>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr 1fr", xs: "1fr" },
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
              ຈຳນວນສະມາຊິກ
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  fontWeight: 700,
                }}
              >
                65
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
              ຄະແນນສະສົມ
            </Card.Header>
            <Card.Body>
              {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  fontWeight: 700,
                }}
              >
                7,600
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
              ຈຳນວນເງິນ
            </Card.Header>
            <Card.Body>
              {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  fontWeight: 700,
                }}
              >
                423,000,000
              </div>
            </Card.Body>
          </Card>
        </Box>
        <div>
          <Card border="primary" style={{ margin: 0, marginBottom: 20 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              ລາຍການສະມາຊິກ
            </Card.Header>
            <Card.Body>
              <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <Form.Control placeholder="ຄົ້ນຫາຊື່ສະມາຊິກ" />
                  <Button
                    variant="primary"
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <FaSearch /> ຄົ້ນຫາ
                  </Button>
                </div>
              </div>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>ຊື່ສະມາຊິກ</th>
                  <th style={{ textAlign: "center" }}>ເບີໂທ</th>
                  <th style={{ textAlign: "center" }}>ຄະແນນສະສົມ</th>
                  <th style={{ textAlign: "center" }}>ໃຊ້ບໍລິການ</th>
                  <th style={{ textAlign: "right" }}>ຈັດການ</th>
                </tr>
                {membersData?.map((e) => (
                  <tr>
                    <td style={{ textAlign: "left" }}>{e?.userId?.userId}</td>
                    <td style={{ textAlign: "center" }}>{e?.served}</td>
                    <td style={{ textAlign: "center" }}>{e?.canceled}</td>
                    <td style={{ textAlign: "right" }}>
                    sdf
                    </td>
                  </tr>
                ))}
              </table>
            </Card.Body>
          </Card>
          <Card border="primary" style={{ margin: 0, marginBottom: 20 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              ເມນູຂາຍດີ (ສຳຫຼັບສະມາຊິກ)
            </Card.Header>
            <Card.Body>
              <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <Form.Control placeholder="ຄົ້ນຫາຊື່ເມນູ" />
                  <Button
                    variant="primary"
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <FaSearch /> ຄົ້ນຫາ
                  </Button>
                </div>
              </div>
              <table style={{ width: "100%" }}>
                <tr>
                  <th style={{ textAlign: "left" }}>ຊື່ເມນູ</th>
                  <th style={{ textAlign: "center" }}>ຈຳນວນອໍເດີ</th>
                  <th style={{ textAlign: "center" }}>ຈຳນວນເງິນ</th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
                {/* {userReport?.map((e) => (
                  <tr>
                    <td style={{ textAlign: "left" }}>{e?.userId?.userId}</td>
                    <td style={{ textAlign: "center" }}>{e?.served}</td>
                    <td style={{ textAlign: "center" }}>{e?.canceled}</td>
                    <td style={{ textAlign: "right" }}>
                      {moneyCurrency(e?.totalSaleAmount)}₭
                    </td>
                  </tr>
                ))} */}
              </table>
            </Card.Body>
          </Card>
          <ReportCard title={"ກຣາຟ"} chart={<ReportChartWeek />} />
        </div>
      </Box>
      {/* popup */}
    </>
  );
}

function ReportCard({ title, chart }) {
  return (
    <Card border="primary" style={{ margin: 0 }}>
      <Card.Header
        style={{
          backgroundColor: COLOR_APP,
          color: "#fff",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {title} <BsInfoCircle />
      </Card.Header>
      <Card.Body>
        {/* <Card.Title>Special title treatment</Card.Title>
          <Card.Text>
            With supporting text below as a natural lead-in to additional content.
          </Card.Text> */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 10,
            padding: 10,
          }}
        >
          <ButtonDropdown variant="outline-primary">
            <option>ຍອດຈຳນວນ</option>
            <option>ຍອດເງິນ</option>
          </ButtonDropdown>
          <Button variant="outline-primary">ເລືອກສິນຄ້າ 1 ລາຍການ</Button>
          <ButtonGroup aria-label="Basic example">
            <Button variant="outline-primary">{"<<"}</Button>
            <Button variant="outline-primary">01/03/2023 ~ 31/03/2023</Button>
            <Button variant="outline-primary">{">>"}</Button>
          </ButtonGroup>
          <div>ປຽບທຽບກັບ</div>
          <ButtonDropdown variant="outline-primary">
            <option value={"test"}>ເດືອນແລ້ວ</option>
            <option value={"test2"}>ຕົ້ນປີ</option>
            <option value={"test3"}>01/03/2023 ~ 31/03/2023</option>
          </ButtonDropdown>
          <Button variant="outline-primary">
            <BsArrowCounterclockwise />
          </Button>
        </div>
        <div>{chart}</div>
      </Card.Body>
    </Card>
  );
}
