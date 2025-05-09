import styled from "styled-components";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { convertImageToBase64, moneyCurrency } from "../../helpers/index";
import moment from "moment";
import {
  QUERY_CURRENCIES,
  getLocalData,
  getLocalDataCustomer,
} from "../../constants/api";
import { usePaymentStore } from "../../zustand/paymentStore";
import { usePointStore } from "../../zustand/pointStore";
import { useUserStore } from "../../zustand/userStore";
import { convertRole } from "../../helpers/convertRole";
import Axios from "axios";
import QRCode from "react-qr-code";
import { EMPTY_LOGO, URL_PHOTO_AW3 } from "../../constants";
import { Image, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { data } from "autoprefixer";

export default function BillForCheckOut80({
  storeDetail,
  orderPayBefore,
  selectedTable,
  dataBill,
  taxPercent = 0,
  serviceCharge = 0,
  totalBillBillForCheckOut80,
  profile,
  paymentMethod,
  enableServiceChange,
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
  const [isShowExchangeRate, setIsShowExchangeRate] = useState(
    storeDetail?.isShowExchangeRate || false
  );

  const { SelectedDataBill } = usePaymentStore();
  const { PointStore } = usePointStore();

  const { selectUserEmployee } = useUserStore();

  // Replace the current useRef and console.log
  const serviceChargeRef = useRef(serviceCharge);
  const enableServiceChangeRef = useRef(enableServiceChange);

  const orders =
    orderPayBefore && orderPayBefore.length > 0
      ? orderPayBefore
      : dataBill?.orderId;

  // First, let's modify the useEffect to properly track enableServiceChange
  useEffect(() => {
    _calculateTotal();
    if (serviceCharge > 0) {
      serviceChargeRef.current = serviceCharge;
    }
    // Always update enableServiceChangeRef with the latest value
    enableServiceChangeRef.current = enableServiceChange;
  }, [
    taxPercent,
    serviceCharge,
    totalBillBillForCheckOut80,
    orderPayBefore,
    enableServiceChange,
  ]);

  // Now let's fix the TotalServiceChange calculation
  const TotalServiceChange = (() => {
    // Debug log to track values during calculation

    // If store has service charge enabled by default
    if (storeDetail?.isServiceChange === true) {
      return serviceChargeRef.current || 0;
    }

    // If service charge is explicitly enabled via prop (even if it was undefined before)
    if (
      enableServiceChange === true ||
      enableServiceChangeRef.current === true
    ) {
      return serviceChargeRef.current || 0;
    }

    // Default case: no service charge
    return 0;
  })();

  useEffect(() => {
    getDataCurrency();
  }, []);

  const _calculateTotal = () => {
    let _total = 0;

    const orders =
      orderPayBefore && orderPayBefore.length > 0
        ? orderPayBefore
        : dataBill?.orderId;

    // Loop through the available orders
    for (let _data of (orders || []).filter(
      (e) =>
        (e?.status === "SERVED" ||
          e?.status === "PRINTBILL" ||
          e?.status === "PAID") &&
        e?.status !== "CANCELED"
    )) {
      const totalOptionPrice = _data?.totalOptionPrice || 0;
      const itemPrice = _data?.price + totalOptionPrice;
      _total += _data?.quantity * itemPrice;
    }

    const totalAmountAll =
      orderPayBefore && orderPayBefore.length > 0
        ? _total
        : totalBillBillForCheckOut80 || _total;

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

    setTaxAmount((totalAmountAll * taxPercent) / 100);

    // Service charge calculation using the improved TotalServiceChange
    const serviceChargeTotal = Math.floor(
      (totalAmountAll * TotalServiceChange) / 100
    );
    setServiceChargeAmount(serviceChargeTotal);
    setTotal(totalAmountAll);
  };

  useEffect(() => {
    _calculateTotal();
  }, [dataBill?.discount]);

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
      setBase64Image(base64);
    });
  }, [imageUrl2]);

  const paymentMethodText = useMemo(() => {
    switch (SelectedDataBill?.paymentMethod) {
      case "CASH":
        return "(ເງີນສົດ)";
      case "TRANSFER":
        return "(ເງີນໂອນ)";
      case "TRANSFER_CASH":
        return "(ເງີນສົດແລະໂອນ)";
      case "CASH_TRANSFER_POINT":
        return "(ເງີນສົດ + ໂອນ + ພ໋ອຍ)";
      case "OTHER":
        return "";
      default:
        return "";
    }
  }, [SelectedDataBill?.paymentMethod]);

  const paymentDisplay = useMemo(
    () => (
      <div
        style={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          fontSize: 12,
        }}
      >
        <div>
          {t("getMoney")}{" "}
          {moneyCurrency(
            SelectedDataBill?.moneyReceived - SelectedDataBill?.pointRecived
          ) || 0}{" "}
          {storeDetail?.firstCurrency} <span>{paymentMethodText}</span>
        </div>
        {","}
        <div>
          {t("moneyWithdrawn")}{" "}
          {moneyCurrency(SelectedDataBill?.moneyChange) || 0}{" "}
          {storeDetail?.firstCurrency}
        </div>
      </div>
    ),
    [
      SelectedDataBill?.moneyReceived,
      SelectedDataBill?.moneyChange,
      paymentMethodText,
      storeDetail?.firstCurrency,
      t,
    ]
  );

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
              {moment(dataBill?.createdAt).format("DD-MM-YYYY - HH:mm:ss")}
            </span>
          </div>
          <div>
            {t("staffCheckBill")}:{" "}
            <span style={{ fontWeight: "bold" }}>
              {selectUserEmployee
                ? `${selectUserEmployee?.firstname ?? "-"} - ${convertRole(
                    selectUserEmployee?.role
                  )}`
                : `${profile?.data?.firstname ?? "-"} - ${convertRole(
                    profile?.data?.role
                  )}`}
            </span>
          </div>

          {dataBill?.Name && dataBill?.Point ? (
            <>
              <div>
                {t("phoneNumber")}: {""}
                <span style={{ fontWeight: "bold" }}>
                  {dataBill?.memberPhone
                    ? `${dataBill?.memberPhone} (${t(
                        "point"
                      )} : ${moneyCurrency(
                        Number(SelectedDataBill?.Point || 0) -
                          Number(SelectedDataBill?.pointRecived || 0)
                      )})`
                    : ""}
                </span>
              </div>

              <div>
                {t("date_expirt_point")}: {""}
                <span style={{ fontWeight: "bold" }}>
                  {dataBill?.ExpireDateForPoint &&
                  moment(dataBill.ExpireDateForPoint).isValid()
                    ? moment(dataBill.ExpireDateForPoint).format("DD-MM-YYYY")
                    : "-"}
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
          ?.filter(
            (e) =>
              e?.status === "SERVED" ||
              e?.status === "PRINTBILL" ||
              e?.status === "PAID"
          )
          ?.map((item, index) => {
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
            {SelectedDataBill?.pointRecived > 0 ? (
              <div style={{ textAlign: "right" }}>
                {moneyCurrency(total - SelectedDataBill?.pointToMoney)}
              </div>
            ) : (
              <div style={{ textAlign: "right" }}>{moneyCurrency(total)}</div>
            )}
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
            <div style={{ textAlign: "right" }}>
              {moneyCurrency(dataBill?.discount)}
            </div>
          </Col>
        </Row>
        {SelectedDataBill?.memberPhone
          ? SelectedDataBill?.Point > 0 && (
              <Row>
                <Col xs={7}>
                  <div style={{ textAlign: "right" }}>{t("point_use")}: </div>
                </Col>
                <Col>
                  <div style={{ textAlign: "right" }}>
                    {SelectedDataBill?.pointRecived
                      ? `${moneyCurrency(
                          SelectedDataBill?.pointRecived
                        )} => ${moneyCurrency(
                          SelectedDataBill?.pointToMoney || 0
                        )}`
                      : 0}
                  </div>
                </Col>
              </Row>
            )
          : ""}
      </div>
      <Row>
        <Col xs={7}>
          <div style={{ textAlign: "right" }}>
            {t("service_charge")} {TotalServiceChange}% :
          </div>
        </Col>
        <Col>
          <div style={{ textAlign: "right" }}>
            {moneyCurrency(serviceChargeAmount)}
          </div>
        </Col>
      </Row>
      <div style={{ height: 10 }} />
      <hr style={{ border: "1px dashed #000", margin: 0 }} />
      <div style={{ fontSize: 14 }}>
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
                Math.floor(
                  totalAfterDiscount +
                    taxAmount +
                    serviceChargeAmount -
                    SelectedDataBill?.pointToMoney
                )
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
        {storeDetail?.isCRM && dataBill?.memberPhone && (
          <Row>
            <Col xs={7}>
              <div style={{ textAlign: "right" }}>{t("point_remain")}:</div>
            </Col>
            <Col>
              <div style={{ textAlign: "right" }}>
                {moneyCurrency(
                  SelectedDataBill?.Point - SelectedDataBill?.pointRecived
                )}
              </div>
            </Col>
          </Row>
        )}
      </div>

      {isShowExchangeRate && (
        <>
          <div style={{ height: 10 }} />
          <hr style={{ border: "1px dashed #000", margin: 0 }} />
          {storeDetail?.isCRM && (
            <span className="text-[12px] ml-[10px]">{t("exchangeRate")} :</span>
          )}
          <div style={{ fontSize: 12, textAlign: "center" }}>
            {!storeDetail?.isCRM && <span>{t("exchangeRate")}&nbsp;</span>}
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
            <span className="mx-2">{"|"}</span>
            {storeDetail?.isCRM &&
              PointStore?.data &&
              PointStore.data.length > 0 && (
                <span>
                  {PointStore.data[0]?.piontUse || 0} {t("point")} :{" "}
                  {moneyCurrency(PointStore.data[0]?.moneyUse || 0)}{" "}
                  {storeDetail?.firstCurrency}
                </span>
              )}
          </div>
        </>
      )}

      <div style={{ height: 10 }} />
      <hr style={{ border: "1px dashed #000", margin: 0 }} />

      {paymentDisplay}

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

      {storeDetail?.textForBill?.trim().length > 0 && (
        <div>
          <div className="text-center text-[12px] font-thin">
            {`(${storeDetail?.textForBill})`}
          </div>
        </div>
      )}
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
