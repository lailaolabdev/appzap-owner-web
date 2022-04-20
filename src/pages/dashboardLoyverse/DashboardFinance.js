import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { Card, Table } from 'react-bootstrap'
import { END_POINT_SEVER } from '../../constants/api'
import { Bar, Line } from 'react-chartjs-2';
import { _statusCheckBill, moneyCurrency } from '../../helpers';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export default function DashboardFinance({ startDate, endDate }) {
  const { history, match } = useReactRouter()

  const [data, setData] = useState();

  // =========>
  useEffect(() => {
    _fetchMenuData()
  }, [])
  // =========>
  useEffect(() => {
    _fetchMenuData()
  }, [endDate, startDate])
  // =========>

  useEffect(() => {
    if (data?.length > 0) {
      convertPieData()
    }
  }, [data])

  const _fetchMenuData = async () => {
    const getDataDashBoard = await axios
      .get(END_POINT_SEVER + "/v3/dashboard-loyvers/" + match?.params?.storeId + "/startTime/" + startDate + "/endTime/" + endDate, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
    setData(getDataDashBoard?.data)
  }
  const convertPieData = () => {
    let _labels = data?.amountDate.map((d) => moment(d?.createdAt).format("DD/MM/yyyy") + ": " + moneyCurrency(d?.billAmount) + " ກີບ")
    let _data = data?.amountDate.map((d) => d?.billAmount)
    return {
      labels: _labels,
      datasets: [
        {
          data: _data,
          label: "ລາຍຮັບ",
          backgroundColor: [
            'rgba(251, 110, 59, 0.2)',
            'rgba(251, 110, 59, 0.3)',
            'rgba(251, 110, 59, 0.4)',
            'rgba(251, 110, 59, 0.5)',
            'rgba(251, 110, 59, 0.6)',
            'rgba(251, 110, 59, 0.7)',
          ],
          borderColor: [
            'rgba(251, 110, 59, 1)',
            'rgba(251, 110, 59, 1)',
            'rgba(251, 110, 59, 1)',
            'rgba(251, 110, 59, 1)',
            'rgba(251, 110, 59, 1)',
            'rgba(251, 110, 59, 1)',
          ],
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          borderWidth: 1,
        },
      ],
    };
  }
  console.log("data",data)
  return (
    <div style={{ padding: 0 }}>
      <div className="row col-sm-12">
        <Card className="col-sm-12" style={{ backgroundColor: "white" }}>
          <Card.Body>
            <div className="grid-container" style={{ display: "flex", justifyContent: "space-between",textAlign: "center" }}>
              <div className="grid-item" style={{borderBottom:"solid 2px green"}}>
                <p>ລ້ວມຍອດທັ້ງໝົດ</p>
                <p style={{ color: "green" }}>₭{moneyCurrency(data?.amount)}</p>
              </div>
              <div className="grid-item">
                <p>ເງີນສົ່ງຄືນ</p>
                <p style={{ color: "green" }}>₭{moneyCurrency(data?.feedBack)}</p>
              </div>
              <div className="grid-item">
                <p>ສ່ວນຫຼຸດ</p>
                <p style={{ color: "green" }}>₭{moneyCurrency(data?.discount)}</p>
              </div>
              {/* <div className="grid-item">
                <p>ເປັນເງີນທັ້ງໝົດ</p>
                <p style={{ color: "green" }}>₭124.000</p>
              </div> */}
            </div>
            <Card.Text>
              <Line
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
                    mode: 'label',
                    label: 'mylabel',
                    callbacks: {
                      label: function (tooltipItem) {
                        return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                      },
                    },
                  },
                }}
              />
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className="col-sm-12" style={{ backgroundColor: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: 20 }}>
            <h4>ສະຫຼຸບຍອດຂາຍ</h4>
            <button type="button" style={{ border: "0px solid white", backgroundColor: "white" }}>EXPORT</button>
          </div>
          <Card.Body>
            <Table hover style={{ fontSize: 15 }}>
              <thead>
                <tr style={{color: "E4E4E4"}}>
                  <th>ວັນທິ</th>
                  <th>ເລກບີນ</th>
                  <th>ລວມຍອດທັ້ງໝົດ</th>
                  <th>ລວມຍອດສົ່ງຄືນ</th>
                  <th>ສ່ວນຫຼຸດ</th>
                </tr>
              </thead>
              <tbody>
                {data?.amountDate?.map((item, index) =>
                <tr style={{ color: "E4E4E4" }}>
                    <td>{item?.createdAt}</td>
                    <td>{item?.code}</td>
                    <td>{moneyCurrency(item?.billAmount)}</td>
                    <td>{moneyCurrency(item?.billFeedBack)}</td>
                    <td>{moneyCurrency(item?.billDiscount)}</td>
                </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </div >
  )
}
