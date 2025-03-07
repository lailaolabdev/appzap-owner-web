import React, { useState, useEffect } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Button, InputGroup, Spinner } from "react-bootstrap";
import styled from "styled-components";
import Select from "react-select";
import Swal from "sweetalert2";
import { BiTransfer } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import Box from "../../../components/Box";
import { moneyCurrency } from "../../../helpers";
import axios from "axios";
import { COLOR_APP, END_POINT } from "../../../constants";
import { getHeaders } from "../../../services/auth";
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
import { RedeemPoint, PointUser } from "../../../services/point";

import { useStoreStore } from "../../../zustand/storeStore";
import { useShiftStore } from "../../../zustand/ShiftStore";
import { useClaimDataStore } from "../../../zustand/claimData";

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
  const navigate = useNavigate();

  // state
  const [selectInput, setSelectInput] = useState("inputCash");
  const [selectDataOpption, setSelectDataOpption] = useState();
  const [cash, setCash] = useState();
  const [transfer, setTransfer] = useState();
  const [delivery, setDelivery] = useState();
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
  const [datePointExpirt, setDatePointExpirt] = useState("");

  const {
    setSelectedTable,
    getTableDataStore,
    setOrderPayBefore,
    orderPayBefore,
    selectedTable,
    profile,
  } = useStore();

  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();
  const { statusServedForOrdering, setStatusServedForOrdering } =
    useClaimDataStore();
  const { shiftCurrent } = useShiftStore();

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

  // console.log({ dataBill });
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
      setMemberData(_res.data);
      setDataBill((prev) => ({
        ...prev,
        memberId: _res.data?._id,
        memberPhone: _res.data?.phone,
        memberName: _res.data?.name,
        Name: _res.data?.name,
        Point: _res.data?.point,
        ExpireDateForPoint: _res?.data?.pointDateExpirt,
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

    moneyReceived =
      selectCurrency?.name === "LAK"
        ? Number.parseFloat(totalReceived)
        : Number.parseFloat(cashCurrency) || 0;

    const changeAmount = totalReceived - discountedTotalBill;
    moneyChange = Number.parseFloat(changeAmount > 0 ? changeAmount : 0);

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
      shiftId: shiftCurrent[0]?._id,
      orderPayBefore: orderItem,
      isCheckout: checkStatus,
      status: checkStatusBill,
      payAmount: cash,
      transferAmount: transfer,
      deliveryAmount: delivery,
      point: point,
      paymentMethod:
        tableData?.isOrderingPaid && !statusServedForOrdering
          ? "APPZAP_TRANSFER"
          : forcus,
      isOrderingPaid: false,
      taxAmount: taxAmount,
      taxPercent: taxPercent,
      serviceChargePercent: serviceChargePer,
      serviceChargeAmount: serviceChargeAmount,
      deliveryName: dataBill?.orderId[0]?.platform,
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
        `${END_POINT}/v7/bill-checkout`,
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
        localStorage.removeItem("STAFFCONFIRM_DATA");

        Swal.fire({
          icon: "success",
          title: `${t("checkbill_success")}`,
          showConfirmButton: false,
          timer: 1800,
        });

        setStoreDetail({
          serviceChargePer: 0,
          isServiceCharge: false,
          zoneCheckBill: true,
          point: 0,
        });
        onClose();
        setStatusServedForOrdering(true);
      })
      .catch((error) => {
        errorAdd(`${t("checkbill_fial")}`);
      });
  };

  // new function Redeem Point Code
  const RedeemPointUser = async () => {
    const TotalPrices =
      (Number(cash) || 0) + (Number(transfer) || 0) + (Number(point) || 0);

    const statusTable =
      storeDetail?.tableEdit === undefined
        ? false
        : !storeDetail?.tableEdit
        ? false
        : true;

    const data = {
      memberId: memberData?._id,
      point: point,
      storeId: storeDetail?._id,
      moneyTotal: TotalPrices,
      money: totalBill,
      billId: dataBill?._id,
      statusTable: statusTable,
    };
    return await RedeemPoint(data);
  };
  const PointUsers = async () => {
    const data = {
      billId: dataBill?._id,
      storeId: storeDetail?._id,
      memberId: memberData?._id,
    };
    return await PointUser(data);
  };

  // const handleSubmit = async () => {
  //   const showAlert = (icon, title, text, timer = 1800) => {
  //     Swal.fire({
  //       icon,
  //       title,
  //       text,
  //       showConfirmButton: false,
  //       timer,
  //     });
  //   };

  //   try {
  //     saveServiceChargeDetails();

  //     if (storeDetail?.isCRM && tab === "cash_transfer_point") {
  //       try {
  //         await RedeemPointUser()
  //           .then((res) => {
  //             console.log(res);
  //           })
  //           .catch((err) => {
  //             if (err?.response?.data.isExpire) {
  //               showAlert(
  //                 "error",
  //                 "ເກີດຂໍ້ຜິດພາດ",
  //                 "ຂໍອະໄພຄະແນນຂອງທ່ານໝົດອາຍຸການໃຊ້ງານແລ້ວ"
  //               );
  //             }
  //           });
  //         return;
  //       } catch {
  //         showAlert(
  //           "error",
  //           "ເກີດຂໍ້ຜິດພາດ",
  //           "ການຊຳລະດ້ວຍພ໋ອຍບໍ່ສຳເລັດ ກະລຸນາເລຶອກສະມາຊິກດ້ວຍ"
  //         );
  //         return; // Stop further execution if RedeemPointUser fails
  //       }
  //     }

  //     try {
  //       await _checkBill(selectCurrency?.id, selectCurrency?.name);
  //     } catch {
  //       showAlert("error", "ການເຊັກບິນບໍ່ສຳເລັດ"); // Add your localized error message
  //       return; // Stop further execution if _checkBill fails
  //     }

  //     if (storeDetail?.isCRM && hasCRM) {
  //       try {
  //         await PointUsers();
  //       } catch {
  //         showAlert("error", "ບໍ່ສາມາດຮັບ point ຈາກການຊຳລະຄັ້ງນີ້");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error in handleSubmit:", error);
  //     showAlert("error", "An unexpected error occurred");
  //   }
  // };

  // useEffect

  const handleSubmit = async () => {
    try {
      saveServiceChargeDetails();

      if (storeDetail?.isCRM && tab === "cash_transfer_point") {
        try {
          await RedeemPointUser();
        } catch (err) {
          if (err?.response?.data.isExpire) {
            Swal.fire({
              icon: "error",
              title: "ເກີດຂໍ້ຜິດພາດ",
              text: "ຂໍອະໄພຄະແນນຂອງທ່ານໝົດອາຍຸການໃຊ້ງານແລ້ວ",
            });
          }
          throw new Error("ຂໍອະໄພຄະແນນຂອງທ່ານໝົດອາຍຸການໃຊ້ງານແລ້ວ"); // 🚨 Ensure error is thrown
        }
      }

      try {
        await _checkBill(selectCurrency?.id, selectCurrency?.name);
      } catch {
        Swal.fire({
          icon: "error",
          title: "ການເຊັກບິນບໍ່ສຳເລັດ",
        });
        throw new Error("ການເຊັກບິນບໍ່ສຳເລັດ"); // 🚨 Ensure error is thrown
      }

      if (storeDetail?.isCRM && hasCRM) {
        try {
          await PointUsers();
        } catch {
          Swal.fire({
            icon: "error",
            title: "ບໍ່ສາມາດຮັບ point ຈາກການຊຳລະຄັ້ງນີ້",
          });
        }
      }

      return true; // ✅ Return success
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      Swal.fire({
        icon: "error",
        title: "An unexpected error occurred",
      });
      throw error; // 🚨 Ensure error is thrown so `onPrintBill()` is not executed
    }
  };

  useEffect(() => {
    getDataCurrency();
    getMembersData();
    setSelectCurrency({
      id: "LAK",
      name: "LAK",
    });
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
    } else if (forcus === "DELIVERY") {
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
      const checkPoint = Math.max(0, Number.parseInt(dataBill?.Point - point));
      if (checkPoint === 0) {
        Swal.fire({
          icon: "warning",
          title: `${t("error_point")}`,
          text: `${t("error_point_enough")}`,
          showConfirmButton: false,
          timer: 1800,
        });
        return;
      }

      if (
        dataBill?.Point <
        totalBill - (totalBill * dataBill?.discount) / 100
      ) {
        setCanCheckOut(true);
        return;
      }

      if (dataBill?.discount) {
        if (dataBill?.discountType === "PERCENT") {
          if (point >= totalBill - (totalBill * dataBill?.discount) / 100) {
            setCanCheckOut(true);
          } else {
            setCanCheckOut(false);
          }
        } else {
          if (point >= totalBill - dataBill?.discount) {
            setCanCheckOut(true);
          } else {
            setCanCheckOut(false);
          }
        }
      } else {
        if (point >= totalBill) {
          setCanCheckOut(true);
        } else {
          setCanCheckOut(false);
        }
      }
    } else if (forcus === "CASH_TRANSFER_POINT") {
      const checkPoint = Math.max(0, Number.parseInt(dataBill?.Point - point));
      if (checkPoint === 0) {
        Swal.fire({
          icon: "warning",
          title: `${t("error_point")}`,
          text: `${t("error_point_enough")} ${dataBill?.Point} ${t("point")}`,
          showConfirmButton: false,
          timer: 1800,
        });
        setPoint("");
        return;
      }
      const _sum =
        (Number.parseInt(cash) || 0) +
        (Number.parseInt(transfer) || 0) +
        (Number.parseInt(point) || 0);
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
    }
  }, [cash, transfer, totalBill, delivery, forcus, point]);

  const transferCal =
    dataBill?.discountType === "PERCENT"
      ? totalBill - dataBill?.discount > 0
        ? totalBill - dataBill?.discount
        : 0
      : totalBill - (totalBill * dataBill?.discount) / 100 > 0
      ? (totalBill * dataBill?.discount) / 100
      : 0;

  const totalBillMoney =
    dataBill?.discountType === "LAK"
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
        );

  useEffect(() => {
    if (selectedTable?.isDeliveryTable) {
      setCash();
      setTransfer();
      setTab("delivery");
      setSelectInput("inputDelivery");
      setForcus("DELIVERY");
    } else {
      setCash();
      setTransfer();
      setDelivery();
      setTab("cash");
      setSelectInput("inputCash");
      setForcus("CASH");
    }
  }, [selectedTable?.isDeliveryTable]);

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
  const onChangeDeliveryInput = (inputData) => {
    convertNumberReverse(inputData, (value) => {
      setDelivery(value);
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
    const parsedCash = Number.parseInt(cash) || 0;
    const parsedTransfer = Number.parseInt(transfer) || 0;
    const parsedDelivery = Number.parseInt(delivery) || 0;
    const parsedPoint = Number.parseInt(point) || 0;

    const discountAmount =
      dataBill && dataBill?.discountType === "LAK"
        ? Math.max(totalBill - dataBill?.discount, 0)
        : Math.max(totalBill - (totalBill * dataBill?.discount) / 100, 0);

    const totalAmount =
      parsedCash +
      parsedTransfer +
      parsedDelivery +
      parsedPoint -
      discountAmount;

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
      setStoreDetail({
        point: value,
      });
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

  useEffect(() => {
    if (selectedTable?.isDeliveryTable) {
      setCash();
      setTransfer();
      setTab("delivery");
      setSelectInput("inputDelivery");
      setForcus("DELIVERY");
      setDelivery(totalBillMoney);
    }
    if (delivery >= totalBillMoney) {
      setCanCheckOut(true);
    } else {
      setCanCheckOut(false);
    }
  }, [open, delivery, totalBillMoney]);

  useEffect(() => {
    if (dataBill?.ExpireDateForPoint) {
      setDatePointExpirt(
        moment(dataBill.ExpireDateForPoint).format("YYYY-MM-DD")
      );
    } else {
      setDatePointExpirt(moment().add(1, "months").format("YYYY-MM-DD"));
    }
  }, [dataBill?.Name]);

  const CountDateExpire = (pointDateExpirt) => {
    if (!pointDateExpirt) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expirtDate = new Date(pointDateExpirt);
    expirtDate.setHours(0, 0, 0, 0);

    const timeDiff = expirtDate.getTime() - today.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // ปัดเศษให้เป็นจำนวนเต็ม

    if (daysDiff > 0) {
      return (
        <span className="text-green-500 font-semibold">
          ຍັງເຫຼືອອີກ {daysDiff} ມື້
        </span>
      );
    } else if (daysDiff === 0) {
      return (
        <span className="text-yellow-500 font-semibold">ໝົດອາຍຸວັນນີ້</span>
      );
    } else {
      return (
        <span className="text-red-500 font-semibold">
          ໝົດອາຍຸແລ້ວ {Math.abs(daysDiff)} ວັນ
        </span>
      );
    }
  };

  return (
    <Modal
      show={open}
      onHide={() => {
        setCash();
        setTransfer();
        setDelivery();
        setPoint();
        onClose();
        setCanCheckOut(false);
        setDatePointExpirt("");
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
          <div style={{ padding: "20px 20px 0 20px" }}>
            <div
              style={{
                marginBottom: 10,
                fontSize: 20,
              }}
            >
              <span>{t("bill_total")}: </span>
              <span style={{ color: COLOR_APP, fontWeight: "bold" }}>
                {totalBillMoney} {storeDetail?.firstCurrency}
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
                {selectedTable?.isDeliveryTable ? (
                  <>
                    <InputGroup>
                      <InputGroup.Text>delivery</InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="0"
                        value={convertNumber(delivery)}
                        onClick={() => {
                          setSelectInput("inputDelivery");
                        }}
                        onChange={(e) => {
                          onChangeDeliveryInput(e.target.value);
                        }}
                        size="lg"
                        readOnly
                      />
                      <InputGroup.Text>
                        {storeDetail?.firstCurrency}
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                ) : (
                  <>
                    <div
                      hidden={tab === "point"}
                      className="flxe flex-col gap-2"
                    >
                      <div className="mb-2">
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
                      </div>
                      <div>
                        <InputGroup>
                          <InputGroup.Text>{t("transfer")}</InputGroup.Text>
                          <Form.Control
                            disabled={
                              tab !== "cash_transfer" &&
                              tab !== "cash_transfer_point"
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
                      </div>
                    </div>
                  </>
                )}

                {tab === "point" || tab === "cash_transfer_point" ? (
                  <div hidden={hasCRM} style={{ marginBottom: 10 }}>
                    <div className="w-full flex flex-col dmd:flex-row justify-between gap-2">
                      <div className="whitespace-nowrap flex-1 flex gap-1.5">
                        <div className="flex-1">
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
                        <div hidden={tab === "point"}>
                          <Button
                            className="primary"
                            onClick={() => {
                              window.open("/add/newMembers");
                            }}
                          >
                            {t("add_new")}{" "}
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-1 justify-start dmd:justify-end">
                        <div className="box-name">
                          <InputGroup.Text>
                            {t("name")}: {dataBill?.Name ? dataBill?.Name : ""}
                          </InputGroup.Text>
                        </div>
                        <div className="box-name">
                          <InputGroup.Text>
                            {t("point")}:{" "}
                            {point
                              ? convertNumber(dataBill?.Point - point)
                              : convertNumber(dataBill?.Point)
                              ? convertNumber(dataBill?.Point)
                              : "0"}
                          </InputGroup.Text>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <InputGroup style={{ marginTop: 10 }}>
                        <InputGroup.Text>{t("point")}</InputGroup.Text>
                        <input
                          disabled={
                            dataBill?.Point <= 0 ||
                            !dataBill?.Name ||
                            !dataBill?.Point ||
                            dataBill?.Point <= point ||
                            (dataBill?.ExpireDateForPoint &&
                              moment(dataBill.ExpireDateForPoint).isBefore(
                                moment(),
                                "day"
                              )) // Disable if expired
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
                          className="w-[320px] text-[20px] h-[45px] p-2 border rounded-r-lg focus:outline-none"
                        />
                      </InputGroup>
                      {dataBill?.ExpireDateForPoint && (
                        <div className="w-[250px]">
                          <span className="text-[18px] font-bold">
                            {t("expire_date_debt")}:{" "}
                            {dataBill?.ExpireDateForPoint &&
                            moment(dataBill.ExpireDateForPoint).isValid()
                              ? moment(dataBill.ExpireDateForPoint).format(
                                  "DD-MM-YYYY"
                                )
                              : "-"}
                          </span>
                          <br />
                          {CountDateExpire(dataBill.ExpireDateForPoint)}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div hidden={!hasCRM} style={{ marginBottom: 10 }}>
                  <BoxMember className="mb-2">
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
                  <label htmlFor="date-expirt" className="my-2">
                    ກຳວັນໝົດອາຍຸຂອງຄະແນນ
                  </label>
                  <BoxMember className="mb-2">
                    <div className="box-left">
                      <div className="box-search">
                        <input
                          type="date"
                          value={datePointExpirt}
                          onChange={(e) => setDatePointExpirt(e.target.value)}
                          className="border p-2 w-[325px] h-[38px] rounded-md focus:outline-none"
                        />
                      </div>
                    </div>
                  </BoxMember>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginBottom: 10, padding: "10px 20px" }}>
            <div className="flex flex-row flex-1 justify-between items-center mb-2">
              <div
                hidden={tab === "point" || selectedTable?.isDeliveryTable}
                style={{ marginBottom: 10 }}
              >
                {t("return")}: {moneyCurrency(calculateReturnAmount())}{" "}
                {storeDetail?.firstCurrency}
              </div>

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
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 20,
                width: "100%",
                whiteSpace: "nowrap",
                flexWrap: "wrap",
              }}
            >
              {/* ເງິີນສົດ */}

              {selectedTable?.isDeliveryTable ? (
                <Button
                  variant={
                    selectedTable?.isDeliveryTable
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => {
                    setCash();
                    setTransfer();
                    setTab("delivery");
                    setSelectInput("inputDelivery");
                    setDelivery(totalBillMoney);
                    setForcus("DELIVERY");
                  }}
                >
                  Delivery :{" "}
                  {dataBill?.orderId?.length > 0 &&
                    dataBill?.orderId[0]?.platform}
                </Button>
              ) : (
                <>
                  <Button
                    variant={
                      selectedTable?.isDeliveryTable
                        ? "outline-primary"
                        : tab === "cash"
                        ? "primary"
                        : "outline-primary"
                    }
                    disabled={selectedTable?.isDeliveryTable}
                    style={{
                      fontSize: 15,
                    }}
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
                    disabled={selectedTable?.isDeliveryTable}
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
                    }}
                  >
                    {t("transfer")}
                  </Button>
                  {/* {storeDetail?.isCRM && (
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
              )} */}
                  <Button
                    variant={
                      tab === "cash_transfer" ? "primary" : "outline-primary"
                    }
                    disabled={selectedTable?.isDeliveryTable}
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
                      setTransfer();
                      setTab("cash_transfer");
                      setSelectInput("inputCash");
                      setForcus("TRANSFER_CASH");
                    }}
                  >
                    {t("cash_transfer")}
                  </Button>
                  {storeDetail?.isCRM && (
                    <Button
                      disabled={hasCRM || selectedTable?.isDeliveryTable}
                      style={{
                        fontSize: 15,
                      }}
                      variant={
                        selectedTable?.isDeliveryTable
                          ? "outline-primary"
                          : tab === "cash_transfer_point"
                          ? "primary"
                          : "outline-primary"
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
                  )}
                </>
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
              onClickButtonDrawer={onPrintDrawer}
              totalBill={totalBillMoney}
              payType={tab}
              selectedTable={selectedTable?.isDeliveryTable}
              setCanCheckOut={setCanCheckOut}
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
                if (selectInput === "inputDelivery") {
                  return delivery;
                }
                if (selectInput === "inputPoint") {
                  return point;
                }
              })()}
              setSelectInput={(e) => {
                if (selectInput === "inputCash") {
                  onChangeCashInput(e);
                } else if (selectInput === "inputTransfer") {
                  onChangeTransferInput(e);
                } else if (selectInput === "inputCurrency") {
                  onChangeCurrencyInput(e);
                } else if (selectInput === "inputDelivery") {
                  onChangeDeliveryInput(e);
                } else if (selectInput === "inputPoint") {
                  onChangePointInput(e);
                }
              }}
            />
          </div>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-wrap items-start w-full justify-center">
          <div className="flex flex-1 h-full whitespace-nowrap mb-2">
            {t("cashier")}:{" "}
            <b>
              {profile?.data?.firstname ?? "-"} {profile?.data?.lastname ?? "-"}
            </b>
          </div>
          <div className="flex flex-col dmd:flex-row gap-2 items-end">
            <Button
              onClick={() => onSubmit()}
              disabled={
                forcus === "DELIVERY" || forcus === "CASH_TRANSFER_POINT"
              }
            >
              {t("debt")}
            </Button>

            {/* <Button
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
                <Spinner
                  animation="border"
                  size="sm"
                  style={{ marginRight: 8 }}
                />
              )}
              <BiSolidPrinter />
              {t("print_checkbill")}
            </Button> */}

            <Button
              onClick={async () => {
                setPrintBillLoading(true);
                saveServiceChargeDetails();

                try {
                  await handleSubmit(); // Run handleSubmit first
                  await onPrintBill(); // Only run if handleSubmit is successful
                } catch (error) {
                  Swal.fire({
                    icon: "error",
                    title: "ເກີດຂໍ້ຜິດພາດ",
                    text: error,
                  });
                } finally {
                  setPrintBillLoading(false);
                }
              }}
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
              disabled={!canCheckOut || printBillLoading}
            >
              {printBillLoading && (
                <Spinner
                  animation="border"
                  size="sm"
                  style={{ marginRight: 8 }}
                />
              )}
              <BiSolidPrinter />
              {t("print_checkbill")}
            </Button>

            <Button
              className="dmd:w-fit w-full"
              onClick={handleSubmit}
              disabled={!canCheckOut}
            >
              {t("calculate")}
            </Button>
          </div>
        </div>
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
