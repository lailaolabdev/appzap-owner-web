import moment from "moment";
import { moneyCurrency } from "./index"; // Assuming you have a moneyCurrency utility
import { convertImageToBase64 } from "./index"; // Assuming you have this helper
import { URL_PHOTO_AW3 } from "../constants";
import { prinBill80 } from "../services/prinBill80";

export const printBillCafe80 = async (
  dataBill,
  printerBillData,
  storeDetail,
  profile
) => {
  // Make sure to calculate the missing values here or pass them as parameters
  const taxPercent = 0;
  const total = calculateTotal(dataBill);
  const taxAmount = calculateTaxAmount(total, taxPercent);
  const serviceChargeAmount = calculateServiceCharge(total, storeDetail);
  const totalAfterDiscount = calculateTotalAfterDiscount(
    total,
    taxAmount,
    serviceChargeAmount,
    dataBill
  );

  // Assuming that the store's logo URL is in storeDetail?.printer?.logo
  const imageUrl2 = URL_PHOTO_AW3 + storeDetail?.printer?.logo;
  const base64Image = await convertImageToBase64(imageUrl2);

  // Format currencies
  const CurrencyData = formatCurrencyData(
    total,
    taxAmount,
    serviceChargeAmount
  );
  // const CurrencyEX = formatCurrencyExchange(currencyData);

  const formatOrderList = formatOrderLists(dataBill);

  // Prepare the data for printing
  const data = {
    header: {
      StoreImage: base64Image,
      StoreName: storeDetail?.name,
      tableName: dataBill?.tableId?.name || "Table not selected",
    },
    subheader: [
      { tel: storeDetail?.phone },
      { whatsapp: storeDetail?.whatsapp },

      { date: moment(dataBill?.createdAt).format("DD-MM-YYYY HH:mm") },
      {
        cashier: `${profile?.data?.firstname ?? "-"} ${
          profile?.data?.lastname ?? "-"
        }`,
      },
    ],
    body: formatOrderList, // Or you could map the items for a more detailed printout
    totalRightPrices: [{ "total:": moneyCurrency(totalAfterDiscount) }],
    totalLeftPrices: [],
    footer: [],
    paymentQR: {
      paymentQr:
        "00020101021138670016a00526628466257701082771041802030010324cchrjzrjzwudwnqvhexuhnoq53034185802la63049b5f",
    },
    printerIP: printerBillData?.ip, // Use stored IP if available
    openCashDrawer: false,
  };

  // Send the data to the printer
  const res = await prinBill80(data);
  return { status: res.status, message: res.message };
};

// Helper functions to calculate totals, discounts, etc.
const calculateTotal = (orders) => {
  let total = 0;
  for (const order of orders || []) {
    const itemPrice = order?.price + (order?.totalOptionPrice || 0);
    total += order?.quantity * itemPrice;
  }
  return total;
};

const calculateTaxAmount = (total, taxPercent) => {
  return (total * taxPercent) / 100;
};

const calculateServiceCharge = (total, storeDetail) => {
  return Math.floor((total * storeDetail?.serviceChargePer) / 100);
};

const calculateTotalAfterDiscount = (
  total,
  taxAmount,
  serviceChargeAmount,
  dataBill
) => {
  let totalAfterDiscount = total + taxAmount + serviceChargeAmount;

  if (dataBill?.discount > 0) {
    if (
      dataBill?.discountType === "LAK" ||
      dataBill?.discountType === "MONEY"
    ) {
      totalAfterDiscount -= dataBill?.discount;
    } else {
      const discount = (totalAfterDiscount * dataBill?.discount) / 100;
      totalAfterDiscount -= discount;
    }
  }

  return totalAfterDiscount;
};

const formatCurrencyData = (
  total,
  taxAmount,
  serviceChargeAmount,
  currencyData
) => {
  return currencyData?.map((item) => {
    return {
      [`${item.currencyCode} `]: moneyCurrency(
        (total + taxAmount + serviceChargeAmount) / item?.sell
      ),
    };
  });
};

const formatCurrencyExchange = (currencyData) => {
  // Add the "Exchange point" line first
  const exchangePoints = "1 Point = 1 LAK"; // Default if exchange rate is not available

  // Now, map over the currency data and include the new exchange point at the start or end
  const formattedCurrencyExchange = currencyData?.map((item) => {
    return {
      "Exchange Rate": `${item?.currencyCode} : ${moneyCurrency(item?.sell)}`,
    };
  });

  // Add the custom exchange point info to the list
  formattedCurrencyExchange.unshift({ "Exchange Point": exchangePoints });

  return formattedCurrencyExchange;
};

const formatOrderLists = (orderList) => {
  return orderList?.map((item) => {
    return {
      name: item?.name,
      qty: item?.quantity,
      price: moneyCurrency(item?.price),
      total: moneyCurrency(item?.quantity * item?.price),
    };
  });
};

// Send the data to the printer and handle success/error
// const sendToPrinter = async (data) => {
//   const res = await prinBill80(data);
//   if (res.status) {
//     await Swal.fire({
//       icon: "success",
//       title: "Print Bill Success ",
//       showConfirmButton: false,
//       timer: 1500,
//     });
//   } else {
//     Swal.fire({
//       icon: "error",
//       title: "Error",
//       text: "IP printer not found",
//       showConfirmButton: false,
//     });
//   }
// };
