import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
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

  const onGetToday = () => {
    const today = moment().format("YYYY-MM-DD");
    setValueStartDate(today);
    setValueEndDate(today);
  };

  const onGetYesterday = () => {
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
    setValueStartDate(yesterday);
    setValueEndDate(yesterday);
  };

  const onGetThisMonth = () => {
    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
    setValueStartDate(startOfMonth);
    setValueEndDate(endOfMonth);
  };

  const onGetLastMonth = () => {
    const startOfLastMonth = moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD");
    const endOfLastMonth = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");
    setValueStartDate(startOfLastMonth);
    setValueEndDate(endOfLastMonth);
  };

  const onGetThisYear = () => {
    const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
    const endOfYear = moment().endOf("year").format("YYYY-MM-DD");
    setValueStartDate(startOfYear);
    setValueEndDate(endOfYear);
  };

  const onGetLastYear = () => {
    const startOfLastYear = moment().subtract(1, "years").startOf("year").format("YYYY-MM-DD");
    const endOfLastYear = moment().subtract(1, "years").endOf("year").format("YYYY-MM-DD");
    setValueStartDate(startOfLastYear);
    setValueEndDate(endOfLastYear);
  };

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
          <Button onClick={onGetToday}>ມື້ນີ້</Button>
          <Button onClick={onGetYesterday}>ມື້ວານ</Button>
          <Button onClick={onGetThisMonth}>ເດືອນນີ້</Button>
          <Button onClick={onGetLastMonth}>ເດືອນກ່ອນ</Button>
          <Button onClick={onGetThisYear}>ປີນີ້</Button>
          <Button onClick={onGetLastYear}>ປີກ່ອນ</Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: { md: 20, xs: 10 },
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
          <div style={{ textAlign: "center" }}> ຫາ </div>
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
