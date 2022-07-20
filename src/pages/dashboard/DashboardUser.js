import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { END_POINT_SEVER } from '../../constants/api'
import { moneyCurrency } from '../../helpers'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,

} from 'chart.js';
import AnimationLoading from '../../constants/loading';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardUser({ startDate, endDate }) {
  const { history, match } = useReactRouter()

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true)
    const getDataDashBoard = await axios
      .get(END_POINT_SEVER + "/v3/dashboard-report-users/" + match?.params?.storeId + "/startTime/" + startDate + "/endTime/" + endDate, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
    setData(getDataDashBoard?.data)
    setIsLoading(false)
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
  return (
    <div style={{ padding: 0 }}>
      {isLoading && <AnimationLoading />}
      <div style={{ width: '100%', padding: 20, borderRadius: 8 }}>
        {data && <p style={{ fontWeight: "bold" }}>ລາຍງານຕາມໝວດປະຈຳວັນທີ່ : {moment(data[0]?.time).format('YYYY-MM-DD')}</p>}
        {data?.length > 0 ? data?.map((item, index) =>
          <div key={"menu-" + index} className="row">
            <div className='col-12'>
              <div style={{ height: 10 }}></div>
              <div style={{ display: "flex", justifyContent: "space-between",fontWeight:'bold' }}>
                <p key={"menu-child-" + index} style={{ margin: 0, color: "blue" }}>{index + 1}. {item?.user?.firstname}</p>
                <p key={"menu-seved-" + index} style={{ margin: 0 }}> ເສີບ : {item?.total}</p>
                <p key={"menu-seved-" + index} style={{ margin: 0 }}> ອາຫານສຳເລັດ : {item?.orderSuccess}</p>
                <p key={"menu-seved-" + index} style={{ margin: 0 }}> ອາຫານຍົກເລີກ : {item?.orderCancel}</p>
                <p key={"menu-seved-" + index} style={{ margin: 0 }}> ລາຍໄດ້ທັ້ງໝົດ : {moneyCurrency(item?.amount)}</p>
              </div>
              <div style={{height:10}}></div>
              {item?.order?.map((itemB, indexB) =>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ margin: 0, color: "orange" }}>ໂຕະ {itemB?.code}</p>
                  <p style={{ margin: 0, width:150 }}>* {itemB?.name}</p>
                  <p style={{ margin: 0, display: "flex" ,width:130 }}>
                    <div>ສະຖານະ </div>
                    <div style={{ marginLeft: 5, color: "green" }}> {itemB?.status === "SERVED" ? "ເສີບແລ້ວ" : "-"}</div>
                  </p>
                  <p style={{ margin: 0 }}>ຈຳນວນ {itemB?.quantity}</p>
                  <p style={{ margin: 0 }}>ລາຄາ {moneyCurrency(itemB?.price)}</p>
                  <p style={{ margin: 0 }}>ລາຄາລວມ {moneyCurrency(itemB?.amount)}</p>
                </div>
              )}
            </div>
            <div className='col-4'>
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

