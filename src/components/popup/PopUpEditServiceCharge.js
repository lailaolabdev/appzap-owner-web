import { React, useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function PopUpEditServiceCharge({
  open,
  onClose,
  onSubmit,
  prevServiceCharge,
}) {
  const { t } = useTranslation();
  const [serviceCharge, setServiceCharge] = useState(0);

  useEffect(() => {
    setServiceCharge(prevServiceCharge);
  }, [prevServiceCharge]);
  return (
    <Modal show={open} onHide={onClose} size="md">
      <Modal.Header
        closeButton
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        {t("edit_service_charge")}
      </Modal.Header>
      <Modal.Body
        style={{
          boxSizing: "border-box",
          overflow: "auto",
          width: "100%",
        }}
      >
        <Form.Control
          type="number"
          value={serviceCharge}
          onChange={(e) => setServiceCharge(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onSubmit(serviceCharge)}>{t("save")}</Button>
      </Modal.Footer>
    </Modal>
  );
}
