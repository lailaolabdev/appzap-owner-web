import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import EmptyImage from "../../image/empty.png";
import { useStoreStore } from "../../zustand/storeStore";
import { moneyCurrency } from "../../helpers";
const CurrencyChart = ({ data }) => {
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const [graphData, setGraphData] = useState({
    options: {},
    series: [],
  });

  useEffect(() => {
    if (!data || !data.data || data.data.length === 0) return;

    // Extract bank names & total amounts safely
    const labels = data?.data?.map((item) => item.currency.currencyName);

    const series = data?.data?.map((item) => Number(item.currencyTotal || 0));
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
      //           color: "#333",
      //           formatter: () => `\n${moneyCurrency(totalAmount)}`, // ให้ตัวเลขขึ้นบรรทัดใหม่
      //         },
      //       },
      //     },
      //   },
      // },
      dataLabels: {
        enabled: true,
        formatter: (value, { seriesIndex, w }) => {
          const amount = w.config.series[seriesIndex];
          return `${moneyCurrency(amount)}`;
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
      //       text: `Total: ${moneyCurrency(totalAmount)} `,
      //       x: "50%",
      //       y: "50%",
      //       textAnchor: "middle",
      //       fontSize: "18px",
      //       fontWeight: "bold",
      //       fontFamily: "Noto Sans Lao, sans-serif",
      //     },
      //   ],
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
            text: `${moneyCurrency(totalAmount)}`,
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
          formatter: (value) => `${moneyCurrency(value)} `,
        },
      },
      export: {
        csv: {
          filename: `Bank_Report_${new Date().toISOString().split("T")[0]}`,
          columnHeaderFormatter: (seriesName) => {
            const columnMap = {
              "Total cash": "Cash Payments",
              "Total transfer": "Bank Transfers",
              BCEL: "BCEL Bank",
              LDB: "Lao Development Bank",
              JDB: "Joint Development Bank",
              APB: "Agricultural Promotion Bank",
            };
            return columnMap[seriesName] || seriesName;
          },
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

export default CurrencyChart;
