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

export default function BillForCheckOutCafe80({
  storeDetail,
  data,
  selectedTable,
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

  // console.log("storeDetail",storeDetail)
  // console.log("profile",profile)
  // console.log("dataBill", dataBill);

  // useEffect
  useEffect(() => {
    _calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // console.log("🚀 ~ file: BillForCheckOutCafe80.js:20 ~ dataBill:", dataBill);
    // console.log("currencyData: ", currencyData);
  }, [dataBill, taxPercent]);

  useEffect(() => {
    _calculateTotal();
    getDataCurrency();
  }, []);

  // function
  const _calculateTotal = () => {
    let _total = 0;
    for (let _data of dataBill || []) {
      const totalOptionPrice = _data?.totalOptionPrice || 0;
      const itemPrice = _data?.price + totalOptionPrice;
      // _total += _data?.totalPrice || (_data?.quantity * itemPrice);
      _total += _data?.quantity * itemPrice;
    }
    setTotal(_total);
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

  return (
    <div className="p-1 bg-white rounded-lg shadow-md w-[285px] ml-[-12px]">
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
        </div>
        <span className="text-[18px] font-bold absolute top-8 right-4">
          No {data || 0}
        </span>
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
          const itemTotal = itemPrice * item?.quantity;
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
              <div style={{ textAlign: "center" }}>{item?.quantity}</div>
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
      <div className="text-[16px] font-bold mb-2">
        <div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {t("total")} :{" "}
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
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 10,
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
