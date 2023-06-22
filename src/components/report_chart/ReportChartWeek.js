import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { COLOR_APP } from "../../constants";
export default function ReportChartWeek() {
  const [series] = useState([
    {
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69],
    },
    {
      name: "op",
      data: [0, 1, 64, 98, 57, 78, 98],
    },
  ]);
  const [options] = useState({
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    colors: [COLOR_APP, "#00ABB3"],
    dataLabels: {
      enabled: true,
    },
    title: {
      text: "Sale Trends by Day",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: ["ອາທິດ", "ຈັນ", "ຄານ", "ພຸດ", "ພະຫັດ", "ສຸກ", "ເສົາ"],
    },
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
}
