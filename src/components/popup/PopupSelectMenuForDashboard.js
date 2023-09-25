import React, { useState } from "react";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import { FaSearch } from "react-icons/fa";

export default function PopupSelectMenuForDashboard({
  open,
  text,
  onClose,
  onSubmit,
}) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  return (
    <Modal show={open} onHide={onClose} size="lg">
      <Modal.Header closeButton>ເລືອກສິນຄ້າ</Modal.Header>
      <Modal.Body
        style={{
          boxSizing: "border-box",
          overflow: "auto",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <Form.Control placeholder="search" />
          <Button>
            <FaSearch />
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>ຍົກເລີກ</Button>
        <Button>ຍືນຍັນ</Button>
      </Modal.Footer>
    </Modal>
  );
}
