import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { moneyCurrency } from "../../helpers/index";
import QRCode from "react-qr-code";
import { useStore } from "../../store";
import moment from "moment";
export default function BillFark80({
  menuFarkData,
  expirDate,
  customerName,
  customerPhone,
  code,
}) {
  const { storeDetail } = useStore();
  return (
    <Container>
      <div
        style={{
          flexDirection: "column",
          alignItems: "start",
          width: "100%",
          display: code ? "flex" : "none",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {storeDetail?.name}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          ບິນຝາກສິນຄ້າ
        </div>
        <div>ຊື່ລູກຄ້າ: {customerName}</div>
        <div>ເບີໂທລູກຄ້າ: {customerPhone}</div>
        <div>ມື້ຝາກ: {moment(moment()).format("DD-MM-YYYY")}</div>
        <div>ມື້ໝົດກຳນົດ: {moment(expirDate).format("DD-MM-YYYY")}</div>
        <div style={{ marginBottom: 5 }}>
          ລະຫັດບິນ:
          <span
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "2px 10px",
              fontWeight: "bold",
            }}
          >
            {code}
          </span>
        </div>
        <div style={{ width: "100%" }}>
          <Table>
            <tr>
              <th>ຊື່ເມນູ</th>
              <th style={{ textAlign: "center" }}>ຈຳນວນ</th>
            </tr>
            {menuFarkData?.map((e) => (
              <tr>
                <td style={{ textAlign: "start" }}>{e?.name}</td>
                <td>{e?.cartCount}</td>
              </tr>
            ))}
          </Table>
        </div>
        <hr style={{ borderBottom: "1px dotted #000", width: "100%" }} />
        <div>ກະລຸນາເກັບບິນໄວໃຫ້ຫ່າງຈາກນ້ຳແລະຄວາມຮ້ອນ</div>
      </div>
    </Container>
  );
}
const Container = styled.div`
  color: #000;
  width: 100%;
  max-width: 330px;
  padding-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Img = styled.div`
  width: 200px;
  height: 200px;
  font-size: 14px;
  border: 2px dotted #000;
`;

const Table = styled("table")({
  width: "100%",
  th: {
    border: "1px solid #fff",
    padding: "2px 4px",
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "bold",
  },
  td: {
    padding: "2px 2px",
  },
});
