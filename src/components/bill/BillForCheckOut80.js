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
  const [rateCurrency, setRateCurrency] = useState();
  const { t } = useTranslation();
  const [base64Image, setBase64Image] = useState("");

  console.log("storeDetail", storeDetail);
  console.log("dataBill", dataBill);

  // useEffect
  useEffect(() => {
    _calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // console.log("🚀 ~ file: BillForCheckOut80.js:20 ~ dataBill:", dataBill);
    // console.log("currencyData: ", currencyData);
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
  // const myUrl = " https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/resized/small/8cdca155-d983-415e-86a4-99b9d0be7ef6.jpeg";

  // console.log("check storeDetail--->", storeDetail);

  useEffect(() => {
    convertImageToBase64(imageUrl2).then((base64) => {
      // console.log("base64:==>", { base64 });
      setBase64Image(base64);
    });
  }, [imageUrl2]);

  return (
    <Container>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {base64Image ? (
          <Image
            style={{
              maxWidth: 120,
              maxHeight: 120,
              // border: "1px solid #ddd",
              // borderRadius: "10em",
              // overflow: "hidden",
            }}
            src={base64Image}
            alt="logo"
          />
        ) : (
          ""
        )}

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
          <div>
            {t("staffCheckBill")}:{" "}
            <span style={{ fontWeight: "bold" }}>
              {dataBill?.dataStaffConfirm?.firstname ?? "-"}{" "}
              {dataBill?.dataStaffConfirm?.lastname ?? "-"}
            </span>
          </div>
        </div>
        <div style={{ flexGrow: 1 }}></div>
      </Price>
      <Name style={{ marginBottom: 10, fontSize: 12 }}>
        <div style={{ textAlign: "left" }}>ລຳດັບ </div>
        <div style={{ textAlign: "center" }}>{t("list")} </div>
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
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                fontSize: 12,
              }}
              key={index}
            >
              <div style={{ textAlign: "left" }}>{index + 1}</div>
              <div style={{ textAlign: "center" }}>{item?.name}</div>
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
          {/* <Row>
            <Col></Col>
            <Col sm={8}>
              <div style={{ textAlign: "right", marginRight: "25px" }}>{t("total")}: </div>
            </Col>
            <Col sm={6}>
              <div style={{ textAlign: "right" }}>
                {moneyCurrency(total)} {storeDetail?.firstCurrency}
              </div>
            </Col>
          </Row> */}
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
              {t("total")}:
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
          {/* {t("total")}: {moneyCurrency(total)} {storeDetail?.firstCurrency} */}
          {/* <div style={{ textAlign: "right" }}>
            
          </div> */}
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
              {t("total")} + {t("vat2")} {taxPercent}%:{" "}
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
          {currencyData?.map((item, index) => (
            <>
              <div
                key={index}
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
                  {t("total")} + {t("vat2")} {taxPercent}% ({item?.currencyCode}
                  ):
                </div>

                <div
                  style={{
                    width: "60%",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  {moneyCurrency((total + taxAmount) / item?.sell)}
                </div>
              </div>
            </>
          ))}

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
              {t("discount")}:{" "}
            </div>

            <div
              style={{
                width: "60%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
               {moneyCurrency(dataBill?.discount)}{" "}
                  {dataBill?.discountType == "MONEY" ||
                  dataBill?.discountType == "LAK"
                    ? storeDetail?.firstCurrency
                    : "%"}
            </div>
          </div>
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
              {t("customerName")}:{" "}
            </div>

            <div
              style={{
                width: "60%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
               {dataBill?.memberName} ( {dataBill?.memberPhone} )
            </div>
          </div>
        </div>
      </div>
      <hr style={{ border: "1px solid #000", margin: 0 }} />
      <div style={{ margin: "10px" }}></div>
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <div style={{ display: "flex", gap: 10 }}>
          <h6>
            {t("aPriceHasToPay")}{" "}
            {moneyCurrency(totalAfterDiscount)}{" "}
            {storeDetail?.firstCurrency}
          </h6>
        </div>
      </Price>
      <Price>
        <div style={{ flexGrow: 1, display: "flex", gap: 10 }}></div>
        <div style={{ fontSize: 12 }}>
          {currencyData?.map((item, index) => (
            <div key={index}>
              {t("exchangeRate")} ({item?.currencyCode}): {item?.buy}
            </div>
          ))}
        </div>
      </Price>
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
          <div>
            {dataBill?.paymentMethod === "CASH"
              ? "ເງີນສົດ"
              : dataBill?.paymentMethod === "TRANSFER"
              ? "ເງີນໂອນ"
              : dataBill?.paymentMethod === "TRANSFER_CASH"
              ? "ເງີນສົດແລະໂອນ"
              : ""}
          </div>
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
        }}
      >
        {" "}
        ໂອນເງີນສຳລະ{" "}
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
    </Container>
  );
}

const Name = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
`;
const Price = styled.div`
  display: flex;
`;
const Container = styled.div`
  margin: 10px;
  width: 100%;
  margin-left: -25px,
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
