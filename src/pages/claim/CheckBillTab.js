import React, { useState, useEffect } from "react";
import MoneySummaryCard from "./components/MoneySummaryCard";
import EmptyState from "./components/EmptyState";
import PaginationControls from "./components/PaginationControls";
import moment from "moment";
import axios from "axios";
import { END_POINT_SEVER } from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { Card } from "../../components/ui/Card";

const CheckBillTab = ({ storeDetail, currentPage, t }) => {
  const rowsPerPage = 100;
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [dataBillHistory, setDataBillHistory] = useState([]);
  const [dataBillHistoryTotal, setDataBillHistoryTotal] = useState(0);

  useEffect(() => {
    _getdataHistories();
  }, []);

  const findBy = `&startDate=${encodeURIComponent(
    startDate
  )}&endDate=${encodeURIComponent(endDate)}&endTime=${encodeURIComponent(
    endTime
  )}&startTime=${encodeURIComponent(startTime)}`;

  const _getdataHistories = async () => {
    try {
      const headers = await getHeaders();
      let apiUrl;

      apiUrl = `${END_POINT_SEVER}/v3/logs/skip/${
        page * rowsPerPage
      }/limit/${rowsPerPage}?storeId=${
        storeDetail?._id
      }&modele=${"checkBill"}${findBy}`;

      const res = await axios.get(apiUrl, { headers });
      setDataBillHistory(res.data?.data);
      setDataBillHistoryTotal(res.data?.data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // Format currency with fallback to storeDetail's currency
  const formatCurrency = (amount, currency) => {
    if (amount === undefined || amount === null) return "-";
    return `${amount.toLocaleString()} ${
      currency || storeDetail?.firstCurrency === "LAK" ? "ກີບ" : "LAK"
    }`;
  };

  console.log("dataBillHistory", dataBillHistory);

  return (
    <Card className="my-4 p-2">
      {/* Table for claiming payments */}
      <Card className="overflow-x-auto my-4">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("no")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("manager_name")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("detail")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("cause")}
              </th>

              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("date_time")}
              </th>
            </tr>
          </thead>
          <tbody>
            {dataBillHistory?.length > 0 ? (
              dataBillHistory?.map((item, index) => (
                <tr key={"finance-" + index}>
                  <td>{page * rowsPerPage + index + 1}</td>
                  <td>{item?.user ? item?.user : "-"}</td>
                  <td>{item?.eventDetail ? item?.eventDetail : "-"}</td>
                  <td>{item?.reason ? item?.reason : "-"}</td>
                  <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
              ))
            ) : (
              <EmptyState />
            )}
          </tbody>
        </table>
      </Card>

      {/* Pagination controls */}
      {dataBillHistoryTotal > 0 && (
        <PaginationControls
          pageCount={dataBillHistoryTotal}
          onPageChange={(e) => e?.selected + 1}
          forcePage={currentPage - 1}
          t={t}
        />
      )}
    </Card>
  );
};

export default CheckBillTab;
