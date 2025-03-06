import {
  faListAlt,
  faPlusCircle,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Dropdown, Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaListCheck } from "react-icons/fa6";
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
import { FaMoneyCheckAlt } from "react-icons/fa";
import { FcEmptyTrash } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";
import Swal from "sweetalert2";

export default function HistoryBankTransferClaim() {
  const { t } = useTranslation();
  const [totalLogs, setTotalLogs] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmClainAndClose, setOpenConfirmClainAndClose] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selctedType, setSelectedType] = useState("PAYMENT");
  const [selctedPayment, setSelectedPayment] = useState([]);
  const [claimData, setClaimData] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 100;

  const { profile, setSelectedTable, getTableDataStore } = useStore();

  const { storeDetail } = useStoreStore();

  const { TotalAmountClaim, setTotalAmountClaim } = useClaimDataStore();
  const { shiftCurrent } = useShiftStore();
  const pageAll = totalLogs > 0 ? Math.ceil(totalLogs / rowsPerPage) : 1;
  useEffect(() => {
    getClaimData();
    getDataAllClaim();
  }, []);

  const getClaimData = async () => {
    try {
      //   console.log("IAMWORK");
      const { DATA } = await getLocalData();
      const _res = await axios.get(
        `${END_POINT_SERVER_JUSTCAN}/v5/claim-payments?storeId=${DATA?.storeId}`
      );
      setClaimData(_res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getDataAllClaim = async () => {
    try {
      //   console.log("IAMWORK");
      const { TOKEN, DATA } = await getLocalData();

      let apiUrl = `${END_POINT_SERVER_JUSTCAN}/v5/checkouts?storeId=${DATA?.storeId}&claimStatus=UNCLAIMED&paymentMethod=BANK_TRANSFER&status=PAID`;

      const _res = await axios.get(apiUrl, { header: TOKEN });
      setData(_res?.data?.data);
      setTotalAmountClaim(_res?.data?.totalAmount);
    } catch (err) {
      console.log(err);
    }
  };

  // const selectPayment = (payment) => {
  //   let _selctedPayment = [...selctedPayment];
  //   let _index = _selctedPayment.findIndex((x) => x._id == payment._id);
  //   if (_index === -1) {
  //     // If not found, add the payment record
  //     _selctedPayment.push(payment);
  //   } else {
  //     // If found, remove the payment record
  //     _selctedPayment.splice(_index, 1);
  //   }
  //   setSelectedPayment(_selctedPayment);
  // };

  const selectPayment = (payment) => {
    let _selctedPayment = [...selctedPayment]; // คัดลอกการชำระเงินที่เลือก
    const _index = _selctedPayment.findIndex((x) => x._id === payment._id); // ตรวจสอบว่ามีการเลือกการชำระเงินนี้หรือยัง

    if (_index === -1) {
      // ถ้ายังไม่ได้เลือก, เราจะเลือกทุกรายการที่มี tableName หรือ tableCode ตรงกับรายการที่เลือก
      _selctedPayment = [
        ..._selctedPayment,
        ...data.filter(
          (x) =>
            x.tableName === payment.tableName ||
            x.tableCode === payment.tableCode
        ),
      ];
    } else {
      // ถ้าเลือกแล้ว, ก็ให้ยกเลิกการเลือกทุกรายการที่มี tableName หรือ tableCode ตรงกัน
      _selctedPayment = _selctedPayment.filter(
        (x) =>
          x.tableName !== payment.tableName && x.tableCode !== payment.tableCode
      );
    }

    setSelectedPayment(_selctedPayment); // อัพเดตการเลือกการชำระเงิน
  };

  // console.log("selectPayment", selectPayment);

  const TotalAmountSlectedClaim = selctedPayment.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0
  );

  const checkPaymentSelected = (payment) => {
    let _index = selctedPayment.findIndex((x) => x._id == payment._id);
    return _index >= 0;
  };

  const claimSelectedPayment = async () => {
    setIsLoading(true);
    try {
      let _selctedPayment = [...selctedPayment];
      let _billIds = _selctedPayment.map((x) => x["_id"]); // สร้างลิสต์ ID ของการชำระเงินที่เลือก

      const { DATA } = await getLocalData();
      const _res = await axios.post(
        END_POINT_SERVER_JUSTCAN + "/v5/claim-payment/create",
        {
          storeId: DATA?.storeId,
          billIds: _billIds,
        }
      );

      const remainingPayments = _selctedPayment.filter(
        (payment) => !_billIds.includes(payment._id)
      );
      setSelectedPayment(remainingPayments);

      setIsLoading(false);
      successAdd(`ສ້າງເຄລມສຳເລັດ`);
      getClaimData();
      getDataAllClaim();
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      errorAdd(`ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃຫມ່`);
    }
  };

  const claimAllPayment = async () => {
    setOpenConfirm(false);
    setIsLoading(true);
    try {
      const { DATA } = await getLocalData();
      const _res = await axios.post(
        END_POINT_SERVER_JUSTCAN + "/v5/claim-payment/create-all",
        {
          storeId: DATA?.storeId,
        }
      );
      setIsLoading(false);
      successAdd(`ສ້າງເຄລມທັງຫມົດສຳເລັດ`);
      getClaimData();
      getDataAllClaim();
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      errorAdd(`ມີຂໍ້ຜິດພາດ ກະລຸນາລອງໃຫມ່`);
    }
  };

  const _checkBillOrdering = async () => {
    const body = {
      shiftId: shiftCurrent[0]?._id,
      isCheckout: "true",
      status: "CHECKOUT",
      paymentMethod: "APPZAP_TRANSFER",
      isOrderingPaid: false,
      billMode: "false",
      tableName: selctedPayment[0]?.tableName,
      tableCode: selctedPayment[0]?.code,
      fullnameStaffCheckOut:
        `${profile?.data?.firstname} ${profile?.data?.lastname}` ?? "-",
      staffCheckOutId: profile?.data?.id,
    };

    await axios
      .put(
        `${END_POINT}/v7/bill-checkout`,
        {
          id: selctedPayment[0]?.billId,
          data: body,
        },
        {
          headers: await getHeaders(),
        }
      )
      .then(async (response) => {
        setSelectedTable();
        getTableDataStore();
        Swal.fire({
          icon: "success",
          title: `${t("checkbill_success")}`,
          showConfirmButton: false,
          timer: 1800,
        });
      })
      .catch((error) => {
        errorAdd(`${t("checkbill_fial")}`);
      });
  };

  const handleConfirmCloseTable = async () => {
    setOpenConfirmClainAndClose(false);
    _checkBillOrdering();
    claimSelectedPayment();
  };

  return (
    <div className="p-2 bg-gray-50">
      <div
        className={`flex gap-2 justify-start items-center ${
          selctedType === "CLAIM" ? " mb-3" : "m-1"
        } `}
      >
        <Button
          onKeyDown={() => {}}
          className="menu-report-stocks"
          style={{
            background: selctedType === "PAYMENT" ? COLOR_APP : "white",
            color: selctedType === "PAYMENT" ? "white" : COLOR_APP,
          }}
          onClick={() => setSelectedType("PAYMENT")}
        >
          <span className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faListAlt} /> ລາຍການຊຳລະ
          </span>
        </Button>
        <Button
          onKeyDown={() => {}}
          className="menu-report-stocks mt-1"
          style={{
            background: selctedType === "CLAIM" ? COLOR_APP : "white",
            color: selctedType === "CLAIM" ? "white" : COLOR_APP,
            // width: width > 900 ? "100%" : "fit-content",
          }}
          onClick={() => setSelectedType("CLAIM")}
        >
          <span className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faTable} />
            ລາຍການເຄລມເງິນ
          </span>
        </Button>
      </div>
      {isLoading && <Loading />}
      {selctedType == "PAYMENT" && (
        <div>
          <div className="flex flex-row justify-center">
            <div className="max-w-lg mx-auto my-auto p-4 border-2 border-orange-500 bg-white rounded-lg shadow-xl w-[350px] h-[160px]">
              <div className="flex flex-row items-center gap-3">
                <span className="bg-orange-500 border border-orange-500 w-[80px] h-[80px] rounded-full relative">
                  <GiMoneyStack className="absolute top-4 right-4 text-[50px] text-white" />
                </span>{" "}
                <div className="flex flex-col justify-center items-center mt-2">
                  <h4 className=" text-lg text-gray-500 font-bold">
                    {t("total_money_claim")}
                  </h4>
                  <h2 className="text-3xl font-bold text-orange-600 text-center">
                    {moneyCurrency(
                      TotalAmountSlectedClaim
                        ? TotalAmountSlectedClaim
                        : TotalAmountClaim
                    )}{" "}
                    {storeDetail?.firstCurrency}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex ${
                selctedPayment.length > 0 ? "justify-end" : "justify-end"
              } flex-wrap gap-3`}
            >
              <div className="flex gap-2">
                {selctedPayment.length > 0 && (
                  <ButtonComponent
                    title={"ເຄລມຕາມເລືອກ"}
                    icon={faPlusCircle}
                    colorbg={"#f97316"}
                    // hoverbg={"orange"}
                    width={"150px"}
                    handleClick={() => claimSelectedPayment()}
                  />
                )}
                <ButtonComponent
                  title={"ເຄລມທັງຫມົດ"}
                  icon={faPlusCircle}
                  colorbg={"#f97316"}
                  // hoverbg={"orange"}
                  handleClick={() => setOpenConfirm(true)}
                  width={"150px"}
                  // handleClick={() => claimAllPayment()}
                />
              </div>
            </div>
          </div>
          <div style={{ height: 10 }}></div>
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
              {data?.length > 0 ? (
                data?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: checkPaymentSelected(item)
                          ? "#616161"
                          : "",
                      }}
                    >
                      <td
                        style={{
                          textWrap: "nowrap",
                          color: checkPaymentSelected(item) ? "white" : "",
                        }}
                      >
                        {page * rowsPerPage + index + 1}
                      </td>
                      <td
                        style={{
                          textWrap: "nowrap",
                          color: checkPaymentSelected(item) ? "white" : "",
                        }}
                      >
                        {item?.tableName ?? "-"}
                      </td>
                      <td
                        style={{
                          textWrap: "nowrap",
                          color: checkPaymentSelected(item) ? "white" : "",
                        }}
                      >
                        {item?.code ?? "-"}
                      </td>
                      <td
                        style={{
                          textWrap: "nowrap",
                          color: checkPaymentSelected(item) ? "white" : "",
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
                          color: checkPaymentSelected(item) ? "white" : "",
                        }}
                      >
                        {t("checkout") ?? "-"}
                      </td>
                      <td
                        style={{
                          textWrap: "nowrap",
                          color: checkPaymentSelected(item) ? "white" : "",
                        }}
                      >
                        {t(item.status) ?? "-"}
                      </td>
                      <td
                        style={{
                          textWrap: "nowrap",
                          color: checkPaymentSelected(item) ? "white" : "",
                        }}
                      >
                        {t(item.claimStatus) ?? "-"}
                      </td>
                      <td
                        style={{
                          textWrap: "nowrap",
                          color: checkPaymentSelected(item) ? "white" : "",
                        }}
                      >
                        {moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}
                      </td>
                      <td
                        className={`${
                          checkPaymentSelected(item) ? "text-white" : ""
                        } flex flex-row gap-2`}
                      >
                        {/* <Button onClick={() => selectPayment(item)}>
                        {checkPaymentSelected(item) ? "ຍົກເລີກ" : "ເລືອກ"}
                      </Button> */}
                        {item?.claimStatus === "UNCLAIMED" && (
                          <Button onClick={() => selectPayment(item)}>
                            {checkPaymentSelected(item) ? "ຍົກເລີກ" : "ເລືອກ"}
                          </Button>
                        )}

                        {/* <Button onClick={() => setOpenConfirmClainAndClose(true)}>
                        {t("confirm_close_table")}
                      </Button> */}

                        {item?.claimStatus === "UNCLAIMED" &&
                        checkPaymentSelected(item) ? (
                          <Button
                            onClick={() => setOpenConfirmClainAndClose(true)}
                          >
                            {t("confirm_close_table")}
                          </Button>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="flex flex-col items-center mt-4">
                      <p className="text-orange-500 text-[18px] font-bold">
                        ບໍ່ມີຂໍ້ມູນ
                      </p>
                      <FcEmptyTrash className="text-orange-500 text-[60px] animate-bounce" />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selctedType == "CLAIM" && (
        <div>
          <div style={{}}>
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("no")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    ລະຫັດເຄລມ
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    ຈຳນວນບິນ
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("amount")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("status")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("date_time")}
                  </th>
                  {/* <th style={{ textWrap: "nowrap" }} scope="col">
                                ຈັດການ
                            </th> */}
                </tr>
              </thead>

              <tbody>
                {claimData?.length > 0 ? (
                  claimData?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        style={{
                          backgroundColor: checkPaymentSelected(item)
                            ? "#616161"
                            : "",
                        }}
                      >
                        <td
                          style={{
                            textWrap: "nowrap",
                            color: checkPaymentSelected(item) ? "white" : "",
                          }}
                        >
                          {page * rowsPerPage + index + 1}
                        </td>
                        <td
                          style={{
                            textWrap: "nowrap",
                            color: checkPaymentSelected(item) ? "white" : "",
                          }}
                        >
                          {item?.code ?? "-"}
                        </td>
                        <td
                          style={{
                            textWrap: "nowrap",
                            color: checkPaymentSelected(item) ? "white" : "",
                          }}
                        >
                          {item.billIds.length}
                        </td>
                        <td
                          style={{
                            textWrap: "nowrap",
                            color: checkPaymentSelected(item) ? "white" : "",
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
                            color: checkPaymentSelected(item) ? "white" : "",
                          }}
                        >
                          {t(item.status) ?? "-"}
                        </td>
                        <td
                          style={{
                            textWrap: "nowrap",
                            color: checkPaymentSelected(item) ? "white" : "",
                          }}
                        >
                          {moment(item?.createdAt).format("DD/MM/YYYY HH:mm a")}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <div className="flex flex-col items-center mt-4">
                        <p className="text-orange-500 text-[18px] font-bold">
                          ບໍ່ມີຂໍ້ມູນ
                        </p>
                        <FcEmptyTrash className="text-orange-500 text-[60px] animate-bounce" />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <PopUpConfirms
        open={openConfirm}
        text={"ເຄລມທັງໝົດ"}
        textBefore={"ທ່ານຕ້ອງການ"}
        textAfter={"ແທ້ບໍ່"}
        onClose={() => setOpenConfirm(false)}
        onSubmit={async () => claimAllPayment()}
      />
      <PopUpConfirms
        open={openConfirmClainAndClose}
        text={"ເຄລມແລະປິດໂຕະ"}
        textBefore={"ທ່ານຕ້ອງການ"}
        textAfter={"ເລີຍບໍ່ ?"}
        onClose={() => setOpenConfirmClainAndClose(false)}
        onSubmit={async () => handleConfirmCloseTable()}
      />
    </div>
  );
}
