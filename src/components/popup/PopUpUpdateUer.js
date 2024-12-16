// services/user.js

  
  // components/popup/PopUpUpdateUser.jsx
  import React, { useState, useEffect } from "react";
  import { Modal, Button, Form } from "react-bootstrap";
  import { COLOR_APP } from "../../constants";
  import { updateUser } from "../../services/user";
  import { getLocalData } from "../../constants/api";
  import { useTranslation } from "react-i18next";
  import { useStore } from "../../store";
  import { convertRole } from "../../helpers/convertRole";
  
  export default function PopUpUpdateUser({ open, onClose, callback, selectUser }) {
    const { t } = useTranslation();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [formData, setFormData] = useState();
    const { storeDetail } = useStore();


    console.log("selectUser:",selectUser)
    
  
    useEffect(() => {
      if (open && selectUser) {
        setFormData({
          firstname: selectUser.firstname,
          lastname: selectUser.lastname,
          role: selectUser.role,
          phone: selectUser.phone,
          userId: selectUser.userId,
        });
      }
      if (!open) {
        setButtonDisabled(false);
        setFormData(null);
      }
    }, [open, selectUser]);
  
    const handleSubmit = async () => {
      try {
        setButtonDisabled(true);
        const { TOKEN } = await getLocalData();
        
        const updateData = {
          ...formData,
          storeId: storeDetail._id,
        };
  
        await updateUser(selectUser._id, updateData, TOKEN);
        callback();
        onClose();
      } catch (err) {
        console.error("Update failed:", err);
        setButtonDisabled(false);
      }
    };
  
    return (
      <Modal show={open} onHide={onClose}>
        <Modal.Header closeButton>{t("edit_staff")}</Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <Form.Label>{t("name")}</Form.Label>
              <Form.Control
                placeholder={t("enter_name")}
                value={formData?.firstname || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, firstname: e.target.value }))
                }
              />
            </div>
            <div>
              <Form.Label>{t("l_name")}</Form.Label>
              <Form.Control
                placeholder={t("enter_lname")}
                value={formData?.lastname || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastname: e.target.value }))
                }
              />
            </div>
            <div>
              <Form.Label>{t("use_system_policy")}</Form.Label>
              <select
                className="form-control"
                value={convertRole(formData?.role) || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
              >
                <option value="">{t("chose_policy_type")}</option>
                <option value="APPZAP_ADMIN">{t("ceo")}</option>
                <option value="APPZAP_STAFF">{t("server_staff")}</option>
                <option value="APPZAP_COUNTER">{t("counter_staff")}</option>
                <option value="APPZAP_KITCHEN">{t("chef")}</option>
                <option value="APPZAP_CUSTOM_ROLE">{t("selft_define")}</option>
              </select>
            </div>
            <div>
              <Form.Label>{t("phonenumber")}</Form.Label>
              <Form.Control
                placeholder={t("enter_phone")}
                value={formData?.phone || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div>
              <Form.Label>{t("username_login")}</Form.Label>
              <Form.Control
                placeholder={t("enter_username")}
                value={formData?.userId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, userId: e.target.value }))
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={buttonDisabled}
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={handleSubmit}
          >
            {t("save_changes")}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }