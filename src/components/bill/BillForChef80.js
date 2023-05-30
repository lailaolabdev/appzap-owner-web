import React from "react";
import styled from "styled-components";
import moment from "moment";
import { moneyCurrency } from "../../helpers";

export default function BillForChef58({ selectedTable, dataBill, val }) {
  return (
    <div style={{ background: "#fff" }}>
      <Container>
        <table
          style={{
            tableLayout: "fixed",
            borderCollapse: "collapse",
            width: "100%",
            lineHeight: 0,
            // padding: 0 10px;
          }}
        >
          <tr>
            <td
              style={{
                background: "#000",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              {val?.tableId?.name || selectedTable?.name}
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
              colspan={2}
              style={{
                color: "#000",
                fontWeight: "bold",
                fontSize: 20,
                textAlign: "left",
              }}
            >
              {val?.name} ({val?.quantity})
            </td>
          </tr>
          <tr>
            <td
              colspan={2}
              style={{
                color: "#000",
                fontSize: 14,
                textAlign: "left",
              }}
            >
              {moneyCurrency(val?.price)} x {val?.quantity}
            </td>
          </tr>
          <tr>
            <td colspan={2} style={{ borderTop: "1px dotted #000" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  {val?.createdBy?.name}
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
  // marginL: "10px",
  // padding: 10,
});
