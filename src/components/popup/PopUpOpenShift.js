import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store";
import { FaRegClock } from "react-icons/fa";

export default function PopUpOpenShift({ open }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Modal show={open} centered>
      <Modal.Body>
        <Form.Group className="mt-3">
          <div className="flex flex-col items-center">
            <div>
              <FaRegClock className="text-[5rem] text-orange-500" />
            </div>
            <div className="mt-4">
              <h2>ກະປິດແລ້ວ</h2>
              <p>ເປີດກະເພື່ອຂາຍອາຫານ</p>
            </div>
          </div>
        </Form.Group>
      </Modal.Body>
      <div className="flex justify-center my-6">
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate("/shift")}
        >
          {t("shift_open")}
        </Button>
      </div>
    </Modal>
  );
}
