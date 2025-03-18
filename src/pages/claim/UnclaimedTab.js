import React from "react";
import { Form } from "react-bootstrap";
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
  claimSelectedPayment,
  setOpenConfirm,
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

  // Function to handle "select all" checkbox
  const handleSelectAll = () => {
    // Get only unclaimed items that can be selected
    const unclaimedItems = unClaimedData.filter(
      (item) => item.claimStatus === "UNCLAIMED"
    );

    // If all unclaimed items are already selected, deselect all
    const allSelected = unclaimedItems.every((item) =>
      checkPaymentSelected(item)
    );

    // Select or deselect all unclaimed items
    if (allSelected) {
      // Deselect all items by removing them from selection
      unclaimedItems.forEach((item) => {
        if (checkPaymentSelected(item)) {
          selectPayment(item);
        }
      });
    } else {
      // Select all items by adding them to selection
      unclaimedItems.forEach((item) => {
        if (!checkPaymentSelected(item)) {
          selectPayment(item);
        }
      });
    }
  };

  console.log("selectedPayment", totalPageCount);

  // Check if all unclaimed items are selected
  const areAllSelected = () => {
    const unclaimedItems = unClaimedData.filter(
      (item) => item.claimStatus === "UNCLAIMED"
    );
    return (
      unclaimedItems.length > 0 &&
      unclaimedItems.every((item) => checkPaymentSelected(item))
    );
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
                title="Claim Selected"
                icon={faPlusCircle}
                className="bg-orange-500 hover:bg-orange-600"
                width={"150px"}
                handleClick={claimSelectedPayment}
              />
            )}

            {/* Conditionally render "Claim All" button if there are unclaimed items */}
            {unClaimedData?.length > 0 && (
              <ButtonComponent
                title="Claim All"
                icon={faPlusCircle}
                className="bg-orange-500 hover:bg-orange-600"
                width={"150px"}
                handleClick={() => setOpenConfirm(true)}
              />
            )}

            {/* Add Claim and Close Table button */}
            {selectedPayment.length > 0 && (
              <ButtonComponent
                title={t("confirm_close_table") ?? "Claim & Close Table"}
                icon={faPlusCircle}
                className="bg-green-500 hover:bg-green-600"
                width={"180px"}
                handleClick={() => setOpenConfirmClaimAndClose(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Table for unclaimed payments */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th className="whitespace-nowrap" scope="col">
                <Form.Check
                  type="checkbox"
                  checked={areAllSelected()}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="whitespace-nowrap" scope="col">
                {t("no")}
              </th>
              <th className="whitespace-nowrap text-center" scope="col">
                {t("tableNumber")}
              </th>
              <th className="whitespace-nowrap text-center" scope="col">
                {t("tableCode")}
              </th>
              <th className="whitespace-nowrap text-center" scope="col">
                {t("amount")}
              </th>
              <th className="whitespace-nowrap text-center" scope="col">
                {t("status")}
              </th>
              <th className="whitespace-nowrap text-center" scope="col">
                {"ສະຖານະເຄລມ"}
              </th>
              <th className="whitespace-nowrap text-center" scope="col">
                {t("date_time")}
              </th>
            </tr>
          </thead>
          <tbody>
            {unClaimedData?.length > 0 ? (
              unClaimedData.map((item, index) => {
                const isSelected = checkPaymentSelected(item);
                return (
                  <tr key={index}>
                    <td className={`whitespace-nowrap`}>
                      {item?.claimStatus === "UNCLAIMED" && (
                        <Form.Check
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => selectPayment(item)}
                        />
                      )}
                    </td>
                    <td className={`whitespace-nowrap`}>
                      {startIndex + index + 1}
                    </td>
                    <td className={`whitespace-nowrap text-center`}>
                      {item?.tableName ?? "-"}
                    </td>
                    <td className={`whitespace-nowrap text-center`}>
                      {item?.code ?? "-"}
                    </td>
                    <td
                      className={`whitespace-nowrap text-center text-green-500`}
                    >
                      {formatCurrency(item?.totalAmount, item?.currency)}
                    </td>
                    <td
                      className={`whitespace-nowrap text-green-500 text-center`}
                    >
                      {t(item.status) ?? "-"}
                    </td>
                    <td
                      className={`whitespace-nowrap text-red-500 text-center`}
                    >
                      {item.claimStatus === "UNCLAIMED" ? "ຍັງບໍ່ເຄລມ" : "-"}
                    </td>
                    <td className={`whitespace-nowrap text-center`}>
                      {item?.createdAt
                        ? moment(item.createdAt).format("DD/MM/YYYY HH:mm a")
                        : "-"}
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
          onPageChange={(e) => onPageChange(e?.selected + 1)}
          forcePage={currentPage - 1}
          t={t}
        />
      )}
    </div>
  );
};

export default UnclaimedTab;
