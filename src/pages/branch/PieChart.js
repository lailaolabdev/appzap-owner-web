import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ DatabranchInCome }) => {
  const { t } = useTranslation();
  let ArrayNameBranch = [];
  let ArrayTotalAmount = [];

  for (const dataObj of DatabranchInCome) {
    ArrayNameBranch.push(dataObj.nameBranch);
    ArrayTotalAmount.push(dataObj.totalAmount);
  }
  const data = {
    labels: ArrayNameBranch,
    datasets: [
      {
        data: ArrayTotalAmount,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 16, // Font size for legend labels
            family: "Noto Sans Lao", // Font family
          },
        },
        title: {
          display: true,
          text: t("list_branch"),
          font: {
            size: 16, // Font size for legend labels
            family: "Noto Sans Lao", // Font family
            bold: true,
          },
        },
      },

      tooltip: {
        titleFont: {
          size: 14, // Font size for tooltips
          family: "Noto Sans Lao", // Font family for tooltips
        },
        bodyFont: {
          size: 12,
          family: "Noto Sans Lao",
        },
      },
    },
    scales: {
      // Add this section if you have scales, for example in bar or line charts
      // y: {
      //   ticks: {
      //     font: {
      //       family: 'Georgia', // Custom font for scales
      //     },
      //   },
      // },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
