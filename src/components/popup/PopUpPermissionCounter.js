import React, { useEffect } from "react";
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
}) {
  // Function to handle the preset date buttons like "Today", "Yesterday", etc.
  const handlePresetDate = (type) => {
    let start, end;

    // Set start and end date based on the button clicked
    switch (type) {
      case "today":
        start = moment().startOf("day");
        end = moment().endOf("day");
        break;
      case "yesterday":
        start = moment().subtract(1, "days").startOf("day");
        end = moment().subtract(1, "days").endOf("day");
        break;
      case "3days":
        start = moment().subtract(3, "days").startOf("day");
        end = moment().endOf("day");
        break;
      case "5days":
        start = moment().subtract(5, "days").startOf("day");
        end = moment().endOf("day");
        break;
      case "7days":
        start = moment().subtract(7, "days").startOf("day");
        end = moment().endOf("day");
        break;
      default:
        break;
    }

    setDateStart(start.toDate()); // Set the start date
    setDateEnd(end.toDate()); // Set the end date
  };

  // Handle date range changes
  const handleDateChange = (type, value) => {
    if (type === "start") {
      setDateStart(value);
    } else {
      setDateEnd(value);
    }
  };

  useEffect(() => {
    // Automatically set dates when the modal is opened (optional)
    if (open && !dateStart && !dateEnd) {
      setDateStart(moment().startOf("day").toDate());
      setDateEnd(moment().endOf("day").toDate());
    }
  }, [open, dateStart, dateEnd, setDateStart, setDateEnd]);

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
          <Button variant="outline-primary" onClick={() => handlePresetDate("today")}>ມື້ນີ້</Button>
          <Button variant="outline-primary" onClick={() => handlePresetDate("yesterday")}>ມື້ວານ</Button>
          <Button variant="outline-primary" onClick={() => handlePresetDate("3days")}>3ມື້</Button>
          <Button variant="outline-primary" onClick={() => handlePresetDate("5days")}>5ມື້</Button>
          <Button variant="outline-primary" onClick={() => handlePresetDate("7days")}>7ມື້</Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: { md: 20, xs: 10 },
            justifyContent: "space-between",
            flexDirection: { md: "row", xs: "column" },
          }}
        >
          {/* Date range start */}
          <InputGroup>
            <Form.Control
              type="date"
              value={moment(dateStart).format("YYYY-MM-DD")}
              onChange={(e) => handleDateChange("start", moment(e.target.value).toDate())}
              className="custom-input"
            />
            <Form.Control
              type="time"
              value={moment(dateStart).format("HH:mm")}
              onChange={(e) => handleDateChange("start", moment(dateStart).set("hour", e.target.value.split(":")[0]).set("minute", e.target.value.split(":")[1]).toDate())}
              className="custom-input"
            />
          </InputGroup>
          <div style={{ textAlign: "center" }}> ຫາ </div>
          {/* Date range end */}
          <InputGroup>
            <Form.Control
              type="date"
              value={moment(dateEnd).format("YYYY-MM-DD")}
              onChange={(e) => handleDateChange("end", moment(e.target.value).toDate())}
              className="custom-input"
            />
            <Form.Control
              type="time"
              value={moment(dateEnd).format("HH:mm")}
              onChange={(e) => handleDateChange("end", moment(dateEnd).set("hour", e.target.value.split(":")[0]).set("minute", e.target.value.split(":")[1]).toDate())}
              className="custom-input"
            />
          </InputGroup>
        </Box>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          ຍົກເລີກ
        </Button>
        <Button onClick={onClose}>ຍືນຢັນ</Button>
      </Modal.Footer>
    </Modal>
  );
}
