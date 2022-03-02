import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import {  Table } from 'react-bootstrap'
import { END_POINT_SEVER } from '../../constants/api'
import { Line } from 'react-chartjs-2';

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


 const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
 const _data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [10,20,30,40,50,60,100],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };
  // const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  // const data = {
  //   labels: labels,
  //   datasets: [{
  //     label: 'My First Dataset',
  //     data: [20, 10, 80, 20, 40, 5, 50, 30, 10],
  //     fill: false,
  //     borderColor: 'red',
  //     tension: 0.1
  //   }]
  // };

  // const config = {
  //   type: 'line',
  //   data: data,
  // };
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
                <th>ໂຕະ</th>
                <th>ເລກໂຕະ</th>
                <th>ສວ່ນຫຼຸດ</th>
                <th>ລາຄາ / ບີນ</th>
                <th>ເວລາ</th>
              </tr>
            </thead>
            <tbody>
              {data?.checkOut?.map((item, index) =>
                <tr key={"finance-" + index}>
                  <td>{index + 1}</td>
                  <td>{item?.tableId?.name}</td>
                  <td>{item?.code}</td>
                  <td>{item?.discountType === "LAK" ? new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.discount)+"ກີບ" : item?.discount+"%"}</td>
                  <td>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.billAmount)} ກີບ</td>
                  <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div style={{ width: '50%', padding: 20 }}>
          {/* <Line options={options} data={_data} /> */}
        </div>
      </div>
    </div>
  )
}
