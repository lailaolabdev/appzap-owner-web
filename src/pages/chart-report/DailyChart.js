import React, { useState, useEffect } from "react";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import EmptyImage from "../../image/empty.png";
import { useStoreStore } from "../../zustand/storeStore";
import { moneyCurrency } from "../../helpers";
const DailyChart = ({ data }) => {
  const { storeDetail } = useStoreStore();
  const { t } = useTranslation();
  const [graphData, setGraphData] = useState({
    options: {},
    series: [],
  });

  // Map values safely
  const _bill = data.map((x) => Number(x.bill || 0));
  const _billAmount = data.map((x) => Number(x.billAmount || 0));
  const _delivery = data.map((x) => Number(x.deliveryAmount || 0));
  const _discount = data.map((x) => Number(x.discount || 0));
  const _order = data.map((x) => Number(x.order || 0));
  const _point = data.map((x) => Number(x.point || 0));

  const TotalAmount = _billAmount.reduce((acc, val) => acc + val, 0);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Convert dates safely
    const _xAxisData = data.map((x) => moment(x.date).format("YYYY-MM-DD"));

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
        text: ` ${t("sales_info")} ${t("every_day")}`,
        align: "center",
        style: {
          fontSize: "20px",
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
        },
      },
      subtitle: {
        text: `Total : ${moneyCurrency(TotalAmount)} ${
          storeDetail?.firstCurrency
        }`,
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
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.5,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      colors: [
        COLOR_APP,
        "#00ABB3",
        "#FF5733",
        "#FFC300",
        "#8A2BE2",
        "#20B2AA",
      ],
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
          formatter: (value) => (value ? value.toLocaleString("en-US") : "0"),
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
            fontFamily: "Noto Sans Lao, Arial, sans-serif",
            fontSize: "12px",
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
          filename: `Sales_Report_${moment().format("YYYY-MM-DD")}`,
          columnHeaderFormatter: (seriesName) => {
            const columnMap = {
              total: "Total",
              bill_amount: "Bill Amount",
              delivery: "Delivery Amount",
              discount: "Discount",
              order: "Orders",
              point: "Points",
            };
            return columnMap[seriesName] || seriesName;
          },
        },
      },
    };

    const _series = [
      { name: t("bill_amount"), data: _bill },
      { name: t("total"), data: _billAmount },
      { name: "delivery", data: _delivery },
      { name: t("discount"), data: _discount },
      { name: t("order"), data: _order },
      { name: t("point"), data: _point },
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

export default DailyChart;
