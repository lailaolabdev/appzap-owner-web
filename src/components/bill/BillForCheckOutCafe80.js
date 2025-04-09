import styled from "styled-components";
import React, { useState, useEffect, useRef } from "react";
import { convertImageToBase64, moneyCurrency } from "../../helpers/index";
import moment from "moment";
import {
  QUERY_CURRENCIES,
  getLocalData,
  getLocalDataCustomer,
} from "../../constants/api";
import Axios from "axios";
import QRCode from "react-qr-code";
import { EMPTY_LOGO, URL_PHOTO_AW3 } from "../../constants";
import { Image, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useTranslation } from "react-i18next";
// import emptyLogo from "/public/images/emptyLogo.jpeg";
import matchRoundNumber from "./../../helpers/matchRound";
import { convertUnitgramAndKilogram } from "../../helpers/convertUnitgramAndKilogram";

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
  paymentMethod
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
    setTotalAfterDiscount(matchRoundNumber(TotalDiscountFinal));
    setTaxAmount((_total * taxPercent) / 100);
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

  return (
    <div className="p-1 bg-white rounded-lg shadow-md w-[285px] mr-[-12px]">
      <div className="flex flex-col mb-2 items-center ">
        <span className="">{t("queue no")}</span>
        <span className="text-[18px] font-bold">{data || 0}</span>
      </div>
      <hr className="border-b border-dashed border-gray-600" />
      <div className=" flex justify-center relative">
        <div className="flex gap-2 items-center">
          {base64Image ? (
            <Image
              style={{
                maxWidth: 120,
                maxHeight: 120,
              }}
              src={base64Image}
              alt="logo"
            />
          ) : (
            ""
          )}
          {/* <span
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            Queue No {data || 0}
          </span> */}
        </div>
        {/* <span className="text-[18px] font-bold absolute top-[-60px] right-[115px]">
          <span className="flex flex-col gap-2 items-center">
            {t("queue no")}
            <br />
            {data || 0}
          </span>
        </span> */}
      </div>
      <div className="text-center font-bold my-4">{storeDetail?.name}</div>
      {/* <div style={{ textAlign: "center" }}>{selectedTable?.tableName}</div> */}
      <Price>
        <div style={{ textAlign: "left", fontSize: 12 }}>
          <div className="mb-1">
            {t("phoneNumber")}: {""}
            <span style={{ fontWeight: "bold" }}>{storeDetail?.phone}</span>
          </div>
          <div className="mb-1">
            Whatapp:{" "}
            <span style={{ fontWeight: "bold" }}>{storeDetail?.whatsapp}</span>
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
        <div style={{ flexGrow: 1 }} />
      </Price>
      <hr className="border-b border-dashed border-gray-600" />
      <Name style={{ marginBottom: 5, fontSize: 12 }}>
        <div style={{ textAlign: "left" }}>ລຳດັບ </div>
        <div style={{ textAlign: "left", marginLeft: "-20px" }}>
          {t("list")}{" "}
        </div>
        <div style={{ textAlign: "center", marginLeft: "2rem" }}>
          {t("amount")}
        </div>
        <div style={{ textAlign: "right" }}>{t("price")}</div>
        <div style={{ textAlign: "right" }}>{t("total")}</div>
      </Name>
      <hr className="border-b border-dashed border-gray-600" />
      <Order>
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
            ? item?.unitWeightMenu === "g"
              ? itemPrice * convertUnitgramAndKilogram(item?.quantity)
              : itemPrice * item?.quantity
            : itemPrice * item?.quantity;
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                fontSize: 12,
              }}
              key={index}
            >
              <div style={{ textAlign: "left" }}>{index + 1}</div>
              <div
                style={{
                  textAlign: "left",
                  marginLeft: "-20px",
                  width: "6rem",
                }}
              >
                {item?.name} {optionsNames}
              </div>
              <div style={{ textAlign: "center" }}>
                {item?.isWeightMenu
                  ? `${item?.quantity} /${item?.unitWeightMenu}`
                  : item?.quantity}
              </div>
              <div style={{ textAlign: "right" }}>
                {itemPrice ? moneyCurrency(itemPrice) : "-"}
              </div>
              <div style={{ textAlign: "right" }}>
                {itemTotal ? moneyCurrency(itemTotal) : "-"}
              </div>
            </div>
          );
        })}
      </Order>
      <div style={{ height: 10 }} />
      <hr className="border-b border-dashed border-gray-600" />
      {dataModal?.discount > 0 ? (
        <div className="mb-2">
          {dataModal?.discount > 0 && (
            <>
              <div className="w-full flex justify-between text-[14px] font-thin">
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {t("price_basic")} :{" "}
                </div>

                <div
                  style={{
                    width: "60%",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {`${moneyCurrency(dataModal?.billAmountBefore)}`}{" "}
                  {storeDetail?.firstCurrency}
                </div>
              </div>
              <div className="w-full flex justify-between text-[14px] font-thin">
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {t("member_discount")} :{" "}
                </div>

                <div
                  style={{
                    width: "60%",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {`${moneyCurrency(dataModal?.discount)}%`}{" "}
                </div>
              </div>
            </>
          )}
          <div className="w-full flex justify-between text-[14px] font-thin">
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {t("totalAmount")} :{" "}
            </div>

            <div
              style={{
                width: "60%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {moneyCurrency(matchRoundNumber(dataModal?.payAmount))}{" "}
              {storeDetail?.firstCurrency}
            </div>
          </div>
          <div className="w-full flex justify-between text-[14px] font-thin">
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {t("change")} :{" "}
            </div>

            <div
              style={{
                width: "60%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {moneyCurrency(dataModal?.change)} {storeDetail?.firstCurrency}
            </div>
          </div>
          {dataModal?.discount > 0 ? (
            <div className="w-full flex justify-between text-[16px] font-bold">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {t("totals")} :{" "}
              </div>
              <div
                style={{
                  width: "60%",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
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
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {t("totals")} :{" "}
              </div>
              <div
                style={{
                  width: "60%",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
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
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {t("price_basic")} :{" "}
                </div>

                <div
                  style={{
                    width: "60%",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {`${moneyCurrency(dataBillEdit?.billAmountBefore)}`}{" "}
                  {storeDetail?.firstCurrency}
                </div>
              </div>
              <div className="w-full flex justify-between text-[14px] font-thin">
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {t("member_discount")} :{" "}
                </div>

                <div
                  style={{
                    width: "60%",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {`${moneyCurrency(dataBillEdit?.discount)}%`}{" "}
                </div>
              </div>
            </>
          )}
          <div className="w-full flex justify-between text-[14px] font-thin">
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {t("totalAmount")} :{" "}
            </div>

            <div
              style={{
                width: "60%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {moneyCurrency(matchRoundNumber(dataBillEdit?.payAmount))}{" "}
              {storeDetail?.firstCurrency}
            </div>
          </div>
          <div className="w-full flex justify-between text-[14px] font-thin">
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {t("change")} :{" "}
            </div>

            <div
              style={{
                width: "60%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {moneyCurrency(dataBillEdit?.change)} {storeDetail?.firstCurrency}
            </div>
          </div>
          {dataBillEdit?.discount > 0 ? (
            <div className="w-full flex justify-between text-[16px] font-bold">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {t("totals")} :{" "}
              </div>
              <div
                style={{
                  width: "60%",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
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
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {t("totals")} :{" "}
              </div>
              <div
                style={{
                  width: "60%",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {moneyCurrency(total)} {storeDetail?.firstCurrency}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`mb-2` }>
          {memberData?.Discount > 0 && (
            <>
              <div className="w-full flex justify-between text-[14px] font-thin">
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {t("price_basic")} :{" "}
                </div>

                <div
                  style={{
                    width: (point > 0 ? "90%" : "60%"),
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {`${moneyCurrency(total)}`} {storeDetail?.firstCurrency}
                </div>
              </div>
              <div className="w-full flex justify-between text-[14px] font-thin">
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {t("member_discount")} :{" "}
                </div>

                <div
                  style={{
                    width: (point > 0 ? "90%" : "60%"),
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {`${moneyCurrency(memberData?.Discount)}%`}{" "}
                </div>
              </div>
            </>
          )}
          <div className="w-full flex justify-between text-[14px] font-thin">
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {t("totalAmount")} :{" "}
            </div>

            <div
              style={{
                width: (point > 0 ? "90%" : "60%"),
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {moneyCurrency(matchRoundNumber(memberData?.moneyReceived))}{" "}
              {storeDetail?.firstCurrency}
            </div>
          </div>
          <div className="w-full flex justify-between text-[14px] font-thin">
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {t("change")} :{" "}
            </div>

            <div
              style={{
                width: (point > 0 ? "90%" : "60%"),
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {moneyCurrency(memberData?.moneyChange)}{" "}
              {storeDetail?.firstCurrency}
            </div>
          </div>
          {(storeDetail?.isStatusCafe && paymentMethod === "CASH_TRANSFER_POINT") &&
            (<>
              <div className="w-full flex justify-between text-[12px] font-thin">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {t("ຍອດລວມແລກພ໋ອຍ")} :{" "}
              </div>

              <div
                style={{
                  width: (point > 0 ? "90%" : "60%"),
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                <span>{moneyCurrency(point)}{" "}
                </span><span>{t("point")}</span> =
                <span>{moneyCurrency(totalPointPrice)}{" "}
                {storeDetail?.firstCurrency}</span>
                
              </div>
            </div>
            </>)}
          {memberData?.Discount > 0 ? (
            <div className="w-full flex justify-between text-[16px] font-bold">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {t("totals")} :{" "}
              </div>
              <div
                style={{
                  width: (point > 0 ? "90%" : "60%"),
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {moneyCurrency(total - (total * memberData?.Discount) / 100)}{" "}
                {storeDetail?.firstCurrency}
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-between text-[16px] font-bold">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {t("totals")} :{" "}
              </div>
              <div
                style={{
                  width: (point > 0 ? "90%" : "60%"),
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {moneyCurrency(paymentMethod === "CASH_TRANSFER_POINT" ? total - totalPointPrice : total)} {storeDetail?.firstCurrency}
              </div>
            </div>
          )}
        </div>
      )}
      {
        storeDetail?.printer?.qr &&
        <>
            <div style={{ height: 10 }} />
            <hr className="border-b border-dashed border-gray-600" />
        </>
      }
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 10,
          paddingLeft : 25
        }}
        hidden={storeDetail?.printer?.qr ? false : true}
      >
        <Img>
          <img
            src={`https://app-api.appzap.la/qr-gennerate/qr?data=${storeDetail?.printer?.qr}`}
            style={{ wifth: "100%", height: "100%" }}
            alt=""
          />
        </Img>
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
}

const Name = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
`;
const Price = styled.div`
  display: flex;
`;
// const Container = styled.div`
//   margin: 10px;
//   width: 100%;
//   margin-left: -8px;
//   /* maxwidth: 80mm; */
// `;
const Img = styled.div`
  width: 200px;
  height: 200px;
  font-size: 14px;
  border: 2px dotted #000;
`;
const Order = styled.div`
  display: flex;
  flex-direction: column;
`;
