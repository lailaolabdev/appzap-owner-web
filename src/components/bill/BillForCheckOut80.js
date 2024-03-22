import styled from "styled-components";
import React, { useState, useEffect, useRef } from "react";
import { moneyCurrency } from "../../helpers/index";
import moment from "moment";
import {
  QUERY_CURRENCIES,
  getLocalData,
  getLocalDataCustomer,
} from "../../constants/api";
import Axios from "axios";
import QRCode from "react-qr-code";
import { URL_PHOTO_AW3 } from "../../constants";
import { Image } from "react-bootstrap";
import axios from 'axios';


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
 
  // ຍ້ອນຫຍັງ ເມື່ອປິ່ນບິນອອກຈາກ barican printer ຈຶ່ງບໍສາມາດດຶງຮູບພາບມາສະແດງໄດ້
  // const urlImage = "https://res.cloudinary.com/vistaprint/image/upload/c_scale,w_440,h_440,dpr_2/f_auto,q_auto/v1704969964/ideas-and-advice-prod/en-us/CHANEL_THUMB_34302915-446e-4eb6-8eb1-ab1634e38378_1080x.jpg?_i=AA"
  const url3 = "https://appzapimglailaolab.s3.ap-southeast-1.amazonaws.com/3801ff89-bfad-4dca-802d-e0dca03bd085.png"
const urlJpg = "https://st.depositphotos.com/1144386/4493/v/450/depositphotos_44937615-stock-illustration-new-style-facebook-icon.jpg"
const urlJpg33 = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Facebook_New_Logo_%282015%29.svg/1280px-Facebook_New_Logo_%282015%29.svg.png"

// Set the src attribute to the image URL
 
// ຍ້ອນຫຍັງຮູບນີ້ ທີ1 ປິ່ນໄດ້ ແຕ່ຮູບທີ2 ປິ່ນບໍໄດ້
  const imageUrlJpg = URL_PHOTO_AW3 + storeDetail?.printer?.logo.replace('.jpeg', '.jpg');
console.log("storeDetail999:--->", storeDetail?.printer?.logo)


  

  return (
    <Container>
      <div style={{ width:'100%', display:'flex', justifyContent:'center' }}>
    <Image
      style={{ width: 60, height: 60, border: '1px solid gray', borderRadius:'10em',  overflow:'hidden' }}
      // src={url3}
      src={URL_PHOTO_AW3 + storeDetail?.printer?.logo}
      alt="preview"
      
    />
        {/* <Image style={{width: 60, height:60,border:'1px solid gray', borderRadius:"10em"}} src={URL_PHOTO_AW3 + storeDetail?.image} roundedCircle /> */}
      </div>
      <div style={{ textAlign: "center" }}>{storeDetail?.name} DEV url3 logo</div>
      <div style={{ textAlign: "center" }}>{selectedTable?.tableName}</div>
      {/* <Price>
        <div style={{ textAlign: "left", fontSize: 12 }}>
          <div>
            ເບີໂທ:{" "}
            <span style={{ fontWeight: "bold" }}>{storeDetail?.phone}</span>
          </div>
          <div>
            Whatapp:{" "}
            <span style={{ fontWeight: "bold" }}>{storeDetail?.whatsapp}</span>
          </div>
          <div>
            ລະຫັດໂຕະ:{" "}
            <span style={{ fontWeight: "bold" }}>{dataBill?.code}</span>
          </div>
          <div>
            ວັນທີ:{" "}
            <span style={{ fontWeight: "bold" }}>
              {moment(dataBill?.createdAt).format("DD-MM-YYYY")}
            </span>
          </div>
        </div>
        <div style={{ flexGrow: 1 }}></div>
      </Price>
      <Name style={{ marginBottom: 10 }}>
        <div style={{ textAlign: "left" }}>ລາຍການ</div>
        <div style={{ textAlign: "center" }}>ຈຳນວນ</div>
        <div style={{ textAlign: "right" }}>ລາຄາ</div>
        <div style={{ textAlign: "right" }}>ລວມ</div>
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
          <div>ລວມ: {moneyCurrency(total)} ກີບ</div>
          <div>
            ລວມ + ພາສີ {taxPercent}%: {moneyCurrency(total + taxAmount)} ກີບ
          </div>
          {currencyData?.map((item, index) => (
            <div key={index}>
              ລວມ + ພາສີ {taxPercent}% ({item?.currencyCode}):{" "}
              {moneyCurrency((total + taxAmount) / item?.sell)}
            </div>
          ))}
          <div>
            ສ່ວນຫຼຸດ:
            {dataBill?.discount}{" "}
            {dataBill?.discountType == "MONEY" ||
            dataBill?.discountType == "LAK"
              ? "ກີບ"
              : "%"}
          </div>
          <div>
            ລູກຄ້າ : {dataBill?.dataCustomer?.username} ({" "}
            {dataBill?.dataCustomer?.phone} )
          </div>
        </div>
      </div>
      <hr style={{ border: "1px solid #000", margin: 0 }} />
      <div style={{ height: 10 }}></div>
      <Price>
        <h6>
          ເງິນທີ່ຕ້ອງຊຳລະ {moneyCurrency(totalAfterDiscount + taxAmount)} ກີບ
        </h6>
      </Price>
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
          <div>ຮັບເງີນມາ {dataBill?.moneyReceived || 0}</div>
          <div>ເງີນທອນ {dataBill?.moneyChange || 0}</div>
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
      </div> */}
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
