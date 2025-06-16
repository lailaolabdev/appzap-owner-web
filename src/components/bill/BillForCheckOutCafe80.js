import { useState, useEffect } from "react";
import { convertImageToBase64, moneyCurrency } from "../../helpers/index";
import moment from "moment";
import { QUERY_CURRENCIES, getLocalData } from "../../constants/api";
import Axios from "axios";
import { URL_PHOTO_AW3 } from "../../constants";
import { Image } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import matchRoundNumber from "./../../helpers/matchRound";
import { convertUnitgramAndKilogram } from "../../helpers/convertUnitgramAndKilogram";
import useDiscountStore from "../../zustand/DiscountMember";

export default function BillForCheckOutCafe80({
  storeDetail,
  data,
  memberData,
  dataBill,
  taxPercent = 0,
  profile,
  dataModal,
  dataBillEdit,
  totalPointPrice,
  point,
  paymentMethod,
  isModalData,
  // discountValue,
  // discountType,
}) {
  // state
  const [total, setTotal] = useState();
  const [currencyData, setCurrencyData] = useState([]);
  const [rateCurrency, setRateCurrency] = useState();
  const { t } = useTranslation();
  const [base64Image, setBase64Image] = useState("");

  const {
    // State selectors
    totalBill,
    discountType,
    discountValue,

    // Calculation function
    calculateDiscountedTotal,
    applyDiscount,
    resetDiscount,
  } = useDiscountStore();

  // useEffect
  useEffect(() => {
    _calculateTotal();
  }, [dataBill, taxPercent]);

  useEffect(() => {
    _calculateTotal();
    getDataCurrency();
  }, []);

  // function
  const _calculateTotal = () => {
    let _total = 0;
    for (let _data of dataBill || []) {
      if (_data?.status !== "CANCELED") {
        const totalOptionPrice = _data?.totalOptionPrice || 0;
        const itemPrice = _data?.price + totalOptionPrice;
        // _total += _data?.totalPrice || (_data?.quantity * itemPrice);
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

    let TotalDiscountFinal = 0;
    if (memberData?.Discount > 0) {
      TotalDiscountFinal = _total - (_total * memberData?.Discount) / 100;
    } else {
      TotalDiscountFinal = _total;
    }
    setTotal(_total);
  };

  const getDataCurrency = async () => {
    try {
      const { DATA } = await getLocalData();
      if (DATA) {
        const data = await Axios.get(
          `${QUERY_CURRENCIES}?storeId=${DATA?.storeId}`
        );
        if (data?.status == 200) {
          setCurrencyData(data?.data?.data);
          const _currencyData = data?.data?.data?.find(
            (e) => e.currencyCode === "THB"
          );
          setRateCurrency(_currencyData?.buy || 1);
        }
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  const imageUrl = URL_PHOTO_AW3 + storeDetail?.image;
  const imageUrl2 = URL_PHOTO_AW3 + storeDetail?.printer?.logo;

  useEffect(() => {
    convertImageToBase64(imageUrl2).then((base64) => {
      // console.log("base64:==>", { base64 });
      setBase64Image(base64);
    });
  }, [imageUrl2]);

  const PointRecive = () => {
    let total;
    if (dataBill) {
      total =
        dataBill?.billAmount < storeDetail?.pointStore
          ? 0
          : Math.floor((dataBill?.billAmount / storeDetail?.pointStore) * 10);
    } else {
      total =
        memberData?.moneyReceived < storeDetail?.pointStore
          ? 0
          : Math.floor(
              (memberData?.moneyReceived / storeDetail?.pointStore) * 10
            );
    }
    return total;
  };

  const totalPercentage = () => {
    let newTotal = total; // Start with the original total
    // console.log("log 1")
    // Both discounts are percentages
    if (discountType === "PERCENT" && discountValue > 0) {
      // console.log("log 2")
      if (discountValue > 0 && memberData?.Discount > 0) {
        // console.log("log 3")
        let totalDiscount =
          parseInt(discountValue) + parseInt(memberData.Discount);

        newTotal = total - (total * totalDiscount) / 100;
      } else {
        newTotal = total - (total * discountValue) / 100 || 0;
      }
    } else if (discountType === "PERCENT" && memberData?.Discount > 0) {
      // console.log("log 4")
      newTotal = total - (total * memberData.Discount) / 100;
    }
    // Fixed amount discount
    else if (discountType === "LAK") {
      console.log("log 5");

      if (memberData?.Discount > 0 && discountValue > 0) {
        console.log("log 5.1");
        newTotal = total - (total * memberData.Discount) / 100;
      }
      console.log("log 6");
      if (discountValue > 0 && discountValue <= total) {
        console.log("log 6.1");
        newTotal = total - discountValue;
      }
    }

    // Prevent negative totals
    if (newTotal < 0) newTotal = 0;
    // console.log("log 7")
    return newTotal;
  };

  // console.log("discountValue", discountValue);
  // console.log("discountType", discountType);
  // console.log("totalPercentage()", totalPercentage())
  // console.log("Member Data", memberData)

  return (
    <div className="p-1 bg-white rounded-lg shadow-md w-[285px] -mr-3">
      <div className="flex flex-col items-center mb-2">
        <span>{t("queue no")}</span>
        <span className="text-lg font-bold">
          {isModalData ? dataModal?.no || dataBillEdit?.no : parseInt(data)}
        </span>
      </div>
      <hr className="border-b border-dashed border-gray-300" />
      <div className="flex justify-center relative">
        <div className="flex items-center gap-2">
          {base64Image && (
            <Image
              className="max-w-[120px] max-h-[120px]"
              src={base64Image}
              alt="logo"
            />
          )}
        </div>
      </div>
      <div className="my-4 text-center font-bold">{storeDetail?.name}</div>
      {/* <div style={{ textAlign: "center" }}>{selectedTable?.tableName}</div> */}
      <div className="flex">
        <div className="text-left text-xs">
          <div className="mb-1">
            {t("phoneNumber")}:{" "}
            <span className="font-bold">{storeDetail?.phone}</span>
          </div>
          <div className="mb-1">
            Whatapp: <span className="font-bold">{storeDetail?.whatsapp}</span>
          </div>
          <div className="mb-1">
            {t("date")}:{" "}
            <span className="font-bold">
              {moment(dataModal?.createdAt).format("DD-MM-YYYY - HH:mm:ss")}
            </span>
          </div>
          <div>
            {t("staffCheckBill")}:{" "}
            <span style={{ fontWeight: "bold" }}>
              {profile?.data?.firstname ?? "-"} {profile?.data?.lastname ?? "-"}
            </span>
          </div>

          {dataBill[0]?.platform?.length > 0 && (
            <>
              <div>
                {t("Delivery")}:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {dataBill[0]?.platform}
                  {dataBill[0]?.deliveryCode
                    ? ` (${dataBill[0]?.deliveryCode})`
                    : ""}
                </span>
              </div>
            </>
          )}

          {memberData?.Name && memberData?.Point ? (
            <>
              <div>
                {t("ctm_tel")}: {""}
                <span style={{ fontWeight: "bold" }}>
                  {memberData?.memberPhone
                    ? `${memberData?.memberPhone} (${t(
                        "point"
                      )} : ${moneyCurrency(
                        Number(memberData?.Point || 0) -
                          Number(storeDetail?.point || 0)
                      )})`
                    : ""}
                </span>
              </div>
              <div className="flex gap-2">
                <span>
                  {t("recive_point")}: {""}
                  <span style={{ fontWeight: "bold" }}>
                    {` ( ${moneyCurrency(PointRecive())})`}
                  </span>
                </span>
                {","}
                <span>
                  {t("used_point")}: {""}
                  <span style={{ fontWeight: "bold" }}>
                    {` ( ${moneyCurrency(storeDetail?.point)})`}
                  </span>
                </span>
              </div>
            </>
          ) : dataModal?.memberId ? (
            <>
              <div>
                {t("ctm_tel")}: {""}
                <span style={{ fontWeight: "bold" }}>
                  {dataModal?.memberId?.phone
                    ? `${dataModal?.memberId?.phone} (${t(
                        "point"
                      )} : ${moneyCurrency(
                        Number(dataModal?.memberId?.point || 0)
                      )})`
                    : ""}
                </span>
              </div>
              <div className="flex gap-2">
                <span>
                  {t("recive_point")}: {""}
                  <span style={{ fontWeight: "bold" }}>
                    {` ( ${moneyCurrency(PointRecive())})`}
                  </span>
                </span>
                {","}
                <span>
                  {t("used_point")}: {""}
                  <span style={{ fontWeight: "bold" }}>
                    {` ( ${moneyCurrency(storeDetail?.point)})`}
                  </span>
                </span>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="flex-grow" />
      </div>
      <hr className="border-b border-dashed border-gray-600" />
      <div className="grid grid-cols-5 mb-1 mt-[-15px] text-xs">
        <div className="text-left">ລຳດັບ</div>
        <div className="text-left -ml-5">{t("list")}</div>
        <div className="text-center ml-8">{t("amount")}</div>
        <div className="text-right">{t("price")}</div>
        <div className="text-right">{t("total")}</div>
      </div>
      <hr className="border-b border-dashed border-gray-600" />
      <div className="flex flex-col gap-2 text-xs">
        {dataBill?.map((item, index) => {
          if (item?.status === "CANCELED") return null;
          const optionsNames =
            item?.options
              ?.map((option) =>
                option.quantity > 1
                  ? `[${option.quantity} x ${option.name}]`
                  : `[${option.name}]`
              )
              .join("") || "";
          const totalOptionPrice = item?.totalOptionPrice || 0;
          const itemPrice = item?.price + totalOptionPrice;
          const itemTotal = item?.isWeightMenu
            ? item?.unitWeightMenu === "g"
              ? itemPrice * convertUnitgramAndKilogram(item?.quantity)
              : itemPrice * item?.quantity
            : itemPrice * item?.quantity;

          return (
            <div className="grid grid-cols-5 gap-2" key={index}>
              <div className="text-left">{index + 1}</div>
              <div className="text-left -ml-5 w-24">
                {item?.name} {optionsNames}
              </div>
              <div className="text-center">
                {item?.isWeightMenu
                  ? `${item?.quantity} /${item?.unitWeightMenu}`
                  : item?.quantity}
              </div>
              <div className="text-right">
                {itemPrice ? moneyCurrency(itemPrice) : "-"}
              </div>
              <div className="text-right">
                {itemTotal ? moneyCurrency(itemTotal) : "-"}
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-2.5"></div>
      <hr className="border-b border-dashed border-gray-600" />
      <div className="w-full flex justify-between text-sm font-thin">
        <div className="w-full flex justify-end items-center">
          {t("price_basic")} :{" "}
        </div>

        <div
          className={`${
            point > 0 ? "w-[90%]" : "w-[60%]"
          } flex justify-end items-center`}
        >
          {`${moneyCurrency(total)}`} {storeDetail?.firstCurrency}
        </div>
      </div>
      <div className="w-full flex justify-between text-sm font-thin">
        <div className="w-full flex justify-end items-center">
          {t("discount_of_bill")} :{" "}
        </div>

        <div
          className={`${
            point > 0 ? "w-[90%]" : "w-[60%]"
          } flex justify-end items-center`}
        >
          {moneyCurrency(discountValue)}{" "}
          {discountType === "PERCENT" ? "%" : storeDetail?.firstCurrency}
        </div>
      </div>
      {dataModal?.discount > 0 ? (
        <div className="mb-2">
          {dataModal?.discount > 0 && (
            <>
              <div className="w-full flex justify-between text-sm font-thin">
                <div className="w-full flex justify-end items-center">
                  {t("discount_of_bill")} :
                </div>

                <div
                  className={`${
                    point > 0 ? "w-[90%]" : "w-[60%]"
                  } flex justify-end items-center`}
                >
                  {`${moneyCurrency(dataModal?.billAmountBefore)}`}{" "}
                  {storeDetail?.firstCurrency}
                </div>
              </div>
              <div className="w-full flex justify-between text-sm font-thin">
                <div
                  className={`${
                    point > 0 ? "w-[90%]" : "w-[60%]"
                  } flex justify-end items-center`}
                >
                  {t("member_discount")} :
                </div>

                <div
                  className={`${
                    point > 0 ? "w-[90%]" : "w-[60%]"
                  } flex justify-end items-center`}
                >
                  {`${moneyCurrency(dataModal?.discount)}%`}
                </div>
              </div>
            </>
          )}
          <div className="w-full flex justify-between text-[14px] font-thin">
            <div className="w-[60%] flex justify-end items-center">
              {t("totalAmount")} :{" "}
            </div>

            <div className="w-[60%] flex justify-end items-center">
              {moneyCurrency(matchRoundNumber(dataModal?.payAmount))}{" "}
              {storeDetail?.firstCurrency}
            </div>
          </div>
          <div className="w-full flex justify-between text-[14px] font-thin">
            <div
              className={`${
                point > 0 ? "w-[90%]" : "w-[60%]"
              } flex justify-end items-center`}
            >
              {t("change")} :{" "}
            </div>

            <div
              className={`${
                point > 0 ? "w-[90%]" : "w-[60%]"
              } flex justify-end items-center`}
            >
              {moneyCurrency(dataModal?.change)} {storeDetail?.firstCurrency}
            </div>
          </div>
          {dataModal?.discount > 0 ? (
            <div className="w-full flex justify-between text-[16px] font-bold">
              <div
                className={`${
                  point > 0 ? "w-[90%]" : "w-[60%]"
                } flex justify-end items-center`}
              >
                {t("totals")} :{" "}
              </div>
              <div
                className={`${
                  point > 0 ? "w-[90%]" : "w-[60%]"
                } flex justify-end items-center`}
              >
                {moneyCurrency(
                  (dataModal?.billAmountBefore * dataModal?.discount) / 100
                )}{" "}
                {storeDetail?.firstCurrency}
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-between text-[16px] font-bold">
              <div
                className={`${
                  point > 0 ? "w-[90%]" : "w-[60%]"
                } flex justify-end items-center`}
              >
                {t("totals")} :{" "}
              </div>
              <div
                className={`${
                  point > 0 ? "w-[90%]" : "w-[60%]"
                } flex justify-end items-center`}
              >
                {moneyCurrency(total)} {storeDetail?.firstCurrency}
              </div>
            </div>
          )}
        </div>
      ) : dataBillEdit?.discount > 0 ? (
        <div className="mb-2">
          {dataBillEdit?.discount > 0 && (
            <>
              <div className="w-full flex justify-between text-[14px] font-thin">
                <div
                  className={`${
                    point > 0 ? "w-[90%]" : "w-[60%]"
                  } flex justify-end items-center`}
                >
                  {t("price_basic")} :{" "}
                </div>

                <div
                  className={`${
                    point > 0 ? "w-[90%]" : "w-[60%]"
                  } flex justify-end items-center`}
                >
                  {`${moneyCurrency(dataBillEdit?.billAmountBefore)}`}{" "}
                  {storeDetail?.firstCurrency}
                </div>
              </div>
              <div className="w-full flex justify-between text-[14px] font-thin">
                <div
                  className={`${
                    point > 0 ? "w-[90%]" : "w-[60%]"
                  } flex justify-end items-center`}
                >
                  {t("member_discount")} :{" "}
                </div>

                <div
                  className={`${
                    point > 0 ? "w-[90%]" : "w-[60%]"
                  } flex justify-end items-center`}
                >
                  {`${moneyCurrency(dataBillEdit?.discount)}%`}{" "}
                </div>
              </div>
            </>
          )}
          <div className="w-full flex justify-between text-[14px] font-thin">
            <div
              className={`${
                point > 0 ? "w-[90%]" : "w-[60%]"
              } flex justify-end items-center`}
            >
              {t("totalAmount")} :{" "}
            </div>

            <div
              className={`${
                point > 0 ? "w-[90%]" : "w-[60%]"
              } flex justify-end items-center`}
            >
              {moneyCurrency(matchRoundNumber(dataBillEdit?.payAmount))}{" "}
              {storeDetail?.firstCurrency}
            </div>
          </div>
          <div className="w-full flex justify-between text-[14px] font-thin">
            <div
              className={`${
                point > 0 ? "w-[90%]" : "w-[60%]"
              } flex justify-end items-center`}
            >
              {t("change")} :{" "}
            </div>

            <div
              className={`${
                point > 0 ? "w-[90%]" : "w-[60%]"
              } flex justify-end items-center`}
            >
              {moneyCurrency(dataBillEdit?.change)} {storeDetail?.firstCurrency}
            </div>
          </div>
          {dataBillEdit?.discount > 0 ? (
            <div className="w-full flex justify-between text-[16px] font-bold">
              <div
                className={`${
                  point > 0 ? "w-[90%]" : "w-[60%]"
                } flex justify-end items-center`}
              >
                {t("totals")} :{" "}
              </div>
              <div
                className={`${
                  point > 0 ? "w-[90%]" : "w-[60%]"
                } flex justify-end items-center`}
              >
                {moneyCurrency(
                  (dataBillEdit?.billAmountBefore * dataBillEdit?.discount) /
                    100
                )}{" "}
                {storeDetail?.firstCurrency}
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-between text-[16px] font-bold">
              <div
                className={`${
                  point > 0 ? "w-[90%]" : "w-[60%]"
                } flex justify-end items-center`}
              >
                {t("totals")} :{" "}
              </div>
              <div
                className={`${
                  point > 0 ? "w-[90%]" : "w-[60%]"
                } flex justify-end items-center`}
              >
                {moneyCurrency(total)} {storeDetail?.firstCurrency}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`mb-2`}>
          {memberData?.Discount > 0 && (
            <>
              <div className="w-full flex justify-between text-sm font-thin">
                <div className="w-full flex justify-end items-center">
                  {t("member_discount")} :{" "}
                </div>

                <div
                  className={`${
                    point > 0 ? "w-[90%]" : "w-[60%]"
                  } flex justify-end items-center`}
                >
                  {`${moneyCurrency(memberData?.Discount)}%`}{" "}
                </div>
              </div>
            </>
          )}

          <div className="w-full flex justify-between text-sm font-thin">
            <div className="w-full flex justify-end items-center">
              {t("totalAmount")} :{" "}
            </div>

            <div
              className={`${
                point > 0 ? "w-[90%]" : "w-[60%]"
              } flex justify-end items-center`}
            >
              {moneyCurrency(matchRoundNumber(memberData?.moneyReceived))}{" "}
              {storeDetail?.firstCurrency}
            </div>
          </div>

          <div className="w-full flex justify-between text-sm font-thin">
            <div className="w-full flex justify-end items-center">
              {t("change")} :{" "}
            </div>

            <div
              className={`${
                point > 0 ? "w-[90%]" : "w-[60%]"
              } flex justify-end items-center`}
            >
              {moneyCurrency(memberData?.moneyChange)}{" "}
              {storeDetail?.firstCurrency}
            </div>
          </div>
          {storeDetail?.isStatusCafe &&
            paymentMethod === "CASH_TRANSFER_POINT" && (
              <>
                <div className="w-full flex justify-between text-xs font-thin">
                  <div className="w-full flex justify-end items-center">
                    {t("ຍອດລວມແລກພ໋ອຍ")} :
                  </div>

                  <div
                    className={`${
                      point > 0 ? "w-[90%]" : "w-[60%]"
                    } flex justify-end items-center gap-1`}
                  >
                    <span>{moneyCurrency(point)}</span>
                    <span>{t("point")}</span> =
                    <span>
                      {moneyCurrency(totalPointPrice)}
                      {` ${storeDetail?.firstCurrency}`}
                    </span>
                  </div>
                </div>
              </>
            )}

          <div className="w-full flex justify-between text-[16px] font-bold">
            <div className="w-full flex justify-end items-center">
              {t("totals")} :{" "}
            </div>
            <div
              className={`${
                point > 0 ? "w-[90%]" : "w-[60%]"
              } flex justify-end items-center`}
            >
              {moneyCurrency(
                paymentMethod === "CASH_TRANSFER_POINT"
                  ? total - totalPointPrice
                  : applyDiscount() || 0
              )}{" "}
              {storeDetail?.firstCurrency}
            </div>
          </div>
        </div>
      )}
      {storeDetail?.printer?.qr && (
        <>
          <hr className="border-b my-3 border-dashed border-gray-600" />
        </>
      )}
      <div
        className={`flex justify-center  ${
          storeDetail?.printer?.qr ? "" : "hidden"
        }`}
      >
        <img
          src={`https://app-api.appzap.la/qr-gennerate/qr?data=${storeDetail?.printer?.qr}`}
          className="w-56 h-56 m-[-15px] border-dashed border-gray-600"
          alt="QR Code"
        />
      </div>
      {storeDetail?.isStatusCafe && (
        <hr className="border-b border-dashed border-gray-600" />
      )}
      {storeDetail?.isStatusCafe && (
        <div className="text-center text-[13px] font-thin">
          {/* LOVE LIFE DRINK Ai-CHA */}
          {`${storeDetail?.textForBill}`}
        </div>
      )}
      {storeDetail?.textForBill?.trim().length > 0 &&
        !storeDetail?.isStatusCafe && (
          <div>
            <div className="text-center text-[12px] font-thin">
              {`(${storeDetail?.textForBill})`}
            </div>
          </div>
        )}
    </div>
  );
}

// Styled components have been replaced with Tailwind classes
