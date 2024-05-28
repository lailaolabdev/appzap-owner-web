import React from "react";
import styled from "styled-components";
import moment from "moment";
import { moneyCurrency } from "../../helpers";

export default function BillForChefNoCutTrailer({ selectedTable, dataBill, val, itemLen }) {
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
              colspan={2}
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
              {val?.name} ({val?.quantity})
            </td>
          </tr>
          {val?.note ? <tr>
            <td
              colspan={2}
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
          </tr> : <span />}
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
      {/* <div style={{ height: 10 }} /> */}
    </div>
  );
}

const Container = styled("div")({
  width: "100%",
  minWidth: "260px",
  maxWidth: "260px",
  borderLeft: '1px solid #000',
  borderRight: '1px solid #000',
  borderBottom: '1px solid #000',
  backgroundColor: "#fff",
});
