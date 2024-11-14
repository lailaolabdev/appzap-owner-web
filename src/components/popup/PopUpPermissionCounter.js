import React, { useEffect, useState } from "react";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import Box from "../Box";
import moment from "moment";

export default function PopUpPermissonCounter({
  open,
  onClose,
  dateStart,
  dateEnd,
  setDateStart,
  setDateEnd,
  days ,
}) {
  const [tempDateStart, setTempDateStart] = useState(dateStart);
  const [tempDateEnd, setTempDateEnd] = useState(dateEnd);

  const handlePresetDate = (type) => {
    let start, end;

    switch (type) {
      case "today":
        start = moment().startOf("day");
        end = moment().endOf("day");
        break;
      case "yesterday":
        start = moment().subtract(1, "days").startOf("day");
        end = moment().endOf("day");
        break;
      case "3days":
        start = moment().subtract(2, "days").startOf("day");
        end = moment().endOf("day");
        break;
      case "5days":
        start = moment().subtract(4, "days").startOf("day");
        end = moment().endOf("day");
        break;
      case "7days":
        start = moment().subtract(6, "days").startOf("day");
        end = moment().endOf("day");
        break;
      default:
        break;
    }

    setTempDateStart(start.toDate());
    setTempDateEnd(end.toDate());
  };

  const handleDateChange = (type, value) => {
    if (type === "start") {
      setTempDateStart(value);
    } else {
      setTempDateEnd(value);
    }
  };

  useEffect(() => {
    if (open && !dateStart && !dateEnd) {
      setTempDateStart(moment().startOf("day").toDate());
      setTempDateEnd(moment().endOf("day").toDate());
    }
  }, [open, dateStart, dateEnd]);

  const handleConfirm = () => {
    setDateStart(tempDateStart);
    setDateEnd(tempDateEnd);
    onClose();
  };

  const buttons = [
    { label: "ມື້ນີ້", type: "today", condition: 0 },
    { label: "ມື້ວານ", type: "yesterday", condition: 1 },
    { label: "3ມື້", type: "3days", condition: 3 },
    { label: "5ມື້", type: "5days", condition: 5 },
    { label: "7ມື້", type: "7days", condition: 7 },
  ];

  // คำนวณช่วงวันที่อนุญาตให้เลือก
  const minDate = moment().subtract(days, "days").format("YYYY-MM-DD");
  const maxDate = moment().format("YYYY-MM-DD");

  return (
    <Modal show={open} onHide={onClose} size="lg" centered>
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
          {buttons
            .filter((button) => days >= button.condition)
            .map((button) => (
              <Button
                key={button.type}
                variant="outline-primary"
                onClick={() => handlePresetDate(button.type)}
              >
                {button.label}
              </Button>
            ))}
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
              min={minDate} // กำหนดวันต่ำสุด
              max={maxDate} // กำหนดวันสูงสุด
              value={moment(tempDateStart).format("YYYY-MM-DD")}
              onChange={(e) => handleDateChange("start", moment(e.target.value).toDate())}
              className="custom-input"
            />
            <Form.Control
              type="time"
              value={moment(tempDateStart).format("HH:mm")}
              onChange={(e) =>
                handleDateChange(
                  "start",
                  moment(tempDateStart)
                    .set("hour", e.target.value.split(":")[0])
                    .set("minute", e.target.value.split(":")[1])
                    .toDate()
                )
              }
              className="custom-input"
            />
          </InputGroup>
          <div style={{ textAlign: "center" }}> ຫາ </div>
          <InputGroup>
            <Form.Control
              type="date"
              min={minDate} // กำหนดวันต่ำสุด
              max={maxDate} // กำหนดวันสูงสุด
              value={moment(tempDateEnd).format("YYYY-MM-DD")}
              onChange={(e) => handleDateChange("end", moment(e.target.value).toDate())}
              className="custom-input"
            />
            <Form.Control
              type="time"
              value={moment(tempDateEnd).format("HH:mm")}
              onChange={(e) =>
                handleDateChange(
                  "end",
                  moment(tempDateEnd)
                    .set("hour", e.target.value.split(":")[0])
                    .set("minute", e.target.value.split(":")[1])
                    .toDate()
                )
              }
              className="custom-input"
            />
          </InputGroup>
        </Box>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          ຍົກເລີກ
        </Button>
        <Button onClick={handleConfirm}>ຍືນຢັນ</Button>
      </Modal.Footer>
    </Modal>
  );
}
