import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import QRCode from "react-qr-code";
import { t } from "i18next";

export default function PopUpStoreCancle({
  tableName,
  open,

  qr,
  storeId,
  onGenerateQR = () => {},
  onClose,
  onSubmit,
}) {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Body>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="text-2xl font-semibold"> {tableName} </div>
          <div>QR ສຳຫຼັບລູກຄ້າສັງເອງ </div>
          <div style={{ width: "100%", maxWidth: "400px" }}>
            {/* <QRCode value={`https://client.appzap.la/store/${storeId}?token=${qr}`} /> */}
            <img
              src={`https://app-api.appzap.la/qr-gennerate/qr?data=https://client.appzap.la/store/${storeId}?token=${qr}`}
              alt=""
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={async () => {
            await onGenerateQR();
          }}
          disabled={buttonDisabled}
          style={{
            backgroundColor: COLOR_APP,
            borderColor: COLOR_APP,
          }}
        >
          {t("Print")} QR
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setButtonDisabled(false);
            onClose();
          }}
        >
          {t("cancel")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
