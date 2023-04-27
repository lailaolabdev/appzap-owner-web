import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { END_POINT_SEVER } from "../../constants/api";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { moneyCurrency } from "../../helpers";
import { useParams } from "react-router-dom";
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export default function MoneyChart({ startDate, endDate }) {
  const params = useParams();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // =========>
  useEffect(() => {
    _fetchMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // =========>
  useEffect(() => {
    _fetchMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate, startDate]);
  // =========>

  useEffect(() => {
    if (data?.length > 0) {
      convertPieData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const _fetchMenuData = async () => {
    setIsLoading(true);
    const getDataDashBoard = await axios.get(
      END_POINT_SEVER +
        "/v3/bill-report/?storeId=" +
        params?.storeId +
        "&startDate=" +
        startDate +
        "&endDate=" +
        endDate,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    );
    setData(getDataDashBoard?.data);
    setIsLoading(false);
  };
  const convertPieData = () => {
    let _labels = data?.map(
      (d) =>{
        //alert(d?.money_transfer + "ເງິນໂອນ"); 
        //alert(d?.billAmount + "ເງິນທັງໝົດ"); 
       return moment(d?.createdAt).format("DD/MM/yyyy") +
        ": " +
        moneyCurrency(d?.billAmount) +
        " ກີບ" +
        " | cach:" +
        moneyCurrency(d?.billAmount - d?.money_transfer) +
        " | transfer:" +
        moneyCurrency(d?.money_transfer) 
      }
      
    );
    let _data = data?.map((d) => d?.billAmount);

    return {
      labels: _labels,
      datasets: [
        {
          data: _data,
          label: "ລາຍຮັບ",
          backgroundColor: [
            "rgba(251, 110, 59, 0.2)",
            "rgba(251, 110, 59, 0.3)",
            "rgba(251, 110, 59, 0.4)",
            "rgba(251, 110, 59, 0.5)",
            "rgba(251, 110, 59, 0.6)",
            "rgba(251, 110, 59, 0.7)",
          ],
          borderColor: [
            "rgba(251, 110, 59, 1)",
            "rgba(251, 110, 59, 1)",
            "rgba(251, 110, 59, 1)",
            "rgba(251, 110, 59, 1)",
            "rgba(251, 110, 59, 1)",
            "rgba(251, 110, 59, 1)",
          ],
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          borderWidth: 1,
        },
      ],
    };
  };
  return (
    <div style={{ padding: 0 }}>
      <div style={{ width: "100%", padding: 20, borderRadius: 8 }}>
        <Bar
          data={convertPieData()}
          options={{
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
            tooltips: {
              mode: "label",
              label: "mylabel",
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.yLabel
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
