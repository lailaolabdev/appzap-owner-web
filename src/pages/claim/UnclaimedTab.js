import React from "react";
import { Button } from "react-bootstrap";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import MoneySummaryCard from "./components/MoneySummaryCard";
import EmptyState from "./components/EmptyState";
import PaginationControls from "./components/PaginationControls";
import { ButtonComponent } from "../../components";
import moment from "moment";

const UnclaimedTab = ({
  amountData,
  storeDetail,
  selectedPayment,
  unClaimedData,
  setSelectedPayment,
  claimSelectedPayment,
  setOpenConfirm,
  page,
  rowsPerPage,
  checkPaymentSelected,
  selectPayment,
  setOpenConfirmClaimAndClose,
  totalPageCount,
  currentPage,
  onPageChange,
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
      {/* Summary card showing total unclaimed amount */}
      <MoneySummaryCard
        amount={amountData?.UNCLAIMED || 0}
        currency={storeDetail?.firstCurrency}
      />

      <div>
        <div className="flex justify-end flex-wrap gap-3 mb-3">
          <div className="flex gap-2">
            {/* Conditionally render "Claim Selected" button if items are selected */}
            {selectedPayment.length > 0 && (
              <ButtonComponent
                title={"ເຄລມຕາມເລືອກ"}
                icon={faPlusCircle}
                colorbg={"#f97316"}
                width={"150px"}
                handleClick={claimSelectedPayment}
              />
            )}

            {/* Conditionally render "Claim All" button if there are unclaimed items */}
            {unClaimedData?.length > 0 && (
              <ButtonComponent
                title={"ເຄລມທັງຫມົດ"}
                icon={faPlusCircle}
                colorbg={"#f97316"}
                width={"150px"}
                handleClick={() => setOpenConfirm(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Table for unclaimed payments */}
      <div className="overflow-x-auto">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("no")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("tableNumber")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("tableCode")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("amount")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("detail")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("status")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                ສະຖານະເຄລມ
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                {t("date_time")}
              </th>
              <th style={{ textWrap: "nowrap" }} scope="col">
                ຈັດການ
              </th>
            </tr>
          </thead>
          <tbody>
            {unClaimedData?.length > 0 ? (
              unClaimedData.map((item, index) => {
                const isSelected = checkPaymentSelected(item);
                return (
                  <tr
                    key={index}
                    style={{ backgroundColor: isSelected ? "#616161" : "" }}
                  >
                    <td
                      style={{
                        textWrap: "nowrap",
                        color: isSelected ? "white" : "",
                      }}
                    >
                      {startIndex + index + 1}
                    </td>
                    <td
                      style={{
                        textWrap: "nowrap",
                        color: isSelected ? "white" : "",
                      }}
                    >
                      {item?.tableName ?? "-"}
                    </td>
                    <td
                      style={{
                        textWrap: "nowrap",
                        color: isSelected ? "white" : "",
                      }}
                    >
                      {item?.code ?? "-"}
                    </td>
                    <td
                      style={{
                        textWrap: "nowrap",
                        color: isSelected ? "white" : "",
                      }}
                    >
                      {formatCurrency(item?.totalAmount, item?.currency)}
                    </td>
                    <td
                      style={{
                        textWrap: "nowrap",
                        color: isSelected ? "white" : "",
                      }}
                    >
                      {t("checkout") ?? "-"}
                    </td>
                    <td
                      style={{
                        textWrap: "nowrap",
                        color: isSelected ? "white" : "",
                      }}
                    >
                      {t(item.status) ?? "-"}
                    </td>
                    <td
                      style={{
                        textWrap: "nowrap",
                        color: isSelected ? "white" : "",
                      }}
                    >
                      {item.claimStatus === "UNCLAIMED" ? "ຖອນເງິນຄືນ" : "-"}
                    </td>
                    <td
                      style={{
                        textWrap: "nowrap",
                        color: isSelected ? "white" : "",
                      }}
                    >
                      {item?.createdAt
                        ? moment(item.createdAt).format("DD/MM/YYYY HH:mm a")
                        : "-"}
                    </td>
                    <td
                      className={`${
                        isSelected ? "text-white" : ""
                      } flex flex-row gap-2`}
                    >
                      {item?.claimStatus === "UNCLAIMED" && (
                        <Button
                          onClick={() => selectPayment(item)}
                          variant={isSelected ? "light" : "primary"}
                        >
                          {isSelected ? "ຍົກເລີກ" : "ເລືອກ"}
                        </Button>
                      )}

                      {item?.claimStatus === "UNCLAIMED" && isSelected && (
                        <Button
                          onClick={() => setOpenConfirmClaimAndClose(true)}
                          variant="success"
                        >
                          {t("confirm_close_table")}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
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

export default UnclaimedTab;
