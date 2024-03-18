import React from "react";
import { Modal, Button } from "react-bootstrap";
import * as _ from "lodash";
export const preventNegativeValues = (e) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
export default function PopUpSelectMemberData({
  open,
  value,
  onClose,
  onSubmit,
  dataBill,
}) {
  // state

  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>ລາຍການສະມາຊິກ</Modal.Header>
      <Modal.Body>
        <div>
          <div>
            Name: Joe setPopAddStock
            Phone: 02097015341
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
