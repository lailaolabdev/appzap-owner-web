import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import StatusComponent from "../StatusComponent";

export default function PopUpStaffUpdateOrder({
  tableName,
  open,
  countItemUpdate,
  onClose,
  onSubmit,
}) {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>ອັບເດດອໍເດີໂຕະ {tableName}</Modal.Header>
      <Modal.Body>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>ລາຍການອັບເດດ ({countItemUpdate}) ລາຍການ</div>
          <div>ອັບເດດສະຖາເປັນ ເສີບແລ້ວ</div>
          <StatusComponent status="SERVED" />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSubmit}>ຍືນຍັນການອັບເດດ</Button>
      </Modal.Footer>
    </Modal>
  );
}
