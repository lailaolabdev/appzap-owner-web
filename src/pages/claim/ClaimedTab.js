import React from "react";
import MoneySummaryCard from "./components/MoneySummaryCard";
import EmptyState from "./components/EmptyState";
import PaginationControls from "./components/PaginationControls";
import moment from "moment";

const ClaimedTab = ({
  amountData,
  storeDetail,
  claimedData,
  totalPageCount,
  currentPage,
  onPageChange,
  rowsPerPage,
  t,
}) => {
  // Calculate the starting index for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;

  // Format currency with fallback to storeDetail's currency
  const formatCurrency = (amount, currency) => {
    if (amount === undefined || amount === null) return "-";
    return `${amount.toLocaleString()} ${
      currency || storeDetail?.firstCurrency === "LAK" ? "ກີບ" : "LAK"
    }`;
  };

  return (
    <div>
      {/* Summary card showing total claimed amount */}
      {/* <MoneySummaryCard
        amount={amountData?.CLAIMED || 0}
        currency={storeDetail?.firstCurrency}
      /> */}

      <div style={{ height: 10 }} />

      {/* Table for claimed payments */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("no")}
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("ລະຫັດເຄລມ")}
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("ຈຳນວນເງິນ")}
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("ສະຖານະເຄລມ")}
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("date_time")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {claimedData?.length > 0 ? (
              claimedData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {item?.billNo ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                    {formatCurrency(item?.totalPrice, item?.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                    {item.status === "APPROVED" ? "ເຄລມແລ້ວ" : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {item?.createdAt
                      ? moment(item.createdAt).format("DD/MM/YYYY HH:mm a")
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
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
      {totalPageCount > 0 && (
        <PaginationControls
          pageCount={totalPageCount}
          onPageChange={(e) => onPageChange(e?.selected + 1)}
          forcePage={currentPage - 1}
          t={t}
        />
      )}
    </div>
  );
};

export default ClaimedTab;
