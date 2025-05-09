import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import Axios from "axios";
import { errorAdd } from "../../helpers/sweetalert";
import { useStoreStore } from "../../zustand/storeStore";
import PinKeyboard from "../keyboard/PinKeyboard";
import { END_POINT } from "../../constants";
import { useTranslation } from "react-i18next";

const PopUpPin = ({ open, onClose, setPinStatus }) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState("");
  const { storeDetail } = useStoreStore();

  // Clear pin and set pin status when popup opens
  useEffect(() => {
    setPin("");
    if (open && !storeDetail?.usePin) {
      setPinStatus(true);
    }
  }, [open, storeDetail, setPinStatus]);

  // Check pin when it reaches 6 digits
  useEffect(() => {
    if (pin.length === 6) {
      validatePin();
    }
  }, [pin]);

  // Validate the pin by calling the backend API
  const validatePin = async () => {
    try {
      const response = await Axios.post(`${END_POINT}/v4/pin/check-pin`, {
        pin,
        storeId: storeDetail?._id,
      });

      if (response.status === 200) {
        setPinStatus(true);
      }
    } catch (err) {
      errorAdd("ລະຫັດບໍຖືກ");
    }
  };

  const modalStyle = storeDetail?.usePin ? { zIndex: 1050 } : { zIndex: -1 };

  return (
    <Modal show={open} onHide={onClose} style={modalStyle}>
      <Modal.Header>
        <div style={{ fontSize: "20px", fontWeight: 600 }}>
          {t("security_code")}
        </div>
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Form.Control
            placeholder={t("enter_pin")}
            type="text"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{ fontSize: 30, fontWeight: 700 }}
          />
          <PinKeyboard selectInput={pin} setSelectInput={setPin} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PopUpPin;
