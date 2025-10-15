import React, { useState, useEffect } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export default function PopUpCustomerCountUpdate({ open, onClose, onSubmit, currentCount }) {
  const { t } = useTranslation();
  const [customerCount, setCustomerCount] = useState(currentCount || 0);

  useEffect(() => {
    if (open) {
      setCustomerCount(currentCount || 0);
    }
  }, [open, currentCount]);

  const handleSubmit = () => {
    if (customerCount && customerCount > 0) {
      onSubmit(customerCount);
      setCustomerCount(0); // Reset after submit
    }
  };

  const handleClose = () => {
    setCustomerCount(currentCount || 0); // Reset to current count on close
    onClose();
  };

  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("update_customer_count")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>{t("current_customer_count")}: {currentCount}</Form.Label>
          <Form.Label className="d-block mt-2">{t("new_customer_count")}</Form.Label>
          <Form.Control 
            type="number" 
            value={customerCount}
            onChange={(e) => setCustomerCount(parseInt(e.target.value))}
            placeholder={t("enter_customer_count")}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>{t("cancel")}</Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!customerCount || customerCount <= 0}
        >
          {t("customer_update")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

