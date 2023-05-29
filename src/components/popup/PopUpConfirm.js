import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";

export default function PopUpConfirm({
  open,
  text1,
  text2,
  onClose,
  onSubmit,
}) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div style={{ textAlign: "center" }}>
          <div>{text1 && text1}</div>
          <div style={{ color: "red" }}>{text2 && text2}</div>
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
          ຢືນຢັນ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
