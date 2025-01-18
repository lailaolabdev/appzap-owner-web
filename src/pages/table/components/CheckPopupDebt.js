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

import _ from "lodash";

import { useStore } from "../../../store";
import { QUERY_CURRENCIES, getLocalData } from "../../../constants/api";

import { createBilldebt, getMenuDebt } from "../../../services/debt";
import { MdRefresh } from "react-icons/md";

import NumberKeyboard from "../../../components/keyboard/NumberKeyboard";
import convertNumber from "../../../helpers/convertNumber";
import convertNumberReverse from "../../../helpers/convertNumberReverse";

import moment from "moment";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import { BiTransfer } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { getMembersAll } from "./../../../services/member.service";

import { useStoreStore } from "../../../zustand/storeStore";

export default function CheckPopupDebt({
  onPrintDrawer,
  onPrintBill,
  open,
  onClose,
  onSubmit = () => { },
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
  const { profile } = useStore();
  const { storeDetail } = useStoreStore()
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
  const [transfer, setTransfer] = useState(0);
  const [amountBefore, setAmountBefore] = useState(0); //update
  const [remainingAmount, setRemainingAmount] = useState(); //update
  const [remainingShow, setRemainingShow] = useState(); //ipdate
  const [tab, setTab] = useState("cash");
  const [forcus, setForcus] = useState("IS_DEBT");
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
  const [debtTotal , setDebtTotal] = useState(true)
  const [debtAndPay , setDebtAndPay] = useState(false)


  //console.log("profile: ",profile)
  // useEffect(() => {
  //   setMemberData();
  //   if (textSearchMember.length > 0) {
  //     handleSearchOne();
  //   }
  // }, [textSearchMember]);

  useEffect(() => {
    getMembersData();
  }, []);


  // useEffect(() => {
  //   getData();
  // }, [billId]);

  // function
  // const getData = async () => {
  //   try {
  //     const { DATA, TOKEN } = await getLocalData();
  //     let findby = "?";
  //     findby += `storeId=${storeDetail?._id}&`;
  //     findby += `billDebtId=${billId}`;
  //     const data = await getMenuDebt(findby, TOKEN);
  //     setMenuDebtData(data);
  //   } catch (err) {
  //     console.log("err", err);
  //   }
  // };

  // const handleSearchOne = async () => {
  //   try {
  //    const url =
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
  

  const getMembersData = async () => {
    setIsLoading(true);
    try {
      const { TOKEN, DATA } = await getLocalData();
      let findby = "?";
      findby += `storeId=${DATA?.storeId}&`;
      // findby += `skip=${(pagination - 1) * limitData}&`;
      // findby += `limit=${limitData}&`;
      const _data = await getMembersAll(findby, TOKEN);
      if (_data.error) throw new Error("error");
      setMembersData(_data.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("err", err);
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
    const amountBefore = "";
    const discountedTotalBill =
      dataBill?.discountType === "LAK"
        ? Math.max(totalBill - dataBill?.discount, 0)
        : Math.max(totalBill - (totalBill * dataBill?.discount) / 100, 0);

    const cashAmount = Number.parseFloat(cash) || 0;
    const transferAmount = Number.parseFloat(transfer) || 0;
    const totalReceived = cashAmount + transferAmount;

    moneyReceived = `${selectCurrency === "LAK"
      ? moneyCurrency(totalReceived)
      : moneyCurrency(Number.parseFloat(cashCurrency) || 0)
      } ${selectCurrency}`;

    const remainingAmountValue = discountedTotalBill - totalReceived;
    remainingAmount = `${moneyCurrency(
      remainingAmountValue > 0 ? remainingAmountValue : 0
    )} ${storeDetail?.firstCurrency}`;

    setDataBill((prev) => ({
      ...prev,
      moneyReceived: moneyReceived,
      remainingAmount: remainingAmountValue,
      dataStaffConfirm: staffConfirm,
    }));
  }, [cash, transfer, selectCurrency]);

  useEffect(() => {
    if (!open) return;
    if (selectCurrency !== "LAK") {
      const _currencyData = currencyList.find(
        (e) => e.currencyCode === selectCurrency
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
        if (data?.status === 200) {
          setCurrencyList(data?.data?.data);
        }
      }
    } catch (err) {
      console.log("err:", err);
    }
  };



  const handleClickCreateDebt = async () => {
    try {
      const { DATA, TOKEN } = await getLocalData();
  
      const _body = {
        amount: totalBill,
        payAmount: Number(amountBefore),
        transferAmount: Number(transfer),
        remainingAmount: remainingAmount,
        customerName: customerName,
        customerPhone: customerPhone,
        billId: tableData?._id,
        status: "DEBT",
        startDate: startDate,
        endDate: expirtDate,
        storeId: DATA?.storeId,
        debtTotal: debtTotal
      };
  
      const data = await createBilldebt(_body, TOKEN);
  
      if (data?.error) {
        errorAdd(`${t("debt_fail")}`);
        return;
      }
      
      
      navigate("/debt");
      await handleSubmit(); 
    } catch (err) {
      console.log(err);
      errorAdd(`${t("debt_fail")}`);
    }
  };
  
  const _checkBill = async () => {
    const staffConfirm = JSON.parse(localStorage.getItem("STAFFCONFIRM_DATA"));
  
    try {
      await axios.put(
        `${END_POINT}/v6/bill-checkout`,
        {
          id: dataBill?._id,
          data: {
            isDebt: debtTotal,
            isDebtAndPay: debtAndPay,
            isCheckout: "true",
            status: "CHECKOUT",
            payAmount: debtTotal ? 0 : Number(amountBefore),
            transferAmount: Number(transfer),
            remainingAmount:debtTotal ? 0 : Number(remainingAmount),
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
              `${profile?.data?.firstname} ${profile?.data?.lastname}` ?? "-",
            staffCheckOutId: staffConfirm?.id,
          },
        },
        {
          headers: await getHeaders(),
        }
      );
  
     
      setSelectedTable();
      getTableDataStore();
      setCashCurrency();
      setTab("cash");
      setSelectCurrency("LAK");
      setSelectInput("inputCash");
      setRateCurrency(1);
      setHasCRM(false);
      setTextSearchMember("");
      setCash();
      setTransfer();
      localStorage.removeItem("STAFFCONFIRM_DATA");
  
      onClose();
      return true; 
    } catch (error) {
      errorAdd(`${t("checkbill_fial")}`);
      return false;
    }
  };
  
  const handleSubmit = async () => {
    try {
      const checkBillSuccess = await _checkBill();
      if (checkBillSuccess) {
        
        Swal.fire({
          icon: "success",
          title: `${t("checkbill_success")}`,
          showConfirmButton: false,
          timer: 1800,
        });
        onSubmit();
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      // เปลี่ยนเงื่อนไขให้เหมือนกับ CASH
      const transferAmount = Number(transfer || 0);
      const discountedTotal = dataBill?.discountType === "PERCENT"
        ? totalBill - (totalBill * dataBill?.discount) / 100
        : totalBill - dataBill?.discount;
      
      setCanCheckOut(transferAmount > 0);  // อนุญาตให้จ่ายบางส่วนได้
    } else if (forcus === "TRANSFER_CASH") {
      const totalPaid = Number(cash || 0) + Number(transfer || 0);
      const discountedTotal = dataBill?.discountType === "PERCENT"
        ? totalBill - (totalBill * dataBill?.discount) / 100
        : totalBill - (dataBill?.discount || 0);
      
      if (totalPaid >= discountedTotal) {
        setCanCheckOut(true);
      } else {
        setCanCheckOut(false);
      }
    }
  }, [cash, transfer, totalBill, forcus]);

  const handlePaymentMethodChange = (method) => {
    setForcus(method);

    if (method === "TRANSFER") {

      setTransfer();
      setAmountBefore();
      setRemainingAmount(totalBill); // เพราะจ่ายครบ
    } else if (method === "TRANSFER_CASH") {
      setTransfer();
      setAmountBefore();
      setRemainingAmount(totalBill);
    } else if (method === "CASH") {
      setTransfer();
      setAmountBefore();
      setRemainingAmount(totalBill);
    }
  };

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
      if (selectCurrency !== "LAK") {
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
    console.log({ inputData });
    convertNumberReverse(inputData, (value) => {
      setCash(value);
      if (selectCurrency !== "LAK") {
        if (!value) {
          setCashCurrency();
        } else {
          const amount = value / rateCurrency;
          setCashCurrency(amount.toFixed(2));
        }
      }
    });
  };

  const onChangeAmountBeforeInput = (inputData) => {
    // Ton update
    console.log({ inputData });
    convertNumberReverse(inputData, (value) => {
      setAmountBefore(value);
      if (selectCurrency !== "LAK") {
        if (!value) {
          setCashCurrency();
        } else {
          const amount = value / rateCurrency;
          setCashCurrency(amount.toFixed(2));
        }
      }
    });
  };


  const onChangeRemainingAmountInput = (inputData) => {
    // Ton update
    console.log({ inputData });
    convertNumberReverse(inputData, (value) => {
      setRemainingAmount(value);
      if (selectCurrency !== "LAK") {
        if (!value) {
          setCashCurrency();
        } else {
          const amount = value / rateCurrency;
          setCashCurrency(amount.toFixed(2));
        }
      }
    });
  };

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

  const optionsData = membersData?.map((data) => {
    return {
      id: data?._id,
      value: data?.name,
      label: data?.phone,
      tel: data?.phone,
    };
  });

  useEffect(() => {
    if (!open) return;
    const totalPaidBefore = Number(amountBefore || 0) + Number(transfer || 0);
    const remainingCalculate = totalBill - totalPaidBefore;
  
    setRemainingShow(remainingCalculate);
    setRemainingAmount(remainingCalculate);
  }, [totalBill, amountBefore, transfer, forcus, open]);

  return (
    <Modal
      show={open}
      onHide={() => {
        setAmountBefore();
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
              <InputGroup hidden={selectCurrency === "LAK"}>
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



              <InputGroup hidden={forcus !== "CASH" && forcus !== "TRANSFER_CASH"}>
                <InputGroup.Text>{ "ຈຳນວນເງິນສົດທີຈ່າຍກ່ອນ"}</InputGroup.Text>
                <Form.Control
                  disabled={tab !== "cash_transfer"}
                  type="text"
                  placeholder={"0"}
                  value={convertNumber(amountBefore)}
                  onClick={() => {
                    setSelectInput("inputAmountBefore");
                  }}
                  onChange={(e) => {
                    onChangeAmountBeforeInput(e.target.value);
                  }}
                  size="lg"
                />
                <InputGroup.Text>{storeDetail?.firstCurrency}</InputGroup.Text>
              </InputGroup>

              <InputGroup hidden={forcus !== "TRANSFER" && forcus !== "TRANSFER_CASH"}>
                <InputGroup.Text>{t("ຈຳນວນເງິນໂອນທີຈ່າຍກ່ອນ")}</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="0"
                  value={convertNumber(transfer )}
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

              <Form hidden={tab !== "cash_transfer"}>
                {['radio'].map((type) => (
                  <div key={`inline-${type}`} className="mb-3">
                    <CustomCheck
                      inline
                      defaultChecked
                      label="ເງິນສົດ"
                      name="paymentMethod"
                      type={type}
                      id={`inline-${type}-1`}
                      onChange={() => handlePaymentMethodChange("CASH")}
                    />
                    <CustomCheck
                      inline
                      label="ເງິນໂອນ"
                      name="paymentMethod"
                      type={type}
                      id={`inline-${type}-3`}
                      onChange={() => handlePaymentMethodChange("TRANSFER")}
                    />
                    <CustomCheck
                      inline
                      label="ເງິນສົດ + ໂອນ"
                      name="paymentMethod"
                      type={type}
                      id={`inline-${type}-2`}
                      onChange={() => handlePaymentMethodChange("TRANSFER_CASH")}
                    />
                  </div>
                ))}
              </Form>

              <InputGroup>
                <InputGroup.Text>{t("debt_notpay")}</InputGroup.Text>
                <Form.Control
                  disabled
                  type="text"
                  placeholder={
                    tab !== "cash"
                      ? convertNumber(totalBill)
                      : convertNumber(remainingAmount)
                  }
                  value={convertNumber(remainingAmount)}
                  onClick={() => {
                    setSelectInput("inputRemainingAmount");
                  }}
                  onChange={(e) => {
                    onChangeRemainingAmountInput(e.target.value);
                  }}
                  size="lg"
                />
                <InputGroup.Text>{storeDetail?.firstCurrency}</InputGroup.Text>
              </InputGroup>

              <Form.Label>
                {t("ctm_tel")} <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <BoxInput>
                <div className="debt-input">
                  <Select
                    options={optionsData}
                    placeholder={t("ctm_tel")}
                    onChange={(e) => {
                      setCustomerPhone(e.tel);
                      setCustomerName(e.value);
                    }}
                  />
                </div>
                <div className="debt-btn-group">
                  <button
                    type="button"
                    style={{ color: "white" }}
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
                    type="button"
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
                {t("customer_name")}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                placeholder={t("customer_phone")}
                maxLength={10}
                value={customerName}
                onChange={(e) => setCustomerPhone(e?.target.value)}
              />

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
                  setSelectInput("inputAmount");
                  setForcus("IS_DEBT");
                  setAmountBefore();
                  setRemainingAmount(remainingAmount);
                  setDebtTotal(true);
                  setDebtAndPay(false)
                }}
              >
                {t("debt_total")}
              </Button>

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
                  setForcus("CASH");
                  setAmountBefore();
                  setDebtTotal(false)
                  setDebtAndPay(true)
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
                  <option key={e?.currencyCode} value={e?.currencyCode}>
                    {e?.currencyCode}
                  </option>
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
                if (selectInput === "inputAmountBefore") {
                  return amountBefore;
                }
                if (selectInput === "inputRemainingAmount") {
                  return remainingAmount;
                }
              })()}
              setSelectInput={(e) => {
                if (selectInput === "inputCash") {
                  onChangeCashInput(e);
                } else if (selectInput === "inputTransfer") {
                  onChangeTransferInput(e);
                } else if (selectInput === "inputCurrency") {
                  onChangeCurrencyInput(e);
                } else if (selectInput === "inputAmountBefore") {
                  onChangeAmountBeforeInput(e);
                } else if (selectInput === "inputRemainingAmount") {
                  onChangeRemainingAmountInput(e);
                }
              }}
            />
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
        <div style={{ width: "20%" }} />
        <Button onClick={handleClickCreateDebt}>{t("debt_create")}</Button>
      </Modal.Footer>
    </Modal>
  );
}
const CustomCheck = styled(Form.Check)`
  .form-check-input:checked {
    background-color: red;
    border-color: red;
  }
`;

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
