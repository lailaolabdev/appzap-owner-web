import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { Card, Table } from 'react-bootstrap'
import { END_POINT_SEVER } from '../../constants/api'
import { Bar, Line } from 'react-chartjs-2';
import { _statusCheckBill } from '../../helpers';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable
} from "@fortawesome/free-solid-svg-icons";
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
import { moneyCurrency } from '../../helpers'
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
    // const getDataDashBoard = await axios
    //   .get(END_POINT_SEVER + "/v3/bill-report/?storeId=" + match?.params?.storeId + "&startDate=" + startDate + "&endDate=" + endDate, {
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json;charset=UTF-8",
    //     },
    //   })
    // setData(getDataDashBoard?.data)
  }
  const convertPieData = () => {
    let _labels = data?.map((d) => moment(d?.createdAt).format("DD/MM/yyyy") + ": " + moneyCurrency(d?.billAmount) + " ກີບ")
    let _data = data?.map((d) => d?.billAmount)
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
  return (
    <div style={{ padding: 0 }}>
      <div className="row col-sm-12">
        <Card className="col-sm-12" style={{ backgroundColor: "white" }}>
          <Card.Body>
            <div className="grid-container" style={{ display: "flex", justifyContent: "space-between",textAlign: "center" }}>
              <div className="grid-item" style={{borderBottom:"solid 2px green"}}>
                <p>Gross sales</p>
                <p style={{color: "green"}}>₭124.000</p>
              </div>
              <div className="grid-item">
                <p>Refunds</p>
                <p style={{ color: "green" }}>₭124.000</p>
              </div>
              <div className="grid-item">
                <p>Discounts</p>
                <p style={{ color: "green" }}>₭124.000</p>
              </div>
              <div className="grid-item">
                <p>Net sales</p>
                <p style={{ color: "green" }}>₭124.000</p>
              </div>
              <div className="grid-item">
                <p>Gross profit</p>
                <p style={{ color: "green" }}>₭124.000</p>
              </div>
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
          <div style={{ display: "flex", justifyContent: "space-between",padding:20}}>
            <button type="button" style={{border: "0px solid white",backgroundColor: "white"}}>EXPORT</button>
            <div>
              <FontAwesomeIcon
                icon={faTable}
                size={40}
              />
            </div>
          </div>
          <Card.Body>
            <Table hover style={{ fontSize: 15 }}>
              <thead>
                <tr style={{color: "E4E4E4"}}>
                  <th>Date</th>
                  <th>Gross sales	</th>
                  <th>Refunds	</th>
                  <th>Discounts</th>
                  <th>Net sales</th>
                  <th>Cost of goods</th>
                  <th>Gross profit</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ color: "E4E4E4" }}>
                  <td>Date</td>
                  <td>Gross sales	</td>
                  <td>Refunds	</td>
                  <td>Discounts</td>
                  <td>Net sales</td>
                  <td>Cost of goods</td>
                  <td>Gross profit</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </div >
  )
}
