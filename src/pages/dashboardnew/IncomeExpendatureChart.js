import ReactApexChart from "react-apexcharts";

export default function IncomeExpendatureChart({ graphData }) {
  return (
    <div id="chart">
      <ReactApexChart
        options={graphData?.options}
        series={graphData?.series}
        type="area"
        height={350}
      />
    </div>
  );
}
