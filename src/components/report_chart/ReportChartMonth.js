import { COLOR_APP } from "../../constants";

import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { converMoney } from "../../helpers/converMoney";

const ReportChartMonth = ({ series }) => {
  // state
  const [state, setState] = useState({
    series: [
      {
        name: "2022",
        data: [8000, 9000, 5700, 5600, 61, 58, 63, 60, 66, 34, 54, 23],
      },
      {
        name: "2023",
        data: [7600, 8500, 10100, 98, 87, 105, 91, 114, 94, 34, 54, 23],
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
        categories: [...new Array(31)].map((e, i) => i + 1),
      },
      yaxis: {
        title: {
          text: "ຈຳນວນເງິນເປັນ (ກີບ)",
        },
        labels: {
          formatter: (value) => {
            return converMoney(value) + " ກີບ";
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return converMoney(val) + " ກີບ";
          },
        },
      },
    },
  });

  // useEffect
  useEffect(() => {
    setState((prev) => ({ ...prev, series: series }));
  }, [series]);

  // function

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default ReportChartMonth;
