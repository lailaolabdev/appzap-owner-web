import React, { useState } from "react";
import styled from "styled-components";
import { Card, Button, Form, ButtonGroup } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import { COLOR_APP } from "../../constants";
import ButtonDropdown from "../../components/button/ButtonDropdown";
import { BsArrowCounterclockwise, BsInfoCircle } from "react-icons/bs";
import ReportChartMonth from "../../components/report_chart/ReportChartMonth";
import ReportChartWeek from "../../components/report_chart/ReportChartWeek";
import ReportChartDay from "../../components/report_chart/ReportChartDay";

export default function ReportMenuPage() {
  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* <ReportChart1 /> */}
      <ReportCard
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
