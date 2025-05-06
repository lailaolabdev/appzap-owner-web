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

import convertNumberReverse from "../../../helpers/convertNumberReverse";
import { RedeemPoint, PointUser } from "../../../services/point";
import { BiTransfer } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import matchRoundNumber from "../../../helpers/matchRound";
import Loading from "../../../components/Loading";
import { getMemberAllCount } from "../../../services/member.service";
import { useStoreStore } from "../../../zustand/storeStore";
import { useShiftStore } from "../../../zustand/ShiftStore";
import { cn } from "../../../utils/cn";
import { fontMap } from "../../../utils/font-map";
import { useMenuSelectStore } from "../../../zustand/menuSelectStore";
import { useChangeMoney } from "../../../zustand/slideImageStore";
import { convertUnitgramAndKilogram } from "../../../helpers/convertUnitgramAndKilogram";
import { getAllDelivery } from "../../../services/delivery";
import { subStringText } from "./../../../helpers/subStringText";

export default function CheckOutPopupCafe({
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
  taxPercent = 0,
  setIsLoading,
  statusBill,
  setPlatform,
  platform,
  setDeliveryCode,
  deliveryCode,
  setIsDelivery,
  isDelivery,
  dataBillEdit,
  setTotalPointPrice,
  totalPointPrice,
  setPoint,
  point,
  paymentMethod,
  setPaymentMethod,
}) {
  // ref
  const inputCashRef = useRef(null);
  const inputTransferRef = useRef(null);
  const { profile } = useStore();
  const { storeDetail, setStoreDetail } = useStoreStore();
  const { shiftCurrent } = useShiftStore();
  const navigate = useNavigate();
  const staffConfirm = JSON.parse(localStorage.getItem("STAFFCONFIRM_DATA"));

  // state
  const [selectInput, setSelectInput] = useState("inputCash");
  const [selectPoint, setSelectPoint] = useState();
  const [cash, setCash] = useState();
  const [transfer, setTransfer] = useState();
  const [tab, setTab] = useState("cash");
  const [forcus, setForcus] = useState("CASH");
  const [delivery, setDelivery] = useState();
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
  const [showTotalPointPrice, setShowTotalPointPrice] = useState(false);

  const {
    t,
    i18n: { language },
  } = useTranslation();

  // console.log("dataBill exchangePointStoreId", dataBill);

  // console.log("dataBillEdit", dataBillEdit);

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
    } catch (err) {}
  };

  const totalBillDefualt = _.sumBy(
    dataBill?.filter((e) => e.status !== "CANCELED"),
    (e) => (e?.price + (e?.totalOptionPrice ?? 0)) * e?.quantity
  );

  const taxAmount = (totalBillDefualt * taxPercent) / 100;

  useEffect(() => {
    setMemberDataSearch();
    setTotalPointPrice();
    setCash();
    setTransfer();
    setTab("cash");
    setSelectInput("inputCash");
    setForcus("CASH");
    setCanCheckOut(false);
    fetchDelivery();
    setDelivery(totalBillMoney);
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
      setPlatformList(res?.data);
    });
  };

  useEffect(() => {
    setPaymentMethod(isDelivery ? "DELIVERY" : forcus);
  }, [forcus, isDelivery]);

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
  }, [dataBill]);
  useEffect(() => {
    _calculateTotal();
  }, [dataBill]);

  const _calculateTotal = () => {
    let _total = 0;
    for (let _data of dataBill || []) {
      if (_data.status !== "CANCELED") {
        const totalOptionPrice = _data?.totalOptionPrice || 0;
        const itemPrice = _data?.price + totalOptionPrice;
        if (storeDetail?.isStatusCafe && _data?.isWeightMenu) {
          _total +=
            _data?.unitWeightMenu === "g"
              ? convertUnitgramAndKilogram(_data?.quantity) * itemPrice
              : _data?.quantity * itemPrice;
        } else {
          _total += _data?.quantity * itemPrice;
        }
      }
    }

    setTotal(_total);
    setTotalBill(_total);
    const roundedNumber = _total;
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
    } else if (dataBillEdit?.discount > 0) {
      TotalDiscountFinal =
        totalBill - (totalBill * dataBillEdit?.discount) / 100;
    } else {
      TotalDiscountFinal = totalBill;
    }

    return TotalDiscountFinal;
  };

  const DataExchangePointStore = () => {
    const pointsData =
      // biome-ignore lint/complexity/useFlatMap: <explanation>
      dataBill
        ?.map((item) => {
          // Check if exchangePointStoreId exists and is an array
          const exchangePointStoreId = Array.isArray(item?.exchangePointStoreId)
            ? item.exchangePointStoreId
            : [];

          // Return array of objects with point, Id, and quantity
          return exchangePointStoreId.map((i) => ({
            point: i?.exchangePoint,
            Id: i?._id,
            quantity: item?.quantity || 1, // Assuming a default quantity of 1 if not provided
            menuName: item?.name,
            price: item?.price,
          }));
        })
        .flat(); // Flatten the array to get a single array of objects

    // Calculate the sum of all points * quantity
    const totalPoints =
      (pointsData?.length > 0 &&
        pointsData.reduce(
          (sum, current) => sum + (current.point * current.quantity || 0),
          0
        )) ||
      0;

    const totalPointsPrice =
      pointsData?.length > 0
        ? pointsData.reduce(
            (sum, current) => sum + (current.price * current.quantity || 0),
            0
          )
        : 0;

    return { pointsData, totalPoints, totalPointsPrice };
  };

  const { pointsData, totalPoints, totalPointsPrice } =
    DataExchangePointStore();

  const handleSelectedPoint = (data) => {
    setSelectPoint(data);
    setPoint(data?.point || data);
  };

  const exchangePointStoreIds = pointsData?.map((i) => i?.Id);

  const _checkBill = async (currencyId, currencyName) => {
    setIsLoading(true);
    onClose();
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
      payAmount: cash,
      billAmount:
        totalPoints < memberDataSearch?.point && !hasCRM
          ? DiscountMember() - totalPointPrice
          : DiscountMember(),
      transferAmount: isDelivery ? 0 : transfer,
      deliveryAmount: isDelivery ? matchRoundNumber(transfer) : 0,
      deliveryName: platform,
      deliveryCode: deliveryCode,
      paymentMethod: isDelivery ? "DELIVERY" : forcus,
      billAmountBefore: totalBill,
      shiftId: shiftCurrent[0]?._id,
      taxAmount: null,
      taxPercent: taxPercent,
      customerId: null,
      userNanme: null,
      saveCafe: true,
      phone: null,
      queue: bill,
      point: point,
      change: moneyChange,
      isCafe: true,
      memberId: memberDataSearch?._id,
      memberName: memberDataSearch?.name,
      memberPhone: memberDataSearch?.phone,
      memberDiscount: memberDataSearch?.discountPercentage,
      discount:
        memberDataSearch?.discountPercentage > 0
          ? memberDataSearch?.discountPercentage
          : dataBillEdit?.discount > 0
          ? dataBillEdit?.discount
          : 0,
      discountType: "PERCENT",
      statusPoint: statusPoint,
      fullnameStaffCheckOut:
        `${profile.data.firstname ? profile.data.firstname : "--"} ${
          profile.data.lastname ? profile.data.lastname : "--"
        }` ?? "-",
      staffCheckOutId: profile.data._id,
      exchangePointStoreId: exchangePointStoreIds,
    };

    if (currencyId !== "LAK") {
      datas.currencyId = currencyId;
      datas.currency = cashCurrency;
      datas.currencyName = currencyName;
    }

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
        // console.log("response", response);
        if (response?.status === 200) {
          onPrintBill();
          setSelectedTable();
          getTableDataStore();
          setCashCurrency();
          setTab("cash");
          setCash();
          setSelectCurrency("LAK");
          setRateCurrency(1);
          setTransfer();
          setShowTotalPointPrice(false);
          setSelectInput("inputCash");
          setHasCRM(false);
          setPlatform("");
          setDeliveryCode("");
          setTextSearchMember("");
          // setSelectedMenus([]);
          localStorage.removeItem("STAFFCONFIRM_DATA");
          // setIsLoading(false);
          // setIsDelivery(false);

          setIsLoading(false);
          setIsDelivery(false);
          onClose();
          onQueue();
          setTotalPointPrice();
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

  const _checkBillNotPrint = async () => {
    onClose();
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
      payAmount: cash,
      billAmount:
        totalPoints < memberDataSearch?.point && !hasCRM
          ? DiscountMember() - totalPointPrice
          : DiscountMember(),
      transferAmount: isDelivery ? 0 : transfer,
      deliveryAmount: isDelivery ? matchRoundNumber(transfer) : 0,
      deliveryName: platform,
      deliveryCode: deliveryCode,
      paymentMethod: isDelivery ? "DELIVERY" : forcus,
      billAmountBefore: totalBill,
      shiftId: shiftCurrent[0]?._id,
      taxAmount: null,
      taxPercent: taxPercent,
      customerId: null,
      userNanme: null,
      saveCafe: true,
      phone: null,
      queue: bill,
      point: point,
      change: moneyChange,
      isCafe: true,
      memberId: memberDataSearch?._id,
      memberName: memberDataSearch?.name,
      memberPhone: memberDataSearch?.phone,
      memberDiscount: memberDataSearch?.discountPercentage,
      discount:
        memberDataSearch?.discountPercentage > 0
          ? memberDataSearch?.discountPercentage
          : dataBillEdit?.discount > 0
          ? dataBillEdit?.discount
          : 0,
      discountType: "PERCENT",
      statusPoint: statusPoint,
      fullnameStaffCheckOut:
        `${profile.data.firstname ? profile.data.firstname : "--"} ${
          profile.data.lastname ? profile.data.lastname : "--"
        }` ?? "-",
      staffCheckOutId: profile.data._id,
      exchangePointStoreId: exchangePointStoreIds,
    };

    if (selectCurrency?.id !== "LAK") {
      datas.currencyId = selectCurrency?.id;
      datas.currency = cashCurrency;
      datas.currencyName = selectCurrency?.name;
    }

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
          setTab("cash");
          setCash();
          setSelectCurrency("LAK");
          setRateCurrency(1);
          setTransfer();
          setShowTotalPointPrice(false);
          setSelectInput("inputCash");
          setHasCRM(false);
          setPlatform("");
          setDeliveryCode("");
          setTextSearchMember("");
          // setSelectedMenus([]);
          localStorage.removeItem("STAFFCONFIRM_DATA");
          // setIsLoading(false);
          setIsDelivery(false);
          // onClose();
          onQueue();
          setTotalPointPrice();
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
      memberId: memberDataSearch?._id,
      point: point,
      storeId: storeDetail?._id,
      moneyTotal: TotalPrices,
      money: totalBill,
      billId: dataBill?._id,
      statusTable: statusTable,
      exchangePointStoreId: exchangePointStoreIds,
    };
    return await RedeemPoint(data);
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
      if (
        storeDetail?.isCRM &&
        tab === "cash_transfer_point" &&
        totalPoints < memberDataSearch?.point
      ) {
        try {
          await RedeemPointUser();
        } catch {
          showAlert(
            "error",
            "ເກີດຂໍ້ຜິດພາດ",
            "ການຊຳລະດ້ວຍພ໋ອຍບໍ່ສຳເລັດ ກະລຸນາເລຶອກສະມາຊິກດ້ວຍ"
          );
          return; // Stop further execution if RedeemPointUser fails
        }
      }
      await _checkBill(selectCurrency?.id, selectCurrency?.name);
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      showAlert("error", "ບໍ່ສາມາດເຊັກບິນໄດ້", error);
      setIsLoading(false);
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
    setDelivery(totalBillMoney);
  }, []);

  useEffect(() => {
    if (!open) return;

    let memberDiscount = memberDataSearch?.discountPercentage || 0; // Get member discount, default to 0 if not available

    if (forcus === "CASH") {
      let discountedTotal = totalBill - (totalBill * memberDiscount) / 100; // Apply member discount to the total bill
      if (dataBill?.discount) {
        if (dataBill?.discountType === "PERCENT") {
          discountedTotal -= (discountedTotal * dataBill?.discount) / 100;
        } else {
          discountedTotal -= dataBill?.discount;
        }
      }
      if (cash >= discountedTotal) {
        setCanCheckOut(true);
      } else {
        setCanCheckOut(false);
      }
    } else if (forcus === "TRANSFER") {
      let discountedTotal = totalBill - (totalBill * memberDiscount) / 100; // Apply member discount to the total bill

      if (dataBill?.discount > 0) {
        // Apply additional discount based on dataBill
        if (dataBill?.discountType === "PERCENT") {
          discountedTotal -= (discountedTotal * dataBill?.discount) / 100;
        } else {
          discountedTotal -= dataBill?.discount;
        }
      } else {
        // Apply discount from dataBillEdit if no discount in dataBill
        if (dataBillEdit?.discount) {
          if (dataBillEdit?.discountType === "PERCENT") {
            discountedTotal -= (discountedTotal * dataBillEdit?.discount) / 100;
          } else {
            discountedTotal -= dataBillEdit?.discount;
          }
        }
      }

      setTransfer(discountedTotal);
      setCanCheckOut(true);
    } else if (forcus === "TRANSFER_CASH") {
      let _sum =
        (Number.parseInt(cash) || 0) + (Number.parseInt(transfer) || 0);
      let discountedTotal = totalBill - (totalBill * memberDiscount) / 100; // Apply member discount to the total bill
      if (dataBill?.discount) {
        if (dataBill?.discountType === "PERCENT") {
          discountedTotal -= (discountedTotal * dataBill?.discount) / 100;
        } else {
          discountedTotal -= dataBill?.discount;
        }
      }
      if (_sum >= discountedTotal) {
        setCanCheckOut(true);
      } else {
        setCanCheckOut(false);
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
      let discountedTotal = totalBill - (totalBill * memberDiscount) / 100; // Apply member discount to the total bill
      if (dataBill?.discount) {
        if (dataBill?.discountType === "PERCENT") {
          discountedTotal -= (discountedTotal * dataBill?.discount) / 100;
        } else {
          discountedTotal -= dataBill?.discount;
        }
      }
      if (dataBill?.Point < discountedTotal) {
        setCanCheckOut(true);
      } else {
        setCanCheckOut(false);
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
      let _sum =
        (Number.parseInt(cash) || 0) +
        (Number.parseInt(transfer) || 0) +
        (Number.parseInt(point) || 0);
      let discountedTotal = totalBill - (totalBill * memberDiscount) / 100; // Apply member discount to the total bill
      if (dataBill?.discount) {
        if (dataBill?.discountType === "PERCENT") {
          discountedTotal -= (discountedTotal * dataBill?.discount) / 100;
        } else {
          discountedTotal -= dataBill?.discount;
        }
      }
      if (totalPoints < memberDataSearch?.point) {
        setCanCheckOut(true);
      } else {
        if (_sum >= discountedTotal) {
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
    }
  }, [
    cash,
    transfer,
    totalBill,
    forcus,
    point,
    delivery,
    deliveryCode,
    platform,
    memberDataSearch?.discountPercentage,
  ]);

  let transferCal =
    dataBill || dataBillEdit
      ? DiscountMember() > 0
        ? DiscountMember()
        : 0
      : DiscountMember() > 0
      ? DiscountMember()
      : 0;

  let totalBillMoney = dataBill
    ? Number.parseFloat(DiscountMember() > 0 ? DiscountMember() : 0)
    : Number.parseFloat(DiscountMember() > 0 ? DiscountMember() : 0);

  const onChangeCurrencyInput = (inputData) => {
    convertNumberReverse(inputData, (value) => {
      setCashCurrency(value);
      if (selectCurrency?.name != "LAK") {
        if (!value) {
          setCash();
        } else {
          const amount = parseFloat(value * rateCurrency);
          setCash(amount.toFixed(0));
        }
      }
    });
  };
  const onChangeCashInput = (inputData) => {
    convertNumberReverse(inputData, (value) => {
      setCash(value);
      if (selectCurrency?.name != "LAK") {
        if (!value) {
          setCashCurrency();
        } else {
          const amount = value / rateCurrency;
          setCashCurrency(amount.toFixed(2));
        }
      }
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
    const parsedCash = Number.parseInt(cash) || 0;
    const parsedTransfer = Number.parseInt(transfer) || 0;
    const parsedPoint = Number.parseInt(point) || 0;

    const totalAmount = parsedCash + parsedTransfer + parsedPoint - totalBill;

    return totalAmount <= 0 ? 0 : totalAmount;
  };

  const totalCashAndTransfer =
    (Number.parseInt(cash) || 0) + (Number.parseInt(transfer) || 0);

  return (
    <Modal
      show={open}
      onHide={() => {
        setCash();
        setTransfer();
        onClose();
        ClearChangeAmount();
        setPlatform("");
        setDeliveryCode("");
        setIsDelivery(false);
        setDelivery();
        setShowTotalPointPrice(false);
      }}
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton></Modal.Header>
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
              className="mb-[10px] text-[22px] flex gap-3 items-center "
            >
              <span>{t("bill_total")}: </span>
              <span style={{ color: COLOR_APP, fontWeight: "bold" }}>
                {totalPointPrice > 0
                  ? dataBill
                    ? moneyCurrency(
                        DiscountMember()
                          ? DiscountMember() - totalPointPrice
                          : 0
                      )
                    : moneyCurrency(
                        DiscountMember() > 0
                          ? DiscountMember() - totalPointPrice
                          : 0
                      )
                  : dataBill
                  ? moneyCurrency(DiscountMember() ? DiscountMember() : 0)
                  : moneyCurrency(
                      DiscountMember() > 0 ? DiscountMember() : 0
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
                  (dataBill
                    ? DiscountMember() > 0
                      ? DiscountMember()
                      : 0
                    : DiscountMember() > 0
                    ? DiscountMember()
                    : 0) / rateCurrency
                )}{" "}
                {selectCurrency?.name}
              </span>
              <span
                style={{ fontSize: 14 }}
                hidden={selectCurrency?.name === "LAK"}
              >
                {" "}
                (ອັດຕາແລກປ່ຽນ: {convertNumber(rateCurrency)})
              </span>

              {/* {showTotalPointPrice && (
                <div className="flex items-center text-[18px] gap-3">
                  <span>
                    ( {moneyCurrency(point)} {t("point")} ={" "}
                    {moneyCurrency(totalPointPrice)}{" "}
                    {storeDetail?.firstCurrency})
                  </span>
                  <span className="ml-1">{t("debt_pay_remaining")}: </span>
                  <span style={{ color: COLOR_APP, fontWeight: "bold" }}>
                    {dataBill
                      ? moneyCurrency(
                          DiscountMember()
                            ? DiscountMember() - totalPointPrice
                            : 0
                        )
                      : moneyCurrency(
                          DiscountMember() > 0 ? DiscountMember() : 0
                        )}{" "}
                    {storeDetail?.firstCurrency}
                  </span>
                </div>
              )} */}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <InputGroup hidden={selectCurrency?.name == "LAK"}>
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
              <div hidden={tab === "point"} className="flxe flex-col gap-2">
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
                        tab !== "cash_transfer_point" &&
                        !isDelivery
                      }
                      type="text"
                      placeholder="0"
                      value={
                        tab === "cash_transfer"
                          ? convertNumber(transfer)
                          : convertNumber(transfer)
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

                  {isDelivery &&
                    (platformList.length > 0 ? (
                      <>
                        <Form.Group>
                          <Form.Label>{t("delivery")}</Form.Label>
                          <Form.Control
                            type="text"
                            value={deliveryCode}
                            onChange={(e) => setDeliveryCode(e.target.value)}
                            placeholder={t("deliveryPlaceholder")}
                            onClick={() => {
                              setSelectInput("inputDelivery");
                            }}
                            style={{
                              borderColor:
                                selectInput === "inputDelivery"
                                  ? COLOR_APP
                                  : "",
                              borderWidth:
                                selectInput === "inputDelivery" ? "2px" : "",
                            }}
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
                      </>
                    ) : (
                      <div className="my-4 flex gap-2 items-center">
                        {t("no_delivery")}

                        <Button
                          variant="primary"
                          style={{
                            fontSize: 15,
                          }}
                          onClick={() => {
                            navigate(
                              `/settingStore/delivery/${storeDetail?._id}`
                            );
                          }}
                        >
                          {t("add")}
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
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
                          {t("name")}:{" "}
                          {memberDataSearch?.name ? memberDataSearch?.name : ""}
                        </InputGroup.Text>
                      </div>
                      <div className="box-name">
                        <InputGroup.Text>
                          {t("point")}:{" "}
                          {point
                            ? convertNumber(memberDataSearch?.point - point)
                            : convertNumber(memberDataSearch?.point)
                            ? convertNumber(memberDataSearch?.point)
                            : "0"}
                        </InputGroup.Text>
                      </div>
                      {memberDataSearch &&
                      memberDataSearch.discountPercentage !== undefined ? (
                        <div className="box-name">
                          <InputGroup.Text>
                            {t("discount")}:{" "}
                            {memberDataSearch?.discountPercentage != null &&
                            memberDataSearch?.discountPercentage > 0
                              ? memberDataSearch.discountPercentage ===
                                undefined
                                ? 0
                                : `${memberDataSearch.discountPercentage ?? 0}%`
                              : "0"}
                          </InputGroup.Text>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  {(!memberDataSearch?.point <= 0 ||
                    memberDataSearch?.name ||
                    memberDataSearch?.point ||
                    !memberDataSearch?.point <= point) && (
                    <div className="flex gap-2 items-center my-3">
                      {pointsData?.length > 0 && (
                        <div>{t("menu_change_point")} : </div>
                      )}
                      <div className="flex gap-1">
                        {pointsData?.length > 1 && (
                          <button
                            type="button"
                            disabled={memberDataSearch?.point < totalPoints}
                            className={cn(
                              "rounded-full  text-color-app flex-col px-3 py-2 shadow-button w-auto min-w-0 flex-shrink-0 font-semibold text-sm whitespace-nowrap float-none",
                              memberDataSearch?.point < totalPoints
                                ? "bg-gray-400 text-white"
                                : "",
                              fontMap[language]
                            )}
                            onClick={() => {
                              handleSelectedPoint(totalPoints);
                              setShowTotalPointPrice(true);
                              setTotalPointPrice(totalPointsPrice);
                            }}
                          >
                            {t("all")} ({moneyCurrency(totalPoints)})
                          </button>
                        )}
                        {/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
                        {pointsData &&
                          pointsData?.map((data) => {
                            return (
                              <div
                                key={data?._id}
                                className="flex-col items-center"
                              >
                                <button
                                  type="button"
                                  key={`points${data?._id}`}
                                  disabled={
                                    memberDataSearch?.point < data?.point
                                  }
                                  className={cn(
                                    "rounded-full flex-col px-3 py-2 shadow-button w-auto min-w-0 flex-shrink-0 font-semibold text-sm whitespace-nowrap float-none",
                                    selectPoint?._id === data?._id
                                      ? "text-color-app"
                                      : "text-gray-700",
                                    memberDataSearch?.point < data?.point
                                      ? "bg-gray-400 text-white"
                                      : "",
                                    fontMap[language]
                                  )}
                                  onClick={() => {
                                    handleSelectedPoint(data);
                                    setShowTotalPointPrice(true);
                                    setTotalPointPrice(
                                      data?.price * data?.quantity
                                    );
                                  }}
                                >
                                  {subStringText(data?.menuName, 5)}(
                                  {moneyCurrency(data?.point)}
                                  )
                                  <div className="ml-12" />
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {showTotalPointPrice && totalPointPrice > 0 && (
                    <div className="flex items-center text-[18px] gap-3">
                      <span>
                        ( {moneyCurrency(point)} {t("point")} ={" "}
                        {moneyCurrency(totalPointPrice)}{" "}
                        {storeDetail?.firstCurrency})
                      </span>
                      {/* <span className="ml-1">{t("debt_pay_remaining")}: </span>
                      <span style={{ color: COLOR_APP, fontWeight: "bold" }}>
                        {dataBill
                          ? moneyCurrency(
                              DiscountMember()
                                ? DiscountMember() - totalPointPrice
                                : 0
                            )
                          : moneyCurrency(
                              DiscountMember() > 0 ? DiscountMember() : 0
                            )}{" "}
                        {storeDetail?.firstCurrency}
                      </span> */}
                    </div>
                  )}

                  <InputGroup style={{ marginTop: 10 }}>
                    <InputGroup.Text>{t("point")}</InputGroup.Text>
                    <Form.Control
                      disabled={
                        memberDataSearch?.point <= 0 ||
                        !memberDataSearch?.name ||
                        !memberDataSearch?.point ||
                        memberDataSearch?.point <= point ||
                        memberDataSearch?.point < totalPoints
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
                        {t("name")}:{" "}
                        {memberDataSearch?.name ? memberDataSearch?.name : ""}
                      </InputGroup.Text>
                    </div>
                    <div className="box-name">
                      <InputGroup.Text>
                        {t("point")}:{" "}
                        {point
                          ? convertNumber(memberDataSearch?.point - point)
                          : convertNumber(memberDataSearch?.point)
                          ? convertNumber(memberDataSearch?.point)
                          : "0"}
                      </InputGroup.Text>
                    </div>
                    {memberDataSearch &&
                    memberDataSearch.discountPercentage !== undefined ? (
                      <div className="box-name">
                        <InputGroup.Text>
                          {t("discount")}:{" "}
                          {memberDataSearch?.discountPercentage != null &&
                          memberDataSearch?.discountPercentage > 0
                            ? memberDataSearch.discountPercentage === undefined
                              ? 0
                              : `${memberDataSearch.discountPercentage ?? 0}%`
                            : "0"}
                        </InputGroup.Text>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                marginBottom: 10,
              }}
            >
              <div hidden={tab === "point"} style={{ marginBottom: 10 }}>
                {t("return")}: {moneyCurrency(calculateReturnAmount())}{" "}
                {storeDetail?.firstCurrency}
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
                variant={tab === "cash" ? "primary" : "outline-primary"}
                style={{
                  fontSize: 15,
                }}
                onClick={() => {
                  setCash();
                  setTransfer();
                  setTab("cash");
                  setSelectInput("inputCash");
                  setForcus("CASH");
                  setIsDelivery(false);
                }}
              >
                {t("cash")}
              </Button>
              <Button
                variant={
                  tab === "transfer" && !isDelivery
                    ? "primary"
                    : "outline-primary"
                }
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
                  setIsDelivery(false);
                }}
              >
                {t("transfer")}
              </Button>
              <Button
                variant={
                  tab === "cash_transfer" ? "primary" : "outline-primary"
                }
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
                  setIsDelivery(false);
                }}
              >
                {t("cash_transfer")}
              </Button>
              {storeDetail?.isCRM && (
                <Button
                  disabled={hasCRM}
                  style={{
                    fontSize: 15,
                  }}
                  variant={
                    tab === "cash_transfer_point"
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
                    setIsDelivery(false);
                  }}
                >
                  {t("transfercashpoint")}
                </Button>
              )}
              <Button
                variant={
                  tab === "transfer" && isDelivery
                    ? "primary"
                    : "outline-primary"
                }
                style={{
                  fontSize: 15,
                }}
                disabled={hasCRM}
                onClick={() => {
                  setCash();
                  setSelectCurrency({
                    id: "LAK",
                    name: "LAK",
                  });
                  setRateCurrency(1);
                  setTransfer(transferCal);
                  setTab("transfer");
                  setForcus("DELIVERY");
                  setIsDelivery(true);
                }}
              >
                {t("Delivery")}
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
              isDelivery={isDelivery}
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
                  return deliveryCode;
                }
              })()}
              setSelectInput={(e) => {
                if (selectInput === "inputCash") {
                  onChangeCashInput(e);
                } else if (selectInput === "inputTransfer") {
                  onChangeTransferInput(e);
                } else if (selectInput === "inputDelivery") {
                  setDeliveryCode(e);
                } else if (selectInput === "inputCurrency") {
                  onChangeCurrencyInput(e);
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
                // await onPrintBill().then(() => {
                handleSubmit();
                // });

                // await onPrintForCher();
              }}
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
              disabled={
                !canCheckOut ||
                (isDelivery && platform.length <= 0) ||
                (isDelivery && transfer < totalBill) ||
                (storeDetail?.isStatusCafe &&
                  totalCashAndTransfer < DiscountMember() - totalPointPrice)
              }
            >
              <BiSolidPrinter />
              {t("print_checkbill")}
            </Button>
            <Button
              className="dmd:w-fit w-full"
              onClick={() => _checkBillNotPrint()}
              disabled={
                !canCheckOut ||
                (isDelivery && platform.length <= 0) ||
                (isDelivery && transfer < totalBill) ||
                (storeDetail?.isStatusCafe &&
                  totalCashAndTransfer < DiscountMember() - totalPointPrice)
              }
            >
              {t("calculate")}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
