import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { Card, CardGroup, Table } from 'react-bootstrap'
import { END_POINT_SEVER } from '../../constants/api'

export default function DashboardFinance({ startDate, endDate }) {
  const { history, match } = useReactRouter()
  const [data, setData] = useState();

  useEffect(() => {
    _fetchFinanceData()
  }, [])

  useEffect(() => {
    _fetchFinanceData()
  }, [endDate, startDate])

  const _fetchFinanceData = async () => {
    const getDataDashBoard = await axios
      .get(END_POINT_SEVER + "/v3/dashboard/" + match?.params?.storeId + "/startTime/" + startDate + "/endTime/" + endDate, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
    setData(getDataDashBoard?.data)
  }

  const [dataChartBar, setDataChartBar] = useState({
    labels: ["ນ້ຳດື່ມ", "ເບຍ", "ຕຳ", "ທອດ", "ຍຳ", "ແກງສົ້ມ", "ຂົ້ວຜັກ"],
    datasets: [{
      label: 'ສະຫຼຸບຕາມໝວດສິນຄ້າ',
      data: [65, 59, 80, 81, 56, 55, 100],
      backgroundColor: [
        '#FB6E3B',
        '#FB6E3B',
        '#FB6E3B',
        '#FB6E3B',
        '#FB6E3B',
        '#FB6E3B',
        '#FB6E3B'
      ],
      borderWidth: 1
    }]
  })
  return (
    <div style={{ padding: 0 }}>
      <div className="row">
        <div style={{ width: '100%', padding: 20 }}>
          <div>ແຕ່ວັນທີ {startDate} ຫາວັນທີ {endDate}</div>
          <div style={{ height: 10 }}></div>
          <div>ຈຳນວນຍອດເງີນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(data?.amount)} ກີບ</div>
          <div style={{ height: 20 }}></div>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>ເລກໂຕະ</th>
                <th>ສວ່ນຫຼຸດ</th>
                <th>ລາຄາ / ບີນ</th>
              </tr>
            </thead>
            <tbody>
              {data?.checkOut?.map((item, index) =>
                <tr key={"finance-" + index}>
                  <td>{index + 1}</td>
                  <td>{item?.code}</td>
                  <td>{item?.discount} {item?.discountType === "LAK" ? "ກີບ" : "%"}</td>
                  <td>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.billAmount)} ກີບ</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        {/* <div style={{ width: '50%', padding: 20 }}>
          <Bar
            data={dataChartBar}
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
        </div> */}
      </div>
    </div>
  )
}
