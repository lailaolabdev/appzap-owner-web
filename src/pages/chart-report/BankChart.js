import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import EmptyImage from "../../image/empty.png";
import { useStoreStore } from "../../zustand/storeStore";
import { moneyCurrency } from "../../helpers";
const BankChart = ({ data }) => {
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const [graphData, setGraphData] = useState({
    options: {},
    series: [],
  });

  useEffect(() => {
    if (!data || !data.data || data.data.length === 0) return;

    // Extract bank names & total amounts safely
    const labels = data?.data
      ?.filter((item) => item.bankDetails?.bankName) // Ensure bankDetails exists
      .map((item) => item.bankDetails.bankName);

    const series = data?.data?.map((item) => Number(item.bankTotalAmount || 0));

    const totalAmount = series.reduce((acc, val) => acc + val, 0);

    const _options = {
      chart: {
        type: "donut",
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
      },
      labels: labels,
      colors: [
        "#00ABB3",
        "#FF5733",
        "#FFC300",
        "#8A2BE2",
        "#DC143C",
        "#20B2AA",
        "#2E8B57",
      ],
      dataLabels: {
        enabled: true,
        formatter: (value, { seriesIndex, w }) => {
          const amount = w.config.series[seriesIndex];
          return `${moneyCurrency(amount)}  ${storeDetail?.firstCurrency}`;
        },
        style: {
          fontFamily: "Noto Sans Lao, sans-serif",
          fontSize: "14px",
        },
      },

      legend: {
        position: "bottom",
        fontFamily: "Noto Sans Lao, sans-serif",
        fontSize: "14px",
      },
      theme: {
        mode: "light",
        fontFamily: "Noto Sans Lao, sans-serif",
      },
      // annotations: {
      //   position: "front",
      //   texts: [
      //     {
      //       text: `Total: ${moneyCurrency(totalAmount)}  ${
      //         storeDetail?.firstCurrency
      //       }`,
      //       x: "50%",
      //       y: "50%",
      //       textAnchor: "middle",
      //       fontSize: "18px",
      //       fontWeight: "bold",
      //       fontFamily: "Noto Sans Lao, sans-serif",
      //     },
      //   ],
      // },
      // plotOptions: {
      //   pie: {
      //     donut: {
      //       labels: {
      //         show: true,
      //         total: {
      //           show: true,
      //           label: "Total",
      //           fontSize: "16px",
      //           fontWeight: "bold",
      //           fontFamily: "Noto Sans Lao, sans-serif",
      //           color: "#333",
      //           formatter: () =>
      //             `\n${moneyCurrency(totalAmount)}  ${
      //               storeDetail?.firstCurrency
      //             }`,
      //         },
      //       },
      //     },
      //   },
      // },
      annotations: {
        position: "front",
        texts: [
          {
            text: "Total",
            x: "50%",
            y: "42%",
            textAnchor: "middle",
            fontSize: "16px",
            fontWeight: "bold",
            fontFamily: "Noto Sans Lao, sans-serif",
            color: "#333",
          },
          {
            text: `${moneyCurrency(totalAmount)} ${storeDetail?.firstCurrency}`,
            x: "50%",
            y: "50%",
            textAnchor: "middle",
            fontSize: "18px",
            fontWeight: "bold",
            fontFamily: "Noto Sans Lao, sans-serif",
            color: "#000",
          },
        ],
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: "14px",
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
          color: "#fff",
        },
        y: {
          formatter: (value) =>
            `${moneyCurrency(value)}  ${storeDetail?.firstCurrency}`,
        },
      },
    };

    setGraphData({
      options: _options,
      series: series,
    });
  }, [data, t]);

  return (
    <div>
      {graphData.series.length > 0 ? (
        <ReactApexChart
          options={graphData.options}
          series={graphData.series}
          type="donut"
          height={350}
        />
      ) : (
        <div className="flex justify-center items-center">
          <img src={EmptyImage} className="w-[300px] h-[200px]" alt="No Data" />
        </div>
      )}
    </div>
  );
};

export default BankChart;
