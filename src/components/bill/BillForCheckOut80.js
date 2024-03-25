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
import { Image } from "react-bootstrap";
import axios from "axios";
import { useTranslation } from "react-i18next";
// import emptyLogo from "/public/images/emptyLogo.jpeg";

export default function BillForCheckOut80({
  storeDetail,
  selectedTable,
  dataBill,
  taxPercent = 0,
}) {
  // state
  const [total, setTotal] = useState();
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState();
  const [currencyData, setCurrencyData] = useState([]);
  const { t } = useTranslation();
  const [base64Image, setBase64Image] = useState("");

  // useEffect
  useEffect(() => {
    _calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log(
      "🚀 ~ file: BillForCheckOut80.js:20 ~ dataBill:",
      dataBill?.dataCustomer
    );
  }, [dataBill, taxPercent]);

  useEffect(() => {
    _calculateTotal();
    getDataCurrency();
  }, []);

  // function
  const _calculateTotal = () => {
    let _total = 0;
    for (let _data of dataBill?.orderId || []) {
      _total += _data?.quantity * _data?.price;
    }
    if (dataBill?.discount > 0) {
      if (
        dataBill?.discountType == "LAK" ||
        dataBill?.discountType == "MONEY"
      ) {
        setTotalAfterDiscount(_total - dataBill?.discount);
      } else {
        const ddiscount = parseInt((_total * dataBill?.discount) / 100);
        setTotalAfterDiscount(_total - ddiscount);
      }
    } else {
      setTotalAfterDiscount(_total);
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
        }
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  const imageUrl = URL_PHOTO_AW3 + storeDetail?.image;
  const imageUrl2 = URL_PHOTO_AW3 + storeDetail?.printer?.logo;
  // const myUrl = " https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/resized/small/8cdca155-d983-415e-86a4-99b9d0be7ef6.jpeg";

  // console.log("check imageUrl--->", imageUrl);

  useEffect(() => {
    convertImageToBase64(imageUrl2).then((base64) => {
      console.log("base64:==>", {base64} );
    setBase64Image(base64);
    });
  }, [imageUrl2]);

  return (
    <Container>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      
        {base64Image ? (
          <Image
            style={{
              width: 60,
              height: 60,
              border: "1px solid #f2f2f2",
              borderRadius: "10em",
              overflow: "hidden",
            }}
            src={base64Image}
            alt="logo"
          />
        ) : ""}

        {/* <Image style={{width: 60, height:60,border:'1px solid gray', borderRadius:"10em"}} src={URL_PHOTO_AW3 + storeDetail?.image} roundedCircle /> */}
      </div>
      <div style={{ textAlign: "center" }}>{storeDetail?.name}</div>
      <div style={{ textAlign: "center" }}>{selectedTable?.tableName}</div>
      <Price>
        <div style={{ textAlign: "left", fontSize: 12 }}>
          <div>
            {t("phoneNumber")}: {""}
            <span style={{ fontWeight: "bold" }}>{storeDetail?.phone}</span>
          </div>
          <div>
            Whatapp:{" "}
            <span style={{ fontWeight: "bold" }}>{storeDetail?.whatsapp}</span>
          </div>
          <div>
            {t("tableCode")}:{" "}
            <span style={{ fontWeight: "bold" }}>{dataBill?.code}</span>
          </div>
          <div>
            {t("date")}:{" "}
            <span style={{ fontWeight: "bold" }}>
              {moment(dataBill?.createdAt).format("DD-MM-YYYY")}
            </span>
          </div>
        </div>
        <div style={{ flexGrow: 1 }}></div>
      </Price>
      <Name style={{ marginBottom: 10 }}>
        <div style={{ textAlign: "left" }}>{t("list")} </div>
        <div style={{ textAlign: "center" }}>{t("amount")}</div>
        <div style={{ textAlign: "right" }}>{t("price")}</div>
        <div style={{ textAlign: "right" }}>{t("total")}</div>
      </Name>
      <Order>
        {dataBill?.orderId?.map((item, index) => {
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                fontSize: 14,
              }}
              key={index}
            >
              <div style={{ textAlign: "left" }}>{item?.name}</div>
              <div style={{ textAlign: "center" }}>{item?.quantity}</div>
              <div style={{ textAlign: "right" }}>
                {item?.price ? moneyCurrency(item?.price) : "-"}
              </div>
              <div style={{ textAlign: "right" }}>
                {item?.price
                  ? moneyCurrency(item?.price * item?.quantity)
                  : "-"}
              </div>
            </div>
          );
        })}
      </Order>
      <div style={{ height: 10 }}></div>
      <hr style={{ border: "1px solid #000", margin: 0 }} />
      <div style={{ fontSize: 14 }}>
        <div>
          <div>
            {t("total")}: {moneyCurrency(total)} {t("lak")}
          </div>
          <div>
            {t("total")} + {t("vat")} {taxPercent}%:{" "}
            {moneyCurrency(total + taxAmount)} {t("lak")}
          </div>
          {currencyData?.map((item, index) => (
            <div key={index}>
              {t("total")} + {t("vat")} {taxPercent}% ({item?.currencyCode}):{" "}
              {moneyCurrency((total + taxAmount) / item?.sell)}
            </div>
          ))}
          <div>
            {t("discount")}:{dataBill?.discount}{" "}
            {dataBill?.discountType == "MONEY" ||
            dataBill?.discountType == "LAK" ? (
              <>{t("lak")}</>
            ) : (
              "%"
            )}
          </div>
          <div>
            {t("customerName")} : {dataBill?.dataCustomer?.username} ({" "}
            {dataBill?.dataCustomer?.phone} )
          </div>
        </div>
      </div>
      <hr style={{ border: "1px solid #000", margin: 0 }} />
      <div style={{ height: 10 }}></div>
      <Price>
        <h6>
          {t("aPriceHasToPay")} {moneyCurrency(totalAfterDiscount + taxAmount)}{" "}
          {t("lak")}
        </h6>
      </Price>
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
          <div>
            {t("getMoney")} {dataBill?.moneyReceived || 0}
          </div>
          <div>
            {t("moneyWithdrawn")} {dataBill?.moneyChange || 0}
          </div>
        </div>
      </Price>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 10,
        }}
      >
        <Img>
          <img
            src={`https://app-api.appzap.la/qr-gennerate/qr?data=${storeDetail?.printer?.qr}`}
            style={{ wifth: "100%", height: "100%" }}
            alt=""
          />
        </Img>
      </div>
    </Container>
  );
}

const Name = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;
const Price = styled.div`
  display: flex;
`;
const Container = styled.div`
  margin: 10px;
  width: 100%;
  /* maxwidth: 80mm; */
`;
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
