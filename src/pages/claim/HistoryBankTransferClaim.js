// React and core dependencies
import { useEffect, useState } from "react";

// Third-party libraries
import axios from "axios";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2"; // Ignore spellcheck: Swal sweetalert2
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Icons
import {
  faListAlt,
  faTable,
  faCog,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";

// Constants, services and helpers
import { END_POINT_SERVER_JUSTCAN, getLocalData } from "../../constants/api"; // Ignore spellcheck: JUSTCAN
import { COLOR_APP, END_POINT } from "../../constants";
import { getHeaders } from "../../services/auth";
import { errorAdd, successAdd } from "../../helpers/sweetalert"; // Ignore spellcheck: sweetalert

// Store/state management
import { useStore } from "../../store";
import { useShiftStore } from "../../zustand/ShiftStore";
import { useClaimDataStore } from "../../zustand/claimData";
import { useStoreStore } from "../../zustand/storeStore";

// Components
import PopUpConfirms from "../../components/popup/PopUpConfirms";
import Loading from "../../components/Loading";
import UnclaimedTab from "./UnclaimedTab";
import ClaimingTab from "./ClaimingTab";
import ClaimedTab from "./ClaimedTab";
import ConfirmPopUp from "./components/ConfirmPopUp";
import CheckBillTab from "./CheckBillTab";

// Constants for claim statuses
const CLAIM_STATUSES = {
  UNCLAIMED: "UNCLAIMED",
  CLAIMING: "CLAIMING",
  CLAIMED: "CLAIMED",
};

const TabButton = ({ isSelected, onClick, icon, title }) => (
  <Button
    className={`menu-report-stocks transition-all duration-200 ${
      isSelected ? "shadow-md" : "hover:shadow-sm"
    }`}
    style={{
      background: isSelected ? COLOR_APP : "white",
      color: isSelected ? "white" : COLOR_APP,
      border: `1px solid ${COLOR_APP}`,
      padding: "0.75rem 1.5rem",
      borderRadius: "0.75rem",
      fontWeight: 500,
    }}
    onClick={onClick}
  >
    <span className="flex gap-2 items-center">
      <FontAwesomeIcon icon={icon} className="text-lg" />
      <span className="text-sm md:text-base">{title}</span>
    </span>
  </Button>
);

export default function HistoryBankTransferClaim() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState(CLAIM_STATUSES.UNCLAIMED);
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [bankAccount, setBankAccount] = useState({
    accountNumber: "",
    accountName: "",
  });
  const [openBankAccountForm, setOpenBankAccountForm] = useState(false);
  const [claimData, setClaimData] = useState({
    [CLAIM_STATUSES.UNCLAIMED]: [],
    [CLAIM_STATUSES.CLAIMING]: [],
    [CLAIM_STATUSES.CLAIMED]: [],
  });
  const [amountData, setAmountData] = useState({
    [CLAIM_STATUSES.UNCLAIMED]: 0,
    [CLAIM_STATUSES.CLAIMING]: 0,
    [CLAIM_STATUSES.CLAIMED]: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSelectClaim, setOpenSelectClaim] = useState(false);
  const [openConfirmClaimAndClose, setOpenConfirmClaimAndClose] =
    useState(false);
  const [rowsPerPage] = useState(50); // Using rowsPerPage directly, no need for setter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState({
    [CLAIM_STATUSES.UNCLAIMED]: 0,
    [CLAIM_STATUSES.CLAIMING]: 0,
    [CLAIM_STATUSES.CLAIMED]: 0,
  });

  const { setTotalAmountClaim } = useClaimDataStore();
  const { profile, setSelectedTable, getTableDataStore } = useStore();
  const { storeDetail } = useStoreStore();
  const { shiftCurrent } = useShiftStore();

  useEffect(() => {
    fetchData(selectedType, currentPage);
    getClaimAmountData();
    // Load saved bank account info
    const savedBankAccount = localStorage.getItem("bankAccountInfo");
    if (savedBankAccount) {
      setBankAccount(JSON.parse(savedBankAccount));
    }
  }, [selectedType, currentPage]);

  const getClaimAmountData = async () => {
    try {
      const { DATA } = await getLocalData();
      // Add timeout and cancel token for better network handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await axios.get(
        `${END_POINT_SERVER_JUSTCAN}/v5/checkout-total-amount?storeId=${DATA?.storeId}`, // Ignore spellcheck: JUSTCAN
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);
      setTotalAmountClaim(response?.data?.totalAmount);
    } catch (err) {
      console.log("Error fetching claim amount data:", err.message);
    }
  };

  const fetchData = async (type, page, loading = true) => {
    try {
      if (loading) setIsLoading(true);
      const { TOKEN, DATA } = await getLocalData();

      // Create abort controller for request cancellation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Map claim types to API endpoints
      const endpoints = {
        [CLAIM_STATUSES.UNCLAIMED]: `${END_POINT_SERVER_JUSTCAN}/v6/checkouts?storeId=${
          DATA?.storeId
        }&status=PAYMENT_COMPLETED&startPrice=1&endPrice=100000000&skip=${
          (page - 1) * rowsPerPage
        }&limit=${rowsPerPage}`, // Ignore spellcheck: JUSTCAN
        [CLAIM_STATUSES.CLAIMING]: `${END_POINT_SERVER_JUSTCAN}/v6/checkout/claims?storeId=${
          DATA?.storeId
        }&status=REQUESTING&skip=${
          (page - 1) * rowsPerPage
        }&limit=${rowsPerPage}`, // Ignore spellcheck: JUSTCAN
        [CLAIM_STATUSES.CLAIMED]: `${END_POINT_SERVER_JUSTCAN}/v6/checkout/claims?storeId=${
          DATA?.storeId
        }&status=APPROVED&skip=${
          (page - 1) * rowsPerPage
        }&limit=${rowsPerPage}`, // Ignore spellcheck: JUSTCAN
      };

      const apiUrl = endpoints[type];
      if (!apiUrl) {
        clearTimeout(timeoutId);
        return;
      }

      const response = await axios.get(apiUrl, {
        headers: TOKEN,
        signal: controller.signal,
      });

      console.log("Response data:", response.data);

      clearTimeout(timeoutId);

      // Update state with new data
      setClaimData((prevData) => ({
        ...prevData,
        [type]: response.data.data || [],
      }));

      setAmountData((prevAmounts) => ({
        ...prevAmounts,
        [type]: response.data.totalAmount || 0,
      }));

      // Store total count for pagination
      setTotalItems((prev) => ({
        ...prev,
        [type]: response.data.pagination.totalCount || 0,
      }));
    } catch (error) {
      console.error("Error fetching data:", error.message);
      if (axios.isCancel(error)) {
        console.log("Request cancelled:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectPayment = (payment) => {
    const { tableName, tableCode, billId } = payment;

    setSelectedPayment((prevSelected) => {
      const isAlreadySelected = prevSelected.some((x) => x.billId === billId);

      if (isAlreadySelected) {
        // Remove selected payments with matching tableName and tableCode
        return prevSelected.filter((x) => x.billId !== billId);
      } else {
        // Add all payments with matching tableName and tableCode
        const paymentsToAdd = claimData[CLAIM_STATUSES.UNCLAIMED].filter(
          (x) => x.billId === billId
        );
        return [...prevSelected, ...paymentsToAdd];
      }
    });
  };

  const selectAllPayment = () => {
    const isAllSelected =
      selectedPayment.length === claimData[CLAIM_STATUSES.UNCLAIMED].length;

    if (isAllSelected) {
      setSelectedPayment([]);
    } else {
      setSelectedPayment(claimData[CLAIM_STATUSES.UNCLAIMED]);
    }
  };

  const checkPaymentSelected = (payment) => {
    return selectedPayment.some((x) => x._id === payment._id);
  };

  const handleBankAccountSubmit = () => {
    localStorage.setItem("bankAccountInfo", JSON.stringify(bankAccount));
    setOpenBankAccountForm(false);
    successAdd(t("bank_account_saved"));
  };

  const claimSelectedPayment = async () => {
    setOpenSelectClaim(false);

    const billIds = selectedPayment
      .filter((x) => x.isPaidConfirm)
      .map((x) => x.paymentData);

    if (billIds.length === 0) {
      errorAdd(`ບໍ່ມີລາຍການທີ່ຢືນຢັນການປິດໂຕະແລ້ວ`);
      return;
    }

    if (!bankAccount.accountNumber || !bankAccount.accountName) {
      errorAdd(t("please_set_bank_account"));
      setOpenBankAccountForm(true);
      return;
    }

    try {
      setIsLoading(true);
      const { TOKEN, DATA } = await getLocalData();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await axios.post(
        `${END_POINT_SERVER_JUSTCAN}/v6/checkout/claim/create`,
        {
          payments: billIds,
          bankAccount: bankAccount.accountNumber,
          bankAccountName: bankAccount.accountName,
          shopId: DATA?.storeId,
        },
        {
          headers: TOKEN,
          signal: controller.signal,
        }
      );

      console.log("claim payment response:", response.data);

      clearTimeout(timeoutId);

      setSelectedPayment([]);
      successAdd(`ສຳເລັດແລ້ວ`); // Ignore spellcheck: ສຳເລັດແລ້ວ

      // Refresh data for both tabs
      fetchData(CLAIM_STATUSES.UNCLAIMED, currentPage);
      fetchData(CLAIM_STATUSES.CLAIMING, currentPage);
    } catch (error) {
      errorAdd(`ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່`); // Ignore spellcheck: ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່
      console.error("Error claiming payment:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const claimAllPayment = async () => {
    try {
      setOpenConfirm(false);
      setIsLoading(true);

      const { TOKEN, DATA } = await getLocalData();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      await axios.post(
        `${END_POINT_SERVER_JUSTCAN}/v5/claim-payment/create-all`, // Ignore spellcheck: JUSTCAN
        { storeId: DATA?.storeId },
        {
          headers: TOKEN,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      successAdd(`ສຳເລັດທັງໝົດແລ້ວ`); // Ignore spellcheck: ສຳເລັດທັງໝົດແລ້ວ
      fetchData(CLAIM_STATUSES.UNCLAIMED, currentPage);
    } catch (error) {
      errorAdd(`ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່`); // Ignore spellcheck: ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່
      console.error("Error claiming all payments:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uniquePaymentData = selectedPayment.reduce((unique, item) => {
    // Find if this billId already exists in our unique array
    const existingIndex = unique.findIndex((obj) => obj.billId === item.billId);

    if (existingIndex === -1) {
      // Add new entry with initial amount
      unique.push({
        billId: item.billId,
        tableName: item.tableName,
        code: item.code,
        totalAmount: item.totalAmount || 0,
        currency: item.currency,
        isPaidConfirm: item.isPaidConfirm,
      });
    } else if (item.totalAmount) {
      // Add to existing entry's total
      unique[existingIndex].totalAmount += item.totalAmount;
    }

    return unique;
  }, []);

  const checkBillOrdering = async () => {
    try {
      if (uniquePaymentData.length === 0) return;
      setIsLoading(true);

      const headers = await getHeaders();

      // Process each table sequentially with proper timeout handling
      for (const table of uniquePaymentData) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        if (table.isPaidConfirm) {
          clearTimeout(timeoutId);
          continue; // Skip this table and move to the next one
        }

        const body = {
          shiftId: shiftCurrent[0]?._id,
          isCheckout: "true",
          status: "CHECKOUT",
          paymentMethod: "APPZAP_TRANSFER" /* cspell:ignore APPZAP */,
          isOrderingPaid: false,
          billMode: "false",
          tableName: table.tableName,
          tableCode: table.code,
          fullnameStaffCheckOut:
            `${profile?.data?.firstname} ${profile?.data?.lastname}` ??
            "-" /* cspell:ignore firstname lastname */,
          staffCheckOutId: profile?.data?.id,
        };

        // First request - separated with its own try-catch
        try {
          await axios.put(
            `${END_POINT}/v7/bill-checkout`,
            {
              id: table.billId,
              data: body,
            },
            {
              headers,
              signal: controller.signal,
            }
          );
          console.log(`First request succeeded for table ${table.tableName}`);
        } catch (firstErr) {
          console.error(
            `First request failed for table ${table.tableName}:`,
            firstErr
          );
          // Continue to the second request even if the first fails
        }

        // Second request - in its own try-catch
        try {
          await axios.put(
            `${END_POINT_SERVER_JUSTCAN}/v5/checkout/update-by-bill` /* cspell:ignore JUSTCAN */,
            {
              billId: table.billId,
              code: table.code,
            },
            {
              headers,
              signal: controller.signal,
            }
          );
          console.log(`Second request succeeded for table ${table.tableName}`);
        } catch (secondErr) {
          console.error(
            `Second request failed for table ${table.tableName}:`,
            secondErr
          );
        }

        clearTimeout(timeoutId);
      }

      // Refresh data and reset selections
      await fetchData(CLAIM_STATUSES.UNCLAIMED, currentPage, false);
      setSelectedPayment([]);

      // Update UI state
      setSelectedTable();
      getTableDataStore();

      // Success notification
      Swal.fire({
        /* cspell:ignore Swal */ icon: "success",
        title: `${t("checkbill_success")}` /* cspell:ignore checkbill */,
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (error) {
      errorAdd(`${t("checkbill_fial")}`); /* cspell:ignore checkbill fial */
      console.error("Error checking bill ordering:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCloseTable = async () => {
    setOpenConfirmClaimAndClose(false);
    await checkBillOrdering();
  };

  // Calculate proper pagination values
  const calculateTotalPages = (type) => {
    return Math.ceil(totalItems[type] / rowsPerPage) || 1;
  };

  // Prepare data for each tab based on selected type
  const tabData = {
    [CLAIM_STATUSES.UNCLAIMED]: claimData[CLAIM_STATUSES.UNCLAIMED] || [],
    [CLAIM_STATUSES.CLAIMING]: claimData[CLAIM_STATUSES.CLAIMING] || [],
    [CLAIM_STATUSES.CLAIMED]: claimData[CLAIM_STATUSES.CLAIMED] || [],
  };

  console.log("tabData:", selectedPayment);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">
                {t("bank_transfer_claims")}
              </h1>
              <div className="hidden md:block h-6 w-px bg-gray-200"></div>
              <div className="flex gap-2">
                <span className="text-sm text-gray-500">
                  {t("total_claims")}:
                </span>
                <span className="text-sm font-medium text-color-app">
                  {claimData[selectedType]?.length || 0}
                </span>
              </div>
            </div>
            <Button
              className="menu-report-stocks transition-all duration-200 hover:shadow-md"
              style={{
                background: COLOR_APP,
                color: "white",
                border: `1px solid ${COLOR_APP}`,
                padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                fontWeight: 500,
              }}
              onClick={() => setOpenBankAccountForm(true)}
            >
              <span className="flex gap-2 items-center">
                <FontAwesomeIcon icon={faCog} className="text-lg" />
                <span className="text-sm md:text-base">
                  {t("bank_account_settings")}
                </span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-orange-100">
                <FontAwesomeIcon
                  icon={faCoins}
                  className="text-xl text-orange-500"
                />
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  {t("total_money_claim")}
                </div>
                <div className="text-xl font-bold text-color-app">
                  {amountData[selectedType]?.toLocaleString() || 0} {t("LAK")}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <FontAwesomeIcon
                  icon={faListAlt}
                  className="text-xl text-blue-500"
                />
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  {t("total_transactions")}
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {claimData[selectedType]?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Tabs */}
          <div className="p-6 pb-4 border-b border-gray-100">
            <div className="flex flex-wrap gap-2">
              <TabButton
                isSelected={selectedType === CLAIM_STATUSES.UNCLAIMED}
                onClick={() => {
                  setSelectedType(CLAIM_STATUSES.UNCLAIMED);
                  setCurrentPage(1);
                }}
                icon={faListAlt}
                title="ລາຍການທີ່ບໍ່ສຳເລັດ"
              />
              <TabButton
                isSelected={selectedType === CLAIM_STATUSES.CLAIMING}
                onClick={() => {
                  setSelectedType(CLAIM_STATUSES.CLAIMING);
                  setCurrentPage(1);
                }}
                icon={faListAlt}
                title="ລາຍການກຳລັງເຄລມ"
              />
              <TabButton
                isSelected={selectedType === CLAIM_STATUSES.CLAIMED}
                onClick={() => {
                  setSelectedType(CLAIM_STATUSES.CLAIMED);
                  setCurrentPage(1);
                }}
                icon={faTable}
                title="ລາຍການເຄລມເງິນ"
              />
              <TabButton
                isSelected={selectedType === "bill-checkout"}
                onClick={() => {
                  setSelectedType("bill-checkout");
                  setCurrentPage(1);
                }}
                icon={faTable}
                title="ປະຫວັດການຊຳລະ"
              />
            </div>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center items-center">
              <Loading />
            </div>
          )}

          {/* Action Buttons */}
          {selectedType === CLAIM_STATUSES.UNCLAIMED &&
            selectedPayment.length > 0 && (
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button
                    className="menu-report-stocks"
                    style={{
                      background: COLOR_APP,
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.75rem",
                    }}
                    onClick={() => setOpenSelectClaim(true)}
                  >
                    <span className="flex gap-2 items-center">
                      <FontAwesomeIcon icon={faListAlt} />
                      {t("claim_selected")}
                    </span>
                  </Button>
                  <Button
                    className="menu-report-stocks"
                    style={{
                      background: COLOR_APP,
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.75rem",
                    }}
                    onClick={() => setOpenConfirm(true)}
                  >
                    <span className="flex gap-2 items-center">
                      <FontAwesomeIcon icon={faListAlt} />
                      {t("claim_all")}
                    </span>
                  </Button>
                </div>
              </div>
            )}

          {/* Table Content */}
          <div className="p-6 pt-4 overflow-x-auto">
            {selectedType === CLAIM_STATUSES.UNCLAIMED && (
              <UnclaimedTab
                amountData={amountData}
                storeDetail={storeDetail}
                selectedPayment={selectedPayment}
                selectAllPayment={selectAllPayment}
                unClaimedData={tabData[CLAIM_STATUSES.UNCLAIMED]}
                setSelectedPayment={setSelectedPayment}
                claimSelectedPayment={claimSelectedPayment}
                setOpenConfirm={setOpenConfirm}
                page={currentPage}
                rowsPerPage={rowsPerPage}
                checkPaymentSelected={checkPaymentSelected}
                selectPayment={selectPayment}
                setOpenSelectClaim={setOpenSelectClaim}
                setOpenConfirmClaimAndClose={setOpenConfirmClaimAndClose}
                totalPageCount={calculateTotalPages(CLAIM_STATUSES.UNCLAIMED)}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                t={t}
              />
            )}
            {selectedType === CLAIM_STATUSES.CLAIMING && (
              <ClaimingTab
                amountData={amountData}
                storeDetail={storeDetail}
                claimingData={tabData[CLAIM_STATUSES.CLAIMING]}
                totalPageCount={calculateTotalPages(CLAIM_STATUSES.CLAIMING)}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                t={t}
              />
            )}
            {selectedType === CLAIM_STATUSES.CLAIMED && (
              <ClaimedTab
                amountData={amountData}
                storeDetail={storeDetail}
                claimedData={tabData[CLAIM_STATUSES.CLAIMED]}
                totalPageCount={calculateTotalPages(CLAIM_STATUSES.CLAIMED)}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                t={t}
              />
            )}
            {selectedType === "bill-checkout" && (
              <CheckBillTab
                amountData={amountData}
                storeDetail={storeDetail}
                claimedData={tabData[CLAIM_STATUSES.CLAIMED]}
                totalPageCount={calculateTotalPages(CLAIM_STATUSES.CLAIMED)}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                t={t}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bank Account Form Dialog */}
      <ConfirmPopUp
        open={openBankAccountForm}
        header={t("bank_account_settings")}
        content={
          <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {t("bank_account_number")}
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={bankAccount.accountNumber}
                onChange={(e) =>
                  setBankAccount((prev) => ({
                    ...prev,
                    accountNumber: e.target.value,
                  }))
                }
                placeholder={t("enter_bank_account_number")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {t("bank_account_name")}
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={bankAccount.accountName}
                onChange={(e) =>
                  setBankAccount((prev) => ({
                    ...prev,
                    accountName: e.target.value,
                  }))
                }
                placeholder={t("enter_bank_account_name")}
              />
            </div>
          </div>
        }
        onClose={() => setOpenBankAccountForm(false)}
        onSubmit={handleBankAccountSubmit}
      />

      {/* Confirm dialogs */}
      <PopUpConfirms
        open={openConfirm}
        text={"ເຄລມທັງໝົດ"}
        textBefore={"ທ່ານຕ້ອງການ"}
        textAfter={"ແທ້ບໍ?"}
        onClose={() => setOpenConfirm(false)}
        onSubmit={claimAllPayment}
      />

      <ConfirmPopUp
        open={openSelectClaim}
        header={"ເຄລມເງິນລາຍການທີ່ເລືອກ"}
        content={
          <div className="flex flex-col items-center text-lg">
            <div className="text-gray-600 mb-1">
              {t("total_amount_to_claim")}
            </div>
            <div className="text-color-app text-2xl font-bold">
              {selectedPayment
                .reduce((total, payment) => total + payment.totalAmount, 0)
                .toLocaleString()}{" "}
              {selectedPayment[0]?.currency ?? "LAK"}
            </div>
          </div>
        }
        onClose={() => setOpenSelectClaim(false)}
        onSubmit={claimSelectedPayment}
      />

      <ConfirmPopUp
        open={openConfirmClaimAndClose}
        header={"ຢືນຢັນການຊໍາລະເງິນ ພ້ອມປິດໂຕະ"}
        content={
          <div className="flex flex-col items-center text-lg">
            <div className="w-full mb-2">
              {selectedPayment
                .filter((payment) => !payment.isPaidConfirm)
                .map((payment, index) => (
                  <div
                    key={index}
                    className="text-base font-medium flex flex-row justify-between items-center py-1 border-b border-gray-100"
                  >
                    <span>{`${payment.tableName} (${payment.code})`}</span>
                    <span className="text-color-app">
                      {payment.totalAmount.toLocaleString()}{" "}
                      {payment.currency === "LAK" ? "ກີບ" : payment.currency}
                    </span>
                  </div>
                ))}
            </div>
            <div className="w-full pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>{t("total")}:</span>
                <span className="text-color-app">
                  {uniquePaymentData
                    .filter((payment) => !payment.isPaidConfirm)
                    .reduce((total, payment) => total + payment.totalAmount, 0)
                    .toLocaleString()}{" "}
                  {uniquePaymentData[0]?.currency === "LAK"
                    ? "ກີບ"
                    : uniquePaymentData[0]?.currency}
                </span>
              </div>
            </div>
          </div>
        }
        onClose={() => setOpenConfirmClaimAndClose(false)}
        onSubmit={handleConfirmCloseTable}
      />
    </div>
  );
}
