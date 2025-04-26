import React from "react";
import { Form } from "react-bootstrap";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import MoneySummaryCard from "./components/MoneySummaryCard";
import EmptyState from "./components/EmptyState";
import PaginationControls from "./components/PaginationControls";
import { Button } from "../../components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      {/* <MoneySummaryCard
        amount={amountData?.UNCLAIMED || 0}
        currency={storeDetail?.firstCurrency}
      /> */}

      <div>
        <div className="flex justify-end flex-wrap gap-3 mb-3">
          <div className="flex gap-2">
            {/* Claim Selected button */}
            <Button
              disabled={
                !selectedPayment.length > 0 ||
                selectedPayment.some((item) => !item.isPaidConfirm)
              }
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
              onClick={() => setOpenSelectClaim(true)}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              <span>ເຄລມລາຍການທີ່ເລືອກ</span>
            </Button>

            {/* Claim and Close Table button */}
            <Button
              disabled={
                selectedPayment.length === 0 ||
                selectedPayment.filter((item) => !item.isPaidConfirm).length ===
                  0
              }
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl"
              onClick={() => setOpenConfirmClaimAndClose(true)}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              <span>{t("confirm_close_table") ?? "Claim & Close Table"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Table for unclaimed payments */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                <Form.Check
                  type="checkbox"
                  checked={areAllSelected()}
                  onChange={selectAllPayment}
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("no")}
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("tableNumber")}
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("tableCode")}
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("amount")}
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("status")}
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                {"ສະຖານະເຄລມ"}
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("date_time")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {unClaimedData?.length > 0 ? (
              unClaimedData.map((item, index) => {
                const isSelected = checkPaymentSelected(item);
                return (
                  <tr
                    key={index}
                    className={`${
                      isSelected
                        ? "bg-orange-50 hover:bg-orange-100"
                        : "hover:bg-gray-50"
                    } transition-colors duration-150`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item?.claimStatus === "UNCLAIMED" && (
                        <Form.Check
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => selectPayment(item)}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {item?.tableName ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {item?.code ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                      {formatCurrency(item?.totalAmount, item?.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                      {item?.isPaidConfirm
                        ? "ຢືນຢັນແລ້ວ"
                        : t(item.status) ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-red-600">
                      {item.claimStatus === "UNCLAIMED" ? "ຍັງບໍ່ຂໍເຄລມ" : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {item?.createdAt
                        ? moment(item.createdAt).format("DD/MM/YYYY HH:mm a")
                        : "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
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

export default UnclaimedTab;
