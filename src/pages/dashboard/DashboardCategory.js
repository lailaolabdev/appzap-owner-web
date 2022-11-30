import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { END_POINT_SEVER } from "../../constants/api";
import { Bar, Pie } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Chart1 from "../../components/chart/Chart1";
import { getHeaders } from "../../services/auth";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardCategory({ startDate, endDate }) {
  // const { history, match } = useReactRouter();
  const params = useParams();

  const [data, setData] = useState();

  // =========>
  useEffect(() => {
    _fetchCategoryData();
  }, []);
  // =========>
  useEffect(() => {
    _fetchCategoryData();
  }, [endDate, startDate]);
  // =========>

  useEffect(() => {
    if (!data) return;
  }, [data]);

  const _fetchCategoryData = async () => {
    const getDataDashBoard = await axios.get(
      END_POINT_SEVER +
        "/v3/dashboard-best-sell-category/" +
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
    setData(getDataDashBoard?.data);
  };

  const convertPieData = (item) => {
    let _labels = item?.data?.map((d) => d?.name);
    let _dataa = item?.data?.map((d) => d?.quantity);
    return {
      labels: _labels,
      datasets: [
        {
          data: _dataa,
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
          borderWidth: 1,
        },
      ],
    };
  };

  let _sortNumBer = (itemNumber) => {
    itemNumber.sort(function (a, b) {
      return b.quantity - a.quantity;
    });
    return itemNumber?.map((itemB, aIndex) => (
      <p key={"menu-child-" + aIndex} style={{ margin: 0 }}>
        {itemB?.name} : {itemB?.quantity}
      </p>
    ));
  };
  return (
    <div style={{ padding: 0 }}>
      <div
        style={{
          width: "100%",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {data?.length > 0
          ? data
              ?.sort((a, b) => new Date(b.time) - new Date(a.time))
              .map((item, index) => (
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
                      ລາຍງານຕາມໝວດປະຈຳວັນທີ່ :{" "}
                      {moment(item?.time).format("YYYY-MM-DD")}
                    </p>
                    {_sortNumBer(item?.data)}
                  </div>
                  <div className="col-7">
                    {/* <Pie data={convertPieData(item)} />; */}

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
      </div>

      {/* <Bar options={options} data={chartData} /> */}
    </div>
  );
}
