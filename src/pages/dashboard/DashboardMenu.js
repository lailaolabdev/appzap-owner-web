import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { Card, CardGroup, Table } from 'react-bootstrap'
import { END_POINT_SEVER } from '../../constants/api'
import { Bar } from 'react-chartjs-2';


// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'top',
//     },
//     title: {
//       display: true,
//       text: 'Chart.js Bar Chart',
//     },
//   },
// };
// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

// const aaadata = {
//   labels:['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data: labels.map(() => Math.floor(Math.random() * 1000)),
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//     {
//       label: 'Dataset 2',
//       data: labels.map(() => Math.floor(Math.random() * 1000)),
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     },
//   ],
// };

export default function DashboardMenu({ startDate, endDate }) {
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

  const _fetchMenuData = async () => {
    const getDataDashBoard = await axios
      .get(END_POINT_SEVER + "/v3/dashboard-best-sell-category/" + match?.params?.storeId + "/startTime/" + startDate + "/endTime/" + endDate, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
    setData(getDataDashBoard?.data)
  }

  // const [dataChartBar, setDataChartBar] = useState({
  //   labels: ["ນ້ຳດື່ມ", "ເບຍ", "ຕຳ", "ທອດ", "ຍຳ", "ແກງສົ້ມ", "ຂົ້ວຜັກ"],
  //   datasets: [{
  //     label: 'ສະຫຼຸບຕາມໝວດສິນຄ້າ',
  //     data: [65, 59, 80, 81, 56, 55, 100],
  //     backgroundColor: [
  //       '#FB6E3B',
  //       '#FB6E3B',
  //       '#FB6E3B',
  //       '#FB6E3B',
  //       '#FB6E3B',
  //       '#FB6E3B',
  //       '#FB6E3B'
  //     ],
  //     borderWidth: 1
  //   }]
  // })

  return (
    <div style={{ padding: 0 }}>
      <div style={{ width: '100%', padding: 20, borderRadius: 8 }}>
        {data?.length > 0 ? data?.map((item, index) =>
          <div key={"menu-" + index}>
            <p style={{ fontWeight: "bold" }}>ລາຍງານຕາມໝວດປະຈຳວັນທີ່ : {moment(item?.time).format('YYYY-MM-DD')}</p>
            {item?.data?.map((itemB) =>
              <p>{itemB?.name} : {itemB?.quantity}</p>
            )}
            <hr />
          </div>
        ) : ""}
      </div>
      {/* <Bar options={options} data={aaadata} /> */}
    </div>
  )
}
