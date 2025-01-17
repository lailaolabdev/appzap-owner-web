import React, { useState, useEffect } from "react";
import moment from "moment";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import Box from "../Box";
import { useStore } from "../../store";
import { useTranslation } from "react-i18next";

import { useStoreStore } from "../../zustand/storeStore";

export default function PopUpSetStartAndEndDateRefine({
  open,
  onClose,
  setStartDate,
  startDate,
  setEndDate,
  endDate,
}) {
  const { t } = useTranslation();
  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();
  // state
  const [valueStartDate, setValueStartDate] = useState(startDate);
  const [valueEndDate, setValueEndDate] = useState(endDate);
  const [selectedButton, setSelectedButton] = useState(null);

  // useEffect
  useEffect(() => {
    setValueStartDate(startDate);
    setValueEndDate(endDate);
  }, [startDate, endDate]);

  const onGetToday = () => {
    const today = moment().format("YYYY-MM-DD");
    setValueStartDate(today + "T00:00:00Z"); // Start of today
    setValueEndDate(today + "T23:59:59Z"); // End of today
    setSelectedButton("today");
  };

  const onGetYesterday = () => {
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
    setValueStartDate(yesterday + "T00:00:00Z"); // Start of yesterday
    setValueEndDate(yesterday + "T23:59:59Z"); // End of yesterday
    setSelectedButton("yesterday");
  };

  const onGetThisMonth = () => {
    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
    setValueStartDate(startOfMonth + "T00:00:00Z"); // Start of the month
    setValueEndDate(endOfMonth + "T23:59:59Z"); // End of the month
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
    setValueStartDate(startOfLastMonth + "T00:00:00Z"); // Start of last month
    setValueEndDate(endOfLastMonth + "T23:59:59Z"); // End of last month
    setSelectedButton("lastMonth");
  };

  const onGetThisYear = () => {
    const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
    const endOfYear = moment().endOf("year").format("YYYY-MM-DD");
    setValueStartDate(startOfYear + "T00:00:00Z"); // Start of the year
    setValueEndDate(endOfYear + "T23:59:59Z"); // End of the year
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
    setValueStartDate(startOfLastYear + "T00:00:00Z"); // Start of last year
    setValueEndDate(endOfLastYear + "T23:59:59Z"); // End of last year
    setSelectedButton("lastYear");
  };

  return (
    <Modal show={open} onHide={onClose} size="lg">
      <Modal.Header closeButton>{t("select_date")}</Modal.Header>
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
            {t("yesterday")}
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
            {t("this_year")}
          </Button>
          <Button
            onClick={onGetLastYear}
            variant={
              selectedButton === "lastYear" ? "primary" : "outline-primary"
            }
          >
            {t("last_year")}
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
              value={moment(valueStartDate).format("YYYY-MM-DD")}
              onChange={(e) => {
                setValueStartDate(e.target.value);
              }}
              max={valueEndDate}
            />
          </InputGroup>
          <div style={{ textAlign: "center", marginTop: 5 }}> ~ </div>
          <InputGroup>
            <Form.Control
              type="date"
              value={moment(valueStartDate).format("YYYY-MM-DD")}
              onChange={(e) => {
                setValueEndDate(e.target.value);
              }}
              min={valueStartDate}
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
            setStartDate(valueStartDate);
            setEndDate(valueEndDate);

            setStoreDetail({
              branchStartDate: valueStartDate,
              branchEndDate: valueEndDate,
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
