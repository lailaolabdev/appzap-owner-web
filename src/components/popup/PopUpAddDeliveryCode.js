import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsQuestionLg } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { getAllDelivery } from "../../services/delivery";

// Assuming COLOR_APP is defined elsewhere
import { COLOR_APP } from "../../constants";

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

  const fetchDelivery = async () => {
    await getAllDelivery().then((res) => {
      setPlatformList(res.data);
    });
  };

  useEffect(() => {
    fetchDelivery();
  }, []);

  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("delivery")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>{t("delivery")}</Form.Label>
          <Form.Control
            type="text"
            value={deliveryCode}
            onChange={(e) => setDeliveryCode(e.target.value)}
            placeholder={t("deliveryPlaceholder")}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>{t("chooseflatform")}</Form.Label>
          <Form.Control
            as="select"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="">{t("chooseflatform")}</option>
            {platformList.map((p, idx) => (
              <option key={p?._id} value={p?.name}>
                {p?.name}
              </option>
            ))}
          </Form.Control>
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
