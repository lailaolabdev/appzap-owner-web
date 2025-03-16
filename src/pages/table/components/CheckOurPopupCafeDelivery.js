import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Box from "../../../components/Box";
import { moneyCurrency } from "../../../helpers";
import axios from "axios";
import { COLOR_APP, END_POINT } from "../../../constants";
import { getHeaders } from "../../../services/auth";
import Swal from "sweetalert2";
import { errorAdd, successAdd } from "../../../helpers/sweetalert";
import { BiSolidPrinter, BiRotateRight } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

import _ from "lodash";

import { useStore } from "../../../store";
import {
  END_POINT_SEVER_TABLE_MENU,
  END_POINT_SEVER,
  QUERY_CURRENCIES,
  getLocalData,
} from "../../../constants/api";
import NumberKeyboard from "../../../components/keyboard/NumberKeyboard";
import convertNumber from "../../../helpers/convertNumber";
import matchRoundNumber from "../../../helpers/matchRound";
import convertNumberReverse from "../../../helpers/convertNumberReverse";
import { RedeemPoint, PointUser } from "../../../services/point";
import { BiTransfer } from "react-icons/bi";
import { useTranslation } from "react-i18next";

import Loading from "../../../components/Loading";
import { getMemberAllCount } from "../../../services/member.service";
import { useStoreStore } from "../../../zustand/storeStore";
import { useShiftStore } from "../../../zustand/ShiftStore";
import { data } from "browserslist";
import { useMenuSelectStore } from "../../../zustand/menuSelectStore";
import { useChangeMoney } from "../../../zustand/slideImageStore";
import { getAllDelivery } from "../../../services/delivery";

