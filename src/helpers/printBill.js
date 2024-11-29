import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { prinBill80 } from "../services/prinBill80";
import { useStore } from "../store";
import { QUERY_CURRENCIES, getLocalData } from "../constants/api";
import { convertImageToBase64, moneyCurrency } from "./index";
import { URL_PHOTO_AW3 } from "../constants";
import Axios from "axios";
import moment from "moment";
export const PrintBill = ({
  storeDetail,
  orderPayBefore,
  selectedTable,
  dataBill,
  taxPercent = 0,
  serviceCharge = 0,
  totalBillBillForCheckOut80,
  profile,
}) => {
  const [total, setTotal] = useState();
  const [taxAmount, setTaxAmount] = useState(0);
  const [serviceChargeAmount, setServiceChargeAmount] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState();
  const [currencyData, setCurrencyData] = useState([]);
  const [rateCurrency, setRateCurrency] = useState();
  const { t } = useTranslation();
  const [base64Image, setBase64Image] = useState("");

  const { printerCounter, printers } = useStore();

  // const _printerCounters = JSON.parse(printerCounter?.prints);
  // const printerBillData = printers?.find(
  //   (e) => e?._id === _printerCounters?.BILL
  // );

  const orders =
    orderPayBefore && orderPayBefore.length > 0
      ? orderPayBefore
      : dataBill?.orderId;

  // useEffect
  useEffect(() => {
    _calculateTotal();
  }, [dataBill, taxPercent, storeDetail?.serviceChargePer]);

  useEffect(() => {
    _calculateTotal();
    getDataCurrency();
  }, [totalBillBillForCheckOut80, taxPercent, storeDetail?.serviceChargePer]);

  // function
  const _calculateTotal = () => {
    let _total = 0;

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
        const ddiscount = Number.parseInt(
          (totalAmountAll * dataBill?.discount) / 100
        );
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

  const imageUrl2 = URL_PHOTO_AW3 + storeDetail?.printer?.logo;

  useEffect(() => {
    convertImageToBase64(imageUrl2).then((base64) => {
      // console.log("base64:==>", { base64 });
      setBase64Image(base64);
    });
  }, [imageUrl2]);

  const CurrencyData = currencyData?.map((item) => {
    return {
      nameCurrency: item.currencyCode,
      price: moneyCurrency(
        (total + taxAmount + serviceChargeAmount) / item?.sell
      ),
    };
  });
  const CurrencyEX = currencyData?.map((item) => {
    return {
      nameCurrency: `${item?.currencyCode} : ${moneyCurrency(item?.sell)}`,
    };
  });

  const data = {
    header: {
      StoreImage: imageUrl2,
      StoreName: storeDetail?.name,
      tableName: dataBill?.tableId?.name,
    },
    subheader: [
      { tel: storeDetail?.phone },
      { whatsapp: storeDetail?.whatsapp },
      { orderId: dataBill?.code },
      { date: moment(dataBill?.createdAt).format("DD-MM-YYYY") },
    ],
    body: orders,
    totalRightPrices: [
      { "total:": moneyCurrency(total), fontSize: 26 },
      {
        "discount:": `${dataBill?.discount} ${
          dataBill?.discountType === "MONEY" || dataBill?.discountType === "LAK"
            ? storeDetail?.firstCurrency
            : "%"
        }`,
        fontSize: 26,
      },
      { "name:": dataBill?.Name ? dataBill?.Name : "", fontSize: 26 },
      { "point:": dataBill?.Point ? dataBill?.Point : "0", fontSize: 26 },
      {
        "Total (LAK):": moneyCurrency(
          Math.floor(totalAfterDiscount + taxAmount + serviceChargeAmount)
        ),
        bold: true,
        fontSize: 30,
      },
    ],
    totalLeftPrices: CurrencyData,
    footer: CurrencyEX,
    paymentQR: {
      paymentQr:
        "00020101021138670016a00526628466257701082771041802030010324cchrjzrjzwudwnqvhexuhnoq53034185802la63049b5f",
    },
    printerIP: "printerBillData?.ip",
    openCashDrawer: true,
  };

  //   await prinBill80(data);
  return (
    <div>
      <h1>Printing Bill...</h1>
    </div>
  );
};
