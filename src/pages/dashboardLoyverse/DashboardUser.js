import React, { useState, useEffect } from "react";
import moment from "moment";
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
import { t } from 'i18next';
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);
export default function DashboardUser({ startDate, endDate }) {
  const { match } = useReactRouter();

  const [data, setData] = useState();

  // =========>
  useEffect(() => {
    _fetchMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // =========>
  useEffect(() => {
    _fetchMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate, startDate]);
  // =========>

  useEffect(() => {
    if (data?.length > 0) {
      convertPieData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const _fetchMenuData = async () => {
    const getDataDashBoard = await axios.get(
      END_POINT_SEVER +
        "/v3/bill-report/?storeId=" +
        match?.params?.storeId +
        "&startDate=" +
        startDate +
        "&endDate=" +
        endDate,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    );
    setData(getDataDashBoard?.data);
  };
  const convertPieData = () => {
    let _labels = data?.map(
      (d) =>
        moment(d?.createdAt).format("DD/MM/yyyy") +
        ": " +
        moneyCurrency(d?.billAmount) +
        " ກີບ"
    );
    let _data = data?.map((d) => d?.billAmount);
    return {
      labels: _labels,
      datasets: [
        {
          data: _data,
          label: "ລາຍຮັບ",
          backgroundColor: [
            "rgba(251, 110, 59, 0.2)",
            "rgba(251, 110, 59, 0.3)",
            "rgba(251, 110, 59, 0.4)",
            "rgba(251, 110, 59, 0.5)",
            "rgba(251, 110, 59, 0.6)",
            "rgba(251, 110, 59, 0.7)",
          ],
          borderColor: [
            "rgba(251, 110, 59, 1)",
            "rgba(251, 110, 59, 1)",
            "rgba(251, 110, 59, 1)",
            "rgba(251, 110, 59, 1)",
            "rgba(251, 110, 59, 1)",
            "rgba(251, 110, 59, 1)",
          ],
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          borderWidth: 1,
        },
      ],
    };
  };
  return (
    <div style={{ padding: 0 }}>
      <div className="row col-sm-12">
        <Card className="col-sm-12" style={{ backgroundColor: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: 20 }}>
            <h4>{t('waitstaffReport')}</h4>
            <button type="button" style={{ border: "0px solid white", backgroundColor: "white" }}>EXPORT</button>
          </div>
          <Card.Body>
            <Table hover style={{ fontSize: 15 }}>
              <thead>
                <tr style={{ color: "E4E4E4" }}>
                  <th>ຊື່ພະນັກງານ</th>
                  <th>{t('totalPrice2')}</th>
                  <th>ສີນຄ້າສົ່ງຄືນ</th>
                  <th>ສ່ວນຫຼຸດ</th>
                  <th>ລາຄາສີນຄ້າ</th>
                  <th>ລາຍຮັບ</th>
                  <th>ຍອດຂາຍສະເລ່ຍ</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ color: "E4E4E4" }}>
                  <td>เจ้าของ</td>
                  <td>₭84.000 </td>
                  <td>₭0 </td>
                  <td>₭0 </td>
                  <td>3 </td>
                  <td>₭84.000</td>
                  <td>3 </td>
                </tr>
                <tr style={{ color: "E4E4E4" }}>
                  <td>เจ้าของ</td>
                  <td>₭84.000 </td>
                  <td>₭0 </td>
                  <td>₭0 </td>
                  <td>3 </td>
                  <td>₭84.000</td>
                  <td>3 </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
