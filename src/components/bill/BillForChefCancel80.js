import React from "react";
import styled from "styled-components";
import moment from "moment";
import { moneyCurrency } from "../../helpers";

export default function BillForChefCancel80({ selectedTable, dataBill, val }) {
  const optionsNames = val?.options?.map(option => `[${option.name}]`).join('') || '';
  const totalOptionPrice = val?.totalOptionPrice || 0;
  const itemPrice = val?.price + totalOptionPrice;

  return (
    <div style={{ background: "#fff" }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{">>ບິນຍົກເລີກ<<"}</div>
      <Container>
        <table
          style={{
            tableLayout: "fixed",
            borderCollapse: "collapse",
            width: "100%",
            lineHeight: 0,
          }}
        >
          <tr>
            <td
              style={{
                color: "#000",
                fontWeight: "bold",
                fontSize: 20,
                lineHeight: "100%",
                padding: 5,
              }}
            >
              {val?.tableId?.name || selectedTable?.tableName}
            </td>
            <td
              style={{
                color: "#000",
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              {val?.code}
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              style={{
                color: "#000",
                fontWeight: "bold",
                fontSize: 20,
                lineHeight: "100%",
                wordWrap: "break-word",
                textAlign: "left",
                padding: 5,
              }}
            >
              {val?.name} {optionsNames} ({val?.quantity})
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              style={{
                color: "#000",
                fontSize: 18,
                lineHeight: "100%",
                wordWrap: "break-word",
                textAlign: "left",
                padding: 5,
              }}
            >
              {val?.note}
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              style={{
                color: "#000",
                fontSize: 14,
                textAlign: "left",
              }}
            >
              {moneyCurrency(itemPrice)} x {val?.quantity}
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ borderTop: "1px dotted #000" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  {val?.createdBy?.firstname}
                </div>
                <div
                  style={{
                    fontSize: 12,
                  }}
                >
                  {moment(val?.createdAt).format("DD/MM/YY")} |{" "}
                  {moment(val?.createdAt).format("LT")}
                </div>
              </div>
            </td>
          </tr>
        </table>
      </Container>
      <div style={{ height: 10 }} />
    </div>
  );
}

const Container = styled("div")({
  width: "100%",
  minWidth: "260px",
  maxWidth: "260px",
  border: "1px solid #000",
  backgroundColor: "#fff",
});
