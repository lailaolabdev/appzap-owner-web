import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";

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
            <img
              src={`https://chart.googleapis.com/chart?cht=qr&chl=https://client.appzap.la/store/${code?.storeId}?table=${code?.tableId}&chs=500x500&choe=UTF-8`}
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