export default function CheckOutPopupCafeDelivery({
  onPrintDrawer,
  bill,
  onQueue,
  onPrintBill,
  onPrintForCher,
  billId,
  open,
  onClose,
  dataBill,
  setDataBill,
  isDelivery,
  taxPercent = 0,
  setIsLoading,
  statusBill,
  setPlatform,
  platform,
  setDeliveryCode,
  deliveryCode,
  mainMenuData
}) {
  // ref
  const inputTransferhRef = useRef(null);
  const { profile } = useStore();
  const { storeDetail, setStoreDetail } = useStoreStore();
  const { shiftCurrent } = useShiftStore();
  const navigate = useNavigate();
  const staffConfirm = JSON.parse(localStorage.getItem("STAFFCONFIRM_DATA"));

  // state
  const [selectInput, setSelectInput] = useState("inputTransfer");
  const [selectDataOpption, setSelectDataOpption] = useState();
  const [point, setPoint] = useState();
  const [cash, setCash] = useState();
  const [transfer, setTransfer] = useState();
  const [tab, setTab] = useState("transfer");
  const [delivery, setDelivery] = useState();
  const [forcus, setForcus] = useState("CATRANSFERSH");
  const [canCheckOut, setCanCheckOut] = useState(false);
  const [total, setTotal] = useState();
  const [totalBill, setTotalBill] = useState();
  const [selectCurrency, setSelectCurrency] = useState("LAK");
  const [rateCurrency, setRateCurrency] = useState(1);
  const [cashCurrency, setCashCurrency] = useState();
  const [hasCRM, setHasCRM] = useState(false);
  const [memberData, setMemberData] = useState();
  const [memberDataSearch, setMemberDataSearch] = useState();
  const [textSearchMember, setTextSearchMember] = useState("");
  const [membersData, setMembersData] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const { setSelectedTable, getTableDataStore } = useStore();
  const { setSelectedMenus } = useMenuSelectStore();
  const { SetChangeAmount, ClearChangeAmount } = useChangeMoney();
  const [selectedBank, setSelectedBank] = useState("");
  const [banks, setBanks] = useState([]);
  const [platformList, setPlatformList] = useState([]);
  


  const { t } = useTranslation();

  useEffect(() => {
    setMemberData();
    if (textSearchMember.length > 0) {
      handleSearchOne();
    }
  }, [textSearchMember]);

  const handleSearchOne = async () => {
    try {
      const url = `${END_POINT_SEVER_TABLE_MENU}/v6/members/search-one?phone=${textSearchMember}`;
      const _header = await getHeaders();
      const _res = await axios.get(url, { headers: _header });
      if (!_res.data) throw new Error("Empty!");
      setMemberDataSearch(_res.data);
      setDataBill((prev) => ({
        ...prev,
        memberId: _res.data?._id,
        memberPhone: _res.data?.phone,
        memberName: _res.data?.name,
        Name: _res.data?.name,
        Point: _res.data?.point,
        Discount: _res?.data?.discountPercentage,
        
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
    } catch (err) { }
  };

  const totalBillDefualt = _.sumBy(
    dataBill?.filter(
      (e) => (e?.price + (e?.totalOptionPrice ?? 0)) * e?.quantity
    )
  );
  const taxAmount = (totalBillDefualt * taxPercent) / 100;
  const totalBills = totalBillDefualt + taxAmount;

  useEffect(() => {
    if (open && inputTransferhRef.current) {
      inputTransferhRef.current.focus();
    }
    fetchDelivery();
  }, [open]);

  useEffect(() => {
    setMemberDataSearch();
    setCash();
    setTransfer(transferCal);
    setTab("transfer");
    setSelectInput("inputTransfer");
    setForcus("TRANSFER");
    setCanCheckOut(false);
  }, [open]);



  useEffect(() => {
    if (!open) return;
    let moneyReceived = "";
    let moneyChange = "";
    moneyReceived = cashCurrency
      ? Number.parseFloat(cashCurrency) || 0
      : (Number.parseFloat(cash) || 0) + (Number.parseFloat(transfer) || 0);

    moneyChange =
      (Number.parseFloat(cash) || 0) +
        (Number.parseFloat(transfer) || 0) -
        (dataBill
          ? totalBill
            ? totalBill
            : 0
          : totalBill > 0
            ? totalBill
            : 0) <=
        0
        ? 0
        : (Number.parseFloat(cash) || 0) +
        (Number.parseFloat(transfer) || 0) -
        (dataBill
          ? totalBill > 0
            ? totalBill
            : 0
          : totalBill > 0
            ? totalBill
            : 0);

    setDataBill((prev) => ({
      ...prev,
      moneyReceived: moneyReceived,
      moneyChange: moneyChange,
      dataStaffConfirm: staffConfirm,

    }));
    SetChangeAmount(
      (Number.parseFloat(cash) || 0) +
        (Number.parseFloat(transfer) || 0) -
        (dataBill
          ? totalBill
            ? totalBill
            : 0
          : totalBill > 0
            ? totalBill
            : 0) <=
        0
        ? 0
        : (Number.parseFloat(cash) || 0) +
        (Number.parseFloat(transfer) || 0) -
        (dataBill
          ? totalBill > 0
            ? totalBill
            : 0
          : totalBill > 0
            ? totalBill
            : 0)
    );
  }, [cash, transfer, selectCurrency?.name]);

  const fetchDelivery = async () => {
    await getAllDelivery().then((res) => {
      setPlatformList(res.data);
    });
  };

  useEffect(() => {
    if (!open) return;
    if (selectCurrency?.name !== "LAK") {
      const _currencyData = currencyList.find(
        (e) => e.currencyCode === selectCurrency?.name
      );
      setRateCurrency(_currencyData?.buy || 1);
    } else {
      setCashCurrency();
      setCash();
      setRateCurrency(1);
    }
  }, [selectCurrency?.id, selectCurrency?.name]);
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
    for (let i = 0; i < dataBill?.length; i++) {
      _calculateTotal();
    }
    _calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataBill]);

  useEffect(() => {
    _calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataBill]);

  const _calculateTotal = () => {
    let _total = 0;
    for (let _data of dataBill || []) {
      const totalOptionPrice = _data?.totalOptionPrice || 0;
      const itemPrice = _data?.price + totalOptionPrice;
      // _total += _data?.totalPrice || (_data?.quantity * itemPrice);
      _total += _data?.quantity * itemPrice;
    }
    setTotal(_total);
    setTotalBill(_total);
    const roundedNumber = matchRoundNumber(_total);
    setTotal(roundedNumber);
  };
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

  const DiscountMember = () => {
    let TotalDiscountFinal = 0;
    if (memberDataSearch?.discountPercentage > 0) {
      TotalDiscountFinal =
        totalBill - (totalBill * memberDataSearch?.discountPercentage) / 100;
    } else {
      TotalDiscountFinal = totalBill;
    }

    return matchRoundNumber(TotalDiscountFinal);
  };

  const _checkBill = async () => {
    setIsLoading(true);
    const moneyChange = calculateReturnAmount();
    const Orders = dataBill?.map((itemOrder) => itemOrder);

    let statusPoint = "";

    if (storeDetail?.isCRM && tab === "cash_transfer_point") {
      statusPoint = "REDEEM";
    }
    if (storeDetail?.isCRM && hasCRM) {
      statusPoint = "EARN";
    }

    const datas = {
      billId: billId,
      selectedBank: selectedBank.name,
      bankId: selectedBank.id,
      order: Orders,
      statusBill: statusBill,
      storeId: profile.data.storeId,
      isCheckout: "true",
      status: "CHECKOUT",
      payAmount: matchRoundNumber(cash),
      deliveryAmount: matchRoundNumber(transfer) ,
      billAmount: DiscountMember(),
      deliveryName: platform,
      deliveryCode:deliveryCode,
      billAmountBefore: matchRoundNumber(totalBill),
      paymentMethod: "DELIVERY",
      shiftId: shiftCurrent[0]?._id,
      taxAmount: null,
      taxPercent: taxPercent,
      customerId: null,
      userNanme: null,
      saveCafe: true,
      phone: null,
      queue: bill,
      point: point,
      change: matchRoundNumber(moneyChange),
      isCafe: true,
      memberId: memberDataSearch?._id,
      memberName: memberDataSearch?.name,
      memberPhone: memberDataSearch?.phone,
      memberDiscount: memberDataSearch?.discountPercentage,
      discount:
        memberDataSearch?.discountPercentage > 0
          ? memberDataSearch?.discountPercentage
          : 0,
      discountType: "PERCENT",
      statusPoint: statusPoint,
      fullnameStaffCheckOut:
        `${profile.data.firstname ? profile.data.firstname : "--"} ${profile.data.lastname ? profile.data.lastname : "--"
        }` ?? "-",
      staffCheckOutId: profile.data._id,
    };

    await axios
      .post(
        `${END_POINT}/v7/admin/bill-cafe-checkout`,
        {
          data: datas,
        },
        {
          headers: await getHeaders(),
        }
      )
      .then(async (response) => {
        if (response?.status === 200) {
          setSelectedTable();
          getTableDataStore();
          setCashCurrency();
          setTab("transfer");
          setCash();
          setSelectCurrency("LAK");
          setRateCurrency(1);
          setTransfer();
          setSelectInput("inputTransfer");
          setPlatform("");
          setDeliveryCode("");
          setHasCRM(false);
          setTextSearchMember("");
          setSelectedMenus([]);
          localStorage.removeItem("STAFFCONFIRM_DATA");
          setIsLoading(false);

          onClose();
          onQueue();
          if (!storeDetail?.isStatusCafe) {
            await onPrintForCher();
          }
          // await onPrintForCherLaBel();
          ClearChangeAmount();
        }

        navigate("/cafe");
      })
      .catch((error) => {
        errorAdd("ທ່ານບໍ່ສາມາດ checkBill ໄດ້..... ");
        setIsLoading(false);
        onClose();
      });
  };

  const handleSubmit = async () => {
    const showAlert = (icon, title, text, timer = 1800) => {
      Swal.fire({
        icon,
        title,
        text,
        showConfirmButton: false,
        timer,
      });
    };

    try {
      await _checkBill();
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      showAlert("error", "An unexpected error occurred");
    }
  };

  // useEffect
  useEffect(() => {
    getDataCurrency();
    getMembersData();
    setMemberDataSearch();
    setSelectCurrency({
      id: "LAK",
      name: "LAK",
    });
  }, []);


  useEffect(() => {
    if (!open) return;

    let memberDiscount = memberDataSearch?.discountPercentage || 0; // Get member discount, default to 0 if not available

   if (forcus === "DELIVERY") {
      if (dataBill?.discount) {
        if (dataBill?.discountType === "PERCENT") {
          if (delivery >= totalBill - (totalBill * dataBill?.discount) / 100) {
            setCanCheckOut(true);
          } else {
            setCanCheckOut(false);
          }
        } else {
          if (delivery >= totalBill - dataBill?.discount) {
            setCanCheckOut(true);
          } else {
            setCanCheckOut(false);
          }
        }
      } else {
        if (delivery >= totalBill) {
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
    }
  }, [
    cash,
    transfer,
    totalBill,
    forcus,
    point,
    delivery,
    memberDataSearch?.discountPercentage,
  ]);




  let transferCal = dataBill
    ? DiscountMember() > 0
      ? DiscountMember()
      : 0
    : DiscountMember() > 0
      ? DiscountMember()
      : 0;

  let totalBillMoney = dataBill
    ? Number.parseFloat(DiscountMember() > 0 ? DiscountMember() : 0)
    : Number.parseFloat(DiscountMember() > 0 ? DiscountMember() : 0);

  let _selectDataOption = (option) => {
    setSelectDataOpption(option);
    setDataBill((prev) => ({
      ...prev,
      dataCustomer: option,
    }));
    // localStorage.setItem("DATA_CUSTOMER", JSON.stringify(option));
  };


  const onChangeTransferInput = (inputData) => {
    convertNumberReverse(inputData, (value) => {
      setTransfer(value);
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

  const calculateReturnAmount = () => {
    const parsedCash = Number.parseInt(matchRoundNumber(cash)) || 0;
    const parsedTransfer = Number.parseInt(matchRoundNumber(transfer)) || 0;
    const parsedDelivery = Number.parseInt(delivery) || 0;
    const parsedPoint = Number.parseInt(matchRoundNumber(point)) || 0;

    const totalAmount =
      parsedCash + parsedTransfer + parsedDelivery + parsedPoint - matchRoundNumber(totalBill);

    return totalAmount <= 0 ? 0 : totalAmount;
  };

  return (
    <Modal
      show={open}
      onHide={() => {
        setCash();
        setTransfer();
        onClose();
        setDelivery();
        ClearChangeAmount();
      }}
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-start">Delivery</Modal.Title>
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
              // style={{
              //   marginBottom: 10,
              //   fontSize: 22,
              // }}
              className="mb-[10px] text-[22px] flex gap-3 items-center"
            >
              <span>{t("bill_total")}: </span>
              <span style={{ color: COLOR_APP, fontWeight: "bold" }}>
                {dataBill
                  ? moneyCurrency(DiscountMember() ? DiscountMember() : 0)
                  : moneyCurrency(
                    DiscountMember() > 0 ? DiscountMember() : 0
                  )}{" "}
                {storeDetail?.firstCurrency}
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
              <div hidden={tab === "point"} className="flxe flex-col gap-2">

                <div>
                  <InputGroup>
                    <InputGroup.Text>{t("transfer")}</InputGroup.Text>
                    <Form.Control
                      ref={inputTransferhRef}
                      disabled={
                        tab !== "cash_transfer" && tab !== "cash_transfer_point"
                      }
                      type="text"
                      placeholder="0"
                      value={
                        tab === "cash_transfer"
                          ? convertNumber(transfer)
                          : convertNumber(matchRoundNumber(transfer || 0))
                      }
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
                  <Form.Group>
                    <Form.Label>{t("delivery")}</Form.Label>
                    <Form.Control
                      type="text"
                      value={deliveryCode}
                      onChange={(e) => setDeliveryCode(e.target.value)}
                      placeholder={t("deliveryPlaceholder")}
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label>{t("chooseflatform")}</Form.Label>
                    <div>
                      {platformList.map((p, idx) => (
                        <Form.Check
                          key={p?._id}
                          type="checkbox"
                          id={`platform-${p?._id}`}
                          label={p?.name}
                          value={p?.name}
                          checked={platform === p?.name} // Only one platform can be selected
                          onChange={(e) => {
                            // Handle checkbox change to ensure only one can be selected
                            if (e.target.checked) {
                              setPlatform(p?.name); // Set the selected platform
                            } else {
                              setPlatform(""); // Deselect the platform (optional)
                            }
                          }}
                        />
                      ))}
                    </div>
                  </Form.Group>
                </div>
              </div>


            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 30,
              }}
            >
              <Button
                variant={tab === "transfer" ? "primary" : "outline-primary"}
                style={{
                  fontSize: 15,
                }}
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
                  setDelivery(totalBillMoney);
                }}
              >
                {t("transfer")}
              </Button>

              <div style={{ flex: 1 }} />
              <Form.Control
                hidden={tab !== "cash"}
                as="select"
                style={{ width: 80 }}
                value={selectCurrency?.name?.id}
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
                if (storeDetail?.isCRM) {
                  setHasCRM((prev) => !prev);
                } else {
                  Swal.fire({
                    title: "ແຈ້ງເຕືອນ?",
                    text: "ກະລະນາເປີດໃຊ້ງານຟັງຊັນ CRM",
                    icon: "warning",
                    showCancelButton: false,
                    confirmButtonColor: COLOR_APP,
                    cancelButtonColor: "#d33",
                    confirmButtonText: "ເປີດໃຊ້ງານ",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate("/config");
                    }
                  });
                }
              }}
              setCanCheckOut={setCanCheckOut}
              onClickButtonDrawer={onPrintDrawer}
              totalBill={totalBillMoney}
              payType={tab}
              selectInput={((e) => {

                if (selectInput === "inputTransfer") {
                  return transfer;
                }
              })()}
              setSelectInput={(e) => {
                if (selectInput === "inputTransfer") {
                  onChangeTransferInput(e);
                }
              }}
            />
          </div>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-wrap items-start w-full justify-center">
          <div className="flex flex-1 h-full whitespace-nowrap mb-2">
            <p>
              {t("cashier")}:{" "}
              <b>
                {profile?.data?.firstname ?? "-"}{" "}
                {profile?.data?.lastname ?? "-"}
              </b>
            </p>
          </div>
          <div className="flex flex-col dmd:flex-row gap-2 items-end">
            <Button
              onClick={async () => {
                await onPrintBill().then(() => {
                  handleSubmit();
                });

                // await onPrintForCher();
              }}
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
              disabled={ platform.length <= 0  }
            >
              <BiSolidPrinter />
              {t("print_checkbill")}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
