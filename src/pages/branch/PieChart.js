import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTranslation } from "react-i18next";
import convertNumber from "../../helpers/convertNumber";
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ DatabranchInCome, TotalInCome }) => {
  const { t } = useTranslation();
  const ArrayNameBranch = [];
  const ArrayTotalAmount = [];
  const backgroundColors = [];
  const borderColors = [];

  const getRandomRGBA = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = Math.random().toFixed(2); // Alpha value between 0 and 1
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  for (const dataObj of DatabranchInCome) {
    ArrayNameBranch.push(dataObj?.nameBranch);
    ArrayTotalAmount.push(dataObj?.totalAmount);
    const randomColor = getRandomRGBA();
    backgroundColors.push(randomColor);
    borderColors.push(randomColor.replace(/0\.\d{2}\)/, "1)"));
  }
  const data = {
    labels: ArrayNameBranch,
    datasets: [
      {
        data: ArrayTotalAmount,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
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
  };

  return (
    <>
      <Pie data={data} options={options} />
    </>
  );
};

export default PieChart;
