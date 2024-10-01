import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import Select from "react-select";
import Box from "../../../components/Box";
import { moneyCurrency } from "../../../helpers";
import axios from "axios";
import { COLOR_APP, END_POINT } from "../../../constants";
import { getHeaders } from "../../../services/auth";
import Swal from "sweetalert2";
import { errorAdd, successAdd } from "../../../helpers/sweetalert";
import { BiSolidPrinter } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

import _ from "lodash";

import { useStore } from "../../../store";
import {
  END_POINT_SEVER,
  QUERY_CURRENCIES,
  getLocalData,
} from "../../../constants/api";

import { createBilldebt, getMenuDebt } from "../../../services/debt";

import { Spinner } from "react-bootstrap";
import { MdRefresh } from "react-icons/md";

import NumberKeyboard from "../../../components/keyboard/NumberKeyboard";
import convertNumber from "../../../helpers/convertNumber";
import convertNumberReverse from "../../../helpers/convertNumberReverse";
import {
  getMembers,
  getMemberAllCount,
} from "../../../services/member.service";
import moment from "moment";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import { BiTransfer } from "react-icons/bi";
import { useTranslation } from "react-i18next";

export default function CheckPopupDebt({
  onPrintDrawer,
  onPrintBill,
  open,
  onClose,
  // onSubmit,
  dataBill,
  tableData,
  setDataBill,
  taxPercent = 0,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // ref
  const inputCashRef = useRef(null);
  const inputTransferRef = useRef(null);
  const { storeDetail, profile } = useStore();
  const staffConfirm = JSON.parse(localStorage.getItem("STAFFCONFIRM_DATA"));

  // state
  const [menuDebtData, setMenuDebtData] = useState();
  const [debtAmount, setDebtAmount] = useState();
  const [billId, setBillId] = useState();
  const [amount, setAmount] = useState();
  const [debt_paymentbefore, setDebt_paymentbefore] = useState();
  const [debt_notpay, setDebt_notpay] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [selectInput, setSelectInput] = useState("inputCash");
  const [selectDataOpption, setSelectDataOpption] = useState();
  const [cash, setCash] = useState();
  const [transfer, setTransfer] = useState();
  const [tab, setTab] = useState("cash");
  const [forcus, setForcus] = useState("CASH");
  const [canCheckOut, setCanCheckOut] = useState(false);
  const [total, setTotal] = useState();
  const [selectCurrency, setSelectCurrency] = useState("LAK");
  const [rateCurrency, setRateCurrency] = useState(1);
  const [cashCurrency, setCashCurrency] = useState();
  const [hasCRM, setHasCRM] = useState(false);
  const [memberData, setMemberData] = useState();
  const [textSearchMember, setTextSearchMember] = useState("");

  const [currencyList, setCurrencyList] = useState([]);
  const [membersData, setMembersData] = useState([]);

  const [printCode, setPrintCode] = useState();
  const { setSelectedTable, getTableDataStore } = useStore();
  const [customerName, setCustomerName] = useState();
  const [customerPhone, setCustomerPhone] = useState();
  const [startDate, setStartDate] = useState(
    moment(moment()).format("YYYY-MM-DD")
  );
  const [expirtDate, setExpirtDate] = useState(
    moment(moment()).add(7, "days").format("YYYY-MM-DD")
  );

  // useEffect(() => {
  //   setMemberData();
  //   if (textSearchMember.length > 0) {
  //     handleSearchOne();
  //   }
  // }, [textSearchMember]);

  useEffect(() => {
    getMembersData();
  }, []);

  useEffect(() => {
    getData();
  }, [billId]);

  // function
  const getData = async () => {
    try {
      const { DATA, TOKEN } = await getLocalData();
      let findby = "?";
      findby += `storeId=${storeDetail?._id}&`;
      findby += `billDebtId=${billId}`;
      const data = await getMenuDebt(findby, TOKEN);
      setMenuDebtData(data);
    } catch (err) {
      console.log("err", err);
    }
  };

  // const handleSearchOne = async () => {
  //   try {
  //     let url =
  //       END_POINT_SEVER + "/v4/member/search-one?phone=" + textSearchMember;
  //     const _header = await getHeaders();
  //     const _res = await axios.get(url, { headers: _header });
  //     if (!_res.data) throw new Error("Empty!");
  //     setMemberData(_res.data);
  //     setDataBill((prev) => ({
  //       ...prev,
  //       memberId: _res.data?._id,
  //       memberName: _res.data?.name,
  //       memberPhone: _res.data?.phone,
  //       status: "DEBT",
  //       startDate: startDate,
  //       endDate: expirtDate,
  //     }));
  //   } catch (err) {
  //     console.log(err);
  //     errorAdd("ບໍ່ພົບສະມາຊິກ");
  //   }
  // };

  // button_create_debt
  const handleClickCreateDebt = async () => {
    try {
      const { DATA, TOKEN } = await getLocalData();
      const _body = {
        amount: totalBill,
        customerName: customerName,
        customerPhone: customerPhone,
        billId: tableData._id,
        status: "DEBT",
        startDate: startDate,
        endDate: expirtDate,
        storeId: DATA?.storeId,
      };

      console.log(_body);
      // return;

      const data = await createBilldebt(_body, TOKEN);
      if (data.error) {
        errorAdd(`${t("debt_fail")}`);
        return;
      }
      setPrintCode(data.code);
      // await onPrintBillFark();
      navigate("/debt");
      successAdd(`${t("debt_success")}`);
    } catch (err) {
      console.log(err);
    }
  };

  const getMembersData = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      let findby = "";
      findby += `${DATA?.storeId}&`;
      const _data = await getMemberAllCount(findby, TOKEN);
      console.log("data api", _data);
      if (_data.error) throw new Error("error");
      setMembersData(_data?.data?.data);
      console.log(_data);
    } catch (err) {
      console.error("Error fetching members data", err);
    }
  };

  // console.log("tableData:=======abc======>", tableData)

  // console.log("membersData", membersData);

  const totalBillDefualt = _.sumBy(
    dataBill?.orderId?.filter((e) => e?.status === "SERVED"),
    (e) => (e?.price + (e?.totalOptionPrice ?? 0)) * e?.quantity
  );
  const taxAmount = (totalBillDefualt * taxPercent) / 100;
  const totalBill = totalBillDefualt + taxAmount;

  //ທອນ
  useEffect(() => {
    if (!open) return;
    let moneyReceived = "";
    let remainingAmount = "";
    const discountedTotalBill =
      dataBill?.discountType === "LAK"
        ? Math.max(totalBill - dataBill?.discount, 0)
        : Math.max(totalBill - (totalBill * dataBill?.discount) / 100, 0);

    const cashAmount = parseFloat(cash) || 0;
    const transferAmount = parseFloat(transfer) || 0;
    const totalReceived = cashAmount + transferAmount;

    moneyReceived = `${
      selectCurrency == "LAK"
        ? moneyCurrency(totalReceived)
        : moneyCurrency(parseFloat(cashCurrency) || 0)
    } ${selectCurrency}`;

    const remainingAmountValue = discountedTotalBill - totalReceived;
    remainingAmount = `${moneyCurrency(
      remainingAmountValue > 0 ? remainingAmountValue : 0
    )} ${storeDetail?.firstCurrency}`;

    setDataBill((prev) => ({
      ...prev,
      moneyReceived: moneyReceived,
      remainingAmount: remainingAmount,
      dataStaffConfirm: staffConfirm,
    }));
  }, [cash, transfer, selectCurrency]);

  useEffect(() => {
    if (!open) return;
    if (selectCurrency != "LAK") {
      const _currencyData = currencyList.find(
        (e) => e.currencyCode == selectCurrency
      );
      setRateCurrency(_currencyData?.buy || 1);
    } else {
      setCashCurrency();
      setCash();
      setRateCurrency(1);
    }
  }, [selectCurrency, selectCurrency]);
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

  useEffect(() => {
    if (!open) return;
    for (let i = 0; i < dataBill?.orderId?.length; i++) {
      _calculateTotal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataBill]);
  // function
  const getDataCurrency = async () => {
    try {
      const { DATA } = await getLocalData();
      if (DATA) {
        const data = await axios.get(
          `${QUERY_CURRENCIES}?storeId=${DATA?.storeId}`
        );
        if (data?.status == 200) {
          setCurrencyList(data?.data?.data);
        }
      }
    } catch (err) {
      console.log("err:", err);
    }
  };
  const _checkBill = async () => {
    let staffConfirm = JSON.parse(localStorage.getItem("STAFFCONFIRM_DATA"));
    await axios
      .put(
        END_POINT + `/v3/bill-checkout`,
        {
          id: dataBill?._id,
          data: {
            isCheckout: "true",
            status: "CHECKOUT",
            payAmount: cash,
            transferAmount: transfer,
            paymentMethod: forcus,
            taxAmount: taxAmount,
            taxPercent: taxPercent,
            customerId: selectDataOpption?._id,
            userNanme: selectDataOpption?.username,
            phone: selectDataOpption?.phone,
            memberId: memberData?._id,
            memberName: memberData?.name,
            memberPhone: memberData?.phone,
            billMode: tableData?.editBill,
            tableName: tableData?.tableName,
            tableCode: tableData?.code,
            fullnameStaffCheckOut:
              staffConfirm?.firstname + " " + staffConfirm?.lastname ?? "-",
            staffCheckOutId: staffConfirm?.id,
          },
        },
        {
          headers: await getHeaders(),
        }
      )
      .then(async function (response) {
        setSelectedTable();
        getTableDataStore();
        setCashCurrency();
        setTab("cash");
        setSelectCurrency("LAK");
        setSelectInput("inputCash");
        setForcus("CASH");
        setRateCurrency(1);
        setHasCRM(false);
        setTextSearchMember("");
        setCash();
        setTransfer();
        localStorage.removeItem("STAFFCONFIRM_DATA");

        onClose();
        Swal.fire({
          icon: "success",
          title: `${t("checkbill_success")}`,
          showConfirmButton: false,
          timer: 1800,
        });
      })
      .catch(function (error) {
        errorAdd(`${t("checkbill_fial")}`);
      });
  };
  // console.log("transfer", transfer);
  // const handleSubmit = () => {
  //   _checkBill();
  //   // onSubmit();
  //   // console.log("valueConfirm:------>", valueConfirm)
  // };

  // const options = membersData?.map((data) => {
  //   return {
  //     id: data?._id,
  //     value: data?.name,
  //     label: data?.phone,
  //     tel: data?.phone,
  //   };
  // });

  const _calculateTotal = () => {
    let _total = 0;
    for (let i = 0; i < dataBill?.orderId.length; i++) {
      if (dataBill?.orderId[i]?.status === "SERVED") {
        _total += dataBill?.orderId[i]?.quantity * dataBill?.orderId[i]?.price;
      }
    }
    setTotal(_total);
  };

  // useEffect
  useEffect(() => {
    getDataCurrency();
  }, []);
  useEffect(() => {
    if (!open) return;
    if (forcus == "CASH") {
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
    } else if (forcus == "TRANSFER") {
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
    } else if (forcus == "TRANSFER_CASH") {
      const _sum = (parseInt(cash) || 0) + (parseInt(transfer) || 0);
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
    }
  }, [cash, transfer, totalBill, forcus]);

  let transferCal =
    dataBill?.discountType === "PERCENT"
      ? totalBill - dataBill?.discount > 0
        ? totalBill - dataBill?.discount
        : 0
      : totalBill - (totalBill * dataBill?.discount) / 100 > 0
      ? (totalBill * dataBill?.discount) / 100
      : 0;

  let totalBillMoney =
    dataBill && dataBill?.discountType === "LAK"
      ? parseFloat(
          totalBill - dataBill?.discount > 0
            ? totalBill - dataBill?.discount
            : 0
        )
      : parseFloat(
          totalBill - (totalBill * dataBill?.discount) / 100 > 0
            ? totalBill - (totalBill * dataBill?.discount) / 100
            : 0
        );

  let _selectDataOption = (option) => {
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
      if (selectCurrency != "LAK") {
        if (!value) {
          setCash();
        } else {
          const amount = parseFloat(value * rateCurrency);
          setCash(amount.toFixed(2));
        }
      }
    });
  };

  const onChangeCashInput = (inputData) => {
    console.log({ inputData });
    convertNumberReverse(inputData, (value) => {
      setCash(value);
      if (selectCurrency != "LAK") {
        if (!value) {
          setCashCurrency();
        } else {
          const amount = value / rateCurrency;
          setCashCurrency(amount.toFixed(2));
        }
      }
    });
  };

  console.log(cash - transfer);

  const onChangeTransferInput = (inputData) => {
    console.log({ inputData });
    convertNumberReverse(inputData, (value) => {
      setTransfer(value);
    });
  };

  // const optionsData = membersData.map((item) => {
  //   // console.log(item);
  //   return {
  //     value: item.phone,
  //     label: `${item.name} `, //(${item.phone})
  //     phoneNumber: item.phone,
  //   };
  // });

  const optionsData = Array.isArray(membersData)
    ? membersData.map((item) => {
        return {
          value: item.phone,
          label: `${item.name} `, //(${item.phone})
          phoneNumber: item.phone,
        };
      })
    : [];

  // console.log("optionsData", optionsData);

  // const handleSearchInput = (option) => {
  //   setTextSearchMember(option.value);
  // };

  // console.log("textSearchMember", textSearchMember);

  //Head of title
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
          {t("debt_customer")} ({tableData?.tableName}) - {t("code")}{" "}
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
              <span>{t("debtAmount")}: </span>
              <span
                style={{ color: COLOR_APP, fontWeight: "bold" }}
                value={debtAmount}
                onChange={(e) => setDebtAmount(e?.target.value)}
              >
                {dataBill && dataBill?.discountType === "LAK"
                  ? moneyCurrency(
                      totalBill - dataBill?.discount > 0
                        ? totalBill - dataBill?.discount
                        : 0
                    )
                  : moneyCurrency(
                      totalBill - (totalBill * dataBill?.discount) / 100 > 0
                        ? totalBill - (totalBill * dataBill?.discount) / 100
                        : 0
                    )}{" "}
                {storeDetail?.firstCurrency}
              </span>
              <span hidden={selectCurrency === "LAK"}>
                {" "}
                <BiTransfer />{" "}
              </span>
              <span
                style={{ color: COLOR_APP, fontWeight: "bold" }}
                hidden={selectCurrency === "LAK"}
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
                {selectCurrency}
              </span>
              <span style={{ fontSize: 14 }} hidden={selectCurrency === "LAK"}>
                {" "}
                ({t("exchange_rate")}: {convertNumber(rateCurrency)})
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 10,
              }}
            >
              {/* Input lakha */}
              <InputGroup hidden={selectCurrency == "LAK"}>
                <InputGroup.Text>{selectCurrency}</InputGroup.Text>
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
                <InputGroup.Text>{selectCurrency}</InputGroup.Text>
              </InputGroup>

              <InputGroup>
                <InputGroup.Text>{t("debt_paymentbefore")}</InputGroup.Text>
                <Form.Control
                  disabled={tab !== "cash_transfer"}
                  type="text"
                  //
                  // placeholder={t("money_amount")}
                  // value={amount}
                  // onChange={(e) => setAmount(e?.target.value)}
                  //
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
                <InputGroup.Text>{storeDetail?.firstCurrency}</InputGroup.Text>
              </InputGroup>

              <InputGroup>
                <InputGroup.Text>{t("debt_notpay")}</InputGroup.Text>
                <Form.Control
                  disabled={tab !== "cash_transfer"}
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
                <InputGroup.Text>{storeDetail?.firstCurrency}</InputGroup.Text>
              </InputGroup>
              {/* <InputGroup hidden={!hasCRM}>
                <InputGroup.Text>{t("member")}</InputGroup.Text>
                <InputGroup.Text>+856 20</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="xxxx xxxx"
                  maxLength={8}
                  value={textSearchMember}
                  // onClick={() => {
                  //   setSelectInput("inputTransfer");
                  // }}
                  onChange={(e) => {
                    setTextSearchMember(e.target.value);
                  }}
                  size="lg"
                />
                <Button>
                  <FaSearch />
                </Button>
                <div style={{ width: 30 }} />
                <InputGroup.Text>
                  {t("name")}: {memberData?.name}
                </InputGroup.Text>
                <InputGroup.Text>
                  {t("point")}: {memberData?.point}
                </InputGroup.Text>
              </InputGroup> */}
              <Form.Label>
                {t("customer_name")} <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <BoxInput>
                <div className="debt-input">
                  <Select
                    options={optionsData}
                    placeholder={t("XXXX")}
                    onChange={(e) => {
                      setCustomerPhone(e.tel);
                      setCustomerName(e.value);
                    }}
                  />
                </div>
                <div className="debt-btn-group">
                  <button
                    className="btn btn-primary"
                    onClick={() => getMembersData()}
                  >
                    {/* {isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : ( */}
                    <MdRefresh />
                    {/* )} */}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={
                      () => window.open("/create/members", "_blank").focus()
                      // navigate("/reports/members-report/create-member", "_blank", {
                      //   state: { key: "create-debt" },
                      // })
                    }
                  >
                    ເພີ່ມໃໝ່
                  </button>
                </div>
              </BoxInput>

              <Form.Label>
                {t("ctm_tel")}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                placeholder={t("20 XXXX-XXXX")}
                value={customerName}
                onChange={(e) => setCustomerPhone(e?.target.value)}
              />
              <Form.Label></Form.Label>

              <Form.Label>{t("start_date_debt")}</Form.Label>
              <Form.Control
                placeholder={t("exp_date")}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e?.target.value)}
              />
              <Form.Label>{t("end_date_debt")}</Form.Label>
              <Form.Control
                placeholder={t("exp_date")}
                type="date"
                value={expirtDate}
                onChange={(e) => setExpirtDate(e?.target.value)}
              />
            </div>

            <div
              style={{
                marginBottom: 10,
              }}
            >
              {t("return")}:{" "}
              {moneyCurrency(
                (parseInt(cash) || 0) +
                  (parseInt(transfer) || 0) -
                  (dataBill && dataBill?.discountType === "LAK"
                    ? totalBill - dataBill?.discount > 0
                      ? totalBill - dataBill?.discount
                      : 0
                    : totalBill - (totalBill * dataBill?.discount) / 100 > 0
                    ? totalBill - (totalBill * dataBill?.discount) / 100
                    : 0) <=
                  0
                  ? 0
                  : (parseInt(cash) || 0) +
                      (parseInt(transfer) || 0) -
                      (dataBill && dataBill?.discountType === "LAK"
                        ? totalBill - dataBill?.discount > 0
                          ? totalBill - dataBill?.discount
                          : 0
                        : totalBill - (totalBill * dataBill?.discount) / 100 > 0
                        ? totalBill - (totalBill * dataBill?.discount) / 100
                        : 0)
              )}{" "}
              {storeDetail?.firstCurrency}
            </div>

            {/* Button click Money */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 30,
              }}
            >
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
                {t("debt_total")}
              </Button>
              {/* <Button
                variant={tab === "transfer" ? "primary" : "outline-primary"}
                onClick={() => {
                  setCash();
                  setSelectCurrency("LAK");
                  setRateCurrency(1);
                  setTransfer(transferCal);
                  setTab("transfer");
                  setForcus("TRANSFER");
                }}
              >
                {t("transfer")}
              </Button> */}

              {/* ຈ່າຍ + ຕິດ */}
              <Button
                variant={
                  tab === "cash_transfer" ? "primary" : "outline-primary"
                }
                onClick={() => {
                  setCash();
                  setSelectCurrency("LAK");
                  setRateCurrency(1);
                  setTransfer();
                  setTab("cash_transfer");
                  setSelectInput("inputCash");
                  setForcus("TRANSFER_CASH");
                }}
              >
                {t("debt_and_pay")}
              </Button>
              <div style={{ flex: 1 }} />
              <Form.Control
                hidden={tab !== "cash"}
                as="select"
                style={{ width: 80 }}
                value={selectCurrency}
                onChange={(e) => {
                  setSelectCurrency(e?.target?.value);
                }}
              >
                <option value="LAK">{storeDetail?.firstCurrency}</option>
                {currencyList?.map((e) => (
                  <option value={e?.currencyCode}>{e?.currencyCode}</option>
                ))}
              </Form.Control>
            </div>
            <NumberKeyboard
              onClickMember={() => {
                setHasCRM((prev) => !prev);
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
            {/* <KeyboardComponents
              onClickEvent={(e) => {
                setCash((prev) => {
                  let _number = prev ? `${prev}` + e : e;
                  return parseInt(_number);
                });
                console.log(parseInt(cash ? cash + e : e));
              }}
              onDelete={() =>
                setCash((prev) => {
                  let _prev = prev + "";
                  let _number =
                    _prev?.length > 0
                      ? _prev.substring(0, _prev.length - 1)
                      : "";
                  return parseInt(_number);
                })
              }
            /> */}
          </div>
        </Box>
      </Modal.Body>
      {/* suan thaiy */}
      <Modal.Footer>
        <div style={{ flex: 1 }}>
          <p>
            {t("cashier")}:{" "}
            <b>
              {profile?.data?.firstname ?? "-"} {profile?.data?.lastname ?? "-"}
            </b>
          </p>
        </div>
        {/* <Button
          onClick={() => {
            onPrintBill().then(() => {
              handleSubmit();
            });
          }}
          disabled={!canCheckOut}
        >
          <BiSolidPrinter />
          {t("debt_create")}
        </Button> */}
        <div style={{ width: "20%" }}></div>
        <Button onClick={handleClickCreateDebt}>{t("debt_create")}</Button>
      </Modal.Footer>
    </Modal>
  );
}

const BoxInput = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  gap: 5px;

  .debt-input {
    width: calc(100% - 23%);
  }
  .debt-btn-group {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    .debt-input {
      width: calc(100% - 40%);
    }
  }
`;
