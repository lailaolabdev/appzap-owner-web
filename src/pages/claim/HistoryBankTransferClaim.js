// React and core dependencies
import { useEffect, useState } from "react";

// Third-party libraries
import axios from "axios";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Icons
import { faListAlt, faTable } from "@fortawesome/free-solid-svg-icons";

// Constants, services and helpers
import { END_POINT_SERVER_JUSTCAN, getLocalData } from "../../constants/api";
import { COLOR_APP, END_POINT } from "../../constants";
import { getHeaders } from "../../services/auth";
import { errorAdd, successAdd } from "../../helpers/sweetalert";

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
  const [openConfirmClaimAndClose, setOpenConfirmClaimAndClose] =
    useState(false);
  const [rowsPerPage] = useState(100);
  const [page, setPage] = useState(0);

  const { setTotalAmountClaim } = useClaimDataStore();
  const { profile, setSelectedTable, getTableDataStore } = useStore();
  const { storeDetail } = useStoreStore();
  const { shiftCurrent } = useShiftStore();

  useEffect(() => {
    fetchData(selectedType);
    getClaimAmountData();
  }, [selectedType]);

  const getClaimAmountData = async () => {
    try {
      const { DATA } = await getLocalData();
      const response = await axios.get(
        `${END_POINT_SERVER_JUSTCAN}/v5/checkout-total-amount?storeId=${DATA?.storeId}`
      );
      setTotalAmountClaim(response?.data?.totalAmount);
    } catch (err) {
      console.log("err", err);
    }
  };

  const fetchData = async (type) => {
    try {
      setIsLoading(true);
      const { TOKEN, DATA } = await getLocalData();

      // Map claim types to API endpoints
      const endpoints = {
        [CLAIM_STATUSES.UNCLAIMED]: `${END_POINT_SERVER_JUSTCAN}/v5/checkouts?storeId=${DATA?.storeId}&claimStatus=UNCLAIMED&paymentMethod=BANK_TRANSFER&status=PAID&skip=0&limit=999999`,
        [CLAIM_STATUSES.CLAIMING]: `${END_POINT_SERVER_JUSTCAN}/v5/claim-payments?storeId=${DATA?.storeId}&status=CLAIMING&skip=0&limit=999999`,
        [CLAIM_STATUSES.CLAIMED]: `${END_POINT_SERVER_JUSTCAN}/v5/claim-payments?storeId=${DATA?.storeId}&status=CLAIMED&skip=0&limit=999999`,
      };

      const apiUrl = endpoints[type];
      if (!apiUrl) return;

      const response = await axios.get(apiUrl, { headers: TOKEN });

      // Update state with new data
      setClaimData((prevData) => ({
        ...prevData,
        [type]: response.data.data || [],
      }));

      setAmountData((prevAmounts) => ({
        ...prevAmounts,
        [type]: response.data.totalAmount || 0,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPayment = (payment) => {
    const { tableName, tableCode } = payment;

    setSelectedPayment((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (x) => x.tableName === tableName && x.tableCode === tableCode
      );

      if (isAlreadySelected) {
        // Remove selected payments with matching tableName and tableCode
        return prevSelected.filter(
          (x) => x.tableName !== tableName || x.tableCode !== tableCode
        );
      } else {
        // Add all payments with matching tableName and tableCode
        const paymentsToAdd = claimData[CLAIM_STATUSES.UNCLAIMED].filter(
          (x) => x.tableName === tableName && x.tableCode === tableCode
        );
        return [...prevSelected, ...paymentsToAdd];
      }
    });
  };

  const checkPaymentSelected = (payment) => {
    return selectedPayment.some((x) => x._id === payment._id);
  };

  const claimSelectedPayment = async () => {
    try {
      setIsLoading(true);
      const billIds = selectedPayment.map((x) => x._id);
      const { TOKEN, DATA } = await getLocalData();

      await axios.post(
        `${END_POINT_SERVER_JUSTCAN}/v5/claim-payment/create`,
        {
          storeId: DATA?.storeId,
          billIds: billIds,
        },
        { headers: TOKEN }
      );

      setSelectedPayment([]);
      successAdd(`ສ້າງເຄລມສຳເລັດ`);

      // Refresh data for both tabs
      fetchData(CLAIM_STATUSES.UNCLAIMED);
      fetchData(CLAIM_STATUSES.CLAIMING);
    } catch (error) {
      errorAdd(`ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃຫມ່`);
    } finally {
      setIsLoading(false);
    }
  };

  const claimAllPayment = async () => {
    try {
      setOpenConfirm(false);
      setIsLoading(true);

      const { TOKEN, DATA } = await getLocalData();
      await axios.post(
        `${END_POINT_SERVER_JUSTCAN}/v5/claim-payment/create-all`,
        { storeId: DATA?.storeId },
        { headers: TOKEN }
      );

      successAdd(`ສ້າງເຄລມທັງຫມົດສຳເລັດ`);
      fetchData(CLAIM_STATUSES.UNCLAIMED);
    } catch (error) {
      errorAdd(`ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃຫມ່`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkBillOrdering = async () => {
    try {
      const currentPayment = selectedPayment[0];
      if (!currentPayment) return;

      const body = {
        shiftId: shiftCurrent[0]?._id,
        isCheckout: "true",
        status: "CHECKOUT",
        paymentMethod: "APPZAP_TRANSFER",
        isOrderingPaid: false,
        billMode: "false",
        tableName: currentPayment?.tableName,
        tableCode: currentPayment?.code,
        fullnameStaffCheckOut:
          `${profile?.data?.firstname} ${profile?.data?.lastname}` ?? "-",
        staffCheckOutId: profile?.data?.id,
      };

      await axios.put(
        `${END_POINT}/v7/bill-checkout`,
        {
          id: currentPayment?.billId,
          data: body,
        },
        { headers: await getHeaders() }
      );

      setSelectedTable();
      getTableDataStore();
      Swal.fire({
        icon: "success",
        title: `${t("checkbill_success")}`,
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (error) {
      errorAdd(`${t("checkbill_fial")}`);
    }
  };

  const handleConfirmCloseTable = async () => {
    setOpenConfirmClaimAndClose(false);
    checkBillOrdering();
    claimSelectedPayment();
  };

  // Prepare data for each tab based on selected type
  const tabData = {
    [CLAIM_STATUSES.UNCLAIMED]: claimData[CLAIM_STATUSES.UNCLAIMED] || [],
    [CLAIM_STATUSES.CLAIMING]: claimData[CLAIM_STATUSES.CLAIMING] || [],
    [CLAIM_STATUSES.CLAIMED]: claimData[CLAIM_STATUSES.CLAIMED] || [],
  };

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
          onClick={() => setSelectedType(CLAIM_STATUSES.UNCLAIMED)}
          icon={faListAlt}
          title="ລາຍການຊຳລະ"
        />

        <TabButton
          isSelected={selectedType === CLAIM_STATUSES.CLAIMING}
          onClick={() => setSelectedType(CLAIM_STATUSES.CLAIMING)}
          icon={faListAlt}
          title="ລາຍການກຳລັງເຄລມ"
        />

        <TabButton
          isSelected={selectedType === CLAIM_STATUSES.CLAIMED}
          onClick={() => setSelectedType(CLAIM_STATUSES.CLAIMED)}
          icon={faTable}
          title="ລາຍການເຄລມເງິນ"
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
          unClaimedData={tabData[CLAIM_STATUSES.UNCLAIMED]}
          setSelectedPayment={setSelectedPayment}
          claimSelectedPayment={claimSelectedPayment}
          setOpenConfirm={setOpenConfirm}
          page={page}
          rowsPerPage={rowsPerPage}
          checkPaymentSelected={checkPaymentSelected}
          selectPayment={selectPayment}
          setOpenConfirmClaimAndClose={setOpenConfirmClaimAndClose}
          t={t}
        />
      )}
      {selectedType === CLAIM_STATUSES.CLAIMING && (
        <ClaimingTab
          amountData={amountData}
          storeDetail={storeDetail}
          claimingData={tabData[CLAIM_STATUSES.CLAIMING]}
          page={page}
          rowsPerPage={rowsPerPage}
          t={t}
        />
      )}
      {selectedType === CLAIM_STATUSES.CLAIMED && (
        <ClaimedTab
          amountData={amountData}
          storeDetail={storeDetail}
          claimedData={tabData[CLAIM_STATUSES.CLAIMED]}
          page={page}
          rowsPerPage={rowsPerPage}
          t={t}
        />
      )}

      {/* Confirm dialogs */}
      <PopUpConfirms
        open={openConfirm}
        text={"ເຄລມທັງໝົດ"}
        textBefore={"ທ່ານຕ້ອງການ"}
        textAfter={"ແທ້ບໍ່"}
        onClose={() => setOpenConfirm(false)}
        onSubmit={claimAllPayment}
      />

      <PopUpConfirms
        open={openConfirmClaimAndClose}
        text={"ເຄລມແລະປິດໂຕະ"}
        textBefore={"ທ່ານຕ້ອງການ"}
        textAfter={"ເລີຍບໍ່ ?"}
        onClose={() => setOpenConfirmClaimAndClose(false)}
        onSubmit={handleConfirmCloseTable}
      />
    </div>
  );
}
