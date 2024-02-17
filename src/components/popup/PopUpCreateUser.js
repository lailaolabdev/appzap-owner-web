import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import moment from "moment";
import styled from "styled-components";
import { moneyCurrency, orderStatus } from "../../helpers";
import * as _ from "lodash";
import axios from "axios";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";
import { createUser } from "../../services/user";
import { useStore } from "../../store";
export const preventNegativeValues = (e) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
export default function PopUpCreateUser({ open, onClose, callback }) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formData, setFormData] = useState();

  // store
  const { storeDetail } = useStore();

  // useEffect
  useEffect(() => {
    if (!open) {
      setButtonDisabled(false);
      setFormData();
    }
  }, [open]);

  // function
  const handleCreateUser = async () => {
    const { TOKEN, DATA } = await getLocalData();
    await createUser({ ...formData, storeId: storeDetail?._id }, TOKEN);
    onClose();
    callback();
  };
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>ເພີ່ມພະນັກງານ</Modal.Header>
      <Modal.Body>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <Form.Label>ຊື່</Form.Label>
            <Form.Control
              placeholder="ຊື່"
              value={formData?.firstname}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstname: e.target.value }))
              }
            />
          </div>
          <div>
            <Form.Label>ນາມສະກຸນ</Form.Label>
            <Form.Control
              placeholder="ນາມສະກຸນ"
              value={formData?.lastname}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastname: e.target.value }))
              }
            />
          </div>
          <div>
            <Form.Label>ສິດການນຳໃຊ້ລະບົບ</Form.Label>
            <select
              className="form-control"
              value={formData?.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
            >
              <option value="">ເລືອກປະເພດສິດ</option>
              <option value="APPZAP_ADMIN">ຜູ້ບໍລິຫານ(ສິດສູງສຸດ)</option>
              <option value="APPZAP_STAFF">ພະນັກງານເສີບ</option>
              <option value="APPZAP_COUNTER">ພະນັກງານເຄົາເຕີ້</option>
              <option value="APPZAP_KITCHEN">ພໍ່ຄົວ / ແມ່ຄົວ</option>
              <option value="APPZAP_CUSTOM_ROLE">ກຳນົດເອງ</option>
            </select>
          </div>
          <div>
            <Form.Label>ເບີໂທ</Form.Label>
            <Form.Control
              placeholder="login username"
              value={formData?.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
          <div>
            <Form.Label>ຊື່ຜູ້ໃຊ້ (ໃຊ້ໃນການເຂົ້າລະບົບ)</Form.Label>
            <Form.Control
              placeholder="login username"
              value={formData?.userId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, userId: e.target.value }))
              }
            />
          </div>
          <div>
            <Form.Label>ລະຫັດຜ່ານ</Form.Label>
            <Form.Control
              placeholder="******"
              value={formData?.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={buttonDisabled}
          style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
          onClick={async () => {
            try {
              setButtonDisabled(true);
              await handleCreateUser();
              onClose();
            } catch (err) {
              setButtonDisabled(false);
            }
          }}
        >
          ເພີ່ມພະນັກງານ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
