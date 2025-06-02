import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
import { RedeemPoint } from "../../../services/point";
import { BiTransfer } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import matchRoundNumber from "../../../helpers/matchRound";
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

// Custom Hooks
const usePaymentCalculations = (
  dataBill,
  memberDataSearch,
  dataBillEdit,
  storeDetail
) => {
  return useMemo(() => {
    const totalBillDefault = _.sumBy(
      dataBill?.filter((e) => e.status !== "CANCELED"),
      (e) => (e?.price + (e?.totalOptionPrice ?? 0)) * e?.quantity
    );

    const calculateTotal = () => {
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
      return _total;
    };

    const calculatedTotal = calculateTotal();

    const calculateDiscountedTotal = (totalBill) => {
      const memberDiscount = memberDataSearch?.discountPercentage || 0;
      let discountedTotal = totalBill - (totalBill * memberDiscount) / 100;

      // Apply additional discounts from dataBill first, then dataBillEdit
      const discount = dataBill?.discount || dataBillEdit?.discount || 0;
      const discountType = dataBill?.discountType || dataBillEdit?.discountType;

      if (discount > 0) {
        if (discountType === "PERCENT") {
          discountedTotal -= (discountedTotal * discount) / 100;
        } else {
          discountedTotal -= discount;
        }
      }

      return Math.max(0, discountedTotal);
    };

    return {
      totalBillDefault,
      calculatedTotal,
      discountedTotal: calculateDiscountedTotal(calculatedTotal),
    };
  }, [
    dataBill,
    memberDataSearch?.discountPercentage,
    dataBillEdit?.discount,
    storeDetail?.isStatusCafe,
  ]);
};

const usePointExchange = (dataBill) => {
  return useMemo(() => {
    const pointsData =
      dataBill
        ?.map((item) => {
          const exchangePointStoreId = Array.isArray(item?.exchangePointStoreId)
            ? item.exchangePointStoreId
            : [];

          return exchangePointStoreId.map((i) => ({
            point: i?.exchangePoint,
            Id: i?._id,
            quantity: item?.quantity || 1,
            menuName: item?.name,
            price: item?.price,
          }));
        })
        .flat() || [];

    const totalPoints = pointsData.reduce(
      (sum, current) => sum + (current.point * current.quantity || 0),
      0
    );

    const totalPointsPrice = pointsData.reduce(
      (sum, current) => sum + (current.price * current.quantity || 0),
      0
    );

    return { pointsData, totalPoints, totalPointsPrice };
  }, [dataBill]);
};

const usePaymentValidation = ({
  forcus,
  cash,
  transfer,
  point,
  delivery,
  discountedTotal,
  memberDataSearch,
  totalPoints,
  totalPointPrice,
  t,
  setPoint,
  setTransfer,
}) => {
  return useMemo(() => {
    const cashAmount = Number(cash) || 0;
    const transferAmount = Number(transfer) || 0;
    const pointAmount = Number(point) || 0;
    const deliveryAmount = Number(delivery) || 0;
    const memberPoints = memberDataSearch?.point || 0;

    const showPointError = (availablePoints) => {
      Swal.fire({
        icon: "warning",
        title: `${t("error_point")}`,
        text: `${t("error_point_enough")} ${moneyCurrency(availablePoints)} ${t(
          "point"
        )}`,
        showConfirmButton: false,
        timer: 3000,
      });
      setPoint("");
    };

    let isValid = false;

    switch (forcus) {
      case "CASH":
        isValid = cashAmount >= discountedTotal;
        break;

      case "TRANSFER":
        // Auto-set transfer amount if not already set correctly
        if (Math.abs(transferAmount - discountedTotal) > 0.01) {
          setTimeout(() => setTransfer(discountedTotal), 0);
        }
        isValid = transferAmount >= discountedTotal;
        break;

      case "TRANSFER_CASH":
        isValid = cashAmount + transferAmount >= discountedTotal;
        break;

      case "POINT":
        if (pointAmount <= 0) {
          isValid = false;
        } else if (pointAmount > memberPoints) {
          showPointError(memberPoints);
          isValid = false;
        } else {
          isValid = pointAmount >= discountedTotal;
        }
        break;

      case "CASH_TRANSFER_POINT":
        // Must have member selected for point payments
        if (!memberDataSearch || !memberDataSearch._id) {
          console.log("❌ No member selected for point payment");
          isValid = false;
          break;
        }

        if (pointAmount > memberPoints) {
          console.log("❌ Not enough member points:", {
            pointAmount,
            memberPoints,
          });
          showPointError(memberPoints);
          isValid = false;
        } else if (totalPoints > 0 && totalPoints <= memberPoints) {
          // Member has enough points for exchange items
          const remainingAmount = Math.max(
            0,
            discountedTotal - (totalPointPrice || 0)
          );
          isValid = cashAmount + transferAmount >= remainingAmount;
          console.log("✅ Point exchange scenario:", {
            remainingAmount,
            cashAndTransfer: cashAmount + transferAmount,
            isValid,
          });
        } else {
          // Regular payment with mixed methods OR no exchange items
          const totalPayment = cashAmount + transferAmount + pointAmount;
          isValid = totalPayment >= discountedTotal;
          console.log("✅ Regular payment scenario:", {
            totalPayment,
            discountedTotal,
            breakdown: `${cashAmount} + ${transferAmount} + ${pointAmount} = ${totalPayment}`,
            sufficient: totalPayment >= discountedTotal,
            isValid,
          });
        }
        break;

      case "DELIVERY":
        isValid = deliveryAmount >= discountedTotal;
        console.log("DELIVERY validation:", {
          deliveryAmount,
          discountedTotal,
          isValid,
        });
        break;

      default:
        isValid = false;
        break;
    }

    console.log("Final validation result:", isValid);
    return isValid;
  }, [
    forcus,
    cash,
    transfer,
    point,
    delivery,
    discountedTotal,
    memberDataSearch?.point,
    memberDataSearch?._id,
    totalPoints,
    totalPointPrice,
    t,
    setPoint,
    setTransfer,
  ]);
};

