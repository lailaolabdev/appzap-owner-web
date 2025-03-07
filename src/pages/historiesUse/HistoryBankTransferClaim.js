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
import { END_POINT } from "../../constants";
import { getHeaders } from "../../services/auth";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import PopUpConfirms from "../../components/popup/PopUpConfirms";
import Loading from "../../components/Loading";
import { moneyCurrency } from "./../../helpers/index";
import { useStore } from "../../store";
import { useShiftStore } from "../../zustand/ShiftStore";

import Swal from "sweetalert2";

export default function HistoryBankTransferClaim({ data }) {
  const { t } = useTranslation();
  const [totalLogs, setTotalLogs] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openConfirmClainAndClose, setOpenConfirmClainAndClose] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selctedType, setSelectedType] = useState("PAYMENT");
  const [selctedPayment, setSelectedPayment] = useState([]);
  const [claimData, setClaimData] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 100;

  const { profile } = useStore();
  const { shiftCurrent } = useShiftStore();
  const pageAll = totalLogs > 0 ? Math.ceil(totalLogs / rowsPerPage) : 1;
  useEffect(() => {
    getClaimData();
  }, []);

  const getClaimData = async () => {
    try {
      //   console.log("IAMWORK");
      const { DATA } = await getLocalData();
      const _res = await axios.get(
        `${END_POINT_SERVER_JUSTCAN}/v5/claim-payments?storeId=${DATA?.storeId}`
      );
      // setTaxPercent(_res?.data?.taxPercent);
      console.log(_res?.data);
      setClaimData(_res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const selectPayment = (payment) => {
    let _selctedPayment = [...selctedPayment];
    let _index = _selctedPayment.findIndex((x) => x._id == payment._id);
    if (_index === -1) {
      // If not found, add the payment record
      _selctedPayment.push(payment);
    } else {
      // If found, remove the payment record
      _selctedPayment.splice(_index, 1);
    }
    setSelectedPayment(_selctedPayment);
  };

  const TotalAmountClaim = selctedPayment.reduce(
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

      let _billIds = _selctedPayment.map((x) => {
        return x["_id"];
      });

      const { DATA } = await getLocalData();
      const _res = await axios.post(
        END_POINT_SERVER_JUSTCAN + "/v5/claim-payment/create",
        {
          storeId: DATA?.storeId,
          billIds: _billIds,
        }
      );
      setIsLoading(false);
      successAdd(`ສ້າງເຄລມສຳເລັດ`);
      getClaimData();
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
      tableName: selctedPayment?.tableName,
      tableCode: selctedPayment?.code,
      fullnameStaffCheckOut:
        `${profile?.data?.firstname} ${profile?.data?.lastname}` ?? "-",
      staffCheckOutId: profile?.data?.id,
    };

    await axios
      .put(
        `${END_POINT}/v7/bill-checkout`,
        {
          id: selctedPayment?.billId,
          data: body,
        },
        {
          headers: await getHeaders(),
        }
      )
      .then(async (response) => {
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
    claimSelectedPayment();
    _checkBillOrdering();
  };

  console.log("selctedPayment", selctedPayment);

  return (
    <div>
      <Nav
        fill
        variant="tabs"
        defaultActiveKey="/checkBill"
        style={{
          fontWeight: "bold",
          backgroundColor: "#f8f8f8",
          border: "none",
          marginBottom: 5,
          overflowX: "scroll",
          display: "flex",
        }}
      >
        <Nav.Item>
          <Nav.Link
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setSelectedType("PAYMENT")}
          >
            <FontAwesomeIcon icon={faListAlt} />{" "}
            <div style={{ width: 8 }}></div> ລາຍການຊຳລະ
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setSelectedType("CLAIM")}
          >
            <FontAwesomeIcon icon={faTable} /> <div style={{ width: 8 }}></div>{" "}
            ລາຍການເຄລມເງິນ
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {isLoading && <Loading />}
      {selctedType == "PAYMENT" && (
        <div>
          <div style={{ height: 10 }}></div>
          <div>
            <div
              className={`flex ${
                selctedPayment.length > 0 ? "justify-between" : "justify-end"
              } flex-wrap gap-3`}
            >
              {selctedPayment.length > 0 && (
                <h3 className="text-[20px] font-bold text-color-app">
                  ຈຳນວນເງິນທີ່ທ່ານຕ້ອງການເຄລມທັງໝົດ :{" "}
                  {moneyCurrency(TotalAmountClaim)}
                </h3>
              )}
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
              {data?.map((item, index) => {
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
                      {item?.claimStatus === "UNCLAIMED" && (
                        <Button onClick={() => selectPayment(item)}>
                          {checkPaymentSelected(item) ? "ຍົກເລີກ" : "ເລືອກ"}
                        </Button>
                      )}
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
              })}
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
                {claimData?.map((item, index) => {
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
                })}
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
