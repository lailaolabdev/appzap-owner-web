import {
  faListAlt,
  faPlusCircle,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Button, Pagination } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FcEmptyTrash } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";
import Swal from "sweetalert2";

import { ButtonComponent } from "../../components";
import {
  END_POINT_SERVER_JUSTCAN,
  END_POINT_SEVER,
  getLocalData,
} from "../../constants/api";
import { END_POINT, COLOR_APP } from "../../constants";
import { getHeaders } from "../../services/auth";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import PopUpConfirms from "../../components/popup/PopUpConfirms";
import Loading from "../../components/Loading";
import { moneyCurrency } from "./../../helpers/index";
import { useStore } from "../../store";
import { useShiftStore } from "../../zustand/ShiftStore";
import { useClaimDataStore } from "../../zustand/claimData";
import { useStoreStore } from "../../zustand/storeStore";

// Component for the header tabs
const TabButton = ({ isSelected, onClick, icon, title }) => (
  <Button
    onKeyDown={() => {}}
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

// Component for the money summary card
const MoneySummaryCard = ({ amount, currency }) => (
  <div className="my-3">
    <div className="max-w-lg p-4 border-2 border-orange-500 bg-white rounded-lg shadow-xl w-[350px] h-[160px]">
      <div className="flex flex-row items-center gap-3">
        <span className="bg-orange-500 border border-orange-500 w-[80px] h-[80px] rounded-full relative">
          <GiMoneyStack className="absolute top-4 right-4 text-[50px] text-white" />
        </span>
        <div className="flex flex-col justify-center items-center mt-2">
          <h4 className="text-lg text-gray-500 font-bold">Total Money Claim</h4>
          <h2 className="text-3xl font-bold text-orange-600 text-center">
            {moneyCurrency(amount)} {currency}
          </h2>
        </div>
      </div>
    </div>
  </div>
);

// Component for the empty state
const EmptyState = () => (
  <tr>
    <td colSpan={9}>
      <div className="flex flex-col items-center mt-4">
        <p className="text-orange-500 text-[18px] font-bold">ບໍ່ມີຂໍ້ມູນ</p>
        <FcEmptyTrash className="text-orange-500 text-[60px] animate-bounce" />
      </div>
    </td>
  </tr>
);

// Component for pagination
const PaginationControls = ({ pageCount, onPageChange, t }) => (
  <ReactPaginate
    previousLabel={
      <span className="glyphicon glyphicon-chevron-left">{t("previous")}</span>
    }
    nextLabel={
      <span className="glyphicon glyphicon-chevron-right">{t("next")}</span>
    }
    breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
    breakClassName={"break-me"}
    pageCount={pageCount || 1}
    marginPagesDisplayed={1}
    pageRangeDisplayed={3}
    onPageChange={onPageChange}
    containerClassName={"pagination justify-content-center"}
    pageClassName={"page-item"}
    pageLinkClassName={"page-link"}
    activeClassName={"active"}
    previousClassName={"page-item"}
    nextClassName={"page-item"}
    previousLinkClassName={"page-link"}
    nextLinkClassName={"page-link"}
  />
);

export default function HistoryBankTransferClaim() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState("UNCLAIMED");
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [claimedData, setClaimedData] = useState([]);
  const [claimingData, setClaimingData] = useState([]);
  const [unClaimedData, setUnClaimedData] = useState([]);
  const [amountData, setAmountData] = useState({
    unclaimed: 0,
    claiming: 0,
    claimed: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmClaimAndClose, setOpenConfirmClaimAndClose] =
    useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 100;
  const [pageClaimData, setPageClaimData] = useState(1);
  const [totalPageClaimData, setTotalPageClaimData] = useState(1);
  const [pageClaimingData, setPageClaimingData] = useState(1);
  const [totalPageClaimingData, setTotalPageClaimingData] = useState(1);
  const [pageUnClaimData, setPageUnClaimData] = useState(1);
  const [totalPageUnClaimData, setTotalPageUnClaimData] = useState(1);

  // Zustand stores
  const { profile, setSelectedTable, getTableDataStore } = useStore();
  const { storeDetail } = useStoreStore();
  const { TotalAmountClaim, setTotalAmountClaim } = useClaimDataStore();
  const { shiftCurrent } = useShiftStore();

  // Calculate total amount of selected claims
  const totalAmountSelectedClaim = selectedPayment.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0
  );

  useEffect(() => {
    getDataAllUnClaim();
    getDataAllClaiming();
    getDataAllClaimed();
  }, []);

  // // API calls
  // const getClaimData = async () => {
  //   try {
  //     setIsLoading(true);
  //     const { DATA } = await getLocalData();
  //     const response = await axios.get(
  //       `${END_POINT_SERVER_JUSTCAN}/v5/claim-payments?storeId=${DATA?.storeId}`
  //     );
  //     setClaimData(response?.data?.data);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //   }
  // };

  const getDataAllUnClaim = async () => {
    try {
      setIsLoading(true);
      const { TOKEN, DATA } = await getLocalData();
      const apiUrl = `${END_POINT_SERVER_JUSTCAN}/v5/checkouts?storeId=${DATA?.storeId}&claimStatus=UNCLAIMED&paymentMethod=BANK_TRANSFER&status=PAID`;
      const response = await axios.get(apiUrl, { header: TOKEN });
      setUnClaimedData(response?.data?.data);
      setAmountData({ ...amountData, unclaimed: response?.data?.totalAmount });
      console.log("unclaimed", response?.data?.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getDataAllClaiming = async () => {
    try {
      setIsLoading(true);
      const { TOKEN, DATA } = await getLocalData();
      const apiUrl = `${END_POINT_SERVER_JUSTCAN}/v5/checkouts?storeId=${DATA?.storeId}&claimStatus=CLAIMING&paymentMethod=BANK_TRANSFER&status=PAID`;
      const response = await axios.get(apiUrl, { header: TOKEN });
      setClaimingData(response?.data?.data);
      setAmountData({ ...amountData, claiming: response?.data?.totalAmount });
      console.log("claiming", response?.data?.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getDataAllClaimed = async () => {
    try {
      setIsLoading(true);
      const { TOKEN, DATA } = await getLocalData();
      const apiUrl = `${END_POINT_SERVER_JUSTCAN}/v5/checkouts?storeId=${DATA?.storeId}&claimStatus=CLAIMED&paymentMethod=BANK_TRANSFER&status=PAID`;
      const response = await axios.get(apiUrl, { header: TOKEN });
      setClaimedData(response?.data?.data);
      setAmountData({ ...amountData, claimed: response?.data?.totalAmount });
      console.log("claimed", response?.data?.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // User interactions
  const selectPayment = (payment) => {
    let updatedSelection = [...selectedPayment];
    const isAlreadySelected = updatedSelection.some(
      (x) =>
        x.tableName === payment.tableName && x.tableCode === payment.tableCode
    );

    if (!isAlreadySelected) {
      // Select all payments with the same tableName and tableCode
      updatedSelection = [
        ...updatedSelection,
        ...unClaimedData.filter(
          (x) =>
            x.tableName === payment.tableName &&
            x.tableCode === payment.tableCode
        ),
      ];
    } else {
      // Deselect all payments with the same tableName and tableCode
      updatedSelection = updatedSelection.filter(
        (x) =>
          x.tableName !== payment.tableName || x.tableCode !== payment.tableCode
      );
    }

    setSelectedPayment(updatedSelection);
  };

  const checkPaymentSelected = (payment) => {
    return selectedPayment.findIndex((x) => x._id === payment._id) >= 0;
  };

  const claimSelectedPayment = async () => {
    setIsLoading(true);
    try {
      const billIds = selectedPayment.map((x) => x._id);
      const { TOKEN, DATA } = await getLocalData();

      await axios.post(
        `${END_POINT_SERVER_JUSTCAN}/v5/claim-payment/create`,
        {
          storeId: DATA?.storeId,
          billIds: billIds,
        },
        {
          headers: TOKEN,
        }
      );

      // Reset selected payments
      setSelectedPayment([]);
      setIsLoading(false);
      successAdd(`ສ້າງເຄລມສຳເລັດ`);

      // Refresh data
      // getClaimData();
      getDataAllUnClaim();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      errorAdd(`ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃຫມ່`);
    }
  };

  const claimAllPayment = async () => {
    setOpenConfirm(false);
    setIsLoading(true);
    try {
      const { TOKEN, DATA } = await getLocalData();
      await axios.post(
        `${END_POINT_SERVER_JUSTCAN}/v5/claim-payment/create-all`,
        { storeId: DATA?.storeId },
        {
          headers: TOKEN,
        }
      );
      setIsLoading(false);
      successAdd(`ສ້າງເຄລມທັງຫມົດສຳເລັດ`);

      // Refresh data
      // getClaimData();
      getDataAllUnClaim();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      errorAdd(`ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃຫມ່`);
    }
  };

  const checkBillOrdering = async () => {
    try {
      const body = {
        shiftId: shiftCurrent[0]?._id,
        isCheckout: "true",
        status: "CHECKOUT",
        paymentMethod: "APPZAP_TRANSFER",
        isOrderingPaid: false,
        billMode: "false",
        tableName: selectedPayment[0]?.tableName,
        tableCode: selectedPayment[0]?.code,
        fullnameStaffCheckOut:
          `${profile?.data?.firstname} ${profile?.data?.lastname}` ?? "-",
        staffCheckOutId: profile?.data?.id,
      };

      await axios.put(
        `${END_POINT}/v7/bill-checkout`,
        {
          id: selectedPayment[0]?.billId,
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

  // Render functions for tab content
  const renderUnclaimedTab = () => (
    <div>
      {unClaimedData?.length > 0 && (
        <MoneySummaryCard
          amount={amountData?.unclaimed}
          currency={storeDetail?.firstCurrency}
        />
      )}

      <div>
        <div className="flex justify-end flex-wrap gap-3">
          <div className="flex gap-2">
            {selectedPayment.length > 0 && (
              <ButtonComponent
                title={"ເຄລມຕາມເລືອກ"}
                icon={faPlusCircle}
                colorbg={"#f97316"}
                width={"150px"}
                handleClick={() => claimSelectedPayment()}
              />
            )}
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

      <div style={{ height: 10 }} />

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
            unClaimedData?.map((item, index) => {
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
                    {page * rowsPerPage + index + 1}
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
                    {item?.totalAmount
                      ? `${item?.totalAmount.toLocaleString()} ${
                          item?.currency ?? "LAK"
                        }`
                      : "-"}
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
                    {moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}
                  </td>
                  <td
                    className={`${
                      isSelected ? "text-white" : ""
                    } flex flex-row gap-2`}
                  >
                    {item?.claimStatus === "UNCLAIMED" && (
                      <Button onClick={() => selectPayment(item)}>
                        {isSelected ? "ຍົກເລີກ" : "ເລືອກ"}
                      </Button>
                    )}

                    {item?.claimStatus === "UNCLAIMED" && isSelected && (
                      <Button onClick={() => setOpenConfirmClaimAndClose(true)}>
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

      <PaginationControls
        pageCount={totalPageClaimData}
        onPageChange={(e) => setPageClaimData(e?.selected + 1)}
        t={t}
      />
    </div>
  );

  const renderClaimingTab = () => (
    <>
      {claimingData?.length > 0 && (
        <MoneySummaryCard
          amount={amountData.claiming}
          currency={storeDetail?.firstCurrency}
        />
      )}

      <div style={{ height: 10 }} />

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
          </tr>
        </thead>
        <tbody>
          {claimingData?.length > 0 ? (
            claimingData?.map((item, index) => {
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
                    {page * rowsPerPage + index + 1}
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
                    {item?.totalAmount
                      ? `${item?.totalAmount.toLocaleString()} ${
                          item?.currency ?? "LAK"
                        }`
                      : "-"}
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
                    {item.claimStatus === "CLAIMING" ? "ກຳລັງຖອນເງິນຄືນ" : "-"}
                  </td>
                  <td
                    style={{
                      textWrap: "nowrap",
                      color: isSelected ? "white" : "",
                    }}
                  >
                    {moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}
                  </td>
                </tr>
              );
            })
          ) : (
            <EmptyState />
          )}
        </tbody>
      </table>

      <PaginationControls
        pageCount={totalPageUnClaimData}
        onPageChange={(e) => setPageUnClaimData(e?.selected + 1)}
        t={t}
      />
    </>
  );

  const renderClaimedTab = () => (
    <div>
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
          </tr>
        </thead>
        <tbody>
          {claimedData?.length > 0 ? (
            claimedData?.map((item, index) => {
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
                    {page * rowsPerPage + index + 1}
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
                    {item?.totalAmount
                      ? `${item?.totalAmount.toLocaleString()} ${
                          item?.currency ?? "LAK"
                        }`
                      : "-"}
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
                    {item.claimStatus === "CLAIMED" ? "ຖອນເງິນສຳເລັດ" : "-"}
                  </td>
                  <td
                    style={{
                      textWrap: "nowrap",
                      color: isSelected ? "white" : "",
                    }}
                  >
                    {moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}
                  </td>
                </tr>
              );
            })
          ) : (
            <EmptyState />
          )}
        </tbody>
      </table>

      <PaginationControls
        pageCount={totalPageClaimingData}
        onPageChange={(e) => setPageClaimingData(e?.selected + 1)}
        t={t}
      />
    </div>
  );

  return (
    <div className="p-2 bg-gray-50">
      {/* Tabs */}
      <div
        className={`flex gap-2 justify-start items-center ${
          selectedType === "CLAIMED" ? "mb-3" : "m-1"
        }`}
      >
        <TabButton
          isSelected={selectedType === "UNCLAIMED"}
          onClick={() => {
            setSelectedType("UNCLAIMED");
            getDataAllUnClaim();
          }}
          icon={faListAlt}
          title="ລາຍການຊຳລະ"
        />

        <TabButton
          isSelected={selectedType === "CLAIMING"}
          onClick={() => {
            setSelectedType("CLAIMING");
            getDataAllClaiming();
          }}
          icon={faListAlt}
          title="ລາຍການກຳລັງເຄລມ"
        />

        <TabButton
          isSelected={selectedType === "CLAIMED"}
          onClick={() => {
            setSelectedType("CLAIMED");
            getDataAllClaimed();
          }}
          icon={faTable}
          title="ລາຍການເຄລມເງິນ"
        />
      </div>

      {/* Loading indicator */}
      {isLoading && <Loading />}

      {/* Tab content */}
      {selectedType === "UNCLAIMED" && renderUnclaimedTab()}
      {selectedType === "CLAIMING" && renderClaimingTab()}
      {selectedType === "CLAIMED" && renderClaimedTab()}

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
