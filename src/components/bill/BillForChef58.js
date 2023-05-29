import React from "react";
import styled from "styled-components";
import moment from "moment";

export default function BillForChef58({ val, selectedTable, dataBill }) {
  return (
    <Container>
      <div
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: "bold",
          borderTop: "1px solid #000",
        }}
      >
        {val?.tableId?.name || selectedTable?.name}
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: 12,
          borderBottom: "1px dotted #000",
        }}
      >
        ວັນທີ: {moment(val?.createdAt).format("DD/MM/YY LT")}
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: "bold",
          borderBottom: "1px solid #000",
        }}
      >
        {val?.name} ({val?.quantity})
      </div>
    </Container>
  );
}

const Container = styled.div`
  margin: 10px;
  width: 100%;
`;
