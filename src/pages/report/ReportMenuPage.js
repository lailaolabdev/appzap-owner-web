import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, Button, Form, ButtonGroup, Breadcrumb } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import { COLOR_APP } from "../../constants";
import ButtonDropdown from "../../components/button/ButtonDropdown";
import { BsArrowCounterclockwise, BsInfoCircle } from "react-icons/bs";
import ReportChartMonth from "../../components/report_chart/ReportChartMonth";
import ReportChartWeek from "../../components/report_chart/ReportChartWeek";
import ReportChartDay from "../../components/report_chart/ReportChartDay";
import PopupDaySplitView from "../../components/popup/report/PopupDaySplitView";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import { getDashboardBillMonth } from "../../services/dashboard";
import moment from "moment";
import { useStore } from "../../store";

export default function ReportMenuPage() {
  const [popup, setPopup] = useState();

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
        <DashboardBillMonthCard
          title={"ລາຍເດືອນ (Compare across Months)"}
          chart={<ReportChartMonth />}
        />
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

function DashboardBillMonthCard({ title, chart }) {
  //state
  const [popup, setPopup] = useState();
  const [series, setSeries] = useState([]);
  const [date1, setDate1] = useState();
  const [date2, setDate2] = useState();
  const [month1, setMonth1] = useState();
  const [month2, setMonth2] = useState();
  const [categories, setCategories] = useState([...new Array(31)]);
  const [state, setState] = useState({
    series: [
      {
        name: "Net Profit",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Revenue",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: "Free Cash Flow",
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      colors: [
        COLOR_APP,
        "#00ABB3",
        "#CDC2AE",
        "#EA906C",
        "#00DFA2",
        "#F266AB",
        "#025464",
        "#99627A",
      ],
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
      },
      yaxis: {
        title: {
          text: "$ (thousands)",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    },
  });
  const [startDate1, setStartDate1] = useState(moment().format("YYYY-MM-DD")); //1
  const [endDate1, setEndDate1] = useState(moment().format("YYYY-MM-DD")); //1
  const [startTime1, setStartTime1] = useState("00:00:00"); //1
  const [endTime1, setEndTime1] = useState("23:59:59"); //1

  const [startDate2, setStartDate2] = useState(moment().format("YYYY-MM-DD")); //2
  const [endDate2, setEndDate2] = useState(moment().format("YYYY-MM-DD")); //2
  const [startTime2, setStartTime2] = useState("00:00:00"); //2
  const [endTime2, setEndTime2] = useState("23:59:59"); //2

  // provider
  const { storeDetail } = useStore();

  // useEffect
  useEffect(() => {
    setSeries([date1, date2]);
  }, []);
  useEffect(() => {
    getDashboardData1();
  }, [month1]);
  useEffect(() => {
    setStartDate2();
    getDashboardData2();
  }, [month2]);

  // function
  const getDashboardData1 = async () => {
    const startDate = moment(month1).format("YYYY-MM-DD");
    const endDate = moment(month1).endOf("month").format("YYYY-MM-DD");
    const startTime = "00:00:00";
    const endTime = "23:59:59";
    const findBy = `?startDate=${startDate}&endDate=${endDate}&endTime=${endTime}&startTime=${startTime}`;
    const data = await getDashboardBillMonth(storeDetail?._id, findBy);
    setDate1(data);
  };
  const getDashboardData2 = async () => {
    const findBy = `?startDate=${startDate2}&endDate=${endDate2}&endTime=${endTime2}&startTime=${startTime2}`;
    const data = await getDashboardBillMonth(storeDetail?._id, findBy);
    setDate2(data);
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
                alert(e.target.value);
                alert(moment(e.target.value).format("YYYY-MM-DD"));
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
        <div>{chart}</div>
      </Card.Body>
    </Card>
  );
}
