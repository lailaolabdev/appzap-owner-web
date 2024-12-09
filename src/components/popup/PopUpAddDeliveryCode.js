import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsQuestionLg } from "react-icons/bs";
import { useTranslation } from "react-i18next";

import { getAllDelivery } from "../../services/delivery";
import { COLOR_APP } from "../../constants";
import { useStore } from "../../store";

const boxIcon = {
  position: "absolute",
  left: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  top: 0,
  width: "100%",
};

const iconStyle = {
  fontSize: "6em",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#FB6E3B",
  marginTop: "-.7em",
  width: 120,
  height: 120,
  borderRadius: "30em",
  boxShadow:
    "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
  color: "#ffff",
  border: "10px solid #ffff",
};

const modalBodyStyle = {
  textAlign: "center",
  minHeight: "23vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: 35,
  paddingTop: 15,
};

const modalFooterStyle = {
  display: "flex",
  justifyContent: "center",
  border: "none",
};

export default function PopUpAddDeliveryCode({ open, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [deliveryCode, setDeliveryCode] = useState("");
  const [platform, setPlatform] = useState("");
  const [platformList, setPlatformList] = useState([]);
  const { selectedTable } = useStore();
  const deliveryCodeInputRef = useRef(null);
  const fetchDelivery = async () => {
    await getAllDelivery().then((res) => {
      setPlatformList(res.data);
    });
  };

  useEffect(() => {
    fetchDelivery();
    // Focus the input when the modal opens
    if (open && deliveryCodeInputRef.current) {
      deliveryCodeInputRef.current.focus();
    }
  }, [open]); // Run when modal opens or changes

  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{`${t("delivery")} (${
          selectedTable?.tableName
        })`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>{t("delivery")}</Form.Label>
          <Form.Control
            type="text"
            value={deliveryCode}
            onChange={(e) => setDeliveryCode(e.target.value)}
            placeholder={t("deliveryPlaceholder")}
            ref={deliveryCodeInputRef}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>{t("chooseflatform")}</Form.Label>
          <div>
            {platformList.map((p, idx) => (
              <Form.Check
                key={p?._id}
                type="checkbox"
                id={`platform-${p?._id}`}
                label={p?.name}
                value={p?.name}
                checked={platform === p?.name} // Only one platform can be selected
                onChange={(e) => {
                  // Handle checkbox change to ensure only one can be selected
                  if (e.target.checked) {
                    setPlatform(p?.name); // Set the selected platform
                  } else {
                    setPlatform(""); // Deselect the platform (optional)
                  }
                }}
              />
            ))}
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={() => onSubmit(deliveryCode, platform)}
          disabled={!deliveryCode || !platform} // Disable until both are filled
        >
          {t("save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
