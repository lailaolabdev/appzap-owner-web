
import styled from 'styled-components'
import axios from "axios";
import { END_POINT_SEVER } from "../../constants/api";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getHeaders } from '../../services/auth';
import { moneyCurrency } from "../../helpers/index";
import moment from "moment";

import { useStore } from "../../store";


export default function BillForCheckOut80({ storeDetail, selectedTable, dataBill, data }) {
  console.log(dataBill);

  const [total, setTotal] = useState();

  const { callingCheckOut } = useStore();
  useEffect(() => {
    _calculateTotal();

  }, [dataBill]);

  const _calculateTotal = () => {
    let _total = 0;
    for (let _data of dataBill?.orderId || []) {
      console.log('_data', _data)
      _total += _data?.quantity * _data?.price

    }
    console.log(_total);
    setTotal(_total);
  };


  return (
    <Container>
      <div style={{ textAlign: "center" }}>
        <h1>{storeDetail?.name}</h1>
      </div>
      <hr></hr>
      <div style={{ textAlign: "center" }}>
        <h3>{selectedTable?.tableName}</h3>
      </div>
      <hr></hr>
      <Price>
        <div>
          <p>ເບີໂທ: {storeDetail?.phone}</p>
          <p>Whatapp: {storeDetail?.whatsapp}</p>
          <p>ລະຫັດໂຕະ: {dataBill?.code}</p>
          <p>ວັນທີ: {moment(dataBill?.createdAt).format("DD-MMMM-YYYY HH:mm:ss")}</p>
        </div>
        <div style={{ flexGrow: 1 }}></div>
        <Img>
          <img src="https://chart.googleapis.com/chart?cht=qr&chl=angie&chs=500x500&choe=UTF-8" style={{ wifth: "100%", height: "100%" }} />
        </Img>
      </Price>
      <hr></hr>
      <Name>
        <p>ລາຍການ</p>
        <p>ຈຳນວນ</p>
        <p>ລາຄາ</p>
        <p>ລວມ</p>
      </Name>
      <hr></hr>
      <Order>
        {
          dataBill?.orderId?.map((item, index) => {
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
                <p>{item?.name}</p>
                <p>{item?.quantity}</p>
                <p>{item?.price}</p>
                <p>{item?.price ? moneyCurrency(item?.price * item?.quantity) : "-"}</p>
              </div>
            )
          }
          )
        }

      </Order>
      <hr></hr>
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <div>
          <p>ລວມ: {moneyCurrency(total)} ກີບ</p>
          <p>ສ່ວນຫຼຸດ(ກີບ) 0</p>
        </div>
      </Price>
      <hr></hr>
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <h6>ເງິນທີ່ຕ້ອງຊຳລະ {moneyCurrency(total)} ກີບ</h6>
      </Price>
      <hr></hr>
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <div>
          <p>ຮັບເງີນມາ 0</p>
          <p>ເງີນທອນ 0</p>
        </div>
      </Price>


    </Container>
  )
}

const Name = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr;
`
const Price = styled.div`
display: flex;
`
const Container = styled.div`
margin: 10px;
width: 80mm;
`
const Img = styled.div`
width: 90px;
height: 90px;
`
const Order = styled.div`
display: flex;
flex-direction: column;
`
