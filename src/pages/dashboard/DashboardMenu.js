import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { Card, CardGroup, Table } from 'react-bootstrap'
import { END_POINT_SEVER } from '../../constants/api'
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'top',
//     },
//     title: {
//       display: true,
//       text: 'ລາຍການເມນູຂາຍດີ',
//     },
//   },
// };

const options = {
  plugins: {
    title: {
      display: true,
      text: 'ລາຍການເມນູຂາຍດີ',
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const aaadata = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'ລາຍການເມນູຂາຍດີ',
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: 'rgba(251, 110, 59, 0.7)',
    },
  ],
};


const initChartData = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: 'rgba(251, 110, 59, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: 'rgba(251, 110, 59, 0.6)',
    },
    {
      label: 'Dataset 3',
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: 'rgba(251, 110, 59, 0.7)',
    },
  ],
};

export default function DashboardMenu({ startDate, endDate }) {
  const { history, match } = useReactRouter()

  const [data, setData] = useState();
  const [chartData, setChartData] = useState(initChartData);

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
    _initChartData()
  }, [data])

  const _initChartData = () => {
    console.log(data)
    if (!data) return;
    let _labels = data.map((d) => d.time)
    let _datasets = data.map((d) => {

      _aSet = d.map((c)=>{
        return {
          label: c?.name,
          data: [1, 2, 3, 4, 5, 6, 7],
          backgroundColor: 'rgba(251, 110, 59, 0.7)',
        }
      })
      
    })
    console.log(_labels)

    setChartData({
      labels: _labels,
      datasets: _datasets
    })
  }

  const _fetchMenuData = async () => {
    const getDataDashBoard = await axios
      .get(END_POINT_SEVER + "/v3/dashboard-best-sell-menu/" + match?.params?.storeId + "/startTime/" + startDate + "/endTime/" + endDate, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
    setData(getDataDashBoard?.data)
  }

  return (
    <div style={{ padding: 0 }}>
      <div style={{ width: '100%', padding: 20, borderRadius: 8 }}>
        {data?.length > 0 ? data?.map((item, index) =>
          <div key={"menu-" + index}>
            <p style={{ fontWeight: "bold" }}>ລາຍງານຕາມໝວດປະຈຳວັນທີ່ : {moment(item?.time).format('YYYY-MM-DD')}</p>
            {item?.data?.map((itemB) =>
              <p key={"menu-child-" + index}>{itemB?.name} : {itemB?.quantity}</p>
            )}
            <hr />
          </div>
        ) : ""}
      </div>
      <Bar options={options} data={chartData} />
    </div>
  )
}
