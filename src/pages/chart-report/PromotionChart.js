import React, { useState, useEffect } from "react";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import EmptyImage from "../../image/empty.png";
import { useStoreStore } from "../../zustand/storeStore";
import { moneyCurrency } from "../../helpers";
const PromotionChart = ({ data }) => {
  // console.log("PromotionChart Data:", data);
  const { storeDetail } = useStoreStore();
  const { t } = useTranslation();
  const [graphData, setGraphData] = useState({
    options: {},
    series: [],
  });

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Format x-axis with date values
    const _xAxisData = data.map((x) => moment(x.date).format("YYYY-MM-DD"));
    // Extract bill count and total discount
    const _billCount = data.map((x) => x.billCount || 0);
    const _totalDiscount = data.map((x) => x.totalDiscount || 0);
    const total = _totalDiscount.reduce((acc, val) => acc + val, 0);

    const _options = {
      chart: {
        height: 350,
        type: "area", // Keep it as area chart
        toolbar: {
          show: true,
          tools: {
            download: true, // Enable CSV download
          },
        },
      },
      title: {
        text: t("promotion"),
        align: "center",
        style: {
          fontSize: "20px",
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
        },
      },
      subtitle: {
        text: `Total : ${moneyCurrency(total)} ${storeDetail?.firstCurrency}`,
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
        curve: "straight", // Use straight lines like in SellChart
      },
      colors: [COLOR_APP, "#00ABB3", "#FF5733", "#FFC300"],
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
          formatter: (value) => (value ? value.toLocaleString("en-US") : 0),
          style: {
            fontFamily: "Noto Sans Lao, Arial, sans-serif",
            fontSize: "12px",
          },
        },
      },
      xaxis: {
        categories: _xAxisData,
        labels: {
          formatter: (value) =>
            value ? moment(value).format("DD-MM-YYYY") : "",
          style: {
            fontSize: "10px",
            fontFamily: "Noto Sans Lao, Arial, sans-serif",
          },
        },
      },
      legend: {
        fontFamily: "Noto Sans Lao, Arial, sans-serif",
        fontSize: "14px",
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: "14px",
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
        },
        y: {
          formatter: (value) => `${value.toLocaleString()} LAK`,
        },
      },
      theme: {
        mode: "light",
        fontFamily: "Noto Sans Lao, Arial, sans-serif",
      },
      export: {
        csv: {
          filename: `Promotion_Report_${moment().format("YYYY-MM-DD")}`,
          columnHeaderFormatter: (seriesName) => {
            const columnMap = {
              discount_bill: "Bill Count",
              all_discount: "Total Discount (LAK)",
            };
            return columnMap[seriesName] || seriesName;
          },
        },
      },
    };

    // Define series like SellChart
    const _series = [
      {
        name: t("discount_bill"),
        data: _billCount,
      },
      {
        name: t("all_discount"),
        data: _totalDiscount,
      },
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
        className="py-4 p-2"
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

export default PromotionChart;
