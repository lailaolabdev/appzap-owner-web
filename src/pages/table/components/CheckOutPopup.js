import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import Box from "../../../components/Box";
import { moneyCurrency } from "../../../helpers";
import axios from "axios";
import { COLOR_APP, END_POINT } from "../../../constants";
import { getHeaders } from "../../../services/auth";
import Swal from "sweetalert2";
import { errorAdd } from "../../../helpers/sweetalert";
import { BiSolidPrinter } from "react-icons/bi";

import _ from "lodash";

import { useStore } from "../../../store";
import { QUERY_CURRENCIES, getLocalData } from "../../../constants/api";
import NumberKeyboard from "../../../components/keyboard/NumberKeyboard";
import convertNumber from "../../../helpers/convertNumber";
import convertNumberReverse from "../../../helpers/convertNumberReverse";

import { BiTransfer } from "react-icons/bi";

export default function CheckOutPopup({
  onPrintBill,
  open,
  onClose,
  // onSubmit,
  dataBill,
  tableData,
  setDataBill,
  taxPercent = 0,
}) {
  // ref
  const inputCashRef = useRef(null);
  const inputTransferRef = useRef(null);

  // state
  const [selectInput, setSelectInput] = useState(null);
  const [selectData, setSelectData] = useState([]);
  const [selectDataOpption, setSelectDataOpption] = useState();
  const [cash, setCash] = useState();
  const [transfer, setTransfer] = useState(0);
  const [tab, setTab] = useState("cash");
  const [forcus, setForcus] = useState("CASH");
  const [canCheckOut, setCanCheckOut] = useState(false);
  const [total, setTotal] = useState();
  const [selectCurrency, setSelectCurrency] = useState("LAK");
  const [rateCurrency, setRateCurrency] = useState(1);
  const [cashCurrency, setCashCurrency] = useState();

  const [currencyList, setCurrencyList] = useState([]);

  const { setSelectedTable, getTableDataStore } = useStore();

  // val

  const totalBillDefualt = _.sumBy(
    dataBill?.orderId?.filter((e) => e?.status === "SERVED"),
    (e) => e?.price * e?.quantity
  );
  const taxAmount = (totalBillDefualt * taxPercent) / 100;
  const totalBill = totalBillDefualt + taxAmount;

  useEffect(() => {
    let moneyReceived = "";
    let moneyChange = "";
    moneyReceived = `${
      selectCurrency == "LAK"
        ? moneyCurrency((parseFloat(cash) || 0) + (parseFloat(transfer) || 0))
        : moneyCurrency((parseFloat(cashCurrency) || 0))
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
    )} ກີບ`;

    setDataBill((prev) => ({
      ...prev,
      moneyReceived: moneyReceived,
      moneyChange: moneyChange,
    }));
  }, [cash, transfer, selectCurrency]);
  useEffect(() => {
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
    const amount = cashCurrency * rateCurrency;
    if (cashCurrency && rateCurrency !== 1) {
      setCash(amount);
    } else {
      setCash();
    }
  }, [rateCurrency]);

  useEffect(() => {
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
          },
        },
        {
          headers: await getHeaders(),
        }
      )
      .then(async function (response) {
        setSelectedTable();
        getTableDataStore();
        setCash();
        setTransfer();
        setSelectCurrency("LAK");
        setRateCurrency(1);
        setCashCurrency();
        setTab("cash");
        onClose();
        Swal.fire({
          icon: "success",
          title: "ສໍາເລັດການເຊັກບິນ",
          showConfirmButton: false,
          timer: 1800,
        });
      })
      .catch(function (error) {
        errorAdd("ທ່ານບໍ່ສາມາດ checkBill ໄດ້..... ");
      });
  };
  const handleSubmit = () => {
    _checkBill();
    // onSubmit();
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
    setCash(selectInput);
  }, [selectInput]);
  useEffect(() => {
    getDataCurrency();
  }, []);
  useEffect(() => {
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

  let _selectDataOption = (option) => {
    setSelectDataOpption(option);
    setDataBill((prev) => ({
      ...prev,
      dataCustomer: option,
    }));
    // localStorage.setItem("DATA_CUSTOMER", JSON.stringify(option));
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
          ຄິດໄລເງິນ ໂຕະ ({tableData?.tableName}) - ລະຫັດ {tableData?.code}
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
              <span>ລາຄາລວມ: </span>
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
                ກີບ
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
                (ອັດຕາແລກປ່ຽນ: {convertNumber(rateCurrency)})
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
                  onChange={(e) => {
                    convertNumberReverse(e.target.value, (value) => {
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
                  }}
                  size="lg"
                />
                <InputGroup.Text>{selectCurrency}</InputGroup.Text>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>ເງິນສົດ</InputGroup.Text>
                <Form.Control
                  disabled={tab !== "cash" && tab !== "cash_transfer"}
                  type="text"
                  placeholder="0"
                  value={convertNumber(cash)}
                  onChange={(e) => {
                    convertNumberReverse(e.target.value, (value) => {
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
                  }}
                  size="lg"
                />
                <InputGroup.Text>ກີບ</InputGroup.Text>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>ເງິນໂອນ</InputGroup.Text>
                <Form.Control
                  disabled={tab !== "cash_transfer"}
                  type="text"
                  placeholder="0"
                  value={convertNumber(transfer)}
                  onChange={(e) => {
                    convertNumberReverse(e.target.value, (value) => {
                      setTransfer(value);
                    });
                  }}
                  size="lg"
                />
                <InputGroup.Text>ກີບ</InputGroup.Text>
              </InputGroup>
            </div>
            <div
              style={{
                marginBottom: 10,
              }}
            >
              ທອນ:{" "}
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
              ກີບ
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
                  setForcus("CASH");
                }}
              >
                Cash
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
                Transfer
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
                  setForcus("TRANSFER_CASH");
                }}
              >
                Cash & Transfer
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
                <option value="LAK">LAK</option>
                {currencyList?.map((e) => (
                  <option value={e?.currencyCode}>{e?.currencyCode}</option>
                ))}
              </Form.Control>
            </div>
            <NumberKeyboard setSelectInput={setCash} />
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
        <div style={{ flex: 1 }}></div>
        <Button
          onClick={() => {
            onPrintBill().then(() => {
              handleSubmit();
            });
          }}
          disabled={!canCheckOut}
        >
          <BiSolidPrinter />
          ພິມບິນ ແລະ ໄລເງິນ
        </Button>
        <div style={{ width: "20%" }}></div>
        <Button onClick={handleSubmit} disabled={!canCheckOut}>
          ໄລເງິນ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
