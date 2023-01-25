import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { Card, Table } from 'react-bootstrap'
import { END_POINT_SEVER } from '../../constants/api'
import { _statusCheckBill } from '../../helpers';
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
export default function DashboardIncome({ startDate, endDate }) {
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
      .get(END_POINT_SEVER + "/v3/bill-report/?storeId=" + match?.params?.storeId + "&startDate=" + startDate + "&endDate=" + endDate, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
    setData(getDataDashBoard?.data)
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
            <div className="grid-container" style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
              <div className="grid-item">
                <div style={{ display: "flex" }}>
                  <div>
                    <img src="https://siraustin-wpengine.netdna-ssl.com/wp-content/uploads/long-distance-moving-quote.png" alt="..." class="img-thumbnail" width="70px" height="70px" style={{ border:"0px solid"}}/>
                  </div>
                  <div>
                    <p>ໃບບີນທັ້ງໝົດ</p>
                    <p style={{ color: "green" }}>3</p>
                  </div>
                </div>
              </div>
              <div className="grid-item">
                <div style={{ display: "flex" }}>
                  <div>
                    <img src="https://www.iconbunny.com/icons/media/catalog/product/cache/2/thumbnail/600x/1b89f2fc96fc819c2a7e15c7e545e8a9/1/5/1549.9-dollar-bills-icon-iconbunny.jpg" alt="..." class="img-thumbnail" width="70px" height="70px" style={{ border: "0px solid"}}/>
                  </div>
                  <div>
                    <p>ຂາຍສຳເລັດ</p>
                    <p style={{ color: "green" }}>3</p>
                  </div>
                </div>
              </div>
              <div className="grid-item">
                <div style={{ display: "flex" }}>
                  <div>
                    <img src="https://icon-library.com/images/bill-icon/bill-icon-16.jpg" alt="..." class="img-thumbnail" width="70px" height="70px" style={{ border: "0px solid" }}/>
                  </div>
                  <div>
                    <p>ບີນຍົກເລີກ</p>
                    <p style={{ color: "green" }}>3</p>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card className="col-sm-12" style={{ backgroundColor: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: 20 }}>
            <h4>ລາຍຮັບ</h4>
            <button type="button" style={{ border: "0px solid white", backgroundColor: "white" }}>EXPORT</button>
          </div>
          <Card.Body>
            <Table hover style={{ fontSize: 15 }}>
              <thead>
                <tr style={{ color: "E4E4E4" }}>
                  <th>ໝວດສີນຄ້າ</th>
                  <th>ຈຳນວນ</th>
                  <th>ລາຄາສີນຄ້າ</th>
                  <th>ກຳໄລສີນຄ້າ</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ color: "E4E4E4" }}>
                  <td>อาหาร</td>
                  <td>2	</td>
                  <td>₭84.000	</td>
                  <td>₭84.000</td>
                </tr>
                <tr style={{ color: "E4E4E4" }}>
                  <td>น้ำ</td>
                  <td>3</td>
                  <td>₭84.000	</td>
                  <td>₭84.000</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </div >
  )
}

