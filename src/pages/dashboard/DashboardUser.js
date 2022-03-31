import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { END_POINT_SEVER } from '../../constants/api'
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,

} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardUser({ startDate, endDate }) {
  const { history, match } = useReactRouter()

  const [data, setData] = useState();

  // =========>
  useEffect(() => {
    _fetchCategoryData()
  }, [])
  // =========>
  useEffect(() => {
    _fetchCategoryData()
  }, [endDate, startDate])
  // =========>

  useEffect(() => {
    if (!data) return;
    // _initChartData()
  }, [data])

  const _fetchCategoryData = async () => {
    const getDataDashBoard = await axios
      .get(END_POINT_SEVER + "/v3/dashboard-report-users/" + match?.params?.storeId + "/startTime/" + startDate + "/endTime/" + endDate, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
    setData(getDataDashBoard?.data)
  }


  const convertPieData = (item) => {
    let _labels = item.data.map((d) => d.name)
    let _dataa = item.data.map((d) => d.quantity)
    return {
      labels: _labels,
      datasets: [
        {
          data: _dataa,
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
  console.log("data===>", data)
  return (
    <div style={{ padding: 0 }}>
      <div style={{ width: '100%', padding: 20, borderRadius: 8 }}>
        {data?.length > 0 ? data?.map((item, index) =>
          <div key={"menu-" + index} className="row">
            <div className='col-5'>
              <p style={{ fontWeight: "bold" }}>ລາຍງານຕາມໝວດປະຈຳວັນທີ່ : {moment(item?.time).format('YYYY-MM-DD')}</p>
              <p key={"menu-child-" + index} style={{ margin: 0 }}>{index+1}. {item?.user?.firstname}</p>
              <p key={"menu-seved-" + index} style={{ margin: 0 }}>- ເສີບທັ້ງໝົດ : {item?.total}</p>
              <p key={"menu-seved-" + index} style={{ margin: 0 }}>- ອາຫານສຳເລັດທັ້ງໝົດ : {item?.orderSuccess}</p>
              <p key={"menu-seved-" + index} style={{ margin: 0 }}>- ອາຫານຍົກເລີກທັ້ງໝົດ : {item?.orderCancel}</p>
              <p key={"menu-seved-" + index} style={{ margin: 0 }}>- ລາຍໄດ້ທັ້ງໝົດ : {item?.amount}</p>
              {item?.order?.map((itemB, indexB) => 
                <div>
                  <p style={{ margin: 0 }}>ໂຕະ {itemB?.code}</p>
                  <p style={{ margin: 0 }}>* {itemB?.name}</p>
                  <p style={{ margin: 0 }}>ສະຖານະ {itemB?.status}</p>
                  <p style={{ margin: 0 }}>ຈຳນວນ {itemB?.quantity}</p>
                  <p style={{ margin: 0 }}>ລາຄາ {itemB?.price}</p>
                  <p style={{ margin: 0 }}>ລາຄາທັ້ງໝົດ {itemB?.amount}</p>
                </div>
              )}
            </div>
            <div className='col-7'>
              {/* <Pie data={convertPieData(item)} />; */}
            </div>
            <hr />
          </div>
        ) : ""}
      </div>

      {/* <Bar options={options} data={chartData} /> */}

    </div>
  )
}

