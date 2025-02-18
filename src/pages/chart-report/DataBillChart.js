import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import EmptyImage from "../../image/empty.png";
import { useStoreStore } from "../../zustand/storeStore";
import { moneyCurrency } from "../../helpers";
const DataBillChart = ({ data }) => {
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const [graphData, setGraphData] = useState({
    options: {},
    series: [],
  });

  useEffect(() => {
    if (!data || data.length === 0) return;

    const categories = data?.map((item) => item.date);

    const paymentMethods = Object.keys(data[0]).filter((key) => key !== "date");

    const seriesData = paymentMethods.map((method) => ({
      // name: t(method.toLowerCase()),
      name: method,
      data: data?.map((item) => {
        return (
          item[method]?.reduce((sum, entry) => sum + entry.totalAmount, 0) || 0
        );
      }),
    }));

    const totalSales = data.reduce((sum, item) => {
      return (
        sum +
        paymentMethods
          ?.filter((method) => method !== "DEBT")
          ?.reduce((methodSum, method) => {
            return (
              methodSum +
              (item[method]?.reduce(
                (entrySum, entry) => entrySum + entry.totalAmount,
                0
              ) || 0)
            );
          }, 0)
      );
    }, 0);
    const totalCountBill = data.reduce((sum, item) => {
      return (
        sum +
        paymentMethods
          ?.filter((method) => method !== "DEBT")
          ?.reduce((methodSum, method) => {
            return (
              methodSum +
              (item[method]?.reduce(
                (entrySum, entry) => entrySum + entry.count,
                0
              ) || 0)
            );
          }, 0)
      );
    }, 0);

    const _options = {
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: true,
          tools: { download: true },
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
      title: {
        text: t("bill_detial"),
        align: "center",
        style: {
          fontSize: "20px",
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
        },
      },
      subtitle: {
        text: `Total : ${moneyCurrency(totalSales)} ${
          storeDetail?.firstCurrency
        } (Bill : ${totalCountBill})`,
        align: "center",
        style: {
          marginTop: "25px",
          fontSize: "16px",
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
          fontWeight: "bold",
          color: "#555",
        },
      },
      colors: [
        "#FF5733",
        "#00ABB3",
        "#FFC300",
        "#8A2BE2",
        "#DC143C",
        "#20B2AA",
        "#C71585",
        "#BA55D3",
        "#663399",
      ],
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
        categories: categories,
        labels: {
          style: {
            fontSize: "10px",
            fontFamily: "Noto Sans Lao, Arial, sans-serif",
          },
        },
      },
      // legend: {
      //   fontFamily: "Noto Sans Lao, Arial, sans-serif",
      //   fontSize: "14px",
      // },
      // tooltip: {
      //   enabled: true,
      //   shared: true,
      //   followCursor: true,
      //   style: {
      //     fontSize: "14px",
      //     fontFamily: "Noto Sans Lao, Arial, sans-serif",
      //   },
      //   y: {
      //     formatter: (value, { seriesIndex, dataPointIndex, w }) => {
      //       const method = w.globals.seriesNames[seriesIndex];
      //       const count =
      //         data[dataPointIndex]?.[method]?.reduce(
      //           (entrySum, entry) => entrySum + entry.count,
      //           0
      //         ) || 0;

      //       return `${moneyCurrency(value)} ${
      //         storeDetail?.firstCurrency
      //       } (Bills: ${count})`;
      //     },
      //   },
      // },

      legend: {
        fontFamily: "Noto Sans Lao, Arial, sans-serif",
        fontSize: "14px",
        labels: {
          colors: "#333",
          useSeriesColors: false,
        },
        formatter: (seriesName) => t(seriesName.toLowerCase()), // Convert to lowercase
      },
      tooltip: {
        enabled: true,
        shared: true,
        followCursor: true,
        style: {
          fontSize: "14px",
          fontFamily: "Noto Sans Lao, Arial, sans-serif",
        },
        y: {
          formatter: (value, { seriesIndex, dataPointIndex, w }) => {
            const method = w.globals.seriesNames[seriesIndex]; // Convert to lowercase
            const count =
              data[dataPointIndex]?.[method]?.reduce(
                (entrySum, entry) => entrySum + entry.count,
                0
              ) || 0;

            return `${moneyCurrency(value)} ${storeDetail?.firstCurrency} (${t(
              "bills"
            )}: ${count})`;
          },
        },
      },
      theme: {
        mode: "light",
        fontFamily: "Noto Sans Lao, Arial, sans-serif",
      },
    };

    setGraphData({
      options: _options,
      series: seriesData,
    });
  }, [data]);

  return (
    <div>
      {/* {graphData.series.length > 0 ? ( */}
      <ReactApexChart
        className="py-4 px-2"
        options={graphData.options}
        series={graphData.series}
        type="area"
        height={380}
      />
      {/* ) : (
        <div className="flex justify-center items-center">
          <img src={EmptyImage} className="w-[300px] h-[200px]" alt="No Data" />
        </div>
      )} */}
    </div>
  );
};

export default DataBillChart;
