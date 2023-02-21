import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
<<<<<<< HEAD
import useReactRouter from "use-react-router";
import { Card, Table } from "react-bootstrap";
import { END_POINT_SEVER } from "../../constants/api";
import { Bar } from "react-chartjs-2";
=======
import useReactRouter from "use-react-router"
import { Card, Table } from 'react-bootstrap'
import { END_POINT_SEVER } from '../../constants/api'
import { Bar } from 'react-chartjs-2';
import { _statusCheckBill } from '../../helpers';
>>>>>>> origin/production_v5.4.4
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
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);
export default function DashboardMenu({ startDate, endDate }) {
  const { history, match } = useReactRouter();

  const [data, setData] = useState();

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
    const getDataDashBoard = await axios.get(
      END_POINT_SEVER +
        "/v3/dashboard-best-sell-menu/" +
        match?.params?.storeId +
        "/startTime/" +
        startDate +
        "/endTime/" +
        endDate,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    );
    setData(getDataDashBoard?.data);
  };
  const convertPieData = () => {
    let _labels = data?.map(
      (d) =>
        moment(d?.createdAt).format("DD/MM/yyyy") +
        ": " +
        moneyCurrency(d?.billAmount) +
        " ກີບ"
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
  console.log(
    "🚀 ~ file: DashboardMenu.js ~ line 37 ~ DashboardMenu ~ data",
    data
  );

  return (
    <div style={{ padding: 0 }}>
      <div className="row col-sm-12">
        <Card className="col-sm-12" style={{ backgroundColor: "white" }}>
          <Card.Body
            style={{
              display: "flex",
              justifyContent: "space-between",
              textAlign: "center",
            }}
          >
            <div className="col-sm-4" style={{ borderWidth: "solid 2px red" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>5 ສີນຄ້າຍອດນິຍົມ</p>
                <p>ລາຄາຕົ້ນທຶນສີນຄ້າ</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>เบียร์</p>
                <p>₭84.000</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>เบียร์</p>
                <p>₭84.000</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>เบียร์</p>
                <p>₭84.000</p>
              </div>
            </div>
            <div className="col-sm-8">
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
          </Card.Body>
        </Card>
        <Card className="col-sm-12" style={{ backgroundColor: "white" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 20,
            }}
          >
            <h4>ລາຍງານເມນູ</h4>
            <button
              type="button"
              style={{ border: "0px solid white", backgroundColor: "white" }}
            >
              EXPORT
            </button>
          </div>
          <Card.Body>
            <Table hover style={{ fontSize: 15 }}>
              <thead>
                <tr style={{ color: "E4E4E4" }}>
                  <th>ລາຍການ</th>
                  <th>ໝວດສີນຄ້າ</th>
                  <th>ຈຳນວນ</th>
                  <th>ລາຄາຂາຍ</th>
                  <th>ລາຄາຕົ້ນທຶນສີນຄ້າ</th>
                  <th>ກຳໄລສີນຄ້າ</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ color: "E4E4E4" }}>
                  <td>เบียร์</td>
                  <td>น้ำ</td>
                  <td>7 </td>
                  <td>₭84.000 </td>
                  <td>₭0 </td>
                  <td>₭84.000</td>
                </tr>
                <tr style={{ color: "E4E4E4" }}>
                  <td>ຕຳຫມາກຮຸງ</td>
                  <td>อาหาร</td>
                  <td>2</td>
                  <td>₭84.000 </td>
                  <td>₭0 </td>
                  <td>₭84.000</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
