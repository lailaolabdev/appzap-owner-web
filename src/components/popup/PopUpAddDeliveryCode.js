import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { useTranslation } from "react-i18next";

import { getAllDelivery } from "../../services/delivery";
import { useStore } from "../../store";

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
