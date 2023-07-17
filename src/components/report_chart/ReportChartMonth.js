// import React, { useState } from "react";
// import ReactApexChart from "react-apexcharts";
import { COLOR_APP } from "../../constants";
// export default function ReportChartMonth() {
//   const [series] = useState([
//     {
//       name: "all",
//       data: [...new Array(31)].map(() => randomData(50_000_000, 34_000_000)),
//     },
//     {
//       name: "beer",
//       data: [...new Array(31)].map(() => randomData(24_000_000, 16_000_00)),
//     },
//     {
//       name: "tea",
//       data: [...new Array(31)].map(() => randomData(7_000_000, 5_000_000)),
//     },
//     {
//       name: "ice",
//       data: [...new Array(31)].map(() => randomData(5_000_000, 4_500_000)),
//     },
//   ]);
//   const [options] = useState({
//     chart: {
//       height: 350,
//       type: "line",
//       zoom: {
//         enabled: false,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       curve: "straight",
//     },
//     colors: [
//       COLOR_APP,
//       "#00ABB3",
//       "#CDC2AE",
//       "#EA906C",
//       "#00DFA2",
//       "#F266AB",
//       "#025464",
//       "#99627A",
//     ],
//     dataLabels: {
//       enabled: true,
//     },
//     title: {
//       text: "Sale Trends by Day",
//       align: "left",
//     },
//     grid: {
//       row: {
//         colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
//         opacity: 0.5,
//       },
//     },
//     xaxis: {
//       categories: [...new Array(31)].map((e, i) => i + 1),
//     },
//   });

//   return (
//     <div id="chart">
//       <ReactApexChart
//         options={options}
//         series={series}
//         type="line"
//         height={350}
//       />
//     </div>
//   );
// }

// const randomData = (max, min) => {
//   const rndInt = Math.floor(Math.random() * (max - min) + min) + 1;
//   return rndInt;
// };

import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ReportChartMonth = () => {
  // state
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

  // useEffect

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
