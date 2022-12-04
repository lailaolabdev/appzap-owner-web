import React from "react";
import styled from "styled-components";
import moment from "moment";

export default function BillForChef58({ val, selectedTable, dataBill }) {
  return (
    <Container>
      <div style={{ textAlign: "center" }}>
        <h1>{selectedTable?.tableName}</h1>
      </div>
      <hr></hr>

      <div style={{ textAlign: "center" }}>
        <p>
          ວັນທີ: {moment(dataBill?.createdAt).format("DD-MMMM-YYYY HH:mm:ss")}
        </p>
      </div>
      <hr></hr>

      <div style={{ textAlign: "center" }}>
        {val?.name} ({val?.quantity})
      </div>
      <hr></hr>
    </Container>
  );
}

const Container = styled.div`
  width: 58mm;
`;
