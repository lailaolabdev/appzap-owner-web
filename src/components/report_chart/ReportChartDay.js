import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { COLOR_APP } from "../../constants";
export default function ReportChartDay() {
  const [series] = useState([
    {
      name: "Desktops",
      data: [
        2, 2, 4, 5, 6, 3, 4, 5, 6, 7, 8, 9, 5, 4, 6, 6, 7, 8, 3, 2, 3, 4, 5, 6,
      ],
    },
    {
      name: "op",
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 3, 2, 3, 4, 4, 5, 5, 7],
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
      categories: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
        "24:00",
      ],
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
