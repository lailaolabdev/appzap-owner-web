import React, { Component } from "react";
import Chart from "react-apexcharts";
function Chart1({ value }) {
  const state = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: value.map((e) => e.categories),
      },
    },
    series: [
      {
        name: "ຈຳນວນ",
        data: value.map((e) => e.data),
      },
    ],
  };

  return (
    <Chart
      options={state.options}
      series={state.series}
      type="bar"
      width="100%"
    />
  );
}

export default Chart1;
