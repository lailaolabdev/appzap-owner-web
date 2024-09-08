import React from "react";
import styled from "styled-components";
import moment from "moment";

export default function CombinedBillForChefNoCut({
  storeDetail,
  selectedTable,
  table,
  selectedMenu,
}) {
  return (
    <div style={{ background: "#fff" }}>
      <Container>
        <table
          style={{
            tableLayout: "fixed",
            borderCollapse: "collapse",
            width: "100%",
            lineHeight: 1.3,
          }}
        >
          {selectedMenu.map((val, i) => (
            <React.Fragment key={i}>
              {i === 0 && (
                <tr>
                  <td
                    // colSpan={2}
                    style={{
                      background: "#000",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 20,
                      lineHeight: "100%",
                      padding: 5,
                    }}
                  >
                    {table?.tableId?.name || selectedTable?.name}
                  </td>
                  <td
                    style={{
                      color: "#000",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    {val?.code || selectedTable?.code} | #
                    {val?.queue || selectedTable?.queue}
                  </td>
                </tr>
              )}

              <tr>
                <td
                  colSpan={2}
                  style={{
                    color: "#000",
                    fontSize: 16,
                    wordWrap: "break-word",
                    textAlign: "left",
                    padding: "0", // Reduced padding
                  }}
                >
                  {val?.name} (x {val?.quantity})
                </td>
              </tr>
              {val?.note && (
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      color: "#000",
                      fontSize: 18,
                      wordWrap: "break-word",
                      textAlign: "left",
                      padding: "0", // Reduced padding
                    }}
                  >
                    {val?.note}
                  </td>
                </tr>
              )}
              {i === selectedMenu.length - 1 && (
                <tr>
                  <td
                    colSpan={2}
                    style={{ borderTop: "1px dotted #000", paddingTop: "5px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
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
              )}
            </React.Fragment>
          ))}
        </table>
      </Container>
    </div>
  );
}

const Container = styled("div")({
  width: "100%",
  minWidth: "260px",
  maxWidth: "260px",
  border: "1px solid #000",
  backgroundColor: "#fff",
  margin: 0, // Ensure no margin
  padding: 0, // Ensure no padding
});
