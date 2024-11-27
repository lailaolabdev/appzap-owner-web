import React from "react";

const printBill = ({ data }) => {
  const printData = {
    header: {
      StoreImage:
        "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp",
      StoreName: "Appzap POS",
      tableName: "T2",
    },
    subheader: [
      { tel: "23334467" },
      { whatsapp: "23345566" },
      { orderId: "GWUSFU" },
      { date: "11/11/2024" },
    ],
    body: [
      { name: "Item 1 hgfhg", qty: 2, price: "75,000", total: "150,000" },
      { name: "Item 2hh", qty: 3, price: "75,000", total: "150,000" },
      { name: "Item 3 fjhghjghj", qty: 4, price: "75,000", total: "150,000" },
      {
        name: "Item 4 vjghhghjvjjh",
        qty: 5,
        price: "75,000",
        total: "150,000",
      },
    ],
    totalRightPrices: [
      { "total:": "835,000", fontSize: 26 },
      { "discount:": "10%", fontSize: 26 },
      { "point:": "835,000", fontSize: 26 },
      { "Total (LAK):": "835,000", bold: true, fontSize: 30 },
    ],
    totalLeftPrices: [{ USD: "835,000" }, { THB: "835,000" }],
    footer: [{ "Exchange Rate": "THB 650 | CNY 3,000" }],
    paymentQR: {
      paymentQr: "000201010211153...",
    },
    printerIP: "10.10.100.254",
    openCashDrawer: true,
  };
  return (
    <div>
      <div style={{ padding: 20 }}>Test</div>
    </div>
  );
};

export default printBill;
