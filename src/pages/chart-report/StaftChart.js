import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import EmptyImage from "../../image/empty.png";
import { useStoreStore } from "../../zustand/storeStore";
import { moneyCurrency } from "../../helpers";
const StaftChart = ({ data }) => {
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const [graphData, setGraphData] = useState({
    options: {},
    series: [],
  });

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Aggregate data from multiple staff records
    let totalCanceled = 0;
    let totalPaid = 0;
    let totalServed = 0;
    let totalSaleAmount = 0;

    const _series = data.forEach((staff) => {
      totalCanceled += Number(staff.canceled || 0);
      totalPaid += Number(staff.paid || 0);
      totalServed += Number(staff.served || 0);
      totalSaleAmount += Number(staff.totalSaleAmount || 0);
    });

    // Labels and Series Data
    const labels = [
      `${t("canceled")} (${totalCanceled})`,
      `${t("paid")} (${totalPaid})`,
      `${t("served")} (${totalServed})`,
      // `${t("total_sales")} (${totalSaleAmount})`,
    ];
    const series = [totalCanceled, totalPaid, totalServed];
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
      title: {
        align: "center",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: "Noto Sans Lao, sans-serif",
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
      //       text: `Total: ${moneyCurrency(totalSaleAmount)}  ${
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
      //             `\n${moneyCurrency(totalSaleAmount)}  ${
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
            text: `${moneyCurrency(totalSaleAmount)} ${
              storeDetail?.firstCurrency
            }`,
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
          formatter: (value) => `${moneyCurrency(value)}`,
        },
      },
      export: {
        csv: {
          filename: `Staff_Report_${new Date().toISOString().split("T")[0]}`,
          columnHeaderFormatter: (seriesName) => {
            const columnMap = {
              [t("canceled")]: "Canceled Orders",
              [t("paid")]: "Paid Orders",
              [t("served")]: "Served Orders",
              [t("total_sales")]: "Total Sales Amount (KIP)",
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

export default StaftChart;
