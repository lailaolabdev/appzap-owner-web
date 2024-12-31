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
import _ from "lodash";

export default function BillForCheckOut80({
  storeDetail,
  orderPayBefore,
  selectedTable,
  dataBill,
  taxPercent = 0,
  serviceCharge = 0,
  totalBillBillForCheckOut80,
  profile,
}) {
  // state
  const [total, setTotal] = useState();
  const [taxAmount, setTaxAmount] = useState(0);
  const [serviceChargeAmount, setServiceChargeAmount] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState();
  const [currencyData, setCurrencyData] = useState([]);
  const [rateCurrency, setRateCurrency] = useState();
  const { t } = useTranslation();
  const [base64Image, setBase64Image] = useState("");

  const orders =
    orderPayBefore && orderPayBefore.length > 0
      ? orderPayBefore
      : dataBill?.orderId;
  // useEffect
  useEffect(() => {
    _calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // console.log("🚀 ~ file: BillForCheckOut80.js:20 ~ dataBill:", dataBill);
    // console.log("currencyData: ", currencyData);
  }, [dataBill, taxPercent, storeDetail?.serviceChargePer]);

  useEffect(() => {
    _calculateTotal();
    getDataCurrency();
  }, [totalBillBillForCheckOut80, taxPercent, storeDetail?.serviceChargePer]);

  // function
  const _calculateTotal = () => {
    let _total = 0;
    // for (let _data of dataBill?.orderId || []) {
    //   const totalOptionPrice = _data?.totalOptionPrice || 0;
    //   const itemPrice = _data?.price + totalOptionPrice;
    //   // _total += _data?.totalPrice || (_data?.quantity * itemPrice);
    //   _total += _data?.quantity * itemPrice;
    // }

    // const _total = _.sumBy(
    //   dataBill?.orderId?.filter((e) => e?.status === "SERVED"),
    //   (e) => (e?.price + (e?.totalOptionPrice ?? 0)) * e?.quantity
    // );
    // let _total = 0;

    // Check for orderPayBefore; if available, use it; otherwise, use dataBill.orderId
    const orders =
      orderPayBefore && orderPayBefore.length > 0
        ? orderPayBefore
        : dataBill?.orderId;

    // Loop through the available orders
    for (let _data of (orders || []).filter(
      (e) => e?.status === "SERVED" || e?.status === "PRINTBILL"
    )) {
      const totalOptionPrice = _data?.totalOptionPrice || 0;
      const itemPrice = _data?.price + totalOptionPrice;
      _total += _data?.quantity * itemPrice;
    }

    const totalAmountAll =
      orderPayBefore && orderPayBefore.length > 0
        ? _total
        : totalBillBillForCheckOut80;

    // Handle discount logic
    if (dataBill?.discount > 0) {
      if (
        dataBill?.discountType === "LAK" ||
        dataBill?.discountType === "MONEY"
      ) {
        setTotalAfterDiscount(totalAmountAll - dataBill?.discount);
      } else {
        const ddiscount = parseInt((totalAmountAll * dataBill?.discount) / 100);
        setTotalAfterDiscount(totalAmountAll - ddiscount);
      }
    } else {
      setTotalAfterDiscount(totalAmountAll);
    }
    setTotal(totalAmountAll);
    setTaxAmount((totalAmountAll * taxPercent) / 100);
    const serviceChargeTotal = Math.floor(
      (totalAmountAll * storeDetail?.serviceChargePer) / 100
    );
    setServiceChargeAmount(serviceChargeTotal);
  };

  const getDataCurrency = async () => {
    try {
      const { DATA } = await getLocalData();
      if (DATA) {
        const data = await Axios.get(
          `${QUERY_CURRENCIES}?storeId=${DATA?.storeId}`
        );
        if (data?.status === 200) {
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
    <Container>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
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
      </div>
      <div style={{ textAlign: "center" }}>{storeDetail?.name}</div>
      <div style={{ textAlign: "center" }}>
        {" "}
        {`${t("tableNumber")} ${dataBill?.tableId?.name}`}
      </div>
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
              {profile?.data?.firstname ?? "-"} {profile?.data?.lastname ?? "-"}
            </span>
          </div>

          {dataBill?.Name && dataBill?.Point ? (
            <>
              <div>
                {t("phoneNumber")}: {""}
                <span style={{ fontWeight: "bold" }}>
                  {dataBill?.memberPhone
                    ? `${dataBill?.memberPhone} (${t("point")} : ${
                        Number(dataBill?.Point || 0) -
                        Number(storeDetail?.point || 0)
                      })`
                    : ""}
                </span>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </Price>
      <div style={{ height: 10 }} />
      <hr style={{ border: "1px dashed #000", margin: 0 }} />
      <div style={{ flexGrow: 1 }} />
      <Name style={{ marginBottom: 10, fontSize: 12 }}>
        <div style={{ textAlign: "left", width: "10px" }}>{t("no")}</div>
        <div style={{ textAlign: "left" }}>{t("list")}</div>
        <div style={{ textAlign: "center" }}>{t("amount")}</div>
        <div style={{ textAlign: "left" }}>{t("price")}</div>
        <div style={{ textAlign: "right" }}>{t("total")}</div>
      </Name>
      <Order>
        {orders
          ?.filter((e) => e?.status === "SERVED" || e?.status === "PRINTBILL")
          ?.map((item, index) => {
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
            const itemTotal = itemPrice * item?.quantity;

            return (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                  fontSize: 12,
                }}
                key={item?._id}
              >
                <div style={{ textAlign: "left", width: "10px" }}>
                  {index + 1}
                </div>
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
                <div style={{ textAlign: "left" }}>
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
      <hr style={{ border: "1px dashed #000", margin: 0 }} />
      <div style={{ fontSize: 14 }}>
        <Row>
          <Col xs={7}>
            <div style={{ textAlign: "right" }}>
              {t("total")} ({storeDetail?.firstCurrency}):{" "}
            </div>
          </Col>
          <Col>
            <div style={{ textAlign: "right" }}>{moneyCurrency(total)}</div>
          </Col>
        </Row>
        <Row>
          <Col xs={7}>
            <div style={{ textAlign: "right" }}>
              {t("discount")} (
              {dataBill?.discountType == "MONEY" ||
              dataBill?.discountType == "LAK"
                ? storeDetail?.firstCurrency
                : "%"}
              ):
            </div>
          </Col>
          <Col>
            <div style={{ textAlign: "right" }}>{dataBill?.discount}</div>
          </Col>
        </Row>
        {dataBill?.memberPhone
          ? storeDetail?.point > 0 && (
              <Row>
                <Col xs={7}>
                  <div style={{ textAlign: "right" }}>{t("point")}: </div>
                </Col>
                <Col>
                  <div style={{ textAlign: "right" }}>
                    {storeDetail?.point ? storeDetail?.point : 0}
                  </div>
                </Col>
                {/* <Col xs={7}>
              <div style={{ textAlign: "right" }}>
                ໄດ້ພ໋ອຍຈາກການຊື້ຄັ້ງນີ້:{" "}
              </div>
            </Col>
            <Col>
              <div style={{ textAlign: "right" }}>150</div>
            </Col> */}
              </Row>
            )
          : ""}
      </div>
      <Row>
        <Col xs={7}>
          <div style={{ textAlign: "right" }}>
            {t("service_charge")} {storeDetail?.serviceChargePer}% :
          </div>
        </Col>
        <Col>
          <div style={{ textAlign: "right" }}>
            {moneyCurrency(serviceChargeAmount)}
          </div>
        </Col>
      </Row>
      <div style={{ fontSize: 14, marginTop: 20 }}>
        <Row>
          <Col xs={7}>
            <div
              style={{ textAlign: "right", fontSize: 16, fontWeight: "bold" }}
            >
              {/* {t("aPriceHasToPay")} + {t("vat")} {taxPercent}%{" "}({storeDetail?.firstCurrency}): */}
              {t("total")} + {"ອມພ"} {taxPercent}% {storeDetail?.firstCurrency}:
            </div>
          </Col>
          <Col>
            <div
              style={{ textAlign: "right", fontSize: 16, fontWeight: "bold" }}
            >
              {moneyCurrency(
                Math.floor(totalAfterDiscount + taxAmount + serviceChargeAmount)
              )}
            </div>
          </Col>
        </Row>

        {currencyData?.map((item, index) => (
          <Row key={index}>
            <Col xs={7}>
              <div style={{ textAlign: "right" }}>{item?.currencyCode}:</div>
            </Col>
            <Col>
              <div style={{ textAlign: "right" }}>
                {moneyCurrency(
                  (total + taxAmount + serviceChargeAmount) / item?.sell
                )}
              </div>
            </Col>
          </Row>
        ))}
      </div>

      <div style={{ height: 10 }} />
      <hr style={{ border: "1px dashed #000", margin: 0 }} />

      <div style={{ fontSize: 12, textAlign: "center" }}>
        <span>{t("exchangeRate")}&nbsp;</span>
        {currencyData?.map((item, index) => (
          <span key={index}>
            {item?.currencyCode}: {moneyCurrency(item?.sell)}
            {index + 1 < currencyData?.length ? (
              <span style={{ marginLeft: 10, marginRight: 10 }}>|</span>
            ) : (
              ""
            )}
          </span>
        ))}
        {","}
        &nbsp;
        {storeDetail?.isCRM && dataBill?.memberPhone && (
          <span>
            1 {t("point")} = 1 {storeDetail?.firstCurrency}
          </span>
        )}
      </div>
      <div style={{ height: 10 }} />
      <hr style={{ border: "1px dashed #000", margin: 0 }} />
      <div
        style={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          fontSize: 12,
        }}
      >
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
        {","}
        <div>
          {t("moneyWithdrawn")} {dataBill?.moneyChange || 0}
        </div>
      </div>

      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {" "}
        ໂອນເງີນສຳລະ{" "}
      </div> */}
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
            style={{ width: "100%", height: "100%" }}
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
  justify-content: space-between;
`;
const Container = styled.div`
  margin: 10px;
  width: 100%;
  margin-left: -8px;
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
