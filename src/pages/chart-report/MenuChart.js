import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import EmptyImage from "../../image/empty.png";
import moment from "moment";
import { useStoreStore } from "../../zustand/storeStore";
import { moneyCurrency } from "../../helpers";
const MenuChart = ({ data }) => {
  // console.log("MenuChart Data:", data);
  const { storeDetail } = useStoreStore();

  const { t } = useTranslation();
  const [graphData, setGraphData] = useState({
    options: {},
    series: [],
  });

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Extract menu names for the X-axis
    const _xAxisData = data.map((x) => x.name);
    const _canceled = data.map((x) => Number(x.canceled || 0));
    const _served = data.map((x) => Number(x.served || 0));
    const _totalSaleAmount = data.map((x) => Number(x.totalSaleAmount || 0));

    const total_canceled = _canceled.reduce((acc, val) => acc + val, 0);
    const total_served = _served.reduce((acc, val) => acc + val, 0);
    const total_SaleAmount = _totalSaleAmount.reduce(
      (acc, val) => acc + val,
      0
    );

    const _options = {
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: true,
          tools: { download: true },
        },
      },
      title: {
        text: t("menu_info"),
        align: "center",
        style: {
          fontSize: "20px",
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
        },
      },
      subtitle: {
        text: `${t("total_sale")} : ${moneyCurrency(total_SaleAmount)} ${
          storeDetail?.firstCurrency
        },
              ${t("served")} : ${moneyCurrency(total_served)}, ${t(
          "canceled"
        )} : ${moneyCurrency(total_canceled)}`,
        align: "center",
        style: {
          marginTop: "25px",
          fontSize: "16px",
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
          fontWeight: "bold",
          color: "#555",
        },
      },
      stroke: {
        curve: "smooth",
      },
      colors: [
        "#FF5733",
        "#00ABB3",
        "#FFC300",
        "#8A2BE2",
        "#20B2AA",
        "#6A0572",
      ],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.5,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
        formatter: (value) => (value ? value.toLocaleString("en-US") : 0),
        style: {
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
          fontSize: "12px",
        },
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => value.toLocaleString("en-US") || "0",
          style: {
            fontFamily: "Noto Sans Lao, Arial, sans-serif",
            fontSize: "12px",
          },
        },
      },
      xaxis: {
        categories: _xAxisData,
        labels: {
          formatter: (value) => (value ? value : ""),
          style: {
            fontSize: "10px",
            fontFamily: "Noto Sans Lao, Arial, sans-serif",
          },
        },
      },
      legend: {
        fontFamily: "Noto Sans Lao, Arial, sans-serif",
        fontSize: "12px",
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: "14px",
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
        },
        y: {
          formatter: (value) => `${value.toLocaleString()}`,
        },
      },
      theme: {
        mode: "light",
        fontFamily: "Noto Sans Lao, Arial, sans-serif",
      },
      export: {
        csv: {
          filename: `Sales_Report_${new Date().toISOString().split("T")[0]}`,
          columnHeaderFormatter: (seriesName) => {
            const columnMap = {
              canceled: "Canceled Orders",
              served: "Served Orders",
              totalSaleAmount: "Total Sales Amount",
            };
            return columnMap[seriesName] || seriesName;
          },
        },
      },
    };

    const _series = [
      { name: t("canceled"), data: _canceled },
      { name: t("served"), data: _served },
      { name: t("total_sales"), data: _totalSaleAmount },
    ];

    setGraphData({
      options: _options,
      series: _series,
    });
  }, [data, t]);

  return (
    <div>
      {/* {graphData.series.length > 0 ? ( */}
      <ReactApexChart
        className="py-4 px-2"
        options={graphData.options}
        series={graphData.series}
        type="area"
        height={350}
      />
      {/* ) : (
        <div className="flex justify-center items-center">
          <img src={EmptyImage} className="w-[300px] h-[200px]" alt="No Data" />
        </div>
      )} */}
    </div>
  );
};

export default MenuChart;
