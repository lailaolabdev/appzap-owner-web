import React from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";

export default function PopUpConfirmDeletion({
  open,
  text,
  onClose,
  onSubmit,
}) {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div style={{ textAlign: "center" }}>
          <div>ທ່ານຕ້ອງການລົບຂໍ້ມູນ? </div>
          <div style={{ color: "red" }}>{text && text}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onClose}>
          ຍົກເລີກ
        </Button>
        <Button
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={onSubmit}>
          ຢືນຢັນການລົບ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
