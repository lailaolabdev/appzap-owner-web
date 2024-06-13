import ReactApexChart from "react-apexcharts";

export default function IncomeExpendatureChart({ series,options }) {

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
}
