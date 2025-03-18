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
      currency || storeDetail?.firstCurrency || "LAK"
    }`;
  };

  return (
    <div>
      {/* Summary card showing total claimed amount */}
      <MoneySummaryCard
        amount={amountData?.CLAIMED || 0}
        currency={storeDetail?.firstCurrency}
      />

      <div style={{ height: 10 }} />

      {/* Table for claimed payments */}
      <div className="overflow-x-auto">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("no")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("ລະຫັດເຄລມ")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("ຈຳນວນບິນ")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("ຈຳນວນບິນເງິນ")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("detail")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("status")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("date_time")}
              </th>
            </tr>
          </thead>
          <tbody>
            {claimedData?.length > 0 ? (
              claimedData.map((item, index) => (
                <tr key={item._id || index}>
                  <td style={{ textWrap: "nowrap" }}>
                    {startIndex + index + 1}
                  </td>
                  <td style={{ textWrap: "nowrap" }}>{item?.code ?? "-"}</td>
                  <td style={{ textWrap: "nowrap" }}>
                    {item?.billIds?.length ?? "-"}
                  </td>
                  <td style={{ textWrap: "nowrap" }}>
                    {formatCurrency(item?.totalAmount, item?.currency)}
                  </td>
                  <td style={{ textWrap: "nowrap" }}>{t("checkout") ?? "-"}</td>
                  <td style={{ textWrap: "nowrap" }}>
                    {item.status === "CLAIMED"
                      ? "ຖອນເງິນຄືນແລ້ວ"
                      : t(item.status) ?? "-"}
                  </td>
                  <td style={{ textWrap: "nowrap" }}>
                    {item?.createdAt
                      ? moment(item.createdAt).format("DD/MM/YYYY HH:mm a")
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
          onPageChange={(e) => onPageChange(e?.selected)}
          forcePage={currentPage - 1}
          t={t}
        />
      )}
    </div>
  );
};

export default ClaimedTab;
