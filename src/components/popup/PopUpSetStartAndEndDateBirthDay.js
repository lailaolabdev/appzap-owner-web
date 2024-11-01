import React, { useState, useEffect } from "react";
import moment from "moment";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import Box from "../Box";
import { useStore } from "../../store";
import { useTranslation } from "react-i18next";
export default function PopUpSetStartAndEndDateBirthDay({
  open,
  onClose,
  startDateBirthDay,
  setStartDateBirthDay,
  setEndDateBirthDay,
  setStartTimeBirthDay,
  setEndTimeBirthDay,
  startTimeBirthDay,
  endTimeBirthDay,
  endDateBirthDay,
}) {
  // state
  const [valueStartDate, setValueStartDate] = useState(startDateBirthDay);
  const [valueEndDate, setValueEndDate] = useState(endDateBirthDay);
  const [valueStartTime, setValueStartTime] = useState(startTimeBirthDay);
  const [valueEndTime, setValueEndTime] = useState(endTimeBirthDay);
  const [selectedButton, setSelectedButton] = useState(null);
  const { t } = useTranslation();
  // useEffect
  useEffect(() => {
    setValueStartDate(startDateBirthDay);
    setValueEndDate(endDateBirthDay);
    setValueStartTime(startTimeBirthDay);
    setValueEndTime(endTimeBirthDay);
  }, [startDateBirthDay, endDateBirthDay, startTimeBirthDay, endTimeBirthDay]);

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

  const onGetthreeDays = () => {
    const threeDays = moment().add(3, "days").format("YYYY-MM-DD");
    setValueStartDate(threeDays);
    setValueEndDate(threeDays);
    setSelectedButton("threeDays");
  };

  const onGetfiveDays = () => {
    const fiveDays = moment().add(5, "days").format("YYYY-MM-DD");
    setValueStartDate(fiveDays);
    setValueEndDate(fiveDays);
    setSelectedButton("fiveDays");
  };

  const onGetSevenDays = () => {
    const sevenDays = moment().add(7, "days").format("YYYY-MM-DD");
    setValueStartDate(sevenDays);
    setValueEndDate(sevenDays);
    setSelectedButton("sevenDays");
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

  const onGetMoreMonth = () => {
    const startOfLastMonth = moment()
      .add(1, "months")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfLastMonth = moment()
      .add(1, "months")
      .endOf("month")
      .format("YYYY-MM-DD");
    setValueStartDate(startOfLastMonth);
    setValueEndDate(endOfLastMonth);
    setSelectedButton("moreMonth");
  };

  const onGetMoreThreeMonth = () => {
    const startOfLastMonth = moment()
      .add(3, "months")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfLastMonth = moment()
      .add(3, "months")
      .endOf("month")
      .format("YYYY-MM-DD");
    setValueStartDate(startOfLastMonth);
    setValueEndDate(endOfLastMonth);
    setSelectedButton("moreThreeMonth");
  };

  // const onGetThisYear = () => {
  //   const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
  //   const endOfYear = moment().endOf("year").format("YYYY-MM-DD");
  //   setValueStartDate(startOfYear);
  //   setValueEndDate(endOfYear);
  //   setSelectedButton("thisYear");
  // };

  // const onGetLastYear = () => {
  //   const startOfLastYear = moment()
  //     .subtract(1, "years")
  //     .startOf("year")
  //     .format("YYYY-MM-DD");
  //   const endOfLastYear = moment()
  //     .subtract(1, "years")
  //     .endOf("year")
  //     .format("YYYY-MM-DD");
  //   setValueStartDate(startOfLastYear);
  //   setValueEndDate(endOfLastYear);
  //   setSelectedButton("lastYear");
  // };

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
            onClick={onGetthreeDays}
            variant={
              selectedButton === "threeDays" ? "primary" : "outline-primary"
            }
          >
            {t("3_more_day")}
          </Button>

          <Button
            onClick={onGetfiveDays}
            variant={
              selectedButton === "fiveDays" ? "primary" : "outline-primary"
            }
          >
            {t("5_more_day")}
          </Button>

          <Button
            onClick={onGetSevenDays}
            variant={
              selectedButton === "sevenDays" ? "primary" : "outline-primary"
            }
          >
            {t("7_more_day")}
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
            onClick={onGetMoreMonth}
            variant={
              selectedButton === "moreMonth" ? "primary" : "outline-primary"
            }
          >
            {t("1_more_month")}
          </Button>
          <Button
            onClick={onGetMoreThreeMonth}
            variant={
              selectedButton === "moreThreeMonth"
                ? "primary"
                : "outline-primary"
            }
          >
            {t("3_more_month")}
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
            setStartDateBirthDay(valueStartDate);
            setEndDateBirthDay(valueEndDate);
            setStartTimeBirthDay(valueStartTime);
            setEndTimeBirthDay(valueEndTime);
            onClose();
          }}
        >
          {t("confirm")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
