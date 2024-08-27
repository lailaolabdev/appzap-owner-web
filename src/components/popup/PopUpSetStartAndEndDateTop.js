import React, { useState, useEffect } from "react";
import moment from "moment";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import Box from "../Box";
import { useStore } from "../../store";

export default function PopUpSetStartAndEndDateTop({
  open,
  onClose,
  startDateTop,
  setStartDateTop,
  setEndDateTop,
  setStartTimeTop,
  setEndTimeTop,
  startTimeTop,
  endTimeTop,
  endDateTop,
}) {
  // state
  const [valueStartDate, setValueStartDate] = useState(startDateTop);
  const [valueEndDate, setValueEndDate] = useState(endDateTop);
  const [valueStartTime, setValueStartTime] = useState(startTimeTop);
  const [valueEndTime, setValueEndTime] = useState(endTimeTop);
  const [selectedButton, setSelectedButton] = useState(null);

  const { storeDetail, setStoreDetail } = useStore();

  // useEffect
  useEffect(() => {
    setValueStartDate(startDateTop);
    setValueEndDate(endDateTop);
    setValueStartTime(startTimeTop);
    setValueEndTime(endTimeTop);
  }, [startDateTop, endDateTop, startTimeTop, endTimeTop]);

  const onGetToday = () => {
    const today = moment().format("YYYY-MM-DD");
    setValueStartDate(today);
    setValueEndDate(today);
    setSelectedButton("today");
  };

  const onGetYesterday = () => {
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
    setValueStartDate(yesterday);
    setValueEndDate(yesterday);
    setSelectedButton("yesterday");
  };

  const onGetThisMonth = () => {
    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
    setValueStartDate(startOfMonth);
    setValueEndDate(endOfMonth);
    setSelectedButton("thisMonth");
  };

  const onGetLastMonth = () => {
    const startOfLastMonth = moment()
      .subtract(1, "months")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfLastMonth = moment()
      .subtract(1, "months")
      .endOf("month")
      .format("YYYY-MM-DD");
    setValueStartDate(startOfLastMonth);
    setValueEndDate(endOfLastMonth);
    setSelectedButton("lastMonth");
  };

  const onGetThisYear = () => {
    const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
    const endOfYear = moment().endOf("year").format("YYYY-MM-DD");
    setValueStartDate(startOfYear);
    setValueEndDate(endOfYear);
    setSelectedButton("thisYear");
  };

  const onGetLastYear = () => {
    const startOfLastYear = moment()
      .subtract(1, "years")
      .startOf("year")
      .format("YYYY-MM-DD");
    const endOfLastYear = moment()
      .subtract(1, "years")
      .endOf("year")
      .format("YYYY-MM-DD");
    setValueStartDate(startOfLastYear);
    setValueEndDate(endOfLastYear);
    setSelectedButton("lastYear");
  };

  return (
    <Modal show={open} onHide={onClose} size="lg">
      <Modal.Header closeButton>ເລືອກວັນທີ Top</Modal.Header>
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
            onClick={onGetToday}
            variant={selectedButton === "today" ? "primary" : "outline-primary"}
          >
            ມື້ນີ້
          </Button>
          <Button
            onClick={onGetYesterday}
            variant={
              selectedButton === "yesterday" ? "primary" : "outline-primary"
            }
          >
            ມື້ວານ
          </Button>
          <Button
            onClick={onGetThisMonth}
            variant={
              selectedButton === "thisMonth" ? "primary" : "outline-primary"
            }
          >
            ເດືອນນີ້
          </Button>
          <Button
            onClick={onGetLastMonth}
            variant={
              selectedButton === "lastMonth" ? "primary" : "outline-primary"
            }
          >
            ເດືອນກ່ອນ
          </Button>
          <Button
            onClick={onGetThisYear}
            variant={
              selectedButton === "thisYear" ? "primary" : "outline-primary"
            }
          >
            ປີນີ້
          </Button>
          <Button
            onClick={onGetLastYear}
            variant={
              selectedButton === "lastYear" ? "primary" : "outline-primary"
            }
          >
            ປີກ່ອນ
          </Button>
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
            setStartDateTop(valueStartDate);
            setEndDateTop(valueEndDate);
            setStartTimeTop(valueStartTime);
            setEndTimeTop(valueEndTime);

            setStoreDetail({
              ...storeDetail,
              startDateTop: moment(valueStartDate).format("DD"),
              endDateTop: moment(valueEndDate).format("DD"),
              monthTop: moment(valueStartDate).format("MM"),
            });
            onClose();
          }}
        >
          ຍືນຢັນ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
