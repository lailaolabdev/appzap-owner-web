import { React, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function PopUpCreateServiceCharge({ open, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [newServiceCharge, setNewServiceCharge] = useState(0);

  const handleSubmit = () => {
    onSubmit(newServiceCharge);
  };

  return (
    <div>
      <Modal show={open} onHide={onClose} size="md">
        <Modal.Header closeButton>{t("service_charge")}</Modal.Header>
        <Modal.Body
          style={{
            boxSizing: "border-box",
            overflow: "auto",
            width: "100%",
          }}
        >
          <Form>
            <Form.Group>
              <Form.Label>{t("create_service_charge")}</Form.Label>
              <Form.Control
                type="number"
                value={newServiceCharge}
                onChange={(e) => setNewServiceCharge(e.target.value)}
                min="0"
                max="100"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
