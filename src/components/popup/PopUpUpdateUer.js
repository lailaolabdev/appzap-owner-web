import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { COLOR_APP } from "../../constants";

import { getLocalData } from "../../constants/api";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store";
import { updateUserV5 } from "../../services/user";

export default function PopUpUpdateUser({
  open,
  onClose,
  callback,
  selectUser,
}) {
  const { t } = useTranslation();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formData, setFormData] = useState();
  const [showPassword, setShowPassword] = useState(false); // เพิ่มสถานะสำหรับแสดง/ซ่อนฟิลด์รหัสผ่าน
  const [password, setPassword] = useState(""); // เพิ่มสถานะสำหรับเก็บรหัสผ่าน
  const [confirmPassword, setConfirmPassword] = useState(""); // เพิ่มสถานะสำหรับยืนยันรหัสผ่าน
  const { storeDetail } = useStore();
  const [error, setError] = useState("");

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
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      // ตรวจสอบรหัสผ่าน ถ้ามีการเปิดฟิลด์รหัสผ่าน
      if (showPassword) {
        if (!password || !confirmPassword) {
          setError(t("p_fill_code"));
          return;
        }
        if (password !== confirmPassword) {
          setError("รหัสผ่านไม่ตรงกัน");
          return;
        }
      }
  
      setButtonDisabled(true);
      setError(""); // รีเซ็ตข้อความ error
  
      const { TOKEN } = await getLocalData();
      console.log("token:", TOKEN)
  
      const updateData = {
        ...formData,
        storeId: storeDetail._id,
        ...(showPassword && { password: password })
      };
  
      const result = await updateUserV5(selectUser._id, updateData, TOKEN);
      
      if (result.error) {
        // แสดง error message จาก backend
        setError(result.message || "การอัปเดตล้มเหลว");
        setButtonDisabled(false);
        return;
      }
      
      callback();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      setError("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
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
              value={formData?.role || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
            >
              <option value="">{t("chose_policy_type")}</option>
              <option
                value="APPZAP_ADMIN"
                selected={formData?.role === "APPZAP_ADMIN"}
              >
                {t("ceo")}
              </option>
              <option
                value="APPZAP_STAFF"
                selected={formData?.role === "APPZAP_STAFF"}
              >
                {t("server_staff")}
              </option>
              <option
                value="APPZAP_COUNTER"
                selected={formData?.role === "APPZAP_COUNTER"}
              >
                {t("counter_staff")}
              </option>
              <option
                value="APPZAP_KITCHEN"
                selected={formData?.role === "APPZAP_KITCHEN"}
              >
                {t("chef")}
              </option>
              <option
                value="APPZAP_CUSTOM_ROLE"
                selected={formData?.role === "APPZAP_CUSTOM_ROLE"}
              >
                {t("selft_define")}
              </option>
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
          <div>
            <Button
              variant="outline-primary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? t("cancel_password_change") : t("change_password")}
            </Button>
          </div>

          {/* ฟิลด์รหัสผ่านใหม่ */}
          {showPassword && (
            <>
              <div>
                <Form.Label>{t("new_password")}</Form.Label>
                <Form.Control
                  type="password"
                  placeholder={t("enter_new_password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Form.Label>{t("confirm_password")}</Form.Label>
                <Form.Control
                  type="password"
                  placeholder={t("enter_confirm_password")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                 {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
              </div>
            </>
          )}
          

          
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
