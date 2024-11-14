import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { moneyCurrency } from "../../helpers/index";
import QRCode from "react-qr-code";
export default function BillQRShortSmartOrdering80({
  CodeShortLink = "",
  tableName = "",
}) {
  return (
    <Container>
      <h2>{tableName}</h2>
      <div>QR ສຳຫຼັບສັ່ງອາຫານ</div>
      <div>
        v2:{" "}
        {CodeShortLink
          ? `https://apz.pw/${CodeShortLink}`.toLowerCase()
          : "URL not available"}
      </div>
      <Img>
        {CodeShortLink ? (
          <img
            src={`https://app-api.appzap.la/qr-gennerate/qr?data=https://apz.pw/${CodeShortLink}`.toLowerCase()}
            style={{ width: "180px", height: "180px" }}
            alt="QR Code"
          />
        ) : (
          <p>QR Code not available</p>
        )}
      </Img>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  height: 200px;
  font-size: 14px;
  border: 2px dotted #000;
`;
