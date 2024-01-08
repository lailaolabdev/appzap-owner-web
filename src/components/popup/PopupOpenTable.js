import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import QRCode from "react-qr-code";

export default function PopupOpenTable({
  open,
  storeId,
  code,
  onClose,
  onSubmit,
}) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div style={{ textAlign: "center" }}>
          <div>QR ໂຕະ {code?.tableName}</div>
          <div style={{ width: "100%", maxWidth: "400px" }}>
            {/* <QRCode
              value={`https://client.appzap.la/store/${code?.storeId}?table=${code?.tableId}`}
            /> */}
            <img
              src={`https://app-api.appzap.la/qr-gennerate/qr?data=https://client.appzap.la/store/${code?.storeId}?table=${code?.tableId}`}
              alt=""
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={buttonDisabled} variant="secondary" onClick={onClose}>
          ຍົກເລີກ
        </Button>
        <Button
          disabled={buttonDisabled}
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={() => {
            setButtonDisabled(true);
            onSubmit().then(() => setButtonDisabled(false));
          }}
        >
          ຢືນຢັນການເປີດໂຕະ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
