import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import QRCode from "react-qr-code";

export default function PopUpStoreCancle({
  tableName,
  open,
  qr,
  storeId,
  onClose,
  onSubmit,
}) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>{tableName}</Modal.Header>
      <Modal.Body>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>QR ສຳຫຼັບລູກຄ້າສັງເອງ </div>
          <div style={{ width: "100%", maxWidth: "400px" }}>
          <QRCode value={`https://client.appzap.la/store/${storeId}?token=${qr}`} />
            {/* <img
              src={`https://chart.googleapis.com/chart?cht=qr&chl=https://client.appzap.la/store/${storeId}?token=${qr}&chs=500x500&choe=UTF-8`}
              alt=""
              style={{ width: "100%" }}
            /> */}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
