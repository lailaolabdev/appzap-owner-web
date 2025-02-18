import React, { useState, useEffect } from "react";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import EmptyImage from "../../image/empty.png";
import { useStoreStore } from "../../zustand/storeStore";
import { moneyCurrency } from "../../helpers";

const SellChart = ({ data }) => {
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const [graphData, setGraphData] = useState({
    options: {},
    series: [],
  });

  useEffect(() => {
    if (!data || data.length === 0) return;

    const _xAxisData = data.map((x) => moment(x.date).format("YYYY-MM-DD"));
    const _incomeData = data.map((x) => x.totalSales || 0);
    const _noOfTransactions = data.map((x) => x.noOfTransactions || 0);
    const _profitData = data.map((x) => x.grossProfit || 0);

    const totalTransactions = _noOfTransactions.reduce(
      (acc, val) => acc + val,
      0
    );
    const totalIncome = _incomeData.reduce((acc, val) => acc + val, 0);

    const _options = {
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
      },
      title: {
        text: t("sales_info"),
        align: "center",
        style: {
          fontSize: "20px",
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
        },
      },
      subtitle: {
        text: `Total : ${moneyCurrency(totalIncome)} ${
          storeDetail?.firstCurrency
        } (Bill : ${moneyCurrency(totalTransactions)})`,
        align: "center",
        style: {
          fontSize: "16px",
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
          fontWeight: "bold",
          color: "#555",
        },
      },
      stroke: {
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.5,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      colors: [COLOR_APP, "#00ABB3", "#FFC300"],
      dataLabels: {
        enabled: false,
        formatter: (value) => (value ? moneyCurrency(value) : 0),
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
          formatter: (value) => (value ? moneyCurrency(value) : 0),
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
          formatter: (value) => `${moneyCurrency(value)}`,
        },
      },
      theme: {
        mode: "light",
        fontFamily: "Noto Sans Lao, Arial, sans-serif",
      },
    };

    const _series = [
      {
        name: t("total_sale"),
        data: _incomeData,
      },
      {
        name: t("business_amount"),
        data: _noOfTransactions,
      },
      {
        name: t("per_bsn"),
        data: _profitData,
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
        className="py-4 px-2"
        options={graphData.options}
        series={graphData.series}
        type="area"
        height={350}
      />
      {/* ) : (
        <div className="flex justify-center items-center">
          <img src={EmptyImage} className="w-[300px] h-[200px]" alt="" />
        </div>
      )} */}
    </div>
  );
};

export default SellChart;
