import React, { useState, useEffect } from "react";
import { Modal, Form, Button, InputGroup, Spinner } from "react-bootstrap";
import styled from "styled-components";
import Select from "react-select";
import Box from "../../../components/Box";
import { moneyCurrency } from "../../../helpers";
import axios from "axios";
import { COLOR_APP, END_POINT } from "../../../constants";
import { getHeaders } from "../../../services/auth";
import Swal from "sweetalert2";
import { errorAdd } from "../../../helpers/sweetalert";
import { BiSolidPrinter, BiRotateRight } from "react-icons/bi";
import { useStore } from "../../../store";
import {
  END_POINT_SEVER,
  END_POINT_SEVER_TABLE_MENU,
  QUERY_CURRENCIES,
  getLocalData,
} from "../../../constants/api";
import NumberKeyboard from "../../../components/keyboard/NumberKeyboard";
import convertNumber from "../../../helpers/convertNumber";
import convertNumberReverse from "../../../helpers/convertNumberReverse";
import {
  getMembers,
  getMemberAllCount,
} from "../../../services/member.service";

import { BiTransfer } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { callCheckOutPrintBillOnly } from "../../../services/code";
import _ from "lodash";

export default function CheckOutPopup({
  onPrintDrawer,
  onPrintBill = () => {},
  open,
  onClose,
  onSubmit = () => {},
  dataBill,
  tableData,
  totalBillCheckOutPopup,
  setDataBill,
  taxPercent = 0,
  saveServiceChargeDetails,
  billDataLoading,
}) {
  const { t } = useTranslation();
  // ref
  // const inputCashRef = useRef(null);
  // const inputTransferRef = useRef(null);
  const staffConfirm = JSON.parse(localStorage.getItem("STAFFCONFIRM_DATA"));

  // state
  const [selectInput, setSelectInput] = useState("inputCash");
  const [selectDataOpption, setSelectDataOpption] = useState();
  const [cash, setCash] = useState();
  const [transfer, setTransfer] = useState();
  const [point, setPoint] = useState();
  const [tab, setTab] = useState("cash");
  const [forcus, setForcus] = useState("CASH");
  const [canCheckOut, setCanCheckOut] = useState(false);
  const [selectCurrency, setSelectCurrency] = useState("LAK");
  const [rateCurrency, setRateCurrency] = useState(1);
  const [cashCurrency, setCashCurrency] = useState();
  const [hasCRM, setHasCRM] = useState(false);
  const [printBillLoading, setPrintBillLoading] = useState(false);
  const [memberData, setMemberData] = useState();
  const [textSearchMember, setTextSearchMember] = useState("");
  const [currencyList, setCurrencyList] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [paid, setPaid] = useState(0);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");

  //select Bank

  useEffect(() => {
    const fetchAllBanks = async () => {
      try {
        const response = await axios.get(
          `${END_POINT_SEVER}/v3/banks?storeId=${storeDetail?._id}`
        );
        setBanks(response.data.data);
      } catch (error) {
        console.error("Error fetching all banks:", error);
      }
    };

    fetchAllBanks();
  }, [tab, selectedBank]);

  const handleChange = (e) => {
    const selectedOption = banks.find((bank) => bank._id === e.target.value);
    setSelectedBank({
      id: selectedOption._id,
      name: selectedOption.bankName,
    });
  };
  const handleChangeCurrencie = (e) => {
    if (e.target.value === "LAK") {
      setSelectCurrency({
        id: "LAK",
        name: "LAK",
      });
      return;
    }
    const selectedCurrencie = currencyList.find(
      (item) => item?._id === e?.target?.value
    );
    setSelectCurrency({
      id: selectedCurrencie._id,
      name: selectedCurrencie.currencyName,
    });
  };

  const {
    setSelectedTable,
    getTableDataStore,
    setOrderPayBefore,
    orderPayBefore,
    selectedTable,
    storeDetail,
    setStoreDetail,
    profile,
  } = useStore();

  // console.log({ dataBill });

  useEffect(() => {
    setMemberData();
    if (textSearchMember.length > 0) {
      handleSearchOne();
    }
  }, [textSearchMember]);

  useEffect(() => {
    getMembersData();
    setSelectCurrency({
      id: "LAK",
      name: "LAK",
    });
  }, []);

  const handleSearchOne = async () => {
    try {
      const url = `${END_POINT_SEVER_TABLE_MENU}/v4/member/search-one?phone=${textSearchMember}`;
      const _header = await getHeaders();
      const _res = await axios.get(url, { headers: _header });
      if (!_res.data) throw new Error("Empty!");
      setMemberData(_res.data);
      setDataBill((prev) => ({
        ...prev,
        memberId: _res.data?._id,
        memberPhone: _res.data?.phone,
        memberName: _res.data?.name,
        Name: _res.data?.name,
        Point: _res.data?.point,
      }));
    } catch (err) {
      console.log(err);
      errorAdd("ບໍ່ພົບສະມາຊິກ");
    }
  };

  const getMembersData = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      const _data = await getMemberAllCount(DATA?.storeId, TOKEN);
      if (_data.error) throw new Error("error");
      setMembersData(_data?.data);
    } catch (err) {}
  };

  useEffect(() => {
    if (orderPayBefore) {
      const paidData = _.sumBy(orderPayBefore, (e) => {
        const mainPrice = (e?.price || 0) * (e?.quantity || 1);

        const menuOptionPrice = _.sumBy(
          e?.options || [],
          (opt) => (opt?.price || 0) * (opt?.quantity || 1)
        );

        return mainPrice + menuOptionPrice;
      });
      setPaid(paidData);
    }
  }, [orderPayBefore]);

  const totalAmount =
    orderPayBefore && orderPayBefore.length > 0 ? paid : totalBillCheckOutPopup;

  const taxAmount = (totalAmount * taxPercent) / 100;
  const serviceAmount = (totalAmount * storeDetail?.serviceChargePer) / 100;
  const totalBill = totalAmount + taxAmount + serviceAmount;

  useEffect(() => {
    if (!open) return;
    let moneyReceived = "";
    let moneyChange = "";
    const discountedTotalBill =
      dataBill?.discountType === "LAK"
        ? totalBill - dataBill?.discount > 0
          ? totalBill - dataBill?.discount
          : 0
        : totalBill - (totalBill * dataBill?.discount) / 100 > 0
        ? totalBill - (totalBill * dataBill?.discount) / 100
        : 0;

    const cashAmount = Number.parseFloat(cash) || 0;
    const transferAmount = Number.parseFloat(transfer) || 0;
    const totalReceived = cashAmount + transferAmount;

    moneyReceived = `${
      selectCurrency?.name === "LAK"
        ? moneyCurrency(totalReceived)
        : moneyCurrency(Number.parseFloat(cashCurrency) || 0)
    } ${selectCurrency?.name}`;

    const changeAmount = totalReceived - discountedTotalBill;
    moneyChange = `${moneyCurrency(changeAmount > 0 ? changeAmount : 0)} ${
      storeDetail?.firstCurrency
    }`;

    setDataBill((prev) => ({
      ...prev,
      moneyReceived: moneyReceived,
      moneyChange: moneyChange,
      dataStaffConfirm: staffConfirm,
    }));
  }, [cash, transfer, selectCurrency?.name]);

  useEffect(() => {
    if (!open) return;
    if (selectCurrency?.name !== "LAK") {
      const _currencyData = currencyList.find(
        (e) => e.currencyCode === selectCurrency?.name
      );
      setRateCurrency(_currencyData?.sell || 1);
    } else {
      setCashCurrency();
      setCash();
      setRateCurrency(1);
    }
  }, [
    selectCurrency?.name,
    selectCurrency?.name,
    storeDetail?.serviceChargePer,
  ]);
  useEffect(() => {
    if (!open) return;
    const amount = cashCurrency * rateCurrency;
    if (cashCurrency && rateCurrency !== 1) {
      setCash(amount);
    } else {
      setCash();
    }
  }, [rateCurrency]);

  useEffect(() => {
    setDataBill((prev) => ({ ...prev, paymentMethod: forcus }));
  }, [forcus]);

  const getDataCurrency = async () => {
    try {
      const { DATA } = await getLocalData();
      if (DATA) {
        const data = await axios.get(
          `${QUERY_CURRENCIES}?storeId=${DATA?.storeId}`
        );
        if (data?.status === 200) {
          setCurrencyList(data?.data?.data);
        }
      }
    } catch (err) {
      console.log("err:", err);
    }
  };
  const _checkBill = async (currencyId, currencyName) => {
    const staffConfirm = JSON.parse(localStorage.getItem("STAFFCONFIRM_DATA"));

    const serviceChargePer = storeDetail?.serviceChargePer;
    const serviceChargeAmount = Math.floor(
      (totalBillCheckOutPopup * storeDetail?.serviceChargePer) / 100
    );

    const localZone = localStorage.getItem("selectedZone");

    const moneyChange = calculateReturnAmount();

    const orderItem =
      orderPayBefore && orderPayBefore.length > 0
        ? orderPayBefore?.map((e) => e?._id)
        : [];
    const checkStatus =
      orderPayBefore && orderPayBefore.length > 0 ? "false" : "true";
    const checkStatusBill =
      orderPayBefore && orderPayBefore.length > 0 ? "PAID" : "CHECKOUT";

    const body = {
      selectedBank: selectedBank.name,
      bankId: selectedBank.id,
      orderPayBefore: orderItem,
      isCheckout: checkStatus,
      status: checkStatusBill,
      payAmount: cash,
      transferAmount: transfer,
      point: point,
      paymentMethod: forcus,
      taxAmount: taxAmount,
      taxPercent: taxPercent,
      serviceChargePercent: serviceChargePer,
      serviceChargeAmount: serviceChargeAmount,
      customerId: selectDataOpption?._id,
      userNanme: selectDataOpption?.username,
      phone: selectDataOpption?.phone,
      memberId: memberData?._id,
      memberName: memberData?.name,
      memberPhone: memberData?.phone,
      billMode: tableData?.editBill,
      tableName: tableData?.tableName,
      change: moneyChange,
      tableCode: tableData?.code,
      fullnameStaffCheckOut:
        `${profile?.data?.firstname} ${profile?.data?.lastname}` ?? "-",
      staffCheckOutId: profile?.data?.id,
    };

    if (currencyId !== "LAK") {
      body.currencyId = currencyId;
      body.currency = cashCurrency;
      body.currencyName = currencyName;
    }

    await axios
      .put(
        `${END_POINT}/v3/bill-checkout`,
        {
          id: dataBill?._id,
          data: body,
        },
        {
          headers: await getHeaders(),
        }
      )
      .then(async (response) => {
        setSelectedTable();
        getTableDataStore();
        setCashCurrency();
        setTab("cash");
        setSelectCurrency({
          id: "LAK",
          name: "LAK",
        });
        setSelectInput("inputCash");
        setForcus("CASH");
        setRateCurrency(1);
        setHasCRM(false);
        setTextSearchMember("");
        setCash();
        setTransfer();
        setOrderPayBefore([]);
        // callCheckOutPrintBillOnly(selectedTable?._id);
        // setStoreDetail({ ...storeDetail, ChangeColorTable: true });
        localStorage.removeItem("STAFFCONFIRM_DATA");

        onClose();
        Swal.fire({
          icon: "success",
          title: `${t("checkbill_success")}`,
          showConfirmButton: false,
          timer: 1800,
        });

        setStoreDetail({
          ...storeDetail,
          serviceChargePer: 0,
          isServiceCharge: false,
          zoneCheckBill: true,
        });
      })
      .catch((error) => {
        errorAdd(`${t("checkbill_fial")}`);
      });
  };

  // console.log("SERVICE", storeDetail?.serviceChargePer);

  const handleSubmit = () => {
    saveServiceChargeDetails();
    _checkBill(selectCurrency?.id, selectCurrency?.name);
    // onSubmit();
    // console.log("valueConfirm:------>", valueConfirm)
  };
  // useEffect
  useEffect(() => {
    getDataCurrency();
  }, []);
  useEffect(() => {
    if (!open) return;
    if (forcus === "CASH") {
      if (dataBill?.discount) {
        if (dataBill?.discountType === "PERCENT") {
          if (cash >= totalBill - (totalBill * dataBill?.discount) / 100) {
            setCanCheckOut(true);
          } else {
            setCanCheckOut(false);
          }
        } else {
          if (cash >= totalBill - dataBill?.discount) {
            setCanCheckOut(true);
          } else {
            setCanCheckOut(false);
          }
        }
      } else {
        if (cash >= totalBill) {
          setCanCheckOut(true);
        } else {
          setCanCheckOut(false);
        }
      }
    } else if (forcus === "TRANSFER") {
      if (dataBill?.discount) {
        if (dataBill?.discountType === "PERCENT") {
          setTransfer(totalBill - (totalBill * dataBill?.discount) / 100);
        } else {
          setTransfer(totalBill - dataBill?.discount);
        }
      } else {
        setTransfer(totalBill);
      }
      setCanCheckOut(true);
    } else if (forcus === "TRANSFER_CASH") {
      const _sum =
        (Number.parseInt(cash) || 0) + (Number.parseInt(transfer) || 0);
      if (dataBill?.discount) {
        if (dataBill?.discountType === "PERCENT") {
          if (_sum >= totalBill - (totalBill * dataBill?.discount) / 100) {
            setCanCheckOut(true);
          } else {
            setCanCheckOut(false);
          }
        } else {
          if (_sum >= totalBill - dataBill?.discount) {
            setCanCheckOut(true);
          } else {
            setCanCheckOut(false);
          }
        }
      } else {
        if (_sum >= totalBill) {
          setCanCheckOut(true);
        } else {
          setCanCheckOut(false);
        }
      }
    } else if (forcus === "POINT") {
      if (point <= 0) {
        setCanCheckOut(false);
      } else {
        setCanCheckOut(true);
      }
    } else if (forcus === "CASH_TRANSFER_POINT") {
      const _sum =
        (Number.parseInt(cash) || 0) +
        (Number.parseInt(transfer) || 0 + Number.parseInt(point));
      if (dataBill?.discount) {
        if (dataBill?.discountType === "PERCENT") {
          if (_sum >= totalBill - (totalBill * dataBill?.discount) / 100) {
            setCanCheckOut(true);
          } else {
            setCanCheckOut(false);
          }
        } else {
          if (_sum >= totalBill - dataBill?.discount) {
            setCanCheckOut(true);
          } else {
            setCanCheckOut(false);
          }
        }
      }
    }
  }, [cash, transfer, totalBill, forcus, point]);

  const transferCal =
    dataBill?.discountType === "PERCENT"
      ? totalBill - dataBill?.discount > 0
        ? totalBill - dataBill?.discount
        : 0
      : totalBill - (totalBill * dataBill?.discount) / 100 > 0
      ? (totalBill * dataBill?.discount) / 100
      : 0;

  const totalBillMoney =
    dataBill && dataBill?.discountType === "LAK"
      ? Number.parseFloat(
          totalBill - dataBill?.discount > 0
            ? totalBill - dataBill?.discount
            : 0
        )
      : Number.parseFloat(
          totalBill - (totalBill * dataBill?.discount) / 100 > 0
            ? totalBill - (totalBill * dataBill?.discount) / 100
            : 0
        );
  const _selectDataOption = (option) => {
    setSelectDataOpption(option);
    setDataBill((prev) => ({
      ...prev,
      dataCustomer: option,
    }));
    // localStorage.setItem("DATA_CUSTOMER", JSON.stringify(option));
  };
  const onChangeCurrencyInput = (inputData) => {
    convertNumberReverse(inputData, (value) => {
      setCashCurrency(value);
      if (selectCurrency?.name !== "LAK") {
        if (!value) {
          setCash();
        } else {
          const amount = Number.parseFloat(value * rateCurrency);
          setCash(amount.toFixed(2));
        }
      }
    });
  };
  const onChangeCashInput = (inputData) => {
    convertNumberReverse(inputData, (value) => {
      setCash(value);
      if (selectCurrency?.name !== "LAK") {
        if (!value) {
          setCashCurrency();
        } else {
          const amount = value / rateCurrency;
          setCashCurrency(amount.toFixed(2));
        }
      }
    });
  };

  // cuaculate money change
  const calculateReturnAmount = () => {
    const parsedCash = parseInt(cash) || 0;
    const parsedTransfer = parseInt(transfer) || 0;

    const discountAmount =
      dataBill && dataBill?.discountType === "LAK"
        ? Math.max(totalBill - dataBill?.discount, 0)
        : Math.max(totalBill - (totalBill * dataBill?.discount) / 100, 0);

    const totalAmount = parsedCash + parsedTransfer - discountAmount;

    return totalAmount <= 0 ? 0 : totalAmount;
  };

  const onChangeTransferInput = (inputData) => {
    convertNumberReverse(inputData, (value) => {
      setTransfer(value);
    });
  };
  const onChangePointInput = (inputData) => {
    convertNumberReverse(inputData, (value) => {
      setPoint(value);
    });
  };

  const optionsData = membersData?.map((item) => {
    // console.log(item);
    return {
      value: item.phone,
      label: `${item.name} (${item.phone})`,
      phoneNumber: item.phone,
      point: item.point,
    };
  });

  const handleSearchInput = (option) => {
    setTextSearchMember(option.value);
  };

  return (
    <Modal
      show={open}
      onHide={() => {
        setCash();
        setTransfer();
        onClose();
      }}
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {t("check_out_table")} ({tableData?.tableName}) - {t("code")}{" "}
          {tableData?.code}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
          }}
        >
          {/* news---------------------------------------------------------------------------------------------------------------------- */}
          <div style={{ padding: 20 }}>
            <div
              style={{
                marginBottom: 10,
                fontSize: 22,
              }}
            >
              <span>{t("bill_total")}: </span>
              <span style={{ color: COLOR_APP, fontWeight: "bold" }}>
                {dataBill && dataBill?.discountType === "LAK"
                  ? moneyCurrency(
                      Math.floor(
                        totalBill - dataBill?.discount > 0
                          ? totalBill - dataBill?.discount
                          : 0
                      )
                    )
                  : moneyCurrency(
                      Math.floor(
                        totalBill - (totalBill * dataBill?.discount) / 100 > 0
                          ? totalBill - (totalBill * dataBill?.discount) / 100
                          : 0
                      )
                    )}{" "}
                {storeDetail?.firstCurrency}
              </span>
              <span
                hidden={
                  selectCurrency?.name === "LAK" && storeDetail?.firstCurrency
                }
              >
                {" "}
                <BiTransfer />{" "}
              </span>
              <span
                style={{ color: COLOR_APP, fontWeight: "bold" }}
                hidden={
                  selectCurrency?.name === "LAK" && storeDetail?.firstCurrency
                }
              >
                {moneyCurrency(
                  (dataBill && dataBill?.discountType === "LAK"
                    ? totalBill - dataBill?.discount > 0
                      ? totalBill - dataBill?.discount
                      : 0
                    : totalBill - (totalBill * dataBill?.discount) / 100 > 0
                    ? totalBill - (totalBill * dataBill?.discount) / 100
                    : 0) / rateCurrency
                )}{" "}
                {selectCurrency?.name}
              </span>
              <span
                style={{ fontSize: 14 }}
                hidden={
                  selectCurrency?.name === "LAK" && storeDetail?.firstCurrency
                }
              >
                {" "}
                ({t("exchange_rate")}: {convertNumber(rateCurrency)})
              </span>
            </div>

            {billDataLoading ? (
              <Spinner animation="border" />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <InputGroup
                  hidden={
                    selectCurrency?.name === "LAK" && storeDetail?.firstCurrency
                  }
                >
                  <InputGroup.Text>{selectCurrency?.name}</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="0"
                    value={convertNumber(cashCurrency)}
                    onClick={() => {
                      setSelectInput("inputCurrency");
                    }}
                    onChange={(e) => {
                      onChangeCurrencyInput(e.target.value);
                    }}
                    size="lg"
                  />
                  <InputGroup.Text>{selectCurrency?.name}</InputGroup.Text>
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>{t("cash")}</InputGroup.Text>
                  <Form.Control
                    disabled={
                      tab !== "cash" &&
                      tab !== "cash_transfer" &&
                      tab !== "cash_transfer_point"
                    }
                    type="text"
                    placeholder="0"
                    value={convertNumber(cash)}
                    onClick={() => {
                      setSelectInput("inputCash");
                    }}
                    onChange={(e) => {
                      onChangeCashInput(e.target.value);
                    }}
                    size="lg"
                  />
                  <InputGroup.Text>
                    {storeDetail?.firstCurrency}
                  </InputGroup.Text>
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>{t("transfer")}</InputGroup.Text>
                  <Form.Control
                    disabled={
                      tab !== "cash_transfer" && tab !== "cash_transfer_point"
                    }
                    type="text"
                    placeholder="0"
                    value={convertNumber(transfer)}
                    onClick={() => {
                      setSelectInput("inputTransfer");
                    }}
                    onChange={(e) => {
                      onChangeTransferInput(e.target.value);
                    }}
                    size="lg"
                  />
                  <InputGroup.Text>
                    {storeDetail?.firstCurrency}
                  </InputGroup.Text>
                </InputGroup>
                {tab === "point" || tab === "cash_transfer_point" ? (
                  <div hidden={hasCRM} style={{ marginBottom: 10 }}>
                    <BoxMember>
                      <div className="box-left">
                        <div className="box-search">
                          <Select
                            placeholder={<div>{t("enter_phone_and_name")}</div>}
                            options={optionsData}
                            onChange={handleSearchInput}
                          />
                        </div>
                        <Button
                          className="primary"
                          onClick={() => getMembersData()}
                        >
                          <BiRotateRight />
                        </Button>
                        <Button
                          className="primary"
                          onClick={() => {
                            // navigate("/add/newMembers", {
                            //   state: { key: "newMembers" },
                            // });
                            window.open("/add/newMembers");
                          }}
                        >
                          {t("add_new")}{" "}
                        </Button>
                      </div>
                      <div className="box-right">
                        <div className="box-name">
                          <InputGroup.Text>
                            {t("name")}: {dataBill?.Name ? dataBill?.Name : ""}
                          </InputGroup.Text>
                        </div>
                        <div className="box-name">
                          <InputGroup.Text>
                            {t("point")}:{" "}
                            {point
                              ? dataBill?.Point - point
                              : dataBill?.Point
                              ? dataBill?.Point
                              : "0"}
                          </InputGroup.Text>
                        </div>
                      </div>
                    </BoxMember>
                    <InputGroup style={{ marginTop: 10 }}>
                      <InputGroup.Text>{t("point")}</InputGroup.Text>
                      <Form.Control
                        disabled={
                          dataBill?.Point <= 0 ||
                          !dataBill?.Name ||
                          !dataBill?.Point
                        }
                        type="text"
                        placeholder="0"
                        value={convertNumber(point)}
                        onClick={() => {
                          setSelectInput("inputPoint");
                        }}
                        onChange={(e) => {
                          onChangePointInput(e.target.value);
                        }}
                        size="lg"
                      />
                    </InputGroup>
                  </div>
                ) : (
                  ""
                )}
                <div hidden={!hasCRM} style={{ marginBottom: 10 }}>
                  <BoxMember>
                    <div className="box-left">
                      <div className="box-search">
                        <Select
                          placeholder={<div>{t("enter_phone_and_name")}</div>}
                          options={optionsData}
                          onChange={handleSearchInput}
                        />
                      </div>
                      <Button
                        className="primary"
                        onClick={() => getMembersData()}
                      >
                        <BiRotateRight />
                      </Button>
                      <Button
                        className="primary"
                        onClick={() => {
                          // navigate("/add/newMembers", {
                          //   state: { key: "newMembers" },
                          // });
                          window.open("/add/newMembers");
                        }}
                      >
                        {t("add_new")}{" "}
                      </Button>
                    </div>
                    <div className="box-right">
                      <div className="box-name">
                        <InputGroup.Text>
                          {t("name")}: {dataBill?.Name ? dataBill?.Name : ""}
                        </InputGroup.Text>
                      </div>
                      <div className="box-name">
                        <InputGroup.Text>
                          {t("point")}:{" "}
                          {point
                            ? dataBill?.Point - point
                            : dataBill?.Point
                            ? dataBill?.Point
                            : "0"}
                        </InputGroup.Text>
                      </div>
                    </div>
                  </BoxMember>
                </div>
              </div>
            )}

            {/* <div
              style={{
                marginBottom: 10,
              }}
            >
              {t("return")}:{" "}
              {moneyCurrency(
                (Number.parseInt(cash) || 0) +
                  (Number.parseInt(transfer) || 0) -
                  (dataBill && dataBill?.discountType === "LAK"
                    ? totalBill - dataBill?.discount > 0
                      ? totalBill - dataBill?.discount
                      : 0
                    : totalBill - (totalBill * dataBill?.discount) / 100 > 0
                    ? totalBill - (totalBill * dataBill?.discount) / 100
                    : 0) <=
                  0
                  ? 0
                  : (Number.parseInt(cash) || 0) +
                      (Number.parseInt(transfer) || 0) -
                      (dataBill && dataBill?.discountType === "LAK"
                        ? totalBill - dataBill?.discount > 0
                          ? totalBill - dataBill?.discount
                          : 0
                        : totalBill - (totalBill * dataBill?.discount) / 100 > 0
                        ? totalBill - (totalBill * dataBill?.discount) / 100
                        : 0)
              )}{" "}
              {storeDetail?.firstCurrency}
            </div> */}
            <div style={{ marginBottom: 10 }}>
              {t("return")}: {moneyCurrency(calculateReturnAmount())}{" "}
              {storeDetail?.firstCurrency}
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 30,
              }}
            >
              {/* ເງິີນສົດ */}
              <Button
                variant={tab === "cash" ? "primary" : "outline-primary"}
                onClick={() => {
                  setCash();
                  setTransfer();
                  setTab("cash");
                  setSelectInput("inputCash");
                  setForcus("CASH");
                }}
              >
                {t("cash")}
              </Button>
              <Button
                variant={tab === "transfer" ? "primary" : "outline-primary"}
                onClick={() => {
                  setCash();
                  setSelectCurrency({
                    id: "LAK",
                    name: "LAK",
                  });
                  setRateCurrency(1);
                  setTransfer(transferCal);
                  setTab("transfer");
                  setForcus("TRANSFER");
                }}
              >
                {t("transfer")}
              </Button>
              <Button
                disabled={hasCRM}
                variant={tab === "point" ? "primary" : "outline-primary"}
                onClick={() => {
                  setCash();
                  setTransfer();
                  setPoint();
                  setTab("point");
                  setSelectInput("inputPoint");
                  setForcus("POINT");
                }}
              >
                {t("point")}
              </Button>
              <Button
                variant={
                  tab === "cash_transfer" ? "primary" : "outline-primary"
                }
                onClick={() => {
                  setCash();
                  setSelectCurrency({
                    id: "LAK",
                    name: "LAK",
                  });
                  setRateCurrency(1);
                  setTransfer();
                  setTab("cash_transfer");
                  setSelectInput("inputCash");
                  setForcus("TRANSFER_CASH");
                }}
              >
                {t("cash_transfer")}
              </Button>
              <Button
                disabled={hasCRM}
                variant={
                  tab === "cash_transfer_point" ? "primary" : "outline-primary"
                }
                onClick={() => {
                  setCash();
                  setTransfer();
                  setPoint();
                  setTab("cash_transfer_point");
                  setSelectInput("inputCash");
                  setForcus("CASH_TRANSFER_POINT");
                }}
              >
                {t("transfercashpoint")}
              </Button>
              <div style={{ flex: 1 }} />
              <Form.Control
                hidden={tab !== "cash"}
                as="select"
                style={{ width: 80 }}
                value={selectCurrency?.id}
                onChange={handleChangeCurrencie}
              >
                <option value="LAK">{storeDetail?.firstCurrency}</option>
                {currencyList?.map((e) => (
                  <option key={e?._id} value={e?._id}>
                    {e?.currencyCode}
                  </option>
                ))}
              </Form.Control>

              {(tab === "transfer" ||
                tab === "cash_transfer" ||
                tab === "cash_transfer_point") && (
                <Form.Control
                  as="select"
                  style={{ width: 140 }}
                  value={selectedBank?.id || ""}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    ເລືອກທະນາຄານ
                  </option>
                  {Array.isArray(banks) &&
                    banks.map((bank) => (
                      <option key={bank._id} value={bank._id}>
                        {bank.bankName}
                      </option>
                    ))}
                </Form.Control>
              )}
            </div>
            <NumberKeyboard
              onClickMember={() => {
                setHasCRM((prev) => !prev);
                // setTab("point");
              }}
              onClickButtonDrawer={onPrintDrawer}
              totalBill={totalBillMoney}
              payType={tab}
              selectInput={((e) => {
                if (selectInput === "inputCash") {
                  return cash;
                }
                if (selectInput === "inputTransfer") {
                  return transfer;
                }
                if (selectInput === "inputCurrency") {
                  return cashCurrency;
                }
              })()}
              setSelectInput={(e) => {
                if (selectInput === "inputCash") {
                  onChangeCashInput(e);
                } else if (selectInput === "inputTransfer") {
                  onChangeTransferInput(e);
                } else if (selectInput === "inputCurrency") {
                  onChangeCurrencyInput(e);
                }
              }}
            />
          </div>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <div style={{ flex: 1 }}>
          <p>
            {t("cashier")}:{" "}
            <b>
              {profile?.data?.firstname ?? "-"} {profile?.data?.lastname ?? "-"}
            </b>
          </p>
        </div>
        <Button
          onClick={() => {
            setPrintBillLoading(true);
            saveServiceChargeDetails();
            onPrintBill().then(() => {
              setPrintBillLoading(false);
              handleSubmit();
            });
          }}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
          disabled={!canCheckOut || printBillLoading}
        >
          {printBillLoading && (
            <Spinner animation="border" size="sm" style={{ marginRight: 8 }} />
          )}
          <BiSolidPrinter />
          {t("print_checkbill")}
        </Button>
        <div style={{ width: "20%" }} />
        <Button onClick={handleSubmit} disabled={!canCheckOut}>
          {t("calculate")}
        </Button>
        {/* <Button onClick={() => onSubmit()}>{t("debt")}</Button> */}
      </Modal.Footer>
    </Modal>
  );
}

const BoxMember = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;

  .box-left {
    display: flex;
    width: 100%;
    gap: 10px;

    .box-search {
      width: calc(100% - 35%);
    }
  }

  .box-right {
    display: flex;
    justify-content: flex-end;
    width: 50%;
    gap: 10px;
    .box-name {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    display: block;

    .box-left {
      display: flex;
      width: 100%;
      gap: 10px;
      margin-bottom: 10px;
      .box-search {
        width: calc(100% - 18%);
      }
    }

    .box-right {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      gap: 10px;
      .box-name {
        width: 100%;
      }
    }
  }
`;
