import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import { getLocalData } from "../../constants/api";
import { useTranslation } from "react-i18next";
import { userUpdate } from "../../services/user";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getPermissionRoles } from "../../services/permissionRole";
import { useStoreStore } from "../../zustand/storeStore";
import Swal from "sweetalert2";

export default function PopUpUpdateUser({ open, onClose, callback, userData }) {
    const { t } = useTranslation();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [formData, setFormData] = useState({});
    const [initialData, setInitialData] = useState({});
    const [dataPermission, setDataPermision] = useState([]);
    const { storeDetail } = useStoreStore();
    const [showPassword, setShowPassword] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [forgetPassword, setForgetPassowrd] = useState(false);
    const [showErrors, setShowErrors] = useState(false);
    const [errors, setErrors] = useState({
        firstname: "",
        phone: "",
        userId: "",
        permissionRoleId: "",
    });

    useEffect(() => {
        if (open && userData) {
            const initialFormData = {
                firstname: userData.firstname,
                lastname: userData.lastname,
                phone: userData.phone,
                userId: userData.userId,
                role: userData.role || "APPZAP_STAFF",
                permissionRoleId: userData.permissionRoleId?._id || "",
                password: ""
            };
            setFormData(initialFormData);
            setInitialData(initialFormData);
            setHasChanges(false);
            setShowErrors(false);
            setForgetPassowrd(false)
            setErrors({
                firstname: "",
                phone: "",
                userId: "",
                permissionRoleId: "",
            });
            getDataPermissionRole();
        }
    }, [open, userData]);

    useEffect(() => {
        if (!open) {
            setForgetPassowrd(false)
            setButtonDisabled(false);
            setFormData({});
            setInitialData({});
            setShowPassword(false);
            setHasChanges(false);
            setShowErrors(false);
        }
    }, [open]);

    useEffect(() => {
        const hasFormChanged = Object.keys(formData).some(key => {
            if (key === 'password') {
                return formData[key]?.trim() !== '';
            }
            return formData[key] !== initialData[key];
        });
        setHasChanges(hasFormChanged);
    }, [formData, initialData]);

    const validateForm = () => {
        const newErrors = {
            firstname: !formData.firstname?.trim() ? t("please_enter_name") : "",
            phone: !formData.phone?.trim() ? t("please_enter_phone") : "",
            userId: !formData.userId?.trim() ? t("please_enter_userId") : "",
            permissionRoleId: !formData.permissionRoleId?.trim() ? t("please_select_rol") : "",
        };

        setErrors(newErrors);
        setShowErrors(true);

        return !Object.values(newErrors).some(error => error !== "");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleUpdateUser = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setButtonDisabled(true);
            const { TOKEN } = await getLocalData();
            const updateData = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                phone: formData.phone,
                userId: formData.userId,
                role: formData.role,
                permissionRoleId: String(formData.permissionRoleId),
                storeId: storeDetail?._id,
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            await userUpdate(userData._id, updateData, TOKEN);

            Swal.fire({
                icon: 'success',
                title: t("success"),
                text: t("role_updated_successfully"),
                showConfirmButton: false,
                timer: 1500
            });

            callback();
            onClose();
        } catch (error) {
            console.error("Error updating user:", error);
            Swal.fire({
                icon: 'error',
                title: t("error"),
                text: error?.response?.data?.message || t("error_updating_role"),
                showConfirmButton: true
            });
            setButtonDisabled(false);
        }
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
            <Modal.Header closeButton>{t("edit")}</Modal.Header>
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
                            isInvalid={showErrors && errors.firstname}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.firstname}
                        </Form.Control.Feedback>
                    </div>
                    <div>
                        <Form.Label>{t("l_name")}</Form.Label>
                        <Form.Control
                            placeholder={t("enter_lname")}
                            value={formData?.lastname || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, lastname: e.target.value }))
                            }
                            isInvalid={showErrors && errors.lastname}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.lastname}
                        </Form.Control.Feedback>
                    </div>
                    <div>
                        <Form.Label>{t("use_system_policy")}</Form.Label>
                        <select
                            className={`form-control ${showErrors && errors.permissionRoleId ? 'is-invalid' : ''}`}
                            value={formData?.permissionRoleId || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    permissionRoleId: e.target.value,
                                }))
                            }
                        >
                            <option value="">{t("chose_policy_type")}</option>
                            {dataPermission.map((role) => (
                                <option key={role._id} value={role._id}>
                                    {role.roleName}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            {errors.permissionRoleId}
                        </div>
                    </div>
                    <div>
                        <Form.Label>{t("phonenumber")}</Form.Label>
                        <Form.Control
                            placeholder={t("enter_phone")}
                            value={formData?.phone || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            isInvalid={showErrors && errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.phone}
                        </Form.Control.Feedback>
                    </div>
                    <div>
                        <Form.Label>{t("username_login")}</Form.Label>
                        <Form.Control
                            placeholder={t("enter_username")}
                            value={formData?.userId || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, userId: e.target.value }))
                            }
                            isInvalid={showErrors && errors.userId}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.userId}
                        </Form.Control.Feedback>
                    </div>
                    {
                        forgetPassword && (
                            <>
                                <Form.Label>{t("password")}</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t("p_fill_code_new")}
                                        value={formData?.password || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, password: e.target.value }))
                                        }
                                        isInvalid={showErrors && errors.password}
                                    />
                                    <InputGroup.Text
                                        onClick={togglePasswordVisibility}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </>
                        )
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className="flex justify-between">
                <p onClick={() => setForgetPassowrd(true)} className="text-color-app mr-auto cursor-pointer">
                    {t("p_fill_code_forget")}
                </p>
                <Button
                    disabled={buttonDisabled || !hasChanges}
                    style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
                    onClick={handleUpdateUser}
                >
                    {t("confirm")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}