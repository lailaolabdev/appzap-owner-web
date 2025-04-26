import React from "react";
import MoneySummaryCard from "./components/MoneySummaryCard";
import EmptyState from "./components/EmptyState";
import PaginationControls from "./components/PaginationControls";
import moment from "moment";

const ClaimingTab = ({
  amountData,
  storeDetail,
  claimingData,
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
      {/* Summary card showing total claiming amount */}
      <MoneySummaryCard
        amount={amountData?.CLAIMING || 0}
        currency={storeDetail?.firstCurrency}
      />

      <div style={{ height: 10 }} />

      {/* Table for claiming payments */}
      <div className="overflow-x-auto">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th className="text-start" scope="col">
                {t("no")}
              </th>
              <th className="text-center" scope="col">
                {t("ລະຫັດເຄລມ")}
              </th>
              <th className="text-center" scope="col">
                {t("ຈຳນວນເງິນ")}
              </th>
              <th className="text-center" scope="col">
                {t("ສະຖານະເຄລມ")}
              </th>
              <th className="text-center" scope="col">
                {t("date_time")}
              </th>
            </tr>
          </thead>
          <tbody>
            {claimingData?.length > 0 ? (
              claimingData.map((item, index) => (
                <tr key={index}>
                  <td className="text-start">{startIndex + index + 1}</td>
                  <td className="text-center">{item?.billNo ?? "-"}</td>
                  <td className="text-center text-green-500">
                    {formatCurrency(item?.totalPrice, item?.currency)}
                  </td>
                  <td className="text-center text-yellow-500">
                    {item.status === "REQUESTING" ? "ກຳລັງເຄລມ" : "-"}
                  </td>
                  <td className="text-center">
                    {item?.createdAt
                      ? moment(item.updatedAt).format("DD/MM/YYYY HH:mm a")
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <EmptyState />
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

export default ClaimingTab;
