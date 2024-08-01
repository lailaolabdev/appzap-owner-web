import React from "react";
import { Modal } from "react-bootstrap";

export default function PopUpAddCategoryType({ open, onClose }) {
  return (
    <div>
      <Modal show={open} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>ສ້າງໝວດໝູ່</Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
      </Modal>
    </div>
  );
}
