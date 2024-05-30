import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import TimePicker from "react-bootstrap-time-picker";
import { BsPrinter } from "react-icons/bs";

export default function PopUpPrintReport({ open, onClose, setPopup }) {
  // state

  // useEffect

  return (
    <Modal show={open} onHide={onClose} size="md">
      <Modal.Header
        closeButton
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <BsPrinter /> ເລືອກສິງທີຕ້ອງການປິນ
      </Modal.Header>
      <Modal.Body
        style={{
          boxSizing: "border-box",
          overflow: "auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => setPopup({ printReportSale: true })}
          >
            <span>ປະຫວັດບິນ</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => setPopup({ printReportStaffSale: true })}
          >
            <span>ປະຫວັດພະນັກງານ</span>
          </Button>
          <Button style={{ height: 100, padding: 20 }} disabled>
            <span>ປະຫວັດສະແກນ</span>
          </Button>

          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => setPopup({ printReportMenuSale: true })}
          >
            <span>ລາຍງານເມນູ</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => setPopup({ printReportMenuCategorySale: true })}
          >
            <span>ລາຍງານປະເພດເມນູ</span>
          </Button>
          <Button
            style={{ height: 100, padding: 20 }}
            onClick={() => setPopup({ printReportMenuAndCategorySale: true })}
          >
            <span>ລາຍງານເມນູແລະປະເພດ</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
