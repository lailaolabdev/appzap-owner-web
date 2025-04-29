import React, { useState, useEffect } from "react";
import MoneySummaryCard from "./components/MoneySummaryCard";
import EmptyState from "./components/EmptyState";
import PaginationControls from "./components/PaginationControls";
import moment from "moment";
import axios from "axios";
import { END_POINT_SEVER } from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { Button } from "../../components/ui/Button";
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
      <div className="bg-white rounded-xl">
        {/* Date Filter Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setPopup({ popupfiltter: true })}
          >
            <BsFillCalendarWeekFill className="text-lg" />
            <div className="flex items-center gap-2">
              <span>
                {startDate} {startTime}
              </span>
              <span className="text-gray-400">~</span>
              <span>
                {endDate} {endTime}
              </span>
            </div>
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {t("no")}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {t("manager_name")}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {t("detail")}
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {t("amount")}
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {t("cause")}
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {t("date_time")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataBillHistory?.length > 0 ? (
                dataBillHistory?.map((item, index) => (
                  <tr
                    key={"finance-" + index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {page * rowsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item?.user ? item?.user : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item?.eventDetail ? item?.eventDetail : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">
                      {moneyCurrency(item?.billAmount)}{" "}
                      {storeDetail?.firstCurrency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item?.reason ? item?.reason : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <EmptyState />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {dataBillHistoryTotal > 0 && (
          <div className="mt-4">
            <PaginationControls
              pageCount={dataBillHistoryTotal}
              onPageChange={(e) => e?.selected + 1}
              forcePage={currentPage - 1}
              t={t}
            />
          </div>
        )}
      </div>

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
