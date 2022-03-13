import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { END_POINT_SEVER } from '../../constants/api'
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { moneyCurrency} from '../../helpers'
ChartJS.register(ArcElement, Tooltip, Legend);

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

  useEffect(() => {
    if (!data) return;
    // _initChartData()
  }, [data])

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


  const convertPieData = (item) => {
    let _labels = item.data.map((d) => d.name)
    let _data = item.data.map((d) => d.quantity)
    return {
      labels: _labels,
      datasets: [
        {
          data: _data,
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
          borderWidth: 1,
        },
      ],
    };
  }
  console.log("data===>", data);
  return (
    <div style={{ padding: 0 }}>
      <div style={{ width: '100%', padding: 20, borderRadius: 8 }}>
        {data?.length > 0 ? data?.map((item, index) =>
          <div key={"menu-" + index} className="row">
            <div className='col-5'>
              <p style={{ fontWeight: "bold" }}>ລາຍງານຕາມໝວດປະຈຳວັນທີ່ : {moment(item?.time).format('YYYY-MM-DD')}</p>
              {item?.data?.map((itemB, aIndex) =>
                <p key={"menu-child-" + aIndex} style={{ margin: 0 }}>{itemB?.quantity} {itemB?.name} : {moneyCurrency(itemB?.price)} ກີບ. {moneyCurrency(itemB?.price * itemB?.quantity)} .ກີບ</p>
              )}
            </div>
            <div className='col-7'>
              <Pie data={convertPieData(item)} />;
            </div>
            <hr />
          </div>
        ) : ""}
      </div>

      {/* <Bar options={options} data={chartData} /> */}

    </div>
  )
}
