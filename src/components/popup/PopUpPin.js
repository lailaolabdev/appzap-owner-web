import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { COLOR_APP, END_POINT } from "../../constants";
import PinKeyboard from "../keyboard/PinKeyboard";
import Axios from "axios";
import { errorAdd } from "../../helpers/sweetalert";
import { useStore } from "../../store";
export default function PopUpPin({ open, onClose, setPinStatus }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");
  }, [open]);
  useEffect(() => {
    if (value.length == 6) {
      checkPin();
    }
  }, [value]);
  const { storeDetail } = useStore();
  const checkPin = async () => {
    try {
      const url = END_POINT + "/v4/pin/check-pin";
      const data = await Axios.post(url, {
        pin: value,
        storeId: storeDetail?._id,
      });
      if (data.status == 200) {
        setPinStatus(true);
      }
    } catch (err) {
      errorAdd("ລະຫັດບໍຖືກ");
    }
  };
  return (
    <div>
      <Modal show={open} onHide={onClose}>
        <Modal.Header>
          <div style={{ fontSize: "20px", fontWeight: 600 }}>
            ລະຫັດຄວາມປອດໄພ
          </div>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Form.Control
              placeholder="ກະລຸນາໃສພິນ"
              type="text"
              maxLength={6}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ fontSize: 30, fontWeight: 700 }}
            />
            <PinKeyboard selectInput={value} setSelectInput={setValue} />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
