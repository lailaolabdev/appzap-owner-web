import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import Select from "react-select";
import Box from "../../../components/Box";
import { moneyCurrency } from "../../../helpers";
import axios from "axios";
import { COLOR_APP, END_POINT } from "../../../constants";
import { getHeaders } from "../../../services/auth";
import Swal from "sweetalert2";
import { errorAdd } from "../../../helpers/sweetalert";
import { BiSolidPrinter } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

import _ from "lodash";

import { useStore } from "../../../store";
import {
  END_POINT_SEVER,
  QUERY_CURRENCIES,
  getLocalData,
} from "../../../constants/api";
import NumberKeyboard from "../../../components/keyboard/NumberKeyboard";
import convertNumber from "../../../helpers/convertNumber";
import convertNumberReverse from "../../../helpers/convertNumberReverse";
import { getMembers } from "../../../services/member.service";

import { BiTransfer } from "react-icons/bi";
import { useTranslation } from "react-i18next";

export default function CheckOutPopup({
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
  const { t } = useTranslation();
  // ref
  const inputCashRef = useRef(null);
  const inputTransferRef = useRef(null);
  const { storeDetail } = useStore();
  const staffConfirm = JSON.parse(localStorage.getItem("STAFFCONFIRM_DATA"));

  // state
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

  const { setSelectedTable, getTableDataStore } = useStore();

  // val
  console.log("tableData:=======abc======>", tableData);

  useEffect(() => {
    setMemberData();
    if (textSearchMember.length > 0) {
      handleSearchOne();
    }
  }, [textSearchMember]);

  useEffect(() => {
    getMembersData();
  }, []);

  const handleSearchOne = async () => {
    try {
      let url =
        END_POINT_SEVER + "/v4/member/search-one?phone=" + textSearchMember;
      const _header = await getHeaders();
      const _res = await axios.get(url, { headers: _header });
      if (!_res.data) throw new Error("Empty!");
      setMemberData(_res.data);
      setDataBill((prev) => ({
        ...prev,
        memberId: _res.data?._id,
        memberName: _res.data?.name,
        memberPhone: _res.data?.phone,
      }));
    } catch (err) {
      console.log(err);
      errorAdd("ບໍ່ພົບສະມາຊິກ");
    }
  };

  const getMembersData = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      let findby = "?";
      findby += `storeId=${DATA?.storeId}&`;
      const _data = await getMembers(findby, TOKEN);
      if (_data.error) throw new Error("error");
      setMembersData(_data);
    } catch (err) {
      console.error("Error fetching members data", err);
    }
  };

  // console.log("tableData:=======abc======>", tableData)

  console.log("membersData", membersData);

  const totalBillDefualt = _.sumBy(
    dataBill?.orderId?.filter((e) => e?.status === "SERVED"),
    (e) => e?.price * e?.quantity
  );
  const taxAmount = (totalBillDefualt * taxPercent) / 100;
  const totalBill = totalBillDefualt + taxAmount;

  useEffect(() => {
    setCash();
    setTransfer();
    setTab("cash");
    setSelectInput("inputCash");
    setForcus("CASH");
    setCanCheckOut(false);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    let moneyReceived = "";
    let moneyChange = "";
    moneyReceived = `${
      selectCurrency == "LAK"
        ? moneyCurrency((parseFloat(cash) || 0) + (parseFloat(transfer) || 0))
        : moneyCurrency(parseFloat(cashCurrency) || 0)
    } ${selectCurrency}`;
    moneyChange = `${moneyCurrency(
      (parseFloat(cash) || 0) +
        (parseFloat(transfer) || 0) -
        (dataBill && dataBill?.discountType === "LAK"
          ? totalBill - dataBill?.discount > 0
            ? totalBill - dataBill?.discount
            : 0
          : totalBill - (totalBill * dataBill?.discount) / 100 > 0
          ? totalBill - (totalBill * dataBill?.discount) / 100
          : 0) <=
        0
        ? 0
        : (parseFloat(cash) || 0) +
            (parseFloat(transfer) || 0) -
            (dataBill && dataBill?.discountType === "LAK"
              ? totalBill - dataBill?.discount > 0
                ? totalBill - dataBill?.discount
                : 0
              : totalBill - (totalBill * dataBill?.discount) / 100 > 0
              ? totalBill - (totalBill * dataBill?.discount) / 100
              : 0)
    )} ${storeDetail?.firstCurrency}`;

    setDataBill((prev) => ({
      ...prev,
      moneyReceived: moneyReceived,
      moneyChange: moneyChange,
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
            billAmount: totalBill,
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
        setCash();
        setSelectCurrency("LAK");
        setRateCurrency(1);
        setTransfer();
        setSelectInput("inputCash");
        setHasCRM(false);
        setTextSearchMember("");
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
  const handleSubmit = () => {
    _checkBill();
    // onSubmit();
    // console.log("valueConfirm:------>", valueConfirm)
  };

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
      console.log(_sum);
      console.log(transfer);
      console.log(cash);
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

  const onChangeTransferInput = (inputData) => {
    convertNumberReverse(inputData, (value) => {
      setTransfer(value);
    });
  };

  const optionsData = membersData.map((item) => {
    console.log(item);
    return {
      value: item.phone,
      label: `${item.name} (${item.phone})`,
      phoneNumber: item.phone,
      point: item.point,
    };
  });

  console.log("optionsData", optionsData);

  const handleSearchInput = (option) => {
    setTextSearchMember(option.value);
  };

  console.log("textSearchMember", textSearchMember);

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
                <InputGroup.Text>{t("cash")}</InputGroup.Text>
                <Form.Control
                  disabled={tab !== "cash" && tab !== "cash_transfer"}
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
                <InputGroup.Text>{storeDetail?.firstCurrency}</InputGroup.Text>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>{t("transfer")}</InputGroup.Text>
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
              <div style={{ display: "flex", gap: "2px" }} hidden={!hasCRM}>
                <div style={{ width: "30rem" }}>
                  <Select options={optionsData} onChange={handleSearchInput} />
                </div>
                <div style={{ width: "9rem" }}>
                  <InputGroup.Text>
                    {t("name")}: {memberData?.name}
                  </InputGroup.Text>
                </div>
                <InputGroup.Text>
                  {t("point")}: {memberData?.point ? memberData?.point : "0"}
                </InputGroup.Text>
              </div>
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
                {t("cash")}
              </Button>
              <Button
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
                  setForcus("TRANSFER_CASH");
                }}
              >
                {t("cash_transfer")}
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
      <Modal.Footer>
        <div style={{ flex: 1 }}>
          <p>
            {t("cashier")}:{" "}
            <b>
              {staffConfirm?.firstname ?? "-"} {staffConfirm?.lastname ?? "-"}
            </b>
          </p>
        </div>
        <Button
          onClick={() => {
            onPrintBill().then(() => {
              handleSubmit();
            });
          }}
          disabled={!canCheckOut}
        >
          <BiSolidPrinter />
          {t("print_checkbill")}
        </Button>
        <div style={{ width: "20%" }}></div>
        <Button onClick={handleSubmit} disabled={!canCheckOut}>
          {t("calculate")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
