import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { moneyCurrency } from "../../helpers/index";
import { useStore } from "../../store";
export default function BillForReport80({}) {
  const {storeDetail}=useStore()
  return (
    <Container>
      <div style={{ fontWeight: "bold", fontSize: 24 }}>ລາຍງານຍອດຂາຍ</div>
      <div style={{ fontWeight: "bold" }}>ເລີ່ມ: 2023/07/17 00:00:00</div>
      <div style={{ fontWeight: "bold" }}>ຫາ: 2023/07/17 23:59:59</div>
      <hr style={{ borderBottom: "1px dotted #000" }} />
      {[
        {
          name: "ຈຳນວນບິນ:",
          value: 66,
        },
        {
          name: "ຍອດທັງຫມົດ:",
          value: 900000,
          type: storeDetail?.firstCurrency,
        },
        {
          name: "ຈ່າຍເງິນສົດ:",
          value: 8000,
          type: storeDetail?.firstCurrency,
        },
        {
          name: "ຈ່າຍເງິນໂອນ:",
          value: 40000,
          type: storeDetail?.firstCurrency,
        },
        {
          name: "ບິນສ່ວນຫຼຸດ:",
          value: 666,
        },
        {
          name: "ສ່ວນຫຼຸດ:",
          value: 666,
          type: storeDetail?.firstCurrency,
        },
        {
          name: "ບິນຄ້າງ:",
          value: 10,
        },
        {
          name: "ເງິນຄ້າງ:",
          value: 6669999,
          type: storeDetail?.firstCurrency,
        },
      ].map((e) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ textAlign: "left", fontWeight: "bold" }}>
            {e?.name}
          </span>
          <span style={{ textAlign: "right", fontWeight: "bold" }}>
            {moneyCurrency(e?.value)} {e?.type}
          </span>
        </div>
      ))}
      <hr style={{ borderBottom: "1px dotted #000" }} />
      <div>
        <TableComponent>
          <tr style={{ fontWeight: "bold" }}>
            <td style={{ textAlign: "left" }}>#</td>
            <td style={{ textAlign: "center" }}>ລະຫັດ</td>
            <td style={{ textAlign: "center" }}>ອໍເດີ</td>
            {/* <td style={{ textAlign: "center" }}>ເງິນສົດ</td>
            <td style={{ textAlign: "center" }}>ເງິນໂອນ</td> */}
            <td style={{ textAlign: "center" }}>ສ່ວນຫຼຸດ</td>
            <td style={{ textAlign: "right" }}>ບິນລວມ</td>
          </tr>
          {[...new Array(20)].map((e, i) => (
            <tr>
              <td style={{ textAlign: "left" }}>{i + 1}</td>
              <td style={{ textAlign: "center" }}>{e?.code || "ERT1T3Z"}</td>
              <td style={{ textAlign: "center" }}>{e?.transfer || 23}</td>
              {/* <td style={{ textAlign: "center" }}>
                {e?.transfer || moneyCurrency(9000000)}
              </td>
              <td style={{ textAlign: "center" }}>
                {e?.transfer || moneyCurrency(9000000)}
              </td> */}
              <td style={{ textAlign: "center" }}>
                {e?.transfer || moneyCurrency(0)}
              </td>
              <td style={{ textAlign: "right" }}>
                {e?.value || moneyCurrency(9000000)}
              </td>
            </tr>
          ))}
        </TableComponent>
      </div>
    </Container>
  );
}

const TableComponent = styled("table")({
  width: "100%",
  color: "#000",
  td: {
    padding: 0,
    color: "#000",
  },
});
const Price = styled.div`
  display: flex;
`;
const Container = styled.div`
  color: #000;
  width: 100%;
  max-width: 330px;
  padding-bottom: 30px;
`;
