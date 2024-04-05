import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import TimePicker from "react-bootstrap-time-picker";
import Box from "../Box";

export default function PopUpSetStartAndEndDate({
  open,
  onClose,
  startDate,
  setStartDate,
  setEndDate,
  setStartTime,
  setEndTime,
  startTime,
  endTime,
  endDate,
}) {
  // state
  const [valueStartDate, setValueStartDate] = useState(startDate);
  const [valueEndDate, setValueEndDate] = useState(endDate);
  const [valueStartTime, setValueStartTime] = useState(startTime);
  const [valueEndTime, setValueEndTime] = useState(endTime);
  // useEffect
  useEffect(() => {
    setValueStartDate(startDate);
    setValueEndDate(endDate);
    setValueStartTime(startTime);
    setValueEndTime(endTime);
  }, [startDate, endDate, startTime, endTime]);

  return (
    <Modal show={open} onHide={onClose} size="lg">
      <Modal.Header closeButton>ເລືອກວັນທີ</Modal.Header>
      <Modal.Body
        style={{
          boxSizing: "border-box",
          overflow: "auto",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr 1fr", xs: "1fr 1fr" },
            width: "100%",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <Button
            disabled
            // onClick={onGetToday}
          >
            ມື້ນີ້
          </Button>
          <Button disabled>ມື້ວານ</Button>
          <Button disabled>ເດືອນນີ້</Button>
          <Button disabled>ເດືອນກ່ອນ</Button>
          <Button disabled>ປີນີ້</Button>
          <Button disabled>ປີກ່ອນ</Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap:{ md: 20, xs: 10 },
            justifyContent: "space-between",
            flexDirection: { md: "row", xs: "column" },
          }}
        >
          <InputGroup>
            <Form.Control
              type="date"
              value={valueStartDate}
              onChange={(e) => {
                setValueStartDate(e.target.value);
              }}
              max={valueEndDate}
            />
            <Form.Control
              type="time"
              step={3}
              value={valueStartTime}
              onChange={(e) => {
                setValueStartTime(e.target.value);
              }}
              max={valueEndDate}
            />
          </InputGroup>
          <div style={{textAlign:"center"}}> ຫາ </div>
          <InputGroup>
            <Form.Control
              type="date"
              value={valueEndDate}
              onChange={(e) => {
                setValueEndDate(e.target.value);
              }}
              min={valueStartDate}
            />
            <Form.Control
              type="time"
              step={3}
              value={valueEndTime}
              onChange={(e) => {
                setValueEndTime(e.target.value);
              }}
              max={valueEndDate}
            />
          </InputGroup>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          ຍົກເລີກ
        </Button>
        <Button
          onClick={() => {
            setStartDate(valueStartDate);
            setEndDate(valueEndDate);
            setStartTime(valueStartTime);
            setEndTime(valueEndTime);
            onClose();
          }}
        >
          ຍືນຢັນ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
