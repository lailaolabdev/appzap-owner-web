import styled from "styled-components";

import React, { useState, useEffect } from "react";
import { convertImageToBase64, moneyCurrency } from "../../helpers/index";
import moment from "moment";
import { QUERY_CURRENCIES, getLocalData } from "../../constants/api";
import Axios from "axios";
import QRCode from "react-qr-code";
import { EMPTY_LOGO, URL_PHOTO_AW3 } from "../../constants";
import { useTranslation } from "react-i18next";
import { Image } from "react-bootstrap";

export default function BillForCheckOut58({
  storeDetail,
  selectedTable,
  dataBill,
}) {
  const { t } = useTranslation();

  const [total, setTotal] = useState();
  const [currencyData, setCurrencyData] = useState([]);
  const [base64Image, setBase64Image] = useState('');
  const imageUrl = URL_PHOTO_AW3 + storeDetail?.printer?.logo;

  const _calculateTotal = () => {
    let _total = 0;
    for (let _data of dataBill?.orderId || []) {
      _total += _data?.quantity * _data?.price;
    }
    setTotal(_total);
  };

  // useEffect
  useEffect(() => {
    getDataCurrency();
  }, []);
  useEffect(() => {
    _calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataBill]);

  
  useEffect(() => { 
    convertImageToBase64(imageUrl).then(base64 => { 
      setBase64Image(base64);
    });
  }, [imageUrl]);

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
  

  return (
    <Container>
      <div style={{ width:'100%', display:'flex', justifyContent:'center' }}>
      {!base64Image ? <Image
      style={{ width: 60, height: 60, border: '1px solid #f2f2f2', borderRadius:'10em',  overflow:'hidden' }}
      src={base64Image}
      alt="preview"
      
    /> :
    <Image
      style={{ width: 60, height: 60, border: '1px solid #f2f2f2', borderRadius:'10em',  overflow:'hidden' }}
      src={EMPTY_LOGO}
      alt="preview"
      
    />
    }
      </div>
      <div style={{ textAlign: "center" }}>{storeDetail?.name}</div>
      <div style={{ textAlign: "center" }}>{selectedTable?.tableName}</div>
      <Price>
        <div style={{ textAlign: "left", fontSize: 12 }}>
          <div>
            {t("phoneNumber")}:{" "}
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
        <Img>
          {/* <QRCode
            value={`https://chart.googleapis.com/chart?cht=qr&chl=${storeDetail?.printer?.qr}`}
          /> */}
          <img
            src={`https://app-api.appzap.la/qr-gennerate/qr?data=${storeDetail?.printer?.qr}`}
            style={{ wifth: "100%", height: "100%" }}
            alt=""
          />
        </Img>
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
                fontSize: 12,
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
      <hr style={{ border: "1px solid #000" }} />
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <div>
          <div>{t("total")}: {moneyCurrency(total)} ກີບ</div>
          {currencyData?.map((item, index) => (
            <div key={index}>
              {t("total")} ({item?.currencyCode}): {moneyCurrency(total / item?.sell)}
            </div>
          ))}
          <div> {t("discount")} (ກີບ) 0</div>
        </div>
      </Price>
      <hr style={{ border: "1px solid #000" }} />
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <h6>{t("aPriceHasToPay")}  {moneyCurrency(total)} {t("lak")}</h6>
      </Price>
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
          <div>{t("getMoney")} 0</div>
          <div>{t("moneyWithdrawn")}  0</div>
        </div>
      </Price>
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
  maxwidth: 58mm;
`;
const Img = styled.div`
  width: 90px;
  height: 90px;
`;
const Order = styled.div`
  display: flex;
  flex-direction: column;
`;
