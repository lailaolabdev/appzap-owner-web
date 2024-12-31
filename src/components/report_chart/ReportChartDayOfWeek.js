import { COLOR_APP } from "../../constants";

import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { converMoney } from "../../helpers/converMoney";

import { useStoreStore } from "../../zustand/storeStore";

const ReportChartDayOfWeek = ({ series }) => {
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
        categories: ["ຈັນ", "ຄານ", "ພຸດ", "ພະຫັດ", "ສຸກ", "ເສົາ", "ທິດ"],
      },
      yaxis: {
        title: {
          text: `ຈຳນວນເງິນເປັນ (${storeDetail?.firstCurrency})`,
        },
        labels: {
          formatter: (value) => {
            return converMoney(value) + ` ${storeDetail?.firstCurrency})`;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return converMoney(val) + ` ${storeDetail?.firstCurrency})`;
          },
        },
      },
    },
  });

  const { storeDetail } = useStoreStore()
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

export default ReportChartDayOfWeek;
