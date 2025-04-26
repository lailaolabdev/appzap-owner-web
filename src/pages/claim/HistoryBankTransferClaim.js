// React and core dependencies
import { useEffect, useState } from "react";

// Third-party libraries
import axios from "axios";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2"; // Ignore spellcheck: Swal sweetalert2
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Icons
import { faListAlt, faTable } from "@fortawesome/free-solid-svg-icons";

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
    className="menu-report-stocks"
    style={{
      background: isSelected ? COLOR_APP : "white",
      color: isSelected ? "white" : COLOR_APP,
    }}
    onClick={onClick}
  >
    <span className="flex gap-2 items-center">
      <FontAwesomeIcon icon={icon} /> {title}
    </span>
  </Button>
);

export default function HistoryBankTransferClaim() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState(CLAIM_STATUSES.UNCLAIMED);
  const [selectedPayment, setSelectedPayment] = useState([]);
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

  const claimSelectedPayment = async () => {
    setOpenSelectClaim(false);

    const billIds = selectedPayment
      .filter((x) => x.isPaidConfirm)
      .map((x) => x.paymentData);

    if (billIds.length === 0) {
      errorAdd(`ບໍ່ມີລາຍການທີ່ຢືນຢັນການປິດໂຕະແລ້ວ`); // Ignore spellcheck: ກະລຸນາເລືອກບິນທີ່ຕ້ອງການຊຳລະໄດ້
      return;
    }
    try {
      setIsLoading(true);
      const { TOKEN, DATA } = await getLocalData();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await axios.post(
        `${END_POINT_SERVER_JUSTCAN}/v6/checkout/claim/create`, // Ignore spellcheck: JUSTCAN
        {
          payments: billIds, // list of payment items
          bankAccount: "150120001384100001", // shop bank account
          bankAccountName: "MR SENGPHACHANH CHANTHAVONG", // shop bank account Name,
          shopId: DATA?.storeId, // storeId
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
    <div className="p-2 bg-gray-50">
      {/* Tabs */}
      <div
        className={`flex gap-2 justify-start items-center ${
          selectedType === CLAIM_STATUSES.CLAIMED ? "mb-3" : "m-1"
        }`}
      >
        <TabButton
          isSelected={selectedType === CLAIM_STATUSES.UNCLAIMED}
          onClick={() => {
            setSelectedType(CLAIM_STATUSES.UNCLAIMED);
            setCurrentPage(1); // Reset page when changing tabs
          }}
          icon={faListAlt}
          title="ລາຍການທີ່ບໍ່ສຳເລັດ" // Ignore spellcheck: ລາຍການທີ່ບໍ່ສຳເລັດ
        />

        <TabButton
          isSelected={selectedType === CLAIM_STATUSES.CLAIMING}
          onClick={() => {
            setSelectedType(CLAIM_STATUSES.CLAIMING);
            setCurrentPage(1); // Reset page when changing tabs
          }}
          icon={faListAlt}
          title="ລາຍການກຳລັງເຄລມ" // Ignore spellcheck: ລາຍການກຳລັງເຄລມ
        />

        <TabButton
          isSelected={selectedType === CLAIM_STATUSES.CLAIMED}
          onClick={() => {
            setSelectedType(CLAIM_STATUSES.CLAIMED);
            setCurrentPage(1); // Reset page when changing tabs
          }}
          icon={faTable}
          title="ລາຍການເຄລມເງິນ" // Ignore spellcheck: ລາຍການເຄລມເງິນ
        />
        <TabButton
          isSelected={selectedType === "bill-checkout"}
          onClick={() => {
            setSelectedType("bill-checkout");
            setCurrentPage(1); // Reset page when changing tabs
          }}
          icon={faTable}
          title="ປະຫວັດການຊຳລະ" // Ignore spellcheck: ລາຍການເຄລມເງິນ
        />
      </div>

      {/* Loading indicator */}
      {isLoading && <Loading />}

      {/* Tab content */}
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

      {/* Confirm dialogs */}
      <PopUpConfirms
        open={openConfirm}
        text={"ເຄລມທັງໝົດ"} // Ignore spellcheck: ເຄລມທັງໝົດ
        textBefore={"ທ່ານຕ້ອງການ"} // Ignore spellcheck: ທ່ານຕ້ອງການ
        textAfter={"ແທ້ບໍ?"} // Ignore spellcheck: ແທ້ບໍ
        onClose={() => setOpenConfirm(false)}
        onSubmit={claimAllPayment}
      />

      <ConfirmPopUp
        open={openSelectClaim}
        header={"ເຄລມເງິນລາຍການທີ່ເລືອກ"} // Ignore spellcheck:
        content={
          <div className="flex flex-col items-center text-lg gap-1">
            <span>ຈຳນວນເງິນເຄລມທັງໝົດ</span>
            <span className="text-color-app text-2xl font-bold">
              {selectedPayment
                .reduce((total, payment) => total + payment.totalAmount, 0)
                .toLocaleString()}{" "}
              {selectedPayment[0]?.currency ?? "LAK"}
            </span>
          </div>
        }
        onClose={() => setOpenSelectClaim(false)}
        onSubmit={claimSelectedPayment}
      />

      <ConfirmPopUp
        open={openConfirmClaimAndClose}
        header={"ຢືນຢັນການຊໍາລະເງິນ ພ້ອມປິດໂຕະ"} // Ignore spellcheck: ເຄລມແລະປິດໂຕະ
        content={
          <div className="flex flex-col items-center text-lg gap-2">
            <div className="flex flex-col gap-0">
              {selectedPayment
                .filter((payment) => !payment.isPaidConfirm)
                .map((payment, index) => (
                  <div
                    key={index}
                    className="text-lg font-bold flex flex-row gap-2"
                  >
                    <span>{`${payment.tableName} (${payment.code}):`}</span>
                    <span className="text-color-app">
                      {payment.totalAmount.toLocaleString()}{" "}
                      {payment.currency === "LAK" ? "ກີບ" : payment.currency}
                    </span>
                  </div>
                ))}
            </div>
            <span className="text-xl font-bold">
              <span>{`ລວມທັງໝົດ: `}</span>
              <span className="text-color-app">
                {uniquePaymentData
                  .filter((payment) => !payment.isPaidConfirm)
                  .reduce((total, payment) => total + payment.totalAmount, 0)
                  .toLocaleString()}{" "}
                {uniquePaymentData[0]?.currency === "LAK"
                  ? "ກີບ"
                  : uniquePaymentData[0]?.currency}
              </span>
            </span>
          </div>
        }
        onClose={() => setOpenConfirmClaimAndClose(false)}
        onSubmit={handleConfirmCloseTable}
      />
    </div>
  );
}
