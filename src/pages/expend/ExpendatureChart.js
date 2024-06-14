import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { COLOR_APP } from "../../constants";

export default function ExpendatureChart({ series,options }) {
  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
}
