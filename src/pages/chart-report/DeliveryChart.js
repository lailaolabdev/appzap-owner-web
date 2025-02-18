import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import EmptyImage from "../../image/empty.png";
import { useStoreStore } from "../../zustand/storeStore";
import { moneyCurrency } from "../../helpers";

const DeliveryChart = ({ data }) => {
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const [graphData, setGraphData] = useState({
    options: {},
    series: [],
  });

  useEffect(() => {
    if (!data || !data.delivery || data.delivery.length === 0) return;

    const revenueData = data.delivery[0]?.revenueByPlatform || [];

    const filteredData = revenueData.filter(
      (item) => item._id && item.totalRevenue
    );

    // Extract labels and series
    const labels = filteredData.map((item) => item._id || "Unknown");
    const series = filteredData.map((item) => Number(item.totalRevenue || 0));

    // Calculate total revenue
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
          return `${moneyCurrency(amount)} ${storeDetail?.firstCurrency}`;
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
            `${moneyCurrency(value)} ${storeDetail?.firstCurrency}`,
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

export default DeliveryChart;
