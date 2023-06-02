import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { END_POINT_SEVER } from "../../constants/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { moneyCurrency } from "../../helpers";
import Chart1 from "../../components/chart/Chart1";
import { useParams } from "react-router-dom";
// import { Table } from "react-bootstrap";
import { t } from "i18next";
import { FaSearch } from "react-icons/fa";
// import { t } from "i18next";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardMenu({ startDate, endDate }) {
  const params = useParams();

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
    if (!data) return;
    // _initChartData()
  }, [data]);

  const _fetchMenuData = async () => {
    const getData = await axios.get(
      END_POINT_SEVER +
      "/v3/dashboard-best-sell-menu/" +
      params?.storeId +
      "/startTime/" +
      startDate +
      "/endTime/" +
      endDate,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    );
    setData(getData?.data[0].data);
    // console.log('object', getData);

  };

  console.log('data ---> ',data);

  // const convertPieData = (item) => {
  //   let _labels = item.data.map((d) => d.name);
  //   let _data = item.data.map((d) => d.quantity);
  //   return {
  //     labels: _labels,
  //     datasets: [
  //       {
  //         data: _data,
  //         backgroundColor: [
  //           "rgba(251, 110, 59, 0.2)",
  //           "rgba(251, 110, 59, 0.3)",
  //           "rgba(251, 110, 59, 0.4)",
  //           "rgba(251, 110, 59, 0.5)",
  //           "rgba(251, 110, 59, 0.6)",
  //           "rgba(251, 110, 59, 0.7)",
  //         ],
  //         borderColor: [
  //           "rgba(251, 110, 59, 1)",
  //           "rgba(251, 110, 59, 1)",
  //           "rgba(251, 110, 59, 1)",
  //           "rgba(251, 110, 59, 1)",
  //           "rgba(251, 110, 59, 1)",
  //           "rgba(251, 110, 59, 1)",
  //         ],
  //         borderWidth: 1,
  //       },
  //     ],
  //   };
  // };
  // let _sortNumBer = (itemNumber) => {
  //   itemNumber.sort(function (a, b) {
  //     return b.quantity - a.quantity;
  //   });
  //   return itemNumber?.map((itemB, aIndex) => (
  //     <p key={"menu-child-" + aIndex} style={{ margin: 0 }}>
  //       {itemB?.quantity} {itemB?.name} : {moneyCurrency(itemB?.price)} ກີບ.{" "}
  //       {moneyCurrency(itemB?.price * itemB?.quantity)} .ກີບ
  //     </p>
  //   ));
  // };
  return (
    <div style={{ padding: 0 }}>
      <div className=" mt-2" style={{ border: '2px solid #fb6e3b', borderRadius: '5px' }}>
        <div className="d-flex justify-content-between p-2">
          <p>ລາຍງານຕາມເມນູປະຈຳວັນ : 2023/04/27 - 2023/05/04</p>
          <div style={{ border: '2px solid #000', borderRadius: '5px', height: '35px' }}>
            <FaSearch className="mx-2" size="20" />
            <input type="text" placeholder="ຄົ້ນຫາເມນູ" style={{ border: "none" }} className="py-1" />
          </div>
        </div>
        <table className="w-100 table-hover" border="0">
          <thead style={{ backgroundColor: '#fb6e3b', color: '#ffffff' }}>
            <tr>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col">{t('no')}</th>
              <th scope="col">{t('menuname')}</th>
              <th scope="col">{t('amount')}</th>
              <th scope="col">{t('price')}</th>
              <th scope="col"> {t('totalPrice')} </th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {
              data?.length == 0 ? (
                <tr>
                  <td colspan="12" className="text-danger"><h2>ບໍ່ມີຂໍ້ມູນ</h2></td>
                </tr>

              ) : (
                <>
                  {data?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td></td>
                        <td></td>
                        <th scope="row">
                          {index}
                        </th>
                        <td>{data?.name}</td>
                        <td>{data?.quantity}</td>
                        <td>{moneyCurrency(data?.price)} </td>
                        <td>{moneyCurrency(data?.price * data.quantity)} </td>
                        {/* <td>{moneyCurrency(data?.reduce((sum, data2) => data2.price * data2.quantity, 0))}</td> */}
                        <td></td>
                        <td></td>
                      </tr>
                    );
                  })}
                </>
              )
            }
          </tbody>
        </table>
      </div>
      {/* <div
        style={{
          width: "100%",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {data?.length > 0
          ? data?.map((item, index) => (
              <div
                key={"menu-" + index}
                className="row"
                style={{
                  border: "1px solid #ccc",
                  padding: 20,
                  borderRadius: 8,
                }}
              >
                <div className="col-5">
                  <p style={{ fontWeight: "bold" }}>
                    ລາຍງານຕາມເມນູປະຈຳວັນທີ່ :{" "}
                    {moment(item?.time).format("YYYY-MM-DD")}
                  </p>
                  {_sortNumBer(item?.data)}
                   {item?.data?.map((itemB, aIndex) =>
                <p key={"menu-child-" + aIndex} style={{ margin: 0 }}>{itemB?.quantity} {itemB?.name} : {moneyCurrency(itemB?.price)} ກີບ. {moneyCurrency(itemB?.price * itemB?.quantity)} .ກີບ</p>
              )} 
                </div>
                <div className="col-7">
                   <Pie data={convertPieData(item)} /> 
                  <Chart1
                    value={item?.data?.map((e) => ({
                      categories: e?.name,
                      data: e?.quantity,
                    }))}
                  />
                </div>
                <hr />
              </div>
            ))
          : ""}
      </div> */}
    </div>
  );
}
