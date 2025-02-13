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
import { getPermissionRoles } from "../../services/permissionRole";
import { useStoreStore } from "../../zustand/storeStore";
import { useStore } from "../../store";

export const preventNegativeValues = (e) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
export default function PopUpCreateUser({ open, onClose, callback }) {
  const { t } = useTranslation();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formData, setFormData] = useState({ role: "APPZAP_STAFF" });
  const [dataPermission, setDataPermision] = useState([])
  const { storeDetail } = useStoreStore()

  // useEffect
  useEffect(() => {
    if (!open) {
      setButtonDisabled(false);
      setFormData({ role: "APPZAP_STAFF" });
      getDataPermissionRole()
    }
  }, [open]);

  // function
  const handleCreateUser = async () => {
    const { TOKEN, DATA } = await getLocalData();
    await createUser({ ...formData, storeId: storeDetail?._id }, TOKEN);
    onClose();
    callback();
  };


  const getDataPermissionRole = async () => {
    try {
      const permissionData = await getPermissionRoles();
      setDataPermision(permissionData);
    } catch (err) {
      console.error("Error fetching permission roles:", err);
    }
  };


  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>{t("add_staff")}</Modal.Header>
      <Modal.Body>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <Form.Label>{t("name")}</Form.Label>
            <Form.Control
              placeholder={t("enter_name")}
              value={formData?.firstname}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstname: e.target.value }))
              }
            />
          </div>
          <div>
            <Form.Label>{t("l_name")}</Form.Label>
            <Form.Control
              placeholder={t("enter_lname")}
              value={formData?.lastname}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastname: e.target.value }))
              }
            />
          </div>
          <div>
            <Form.Label>{t("use_system_policy")}</Form.Label>
            <Form.Label>{t("use_system_policy")}</Form.Label>
            <select
              className="form-control"
              value={formData?.permissionRoleId || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, permissionRoleId: e.target.value }))
              }>
              <option value="">{t("chose_policy_type")}</option>
              {dataPermission.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Form.Label>{t("phonenumber")}</Form.Label>
            <Form.Control
              placeholder={t("enter_phone")}
              value={formData?.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
          <div>
            <Form.Label>{t("username_login")}</Form.Label>
            <Form.Control
              placeholder={t("enter_username")}
              value={formData?.userId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, userId: e.target.value }))
              }
            />
          </div>
          <div>
            <Form.Label>{t("password")}</Form.Label>
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
          {t("save_add_staff")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}