import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, Button, Form, ButtonGroup, Breadcrumb } from "react-bootstrap";
import * as _ from "lodash";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import { COLOR_APP } from "../../constants";
import ButtonDropdown from "../../components/button/ButtonDropdown";
import { BsArrowCounterclockwise, BsInfoCircle } from "react-icons/bs";
import ReportChartMonth from "../../components/report_chart/ReportChartMonth";
import ReportChartWeek from "../../components/report_chart/ReportChartWeek";
import ReportChartDay from "../../components/report_chart/ReportChartDay";
import ReportChartDayOfWeek from "../../components/report_chart/ReportChartDayOfWeek";
import PopupDaySplitView from "../../components/popup/report/PopupDaySplitView";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import { getDashboardBillMonth } from "../../services/dashboard";
import moment from "moment";
import { useStore } from "../../store";
import {
  getReports,
  getSalesInformationReport,
  getUserReport,
  getMenuReport,
  getCategoryReport,
  getMoneyReport,
  getPromotionReport,
} from "../../services/report";
import "moment/locale/lo";
import PopupSelectMenuForDashboard from "../../components/popup/PopupSelectMenuForDashboard";

import { useStoreStore } from "../../zustand/storeStore";

export default function ReportMenuPage() {
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

  const { storeDetail } = useStoreStore()

  // useEffect
  useEffect(() => {
    getReportData();
    getSalesInformationReportData();
    getUserReportData();
    getMenuReportData();
    getMoneyReportData();
    getPromotionReportData();
    getCategoryReportData();
  }, [endDate, startDate, endTime, startTime]);

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
  const getCategoryReportData = async () => {
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getCategoryReport(storeDetail?._id, findBy);
    setCategoryReport(data);
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
    <div style={{ padding: 20 }}>
      <Breadcrumb>
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
          Library
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Data</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* <ReportChart1 /> */}
        <DashboardBillMonthCard title={"ລາຍເດືອນ (Compare across Months)"} />
        <DashboardBillWeekCard title={"ລາຍອາທິດ (Compare across Weeks)"} />
        <ReportCard
          title={"ລາຍອາທິດ (Compare across Weeks)"}
          chart={<ReportChartWeek />}
        />
        <ReportCard
          title={"ລາຍວັນ (Compare across Days)"}
          chart={<ReportChartDay />}
        />
      </div>
      <PopUpSetStartAndEndDate />
      {/* <PopupSelectMenuForDashboard open /> */}
    </div>
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

function DashboardBillMonthCard({ title }) {
  //state
  const [series, setSeries] = useState([]);
  const [month1, setMonth1] = useState();
  const [month2, setMonth2] = useState();

  const [reportDataMonth1, setReportDataMonth1] = useState([]);
  const [reportDataMonth2, setReportDataMonth2] = useState([]);

  // provider
  const { storeDetail } = useStore();

  // useEffect
  useEffect(() => {
    if (month1) {
      getReportDataMonth1();
    }
  }, [month1]);
  useEffect(() => {
    if (month2) {
      getReportDataMonth2();
    }
  }, [month2]);

  useEffect(() => {
    let _series = [];
    if (reportDataMonth1) {
      let _month1 = {
        name: month1,
        data: [...new Array(31)].map((e, i) => {
          const data = reportDataMonth1.find((item) => {
            if (
              parseInt(moment(item?.date, "YYYY-MM-DD").format("DD")) ==
              i + 1
            ) {
              return true;
            }
            return false;
          });
          console.log("first", data);
          if (data) {
            return data?.billAmount;
          } else {
            return null;
          }
        }),
      };
      _series.push(_month1);
    }
    if (reportDataMonth2) {
      let _month2 = {
        name: month2,
        data: [...new Array(31)].map((e, i) => {
          const data = reportDataMonth2.find((item) => {
            if (parseInt(moment(item?.date).format("DD")) == i + 1) {
              return true;
            }
            return false;
          });
          if (data) {
            return data?.billAmount;
          } else {
            return null;
          }
        }),
      };
      _series.push(_month2);
    }

    setSeries(_series);
  }, [reportDataMonth1, reportDataMonth2]);

  // function
  const getReportDataMonth1 = async () => {
    const startDate = moment(month1, "YYYY-MM")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(month1, "YYYY-MM")
      .endOf("month")
      .format("YYYY-MM-DD");
    const endTime = "00:00:00";
    const startTime = "23:59:59";

    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getReports(storeDetail?._id, findBy);
    setReportDataMonth1(data);
  };
  const getReportDataMonth2 = async () => {
    const startDate = moment(month2, "YYYY-MM")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(month2, "YYYY-MM")
      .endOf("month")
      .format("YYYY-MM-DD");
    const endTime = "00:00:00";
    const startTime = "23:59:59";
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getReports(storeDetail?._id, findBy);
    setReportDataMonth2(data);
  };

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
            <Form.Control
              type="month"
              variant="outline-primary"
              style={{ borderRadius: 0 }}
              value={month1}
              onChange={(e) => {
                console.log(e.target.value);
                setMonth1(e.target.value);
              }}
            />
            <Button variant="outline-primary">{">>"}</Button>
          </ButtonGroup>
          <div>ປຽບທຽບກັບ</div>
          <ButtonGroup aria-label="Basic example">
            <Button variant="outline-primary">{"<<"}</Button>
            <Form.Control
              type="month"
              variant="outline-primary"
              style={{ borderRadius: 0 }}
              value={month2}
              onChange={(e) => {
                setMonth2(e.target.value);
              }}
            />
            <Button variant="outline-primary">{">>"}</Button>
          </ButtonGroup>
          <Button variant="outline-primary">
            <BsArrowCounterclockwise />
          </Button>
        </div>
        <div>
          <ReportChartMonth series={series} />
        </div>
      </Card.Body>
    </Card>
  );
}

