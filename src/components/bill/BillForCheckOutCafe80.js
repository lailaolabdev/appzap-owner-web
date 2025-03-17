import styled from "styled-components";
import React, { useState, useEffect, useRef } from "react";
import { convertImageToBase64, moneyCurrency } from "../../helpers/index";
import moment from "moment";
import { QUERY_CURRENCIES, getLocalData } from "../../constants/api";
import Axios from "axios";
import { EMPTY_LOGO, URL_PHOTO_AW3 } from "../../constants";
import { useTranslation } from "react-i18next";
// import emptyLogo from "/public/images/emptyLogo.jpeg";
import matchRoundNumber from "./../../helpers/matchRound";
import { convertkgToG } from "../../helpers/convertKgToG";

export default function BillForCheckOutCafe80({
  storeDetail,
  data,
  memberData,
  dataBill,
  taxPercent = 0,
  profile,
}) {
  // state
  const [total, setTotal] = useState();
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState();
  const [currencyData, setCurrencyData] = useState([]);
  const [rateCurrency, setRateCurrency] = useState();
  const { t } = useTranslation();
  const [base64Image, setBase64Image] = useState("");

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
          _total += convertkgToG(_data?.quantity) * itemPrice;
        } else {
          _total += _data?.quantity * itemPrice;
        }
      }

      let TotalDiscountFinal = 0;
      if (memberData?.Discount > 0) {
        TotalDiscountFinal = _total - (_total * memberData?.Discount) / 100;
      } else {
        TotalDiscountFinal = _total;
      }
      setTotal(_total);
      setTotalAfterDiscount(matchRoundNumber(TotalDiscountFinal));
      setTaxAmount((_total * taxPercent) / 100);
    }

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
      const total =
        memberData?.moneyReceived < storeDetail?.pointStore
          ? 0
          : Math.floor(
              (memberData?.moneyReceived / storeDetail?.pointStore) * 10
            );

      return total;
    };

    return (
      <div className="p-1 bg-white rounded-lg shadow-md w-[285px] ml-[-12px]">
        <div className="flex flex-col mb-2 items-center ">
          <span className="">{t("queue no")}</span>
          <span className="text-[18px] font-bold">{data || 0}</span>
        </div>
        <hr className="border-b border-dashed border-gray-600" />
        <div className=" flex justify-center relative">
          <div className="flex gap-2 items-center">
            {base64Image ? (
              <img
                className="max-w-[120px] max-h-[120px]"
                src={base64Image}
                alt="logo"
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="text-center font-bold my-4">{storeDetail?.name}</div>

        <div className="flex">
          <div style={{ textAlign: "left", fontSize: 12 }}>
            <div className="mb-1">
              {t("phoneNumber")}: {""}
              <span style={{ fontWeight: "bold" }}>{storeDetail?.phone}</span>
            </div>
            <div className="mb-1">
              Whatapp:{" "}
              <span style={{ fontWeight: "bold" }}>
                {storeDetail?.whatsapp}
              </span>
            </div>
            <div className="mb-1">
              {t("date")}:{" "}
              <span style={{ fontWeight: "bold" }}>
                {moment(dataBill?.createdAt).format("DD-MM-YYYY - HH:mm:ss")}
              </span>
            </div>
            <div>
              {t("staffCheckBill")}:{" "}
              <span style={{ fontWeight: "bold" }}>
                {profile?.data?.firstname ?? "-"}{" "}
                {profile?.data?.lastname ?? "-"}
              </span>
            </div>
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
            ) : (
              ""
            )}
          </div>
          <div style={{ flexGrow: 1 }} />
        </div>
        <hr className="border-b border-dashed border-gray-600" />
        <div
          className="grid grid-cols-5 mb-[5px] text-[12px]"
          style={{ marginBottom: 5, fontSize: 12 }}
        >
          <div className="text-left">ລຳດັບ </div>
          <div className="text-left ml-[-20px]">{t("list")} </div>
          <div className="text-center ml-[20px]">{t("amount")}</div>
          <div className="text-right">{t("price")}</div>
          <div className="text-right">{t("total")}</div>
        </div>
        <hr className="border-b border-dashed border-gray-600" />
        <div className="flex flex-col">
          {dataBill?.map((item, index) => {
            if (item?.status === "CANCELED") return;
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
            // const itemTotal = item?.totalPrice || (itemPrice * item?.quantity);
            const itemTotal = item?.isWeightMenu
              ? itemPrice * convertkgToG(item?.quantity)
              : itemPrice * item?.quantity;

            return (
              <div className="grid grid-cols-5 text-[12px]" key={index}>
                <div className="text-left">{index + 1}</div>
                <div className="text-left ml-[-20px] w-[60rem]">
                  {item?.name} {optionsNames}
                </div>
                <div className="text-right">
                  {item?.isWeightMenu
                    ? convertkgToG(item?.quantity)
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
        <div style={{ height: 10 }} />
        <hr className="border-b border-dashed border-gray-600" />
        <div className="mb-2">
          {memberData?.Discount > 0 && (
            <>
              <div className="w-full flex justify-between text-[14px] font-thin">
                <div className="w-full flex justify-end items-center">
                  {t("price_basic")} :{" "}
                </div>

                <div className="w-[60%] flex justify-end items-center">
                  {`${moneyCurrency(total)}`} {storeDetail?.firstCurrency}
                </div>
              </div>
              <div className="w-full flex justify-between text-[14px] font-thin">
                <div className="w-full flex justify-end items-center">
                  {t("member_discount")} :{" "}
                </div>

                <div className="w-[60%] flex justify-end items-center">
                  {`${moneyCurrency(memberData?.Discount)}%`}{" "}
                </div>
              </div>
            </>
          )}
          <div className="w-full flex justify-between text-[14px] font-thin">
            <div className="w-full flex justify-end items-center">
              {t("totalAmount")} :{" "}
            </div>

            <div className="w-[60%] flex justify-end items-center">
              {moneyCurrency(matchRoundNumber(memberData?.moneyReceived))}{" "}
              {storeDetail?.firstCurrency}
            </div>
          </div>
          <div className="w-full flex justify-between text-[14px] font-thin">
            <div className="w-full flex justify-end items-center">
              {t("change")} :{" "}
            </div>

            <div className="w-[60%] flex justify-end items-center">
              {moneyCurrency(memberData?.moneyChange)}{" "}
              {storeDetail?.firstCurrency}
            </div>
          </div>
          {memberData?.Discount > 0 ? (
            <div className="w-full flex justify-between text-[16px] font-bold">
              <div className="w-full flex justify-end items-center">
                {t("totals")} :{" "}
              </div>
              <div className="w-[60%] flex justify-end items-center">
                {moneyCurrency(totalAfterDiscount)} {storeDetail?.firstCurrency}
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-between text-[16px] font-bold">
              <div className="w-full flex justify-end items-center">
                {t("totals")} :{" "}
              </div>
              <div className="w-[60%] flex justify-end items-center">
                {moneyCurrency(total)} {storeDetail?.firstCurrency}
              </div>
            </div>
          )}
        </div>

        <div
          className="flex justify-center p-[10px]"
          hidden={storeDetail?.printer?.qr ? false : true}
        >
          <div className="w-[200px] h-[200px] text-[14px] border border-black border-dashed">
            <img
              src={`https://app-api.appzap.la/qr-gennerate/qr?data=${storeDetail?.printer?.qr}`}
              style={{ wifth: "100%", height: "100%" }}
              alt=""
            />
          </div>
        </div>
        {storeDetail?.isStatusCafe && (
          <hr className="border-b border-dashed border-gray-600" />
        )}
        {storeDetail?.isStatusCafe && (
          <div className="text-center text-[12px] font-thin">
            LOVE LIFE DRINK Ai-CHA
          </div>
        )}
        {storeDetail?.textForBill?.trim().length > 0 && (
          <div>
            <div className="text-center text-[12px] font-thin">
              {`(${storeDetail?.textForBill})`}
            </div>
          </div>
        )}
      </div>
    );
  };
}
