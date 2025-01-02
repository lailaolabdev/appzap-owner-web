import React, { useState, useEffect } from "react";
import moment from "moment";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import Box from "../Box";
import { useTranslation } from "react-i18next";

import { useStoreStore } from "../../zustand/storeStore";

export default function PopUpSetStartAndEndDateCafe({
  open,
  onClose,
  startDateCafe,
  setStartDateCafe,
  setEndDateCafe,
  setStartTimeCafe,
  setEndTimeCafe,
  startTimeCafe,
  endTimeCafe,
  endDateCafe,
}) {
  // state
  const [valueStartDate, setValueStartDate] = useState(startDateCafe);
  const [valueEndDate, setValueEndDate] = useState(endDateCafe);
  const [valueStartTime, setValueStartTime] = useState(startTimeCafe);
  const [valueEndTime, setValueEndTime] = useState(endTimeCafe);
  const [selectedButton, setSelectedButton] = useState(null);

  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();
  const { t } = useTranslation();
  // useEffect
  useEffect(() => {
    setValueStartDate(startDateCafe);
    setValueEndDate(endDateCafe);
    setValueStartTime(startTimeCafe);
    setValueEndTime(endTimeCafe);
  }, [startDateCafe, endDateCafe, startTimeCafe, endTimeCafe]);

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
            onClick={onGetToday}
            variant={selectedButton === "today" ? "primary" : "outline-primary"}
          >
            {t("today")}
          </Button>
          <Button
            onClick={onGetYesterday}
            variant={
              selectedButton === "yesterday" ? "primary" : "outline-primary"
            }
          >
            {t("yester_day")}
          </Button>
          <Button
            onClick={onGetThisMonth}
            variant={
              selectedButton === "thisMonth" ? "primary" : "outline-primary"
            }
          >
            {t("this_month")}
          </Button>
          <Button
            onClick={onGetLastMonth}
            variant={
              selectedButton === "lastMonth" ? "primary" : "outline-primary"
            }
          >
            {t("last_month")}
          </Button>
          <Button
            onClick={onGetThisYear}
            variant={
              selectedButton === "thisYear" ? "primary" : "outline-primary"
            }
          >
            {t("this_years")}
          </Button>
          <Button
            onClick={onGetLastYear}
            variant={
              selectedButton === "lastYear" ? "primary" : "outline-primary"
            }
          >
            {t("last_years")}
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
          {t("cancel")}
        </Button>
        <Button
          onClick={() => {
            setStartDateCafe(valueStartDate);
            setEndDateCafe(valueEndDate);
            setStartTimeCafe(valueStartTime);
            setEndTimeCafe(valueEndTime);

            setStoreDetail({
              startDateCafe: moment(valueStartDate).format("DD"),
              endDateCafe: moment(valueEndDate).format("DD"),
              monthCafe: moment(valueStartDate).format("MM"),
            });
            onClose();
          }}
        >
          {t("confirm")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