function DashboardBillWeekCard({ title }) {
  //state
  const [series, setSeries] = useState([]);
  const [month1, setMonth1] = useState();
  const [month2, setMonth2] = useState();

  const [reportDataMonth1, setReportDataMonth1] = useState([]);
  const [reportDataMonth2, setReportDataMonth2] = useState([]);

  // provider
  const { storeDetail } = useStore();

  // useEffect
  useEffect(() => {
    if (month1) {
      getReportDataMonth1();
    }
  }, [month1]);
  useEffect(() => {
    if (month2) {
      getReportDataMonth2();
    }
  }, [month2]);

  useEffect(() => {
    let _series = [];
    if (reportDataMonth1) {
      let _month1 = {
        name: month1,
        data: ["ຈັນ", "ອັງຄານ", "ພຸດ", "ພະຫັດ", "ສຸກ", "ເສົາ", "ອາທິດ"].map(
          (e, i) => {
            const data = reportDataMonth1.filter((item) => {
              console.log(moment(item?.date, "YYYY-MM-DD").format("dddd"));
              if (moment(item?.date, "YYYY-MM-DD").format("dddd") == e) {
                return true;
              }
              return false;
            });
            const _sum = _.sumBy(data, function (o) {
              return o.billAmount;
            });
            if (_sum) {
              return _sum;
            } else {
              return null;
            }
          }
        ),
      };
      _series.push(_month1);
    }
    if (reportDataMonth2) {
      let _month2 = {
        name: month2,
        data: ["ຈັນ", "ອັງຄານ", "ພຸດ", "ພະຫັດ", "ສຸກ", "ເສົາ", "ອາທິດ"].map(
          (e, i) => {
            const data = reportDataMonth2.filter((item) => {
              console.log(moment(item?.date, "YYYY-MM-DD").format("dddd"));
              if (moment(item?.date, "YYYY-MM-DD").format("dddd") == e) {
                return true;
              }
              return false;
            });
            const _sum = _.sumBy(data, function (o) {
              return o.billAmount;
            });
            if (_sum) {
              return _sum;
            } else {
              return null;
            }
          }
        ),
      };
      _series.push(_month2);
    }

    setSeries(_series);
  }, [reportDataMonth1, reportDataMonth2]);

  // function
  const getReportDataMonth1 = async () => {
    const startDate = moment(month1, "YYYY-MM")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(month1, "YYYY-MM")
      .endOf("month")
      .format("YYYY-MM-DD");
    const endTime = "00:00:00";
    const startTime = "23:59:59";

    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getReports(storeDetail?._id, findBy);
    setReportDataMonth1(data);
  };
  const getReportDataMonth2 = async () => {
    const startDate = moment(month2, "YYYY-MM")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(month2, "YYYY-MM")
      .endOf("month")
      .format("YYYY-MM-DD");
    const endTime = "00:00:00";
    const startTime = "23:59:59";
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getReports(storeDetail?._id, findBy);
    setReportDataMonth2(data);
  };

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
            <Form.Control
              type="month"
              variant="outline-primary"
              style={{ borderRadius: 0 }}
              value={month1}
              onChange={(e) => {
                console.log(e.target.value);
                setMonth1(e.target.value);
              }}
            />
            <Button variant="outline-primary">{">>"}</Button>
          </ButtonGroup>
          <div>ປຽບທຽບກັບ</div>
          <ButtonGroup aria-label="Basic example">
            <Button variant="outline-primary">{"<<"}</Button>
            <Form.Control
              type="month"
              variant="outline-primary"
              style={{ borderRadius: 0 }}
              value={month2}
              onChange={(e) => {
                setMonth2(e.target.value);
              }}
            />
            <Button variant="outline-primary">{">>"}</Button>
          </ButtonGroup>
          <Button variant="outline-primary">
            <BsArrowCounterclockwise />
          </Button>
        </div>
        <div>
          <ReportChartDayOfWeek series={series} />
        </div>
      </Card.Body>
    </Card>
  );
}
