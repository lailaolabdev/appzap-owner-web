import React, { useState, useEffect } from "react";
import MoneySummaryCard from "./components/MoneySummaryCard";
import EmptyState from "./components/EmptyState";
import PaginationControls from "./components/PaginationControls";
import moment from "moment";
import axios from "axios";
import { END_POINT_SEVER } from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "react-bootstrap";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import PopUpSetStartAndEndDateDebt from "../../components/popup/PopUpSetStartAndEndDateDebt";
import { moneyCurrency } from "../../helpers";

const CheckBillTab = ({ storeDetail, currentPage, t }) => {
  const rowsPerPage = 100;
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [popup, setPopup] = useState([]);
  const [dataBillHistory, setDataBillHistory] = useState([]);
  const [dataBillHistoryTotal, setDataBillHistoryTotal] = useState(0);

  useEffect(() => {
    _getdataHistories();
  }, [page, startDate, endDate, startTime, endTime]);

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

  return (
    <div>
      <Card className="my-4 p-2">
        {/* Table for claiming payments */}
        <div className="w-full flex-row justify-end mt-2">
          <Button
            variant="outline-primary"
            size="small"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setPopup({ popupfiltter: true })}
          >
            <BsFillCalendarWeekFill />
            <div>
              {startDate} {startTime}
            </div>{" "}
            ~{" "}
            <div>
              {endDate} {endTime}
            </div>
          </Button>
        </div>
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
                  {t("amount")}
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
                    <td>
                      {moneyCurrency(item?.billAmount)}{" "}
                      {storeDetail?.firstCurrency}
                    </td>
                    <td>{item?.reason ? item?.reason : "-"}</td>
                    <td>
                      {moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}
                    </td>
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
      <PopUpSetStartAndEndDateDebt
        open={popup?.popupfiltter}
        onClose={() => setPopup()}
        startDate={startDate}
        setStartDate={setStartDate}
        setStartTime={setStartTime}
        startTime={startTime}
        setEndDate={setEndDate}
        setEndTime={setEndTime}
        endTime={endTime}
        endDate={endDate}
      />
    </div>
  );
};

export default CheckBillTab;
