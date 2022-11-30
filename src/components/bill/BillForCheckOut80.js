import styled from "styled-components";
import axios from "axios";
import { END_POINT_SEVER } from "../../constants/api";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getHeaders } from "../../services/auth";

export default function BillForCheckOut80({ storeDetail, selectedTable }) {
  console.log(storeDetail);

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
          <p>ລະຫັດໂຕະ: {selectedTable?.code}</p>
          <p>ວັນທີ: 29-11-2022</p>
        </div>
        <div style={{ flexGrow: 1 }}></div>
        <Img>
          <img
            src="https://chart.googleapis.com/chart?cht=qr&chl=angie&chs=500x500&choe=UTF-8"
            style={{ wifth: "100%", height: "100%" }}
          />
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
      <Name>
        <p>beerlao</p>
        <p>4</p>
        <p>20,000</p>
        <p>80,000</p>
      </Name>
      <hr></hr>
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <div>
          <p>ລວມ: 80,000 ກີບ</p>
          <p>ສ່ວນຫຼຸດ(ກີບ) 0</p>
        </div>
      </Price>
      <hr></hr>
      <Price>
        <div style={{ flexGrow: 1 }}></div>
        <h6>ເງິນທີ່ຕ້ອງຊຳລະ 100,000 ກີບ</h6>
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
  width: 80mm;
`;
const Img = styled.div`
  width: 90px;
  height: 90px;
`;