// Memoized Components
const PaymentMethods = React.memo(
  ({
    tab,
    isDelivery,
    storeDetail,
    hasCRM,
    t,
    onTabChange,
    selectCurrency,
    currencyList,
    handleChangeCurrency,
    selectedBank,
    banks,
    handleBankChange,
  }) => {
    const buttonConfigs = [
      { key: "cash", label: t("cash"), forcus: "CASH" },
      { key: "transfer", label: t("transfer"), forcus: "TRANSFER" },
      {
        key: "cash_transfer",
        label: t("cash_transfer"),
        forcus: "TRANSFER_CASH",
      },
      ...(storeDetail?.isCRM
        ? [
            {
              key: "cash_transfer_point",
              label: t("transfercashpoint"),
              forcus: "CASH_TRANSFER_POINT",
              disabled: hasCRM,
            },
          ]
        : []),
      {
        key: "delivery",
        label: t("Delivery"),
        forcus: "DELIVERY",
        disabled: hasCRM,
        isDelivery: true,
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 30,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {buttonConfigs.map((config) => (
          <Button
            key={config.key}
            variant={
              (tab === config.key && (!config.isDelivery || !isDelivery)) ||
              (config.isDelivery && isDelivery)
                ? "primary"
                : "outline-primary"
            }
            style={{ fontSize: 15 }}
            disabled={config.disabled}
            onClick={() => onTabChange(config)}
          >
            {config.label}
          </Button>
        ))}

        <div style={{ flex: 1 }} />

        {/* Currency Selection */}
        <Form.Control
          hidden={tab !== "cash"}
          as="select"
          style={{ width: 80 }}
          value={selectCurrency?.id || "LAK"}
          onChange={handleChangeCurrency}
        >
          <option value="LAK">{storeDetail?.firstCurrency}</option>
          {currencyList?.map((e) => (
            <option key={e?._id} value={e?._id}>
              {e?.currencyCode}
            </option>
          ))}
        </Form.Control>

        {/* Bank Selection */}
        {(tab === "transfer" ||
          tab === "cash_transfer" ||
          tab === "cash_transfer_point") && (
          <Form.Control
            as="select"
            style={{ width: 140 }}
            value={selectedBank?.id || ""}
            onChange={handleBankChange}
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
    );
  }
);

const MemberSearch = React.memo(
  ({
    optionsData,
    handleSearchInput,
    getMembersData,
    memberDataSearch,
    point,
    t,
    hasCRM,
    tab,
    pointsData,
    totalPoints,
    totalPointsPrice,
    handleSelectedPoint,
    selectPoint,
    showTotalPointPrice,
    totalPointPrice,
    storeDetail,
    onChangePointInput,
    selectInput,
    setSelectInput,
    language,
  }) => {
    const shouldShow =
      tab === "point" || tab === "cash_transfer_point" || hasCRM;

    if (!shouldShow) return null;

    return (
      <div style={{ marginBottom: 10 }}>
        <div className="w-full flex flex-col dmd:flex-row justify-between gap-2">
          <div className="whitespace-nowrap flex-1 flex gap-1.5">
            <div className="flex-1">
              <Select
                placeholder={<div>{t("enter_phone_and_name")}</div>}
                options={optionsData}
                onChange={handleSearchInput}
                isClearable
              />
            </div>
            <Button className="primary" onClick={getMembersData}>
              <BiRotateRight />
            </Button>
            {tab !== "point" && (
              <Button
                className="primary"
                onClick={() => window.open("/add/newMembers")}
              >
                {t("add_new")}
              </Button>
            )}
          </div>

          <div className="flex flex-1 justify-start dmd:justify-end">
            <div className="box-name">
              <InputGroup.Text>
                {t("name")}: {memberDataSearch?.name || ""}
              </InputGroup.Text>
            </div>
            <div className="box-name">
              <InputGroup.Text>
                {t("point")}:{" "}
                {point
                  ? convertNumber((memberDataSearch?.point || 0) - point)
                  : convertNumber(memberDataSearch?.point) || "0"}
              </InputGroup.Text>
            </div>
            {memberDataSearch?.discountPercentage !== undefined && (
              <div className="box-name">
                <InputGroup.Text>
                  {t("discount")}:{" "}
                  {memberDataSearch?.discountPercentage > 0
                    ? `${memberDataSearch.discountPercentage}%`
                    : "0"}
                </InputGroup.Text>
              </div>
            )}
          </div>
        </div>

        {/* Point Exchange Buttons */}
        {pointsData?.length > 0 && memberDataSearch?.name && (
          <div className="flex gap-2 items-center my-3">
            <div>{t("menu_change_point")}: </div>
            <div className="flex gap-1">
              {pointsData.length > 1 && (
                <button
                  type="button"
                  disabled={memberDataSearch?.point < totalPoints}
                  className={cn(
                    "rounded-full text-color-app flex-col px-3 py-2 shadow-button w-auto min-w-0 flex-shrink-0 font-semibold text-sm whitespace-nowrap float-none",
                    memberDataSearch?.point < totalPoints
                      ? "bg-gray-400 text-white"
                      : "",
                    fontMap[language]
                  )}
                  onClick={() =>
                    handleSelectedPoint(totalPoints, totalPointsPrice)
                  }
                >
                  {t("all")} ({moneyCurrency(totalPoints)})
                </button>
              )}
              {pointsData.map((data) => (
                <button
                  key={data.Id}
                  type="button"
                  disabled={memberDataSearch?.point < data.point}
                  className={cn(
                    "rounded-full flex-col px-3 py-2 shadow-button w-auto min-w-0 flex-shrink-0 font-semibold text-sm whitespace-nowrap float-none",
                    selectPoint?.Id === data.Id
                      ? "text-color-app"
                      : "text-gray-700",
                    memberDataSearch?.point < data.point
                      ? "bg-gray-400 text-white"
                      : "",
                    fontMap[language]
                  )}
                  onClick={() =>
                    handleSelectedPoint(
                      data.point,
                      data.price * data.quantity,
                      data
                    )
                  }
                >
                  {subStringText(data.menuName, 5)}({moneyCurrency(data.point)})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Point Value Display */}
        {showTotalPointPrice && totalPointPrice > 0 && (
          <div className="flex items-center text-[18px] gap-3 my-2">
            <span>
              ({moneyCurrency(point)} {t("point")} ={" "}
              {moneyCurrency(totalPointPrice)} {storeDetail?.firstCurrency})
            </span>
          </div>
        )}

        {/* Point Input */}
        <InputGroup style={{ marginTop: 10 }}>
          <InputGroup.Text>{t("point")}</InputGroup.Text>
          <Form.Control
            disabled={
              !memberDataSearch?.name ||
              memberDataSearch?.point <= 0 ||
              (totalPoints > 0 && memberDataSearch?.point < totalPoints) ||
              (totalPoints > 0 && totalPoints < totalPointPrice) // New condition: disable when totalPoints < totalPointPrice
            }
            type="text"
            placeholder="0"
            value={convertNumber(point)}
            onClick={() => setSelectInput("inputPoint")}
            onChange={(e) => onChangePointInput(e.target.value)}
            size="lg"
          />
        </InputGroup>
      </div>
    );
  }
);

const DeliverySection = React.memo(
  ({
    isDelivery,
    forcus,
    platformList,
    platform,
    setPlatform,
    deliveryCode,
    setDeliveryCode,
    selectInput,
    setSelectInput,
    t,
    navigate,
    storeDetail,
  }) => {
    // Show delivery section for both isDelivery state and DELIVERY forcus
    if (!isDelivery && forcus !== "DELIVERY") return null;

    console.log("DeliverySection Debug:", {
      isDelivery,
      forcus,
      platformList: platformList.length,
      platform,
      deliveryCode,
    });

    return (
      <div className="mt-3">
        {platformList.length > 0 ? (
          <>
            <Form.Group>
              <Form.Label>{t("delivery")}</Form.Label>
              <Form.Control
                type="text"
                value={deliveryCode}
                onChange={(e) => setDeliveryCode(e.target.value)}
                placeholder={t("deliveryPlaceholder") || "Enter delivery code"}
                onClick={() => setSelectInput("inputDelivery")}
                style={{
                  borderColor: selectInput === "inputDelivery" ? COLOR_APP : "",
                  borderWidth: selectInput === "inputDelivery" ? "2px" : "",
                }}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>
                {t("chooseflatform") || "Choose Platform"}
              </Form.Label>
              <div>
                {platformList.map((p) => (
                  <Form.Check
                    key={p?._id}
                    type="radio" // Changed from checkbox to radio for single selection
                    name="delivery-platform" // Added name for radio group
                    id={`platform-${p?._id}`}
                    label={p?.name}
                    value={p?.name}
                    checked={platform === p?.name}
                    onChange={(e) => {
                      if (e.target.checked) {
                        console.log("Platform selected:", p?.name);
                        setPlatform(p?.name);
                      }
                    }}
                  />
                ))}
              </div>
              {platform && (
                <div className="mt-2">
                  <small className="text-success">
                    ✅ Selected: {platform}
                  </small>
                </div>
              )}
            </Form.Group>
          </>
        ) : (
          <div className="my-4 flex gap-2 items-center">
            {t("no_delivery") || "No delivery platforms available"}
            <Button
              variant="primary"
              style={{ fontSize: 15 }}
              onClick={() =>
                navigate(`/settingStore/delivery/${storeDetail?._id}`)
              }
            >
              {t("add") || "Add"}
            </Button>
          </div>
        )}
      </div>
    );
  }
);

// Main Component
export default function CheckOutPopupCafe(props) {
  const {
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
  } = props;

  // Hooks
  const { profile } = useStore();
  const { storeDetail } = useStoreStore();
  const { shiftCurrent } = useShiftStore();
  const navigate = useNavigate();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { setSelectedTable, getTableDataStore } = useStore();
  const { setSelectedMenus } = useMenuSelectStore();
  const { SetChangeAmount, ClearChangeAmount } = useChangeMoney();

  // States
  const [selectInput, setSelectInput] = useState("inputCash");
  const [selectPoint, setSelectPoint] = useState();
  const [cash, setCash] = useState();
  const [transfer, setTransfer] = useState();
  const [tab, setTab] = useState("cash");
  const [forcus, setForcus] = useState("CASH");
  const [delivery, setDelivery] = useState();
  const [canCheckOut, setCanCheckOut] = useState(false);
  const [selectCurrency, setSelectCurrency] = useState({
    id: "LAK",
    name: "LAK",
  });
  const [rateCurrency, setRateCurrency] = useState(1);
  const [cashCurrency, setCashCurrency] = useState();
  const [hasCRM, setHasCRM] = useState(false);
  const [memberDataSearch, setMemberDataSearch] = useState();
  const [textSearchMember, setTextSearchMember] = useState("");
  const [membersData, setMembersData] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [banks, setBanks] = useState([]);
  const [platformList, setPlatformList] = useState([]);
  const [showTotalPointPrice, setShowTotalPointPrice] = useState(false);

  // Custom hooks for calculations
  const { discountedTotal, calculatedTotal } = usePaymentCalculations(
    dataBill,
    memberDataSearch,
    dataBillEdit,
    storeDetail
  );

  const { pointsData, totalPoints, totalPointsPrice } =
    usePointExchange(dataBill);

  // Payment validation
  const isPaymentValid = usePaymentValidation({
    forcus,
    cash,
    transfer,
    point,
    delivery: isDelivery ? delivery || transfer : delivery, // Use transfer as delivery amount for delivery payments
    discountedTotal,
    memberDataSearch,
    totalPoints,
    totalPointPrice,
    t,
    setPoint,
    setTransfer,
  });

  useEffect(() => {
    setCanCheckOut(isPaymentValid);
  }, [isPaymentValid]);

  // Memoized calculations
  const optionsData = useMemo(
    () =>
      membersData?.map((item) => ({
        value: item.phone,
        label: `${item.name} (${item.phone})`,
        phoneNumber: item.phone,
        point: item.point,
      })) || [],
    [membersData]
  );

  const exchangePointStoreIds = useMemo(
    () => pointsData?.map((i) => i?.Id) || [],
    [pointsData]
  );

  const calculateReturnAmount = useCallback(() => {
    const parsedCash = Number(cash) || 0;
    const parsedTransfer = Number(transfer) || 0;
    const parsedPoint = Number(point) || 0;
    const totalPayment = parsedCash + parsedTransfer + parsedPoint;
    const finalAmount =
      totalPointPrice > 0 ? discountedTotal - totalPointPrice : discountedTotal;

    // Validation logic
    if (parsedCash === 0 && parsedTransfer === 0 && parsedPoint > 0) {
      return 0;
    }
    // If cash or transfer is provided (or both), allow any point value (including 0)
    // If all are > 0, allow it (falls through to calculation below)

    return Math.max(0, totalPayment - finalAmount);
  }, [cash, transfer, point, discountedTotal, totalPointPrice]);

  // Event handlers
  const handleSearchInput = useCallback(
    async (option) => {
      if (!option?.value) {
        errorAdd("ກະລຸນາປ້ອນເບີໂທລະສັບ");
        return;
      }

      const phoneNumber = option.value;
      setTextSearchMember(phoneNumber);

      try {
        const searchUrl = new URL(
          `${END_POINT_SEVER_TABLE_MENU}/v6/members/search-one`
        );
        searchUrl.searchParams.set("phone", phoneNumber);

        const headers = await getHeaders();
        const response = await axios.get(searchUrl.toString(), { headers });

        if (!response.data) {
          throw new Error("Member not found");
        }

        const memberData = response.data;
        setMemberDataSearch(memberData);

        setDataBill((prev) => ({
          ...prev,
          memberId: memberData._id,
          memberPhone: memberData.phone,
          memberName: memberData.name,
          Name: memberData.name,
          Point: memberData.point,
          Discount: memberData.discountPercentage,
        }));
      } catch (error) {
        console.error("Member search error:", error);

        if (error.response?.status === 404) {
          errorAdd("ບໍ່ພົບສະມາຊິກທີ່ມີເບີໂທນີ້");
        } else if (error.response?.status === 500) {
          errorAdd("ເກີດຂໍ້ຜິດພາດໃນລະບົບ");
        } else {
          errorAdd("ບໍ່ພົບສະມາຊິກ");
        }
      }
    },
    [setDataBill]
  );

  const getMembersData = useCallback(async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      const _data = await getMemberAllCount(DATA?.storeId, TOKEN);
      if (_data.error) throw new Error("error");
      setMembersData(_data?.data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  }, []);

  const fetchDelivery = useCallback(async () => {
    try {
      const res = await getAllDelivery();
      setPlatformList(res?.data || []);
    } catch (error) {
      console.error("Error fetching delivery platforms:", error);
    }
  }, []);

  const getDataCurrency = useCallback(async () => {
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
      console.log("Currency fetch error:", err);
    }
  }, []);

  const fetchAllBanks = useCallback(async () => {
    try {
      const response = await axios.get(
        `${END_POINT_SEVER}/v3/banks?storeId=${storeDetail?._id}`
      );
      setBanks(response.data.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  }, [storeDetail?._id]);

  const handleSelectedPoint = useCallback(
    (pointValue, priceValue, pointData = null) => {
      setSelectPoint(pointData || pointValue);
      setPoint(pointValue);
      setShowTotalPointPrice(true);
      setTotalPointPrice(priceValue);
    },
    [setPoint, setTotalPointPrice]
  );

  const onTabChange = useCallback(
    (config) => {
      setCash();
      setTransfer();

      if (config.key !== "cash_transfer_point") {
        setPoint();
        setShowTotalPointPrice(false);
        setTotalPointPrice();
      }

      setTab(config.key);
      setSelectInput("inputCash");
      setForcus(config.forcus);
      setIsDelivery(config.isDelivery || false);

      if (config.key === "transfer" && !config.isDelivery) {
        setSelectCurrency({ id: "LAK", name: "LAK" });
        setRateCurrency(1);
        setTransfer(discountedTotal);
      } else if (config.isDelivery) {
        // For delivery, set the transfer amount as delivery amount
        setTransfer(discountedTotal);
        setDelivery(discountedTotal);
      }
    },
    [setIsDelivery, setPoint, setTotalPointPrice, discountedTotal, setDelivery]
  );

  // Input handlers
  const onChangeCurrencyInput = useCallback(
    (inputData) => {
      convertNumberReverse(inputData, (value) => {
        setCashCurrency(value);
        if (selectCurrency?.name !== "LAK") {
          if (!value) {
            setCash();
          } else {
            const amount = parseFloat(value * rateCurrency);
            setCash(amount.toFixed(0));
          }
        }
      });
    },
    [selectCurrency?.name, rateCurrency]
  );

  const onChangeCashInput = useCallback(
    (inputData) => {
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
    },
    [selectCurrency?.name, rateCurrency]
  );

  const onChangeTransferInput = useCallback((inputData) => {
    convertNumberReverse(inputData, (value) => {
      setTransfer(value);
    });
  }, []);

  const onChangePointInput = useCallback(
    (inputData) => {
      convertNumberReverse(inputData, (value) => {
        setPoint(value);
      });
    },
    [setPoint]
  );

  const handleChangeCurrency = useCallback(
    (e) => {
      if (e.target.value === "LAK") {
        setSelectCurrency({ id: "LAK", name: "LAK" });
        return;
      }
      const selectedCurrency = currencyList.find(
        (item) => item?._id === e?.target?.value
      );
      setSelectCurrency({
        id: selectedCurrency._id,
        name: selectedCurrency.currencyName,
      });
    },
    [currencyList]
  );

  const handleBankChange = useCallback(
    (e) => {
      const selectedOption = banks.find((bank) => bank._id === e.target.value);
      setSelectedBank({
        id: selectedOption._id,
        name: selectedOption.bankName,
      });
    },
    [banks]
  );

  // API calls for checkout
  const RedeemPointUser = useCallback(async () => {
    const TotalPrices =
      (Number(cash) || 0) + (Number(transfer) || 0) + (Number(point) || 0);
    const statusTable =
      storeDetail?.tableEdit === undefined ? false : !!storeDetail?.tableEdit;

    const data = {
      memberId: memberDataSearch?._id,
      point: point,
      storeId: storeDetail?._id,
      moneyTotal: TotalPrices,
      money: calculatedTotal,
      billId: dataBill?._id,
      statusTable: statusTable,
      exchangePointStoreId: exchangePointStoreIds,
    };
    return await RedeemPoint(data);
  }, [
    cash,
    transfer,
    point,
    storeDetail,
    memberDataSearch,
    calculatedTotal,
    dataBill,
    exchangePointStoreIds,
  ]);

  const _checkBill = useCallback(
    async (currencyId, currencyName) => {
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

      const finalBillAmount =
        totalPoints < (memberDataSearch?.point || 0) && !hasCRM
          ? discountedTotal - (totalPointPrice || 0)
          : discountedTotal;

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
        billAmount: finalBillAmount,
        transferAmount: isDelivery ? 0 : transfer,
        deliveryAmount: isDelivery ? matchRoundNumber(transfer) : 0,
        deliveryName: platform,
        deliveryCode: deliveryCode,
        paymentMethod: isDelivery ? "DELIVERY" : forcus,
        billAmountBefore: calculatedTotal,
        shiftId: shiftCurrent[0]?._id,
        taxAmount: null,
        taxPercent: taxPercent,
        customerId: null,
        userNanme: null,
        saveCafe: true,
        phone: null,
        no: dataBillEdit?.no ? dataBillEdit?.no : bill,
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
        fullnameStaffCheckOut: `${profile.data.firstname || "--"} ${
          profile.data.lastname || "--"
        }`,
        staffCheckOutId: profile.data._id,
        exchangePointStoreId: exchangePointStoreIds,
      };

      if (currencyId !== "LAK") {
        datas.currencyId = currencyId;
        datas.currency = cashCurrency;
        datas.currencyName = currencyName;
      }

      try {
        const response = await axios.post(
          `${END_POINT}/v7/admin/bill-cafe-checkout`,
          { data: datas },
          { headers: await getHeaders() }
        );

        if (response?.status === 200) {
          onPrintBill();
          setSelectedTable();
          getTableDataStore();
          resetFormState();

          if (!storeDetail?.isStatusCafe) {
            await onPrintForCher();
          }

          ClearChangeAmount();
          navigate("/cafe");
        }
      } catch (error) {
        errorAdd("ທ່ານບໍ່ສາມາດ checkBill ໄດ້.....");
        setIsLoading(false);
        onClose();
      }
    },
    [
      setIsLoading,
      onClose,
      calculateReturnAmount,
      dataBill,
      storeDetail,
      tab,
      hasCRM,
      totalPoints,
      memberDataSearch,
      discountedTotal,
      totalPointPrice,
      billId,
      selectedBank,
      statusBill,
      profile,
      cash,
      transfer,
      isDelivery,
      platform,
      deliveryCode,
      forcus,
      calculatedTotal,
      shiftCurrent,
      taxPercent,
      dataBillEdit,
      bill,
      point,
      cashCurrency,
      exchangePointStoreIds,
      onPrintBill,
      setSelectedTable,
      getTableDataStore,
      onPrintForCher,
      ClearChangeAmount,
      navigate,
    ]
  );

  const _checkBillNotPrint = useCallback(async () => {
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

    const finalBillAmount =
      totalPoints < (memberDataSearch?.point || 0) && !hasCRM
        ? discountedTotal - (totalPointPrice || 0)
        : discountedTotal;

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
      billAmount: finalBillAmount,
      transferAmount: isDelivery ? 0 : transfer,
      deliveryAmount: isDelivery ? matchRoundNumber(transfer) : 0,
      deliveryName: platform,
      deliveryCode: deliveryCode,
      paymentMethod: isDelivery ? "DELIVERY" : forcus,
      billAmountBefore: calculatedTotal,
      shiftId: shiftCurrent[0]?._id,
      taxAmount: null,
      taxPercent: taxPercent,
      customerId: null,
      userNanme: null,
      saveCafe: true,
      phone: null,
      no: dataBillEdit?.no ? dataBillEdit?.no : bill,
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
      fullnameStaffCheckOut: `${profile.data.firstname || "--"} ${
        profile.data.lastname || "--"
      }`,
      staffCheckOutId: profile.data._id,
      exchangePointStoreId: exchangePointStoreIds,
    };

    if (selectCurrency?.id !== "LAK") {
      datas.currencyId = selectCurrency?.id;
      datas.currency = cashCurrency;
      datas.currencyName = selectCurrency?.name;
    }

    try {
      const response = await axios.post(
        `${END_POINT}/v7/admin/bill-cafe-checkout`,
        { data: datas },
        { headers: await getHeaders() }
      );

      if (response?.status === 200) {
        resetFormState();
        setSelectedMenus([]);
        setIsLoading(false);
        onQueue();

        if (!storeDetail?.isStatusCafe) {
          await onPrintForCher();
        }

        ClearChangeAmount();

        await Swal.fire({
          icon: "success",
          title: `${t("calculate")}${t("success")}`,
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/cafe");
      }
    } catch (error) {
      errorAdd("ທ່ານບໍ່ສາມາດ checkBill ໄດ້.....");
      setIsLoading(false);
      onClose();
    }
  }, [
    onClose,
    setIsLoading,
    calculateReturnAmount,
    dataBill,
    storeDetail,
    tab,
    hasCRM,
    totalPoints,
    memberDataSearch,
    discountedTotal,
    totalPointPrice,
    billId,
    selectedBank,
    statusBill,
    profile,
    cash,
    transfer,
    isDelivery,
    platform,
    deliveryCode,
    forcus,
    calculatedTotal,
    shiftCurrent,
    taxPercent,
    dataBillEdit,
    bill,
    point,
    selectCurrency,
    cashCurrency,
    exchangePointStoreIds,
    setSelectedMenus,
    onQueue,
    onPrintForCher,
    ClearChangeAmount,
    t,
    navigate,
  ]);

  const handleSubmit = useCallback(async () => {
    const showAlert = (icon, title, text, timer = 1800) => {
      Swal.fire({ icon, title, text, showConfirmButton: false, timer });
    };

    try {
      if (
        storeDetail?.isCRM &&
        tab === "cash_transfer_point" &&
        totalPoints < (memberDataSearch?.point || 0)
      ) {
        try {
          await RedeemPointUser();
        } catch {
          showAlert(
            "error",
            "ເກີດຂໍ້ຜິດພາດ",
            "ການຊຳລະດ້ວຍພ໋ອຍບໍ່ສຳເລັດ ກະລຸນາເລຶອກສະມາຊິກດ້ວຍ"
          );
          return;
        }
      }
      await _checkBill(selectCurrency?.id, selectCurrency?.name);
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      showAlert("error", "ບໍ່ສາມາດເຊັກບິນໄດ້", error.message);
      setIsLoading(false);
    }
  }, [
    storeDetail,
    tab,
    totalPoints,
    memberDataSearch,
    RedeemPointUser,
    _checkBill,
    selectCurrency,
    setIsLoading,
  ]);

  const resetFormState = useCallback(() => {
    setSelectedTable();
    getTableDataStore();
    setCashCurrency();
    setTab("cash");
    setCash();
    setSelectCurrency({ id: "LAK", name: "LAK" });
    setRateCurrency(1);
    setTransfer();
    setShowTotalPointPrice(false);
    setSelectInput("inputCash");
    setHasCRM(false);
    setPlatform("");
    setDeliveryCode("");
    setTextSearchMember("");
    localStorage.removeItem("STAFFCONFIRM_DATA");
    setIsDelivery(false);
    setTotalPointPrice();
    setPoint();
  }, [
    setSelectedTable,
    getTableDataStore,
    setPlatform,
    setDeliveryCode,
    setIsDelivery,
    setTotalPointPrice,
    setPoint,
  ]);

  // Effects
  useEffect(() => {
    if (open) {
      getMembersData();
      getDataCurrency();
      fetchDelivery();
      fetchAllBanks();
    }
  }, [open, getMembersData, getDataCurrency, fetchDelivery, fetchAllBanks]);

  useEffect(() => {
    if (open) {
      setMemberDataSearch();
      setTotalPointPrice();
      setCash();
      setTransfer();
      setTab("cash");
      setSelectInput("inputCash");
      setForcus("CASH");
      setCanCheckOut(false);
      setShowTotalPointPrice(false);
      setDelivery(discountedTotal);
    }
  }, [open, discountedTotal, setTotalPointPrice]);

  useEffect(() => {
    setPaymentMethod(isDelivery ? "DELIVERY" : forcus);
  }, [forcus, isDelivery, setPaymentMethod]);

  useEffect(() => {
    if (open && selectCurrency?.name !== "LAK") {
      const _currencyData = currencyList.find(
        (e) => e.currencyCode === selectCurrency?.name
      );
      setRateCurrency(_currencyData?.buy || 1);
    } else {
      setCashCurrency();
      setCash();
      setRateCurrency(1);
    }
  }, [selectCurrency?.id, selectCurrency?.name, open, currencyList]);

  useEffect(() => {
    if (open && cashCurrency && rateCurrency !== 1) {
      const amount = cashCurrency * rateCurrency;
      setCash(amount);
    }
  }, [rateCurrency, cashCurrency, open]);

  // Sync delivery amount with transfer amount for delivery payments
  useEffect(() => {
    if (isDelivery && transfer) {
      setDelivery(transfer);
    }
  }, [isDelivery, transfer]);

  useEffect(() => {
    if (!open) return;

    const moneyReceived = cashCurrency
      ? Number.parseFloat(cashCurrency) || 0
      : (Number.parseFloat(cash) || 0) + (Number.parseFloat(transfer) || 0);

    const moneyChange = calculateReturnAmount();

    setDataBill((prev) => ({
      ...prev,
      moneyReceived: moneyReceived,
      moneyChange: moneyChange,
      dataStaffConfirm: JSON.parse(localStorage.getItem("STAFFCONFIRM_DATA")),
      paymentMethod: forcus,
    }));

    SetChangeAmount(moneyChange);
  }, [
    cash,
    transfer,
    selectCurrency?.name,
    open,
    cashCurrency,
    calculateReturnAmount,
    forcus,
    setDataBill,
    SetChangeAmount,
  ]);

  // Memoized values
  const totalCashAndTransfer = useMemo(
    () => (Number(cash) || 0) + (Number(transfer) || 0),
    [cash, transfer]
  );

  const isCheckoutDisabled = useMemo(() => {
    // Basic validation
    if (!canCheckOut) {
      console.log("❌ Checkout disabled: canCheckOut is false");
      return true;
    }

    // Delivery specific validations
    if (isDelivery || forcus === "DELIVERY") {
      // Check if platform is selected (only if platforms are available)
      if (platformList.length > 0 && (!platform || platform.length <= 0)) {
        console.log("❌ Checkout disabled: no delivery platform selected");
        return true;
      }

      // For delivery, the transfer amount acts as the delivery amount
      const deliveryAmount = Number(transfer) || Number(delivery) || 0;
      if (deliveryAmount < discountedTotal) {
        console.log("❌ Checkout disabled: delivery amount insufficient", {
          deliveryAmount,
          discountedTotal,
          transfer: Number(transfer),
          delivery: Number(delivery),
        });
        return true;
      }

      console.log("✅ Delivery validation passed");
      return false; // Enable checkout for delivery if all conditions met
    }

    // Special cafe validation only for non-delivery, non-point-only payments
    if (
      storeDetail?.isStatusCafe &&
      !isDelivery &&
      forcus !== "POINT" &&
      forcus !== "DELIVERY"
    ) {
      // Only apply this check for payment methods that rely primarily on cash/transfer
      // For CASH_TRANSFER_POINT, skip this check as points can cover the bill
      if (
        (forcus === "CASH" || forcus === "TRANSFER_CASH") &&
        totalCashAndTransfer < discountedTotal - (totalPointPrice || 0)
      ) {
        console.log("❌ Checkout disabled: cafe validation failed", {
          forcus,
          totalCashAndTransfer,
          required: discountedTotal - (totalPointPrice || 0),
        });
        return true;
      }

      // Special handling for CASH_TRANSFER_POINT: allow if points cover most of the bill
      if (forcus === "CASH_TRANSFER_POINT") {
        const pointAmount = Number(point) || 0;
        const totalPayment = totalCashAndTransfer + pointAmount;
        const effectiveBillAmount = discountedTotal - (totalPointPrice || 0);

        if (totalPayment < effectiveBillAmount) {
          console.log(
            "❌ Checkout disabled: CASH_TRANSFER_POINT insufficient total payment",
            {
              totalPayment,
              effectiveBillAmount,
              breakdown: `cash(${cash}) + transfer(${transfer}) + points(${pointAmount}) = ${totalPayment}`,
            }
          );
          return true;
        }
      }
    }

    console.log("✅ Checkout enabled: all validations passed");
    return false;
  }, [
    canCheckOut,
    isDelivery,
    forcus,
    platform,
    deliveryCode,
    delivery,
    transfer,
    discountedTotal,
    storeDetail,
    totalCashAndTransfer,
    totalPointPrice,
  ]);

  return (
    <Modal
      show={open}
      onHide={() => {
        resetFormState();
        onClose();
        ClearChangeAmount();
      }}
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton />
      <Modal.Body style={{ padding: 0 }}>
        <Box style={{ display: "grid", gridTemplateColumns: "1fr" }}>
          <div style={{ padding: 20 }}>
            {/* Bill Total Display */}
            <div className="mb-[10px] text-[22px] flex gap-3 items-center">
              <span>{t("bill_total")}: </span>
              <span style={{ color: COLOR_APP, fontWeight: "bold" }}>
                {totalPointPrice > 0
                  ? moneyCurrency(discountedTotal - totalPointPrice)
                  : moneyCurrency(discountedTotal)}{" "}
                {storeDetail?.firstCurrency}
              </span>

              {selectCurrency?.name !== "LAK" && (
                <>
                  <span>
                    <BiTransfer />
                  </span>
                  <span style={{ color: COLOR_APP, fontWeight: "bold" }}>
                    {moneyCurrency(discountedTotal / rateCurrency)}{" "}
                    {selectCurrency?.name}
                  </span>
                  <span style={{ fontSize: 14 }}>
                    (ອັດຕາແລກປ່ຽນ: {convertNumber(rateCurrency)})
                  </span>
                </>
              )}
            </div>

            {/* Payment Input Fields */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 10,
              }}
            >
              {/* Currency Input */}
              <InputGroup hidden={selectCurrency?.name === "LAK"}>
                <InputGroup.Text>{selectCurrency?.name}</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="0"
                  value={convertNumber(cashCurrency)}
                  onClick={() => setSelectInput("inputCurrency")}
                  onChange={(e) => onChangeCurrencyInput(e.target.value)}
                  size="lg"
                />
                <InputGroup.Text>{selectCurrency?.name}</InputGroup.Text>
              </InputGroup>

              {/* Cash and Transfer Inputs */}
              <div hidden={tab === "point"} className="flex flex-col gap-2">
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
                    onClick={() => setSelectInput("inputCash")}
                    onChange={(e) => onChangeCashInput(e.target.value)}
                    size="lg"
                  />
                  <InputGroup.Text>
                    {storeDetail?.firstCurrency}
                  </InputGroup.Text>
                </InputGroup>

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
                      value={convertNumber(transfer)}
                      onClick={() => setSelectInput("inputTransfer")}
                      onChange={(e) => onChangeTransferInput(e.target.value)}
                      size="lg"
                    />
                    <InputGroup.Text>
                      {storeDetail?.firstCurrency}
                    </InputGroup.Text>
                  </InputGroup>
                </div>
              </div>

              {/* Delivery Section - Always show when delivery is active */}
              <DeliverySection
                isDelivery={isDelivery}
                forcus={forcus}
                platformList={platformList}
                platform={platform}
                setPlatform={setPlatform}
                deliveryCode={deliveryCode}
                setDeliveryCode={setDeliveryCode}
                selectInput={selectInput}
                setSelectInput={setSelectInput}
                t={t}
                navigate={navigate}
                storeDetail={storeDetail}
              />
            </div>

            {/* Member Search Component */}
            <MemberSearch
              optionsData={optionsData}
              handleSearchInput={handleSearchInput}
              getMembersData={getMembersData}
              memberDataSearch={memberDataSearch}
              point={point}
              t={t}
              hasCRM={hasCRM}
              tab={tab}
              pointsData={pointsData}
              totalPoints={totalPoints}
              totalPointsPrice={totalPointsPrice}
              handleSelectedPoint={handleSelectedPoint}
              selectPoint={selectPoint}
              showTotalPointPrice={showTotalPointPrice}
              totalPointPrice={totalPointPrice}
              storeDetail={storeDetail}
              onChangePointInput={onChangePointInput}
              selectInput={selectInput}
              setSelectInput={setSelectInput}
              language={language}
            />

            {/* Return Amount */}
            <div style={{ marginBottom: 10 }}>
              <div hidden={tab === "point"} style={{ marginBottom: 10 }}>
                {t("return")}: {moneyCurrency(calculateReturnAmount())}{" "}
                {storeDetail?.firstCurrency}
              </div>

              {/* Debug Information - Remove in production
              {(isDelivery || forcus === "DELIVERY") && (
                <div
                  style={{
                    padding: 10,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 5,
                    fontSize: 12,
                    marginBottom: 10,
                  }}
                >
                  <strong>Debug Info (Delivery):</strong>
                  <br />
                  canCheckOut: {canCheckOut ? "✅" : "❌"}
                  <br />
                  isDelivery: {isDelivery ? "✅" : "❌"}
                  <br />
                  forcus: {forcus}
                  <br />
                  platform: "{platform}" {platform ? "✅" : "❌"}
                  <br />
                  transfer: {transfer}
                  <br />
                  discountedTotal: {discountedTotal}
                  <br />
                  platformList.length: {platformList.length}
                </div>
              )}

               Debug Information for CASH_TRANSFER_POINT 
              {forcus === "CASH_TRANSFER_POINT" && (
                <div
                  style={{
                    padding: 10,
                    backgroundColor: "#fff3cd",
                    borderRadius: 5,
                    fontSize: 12,
                    marginBottom: 10,
                    border: "1px solid #ffeaa7",
                  }}
                >
                  <strong>Debug Info (CASH_TRANSFER_POINT):</strong>
                  <br />
                  canCheckOut: {canCheckOut ? "✅" : "❌"}
                  <br />
                  cash: {cash || 0}
                  <br />
                  transfer: {transfer || 0}
                  <br />
                  point: {point || 0}
                  <br />
                  memberPoints: {memberDataSearch?.point || 0}
                  <br />
                  memberName: {memberDataSearch?.name || "None"}
                  <br />
                  memberId: {memberDataSearch?._id ? "✅" : "❌"}
                  <br />
                  discountedTotal: {discountedTotal}
                  <br />
                  totalPoints: {totalPoints}
                  <br />
                  totalPointPrice: {totalPointPrice || 0}
                  <br />
                  totalPayment:{" "}
                  {(Number(cash) || 0) +
                    (Number(transfer) || 0) +
                    (Number(point) || 0)}
                  <br />
                  sufficientPoints:{" "}
                  {(Number(point) || 0) <= (memberDataSearch?.point || 0)
                    ? "✅"
                    : "❌"}
                  <br />
                  sufficientTotal:{" "}
                  {(Number(cash) || 0) +
                    (Number(transfer) || 0) +
                    (Number(point) || 0) >=
                  discountedTotal
                    ? "✅"
                    : "❌"}
                </div>
              )} */}
            </div>

            {/* Payment Method Buttons */}
            <PaymentMethods
              tab={tab}
              isDelivery={isDelivery}
              storeDetail={storeDetail}
              hasCRM={hasCRM}
              t={t}
              onTabChange={onTabChange}
              selectCurrency={selectCurrency}
              currencyList={currencyList}
              handleChangeCurrency={handleChangeCurrency}
              selectedBank={selectedBank}
              banks={banks}
              handleBankChange={handleBankChange}
            />

            {/* Number Keyboard */}
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
              totalBill={discountedTotal}
              payType={tab}
              isDelivery={isDelivery}
              selectInput={(() => {
                switch (selectInput) {
                  case "inputCash":
                    return cash;
                  case "inputTransfer":
                    return transfer;
                  case "inputCurrency":
                    return cashCurrency;
                  case "inputDelivery":
                    return deliveryCode;
                  default:
                    return "";
                }
              })()}
              setSelectInput={(e) => {
                switch (selectInput) {
                  case "inputCash":
                    onChangeCashInput(e);
                    break;
                  case "inputTransfer":
                    onChangeTransferInput(e);
                    break;
                  case "inputDelivery":
                    setDeliveryCode(e);
                    break;
                  case "inputCurrency":
                    onChangeCurrencyInput(e);
                    break;
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
              onClick={handleSubmit}
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
              disabled={isCheckoutDisabled}
            >
              <BiSolidPrinter />
              {t("print_checkbill")}
            </Button>
            <Button
              className="dmd:w-fit w-full"
              onClick={_checkBillNotPrint}
              disabled={isCheckoutDisabled}
            >
              {t("calculate")}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
