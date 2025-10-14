import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export default function PopUpCustomerCount({ open, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [customerCount, setCustomerCount] = useState(0);

  const handleSubmit = () => {
    if (customerCount && customerCount > 0) {
      onSubmit(customerCount);
      setCustomerCount(0); // Reset after submit
    }
  };

  const handleClose = () => {
    setCustomerCount(0); // Reset on close
    onClose();
  };

  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>{t("customer_count")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>{t("customer_count")}</Form.Label>
          <Form.Control 
            type="number" 
            value={customerCount}
            onChange={(e) => setCustomerCount(parseInt(e.target.value))}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>{t("cancel")}</Button>
        <Button variant="primary" onClick={handleSubmit}>{t("confirm")}</Button>
      </Modal.Footer>
    </Modal>
  );
}
