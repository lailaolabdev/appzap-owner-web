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
  selectAllPayment,
  setOpenSelectClaim,
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
      currency || storeDetail?.firstCurrency === "LAK" ? "ກີບ" : "LAK"
    }`;
  };

  // Check if all items are selected
  const areAllSelected = () => {
    return (
      unClaimedData.length > 0 &&
      unClaimedData.every((item) => checkPaymentSelected(item))
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
            <ButtonComponent
              disabled={
                !selectedPayment.length > 0 ||
                selectedPayment.some((item) => !item.isPaidConfirm)
              }
              title="ເຄລມລາຍການທີ່ເລືອກ"
              icon={faPlusCircle}
              className={`bg-orange-500 hover:bg-orange-600 ${
                !selectedPayment.length > 0 ||
                selectedPayment.some((item) => !item.isPaidConfirm)
                  ? "!bg-orange-300 !cursor-default"
                  : ""
              }`}
              handleClick={() => setOpenSelectClaim(true)}
            />

            {/* Conditionally render "Claim All" button if there are unclaimed items */}
            {/* {unClaimedData?.length > 0 && (
              <ButtonComponent
                title="Claim All"
                icon={faPlusCircle}
                className="bg-orange-500 hover:bg-orange-600"
                width={"150px"}
                handleClick={() => setOpenConfirm(true)}
              />
            )} */}

            {/* Add Claim and Close Table button */}
            <ButtonComponent
              disabled={
                selectedPayment.length === 0 ||
                selectedPayment.filter((item) => !item.isPaidConfirm).length ===
                  0
              }
              title={t("confirm_close_table") ?? "Claim & Close Table"}
              icon={faPlusCircle}
              className={`bg-green-500 hover:bg-green-600 ${
                selectedPayment.length === 0 ||
                selectedPayment.filter((item) => !item.isPaidConfirm).length ===
                  0
                  ? "!bg-green-300 !cursor-default"
                  : ""
              }`}
              handleClick={() => setOpenConfirmClaimAndClose(true)}
            />
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
                  onChange={selectAllPayment}
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
                  <tr
                    key={index}
                    className={`${isSelected ? "!bg-orange-100" : ""}`}
                  >
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
                      {item?.isPaidConfirm
                        ? "ຢືນຢັນແລ້ວ"
                        : t(item.status) ?? "-"}
                    </td>
                    <td
                      className={`whitespace-nowrap text-red-500 text-center`}
                    >
                      {item.claimStatus === "UNCLAIMED" ? "ຍັງບໍ່ຂໍເຄລມ" : "-"}
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
