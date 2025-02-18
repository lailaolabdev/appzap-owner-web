import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Card, Spinner, Modal } from "react-bootstrap";
import { useStoreStore } from "../../zustand/storeStore";
import { PermissionsConfig } from '../../helpers/permissionRole';
import Swal from "sweetalert2";
import { useStore } from "../../store";

export default function PopUpEditRole({
    open,
    onClose,
    roleData,
    updatePermissionRole
}) {
    const { t } = useTranslation();
    const [error, setError] = useState('');
    const { storeDetail } = useStoreStore();
    const [loading, setLoading] = useState(false);
    const { profile, setProfile } = useStore();
    const [initialFormData, setInitialFormData] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    const {
        permissionsConfig,
        createInitialState,
        transformPermissions,
        createInputChangeHandler,
        createCheckboxChangeHandler
    } = PermissionsConfig();

    const [formData, setFormData] = useState(() => {
        const initialState = createInitialState();
        if (roleData) {
            initialState.accountName = roleData.roleName;
            initialState.note = roleData.note;

            Object.entries(permissionsConfig.permissionsCategories).forEach(([categoryKey, category]) => {
                Object.entries(category.permissions).forEach(([permKey, permValue]) => {
                    initialState[categoryKey][permKey] = roleData.permissions.includes(permValue);
                });
            });

            const allPermissions = Object.values(permissionsConfig.permissionsCategories).flatMap(
                category => Object.values(category.permissions)
            );
            initialState.canAccessAllSystems = allPermissions.every(
                perm => roleData.permissions.includes(perm)
            );
        }
        return initialState;
    });

    useEffect(() => {
        if (roleData) {
            const newFormData = {
                ...formData,
                accountName: roleData.roleName,
                note: roleData.note
            };
            setFormData(newFormData);
            setInitialFormData(JSON.stringify(newFormData));
            setHasChanges(false);
        }
    }, [roleData]);

    const handleInputChange = (e) => {
        const newFormData = {
            ...formData,
            [e.target.name]: e.target.value
        };
        setFormData(newFormData);
        checkForChanges(newFormData);
    };

    const handleCheckboxChange = (category, key) => {
        const newFormData = createCheckboxChangeHandler(setFormData)(category, key);
        checkForChanges(newFormData);
    };

    const checkForChanges = (currentFormData) => {
        if (!initialFormData) return;
        const hasChanged = JSON.stringify(currentFormData) !== initialFormData;
        setHasChanges(hasChanged);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (!formData.accountName.trim()) {
                setError(t('please_enter_name_of_role'));
                return;
            }

            const permissions = transformPermissions(formData);
            const updatePayload = {
                roleName: formData.accountName,
                note: formData.note || "-",
                permissions: permissions,
                storeId: storeDetail._id,
                userId: profile?.data?._id
            };

            await updatePermissionRole(roleData._id, updatePayload).then((data) => {
                setProfile({
                    accessToken: profile?.accessToken ,
                    data: data.data,
                    refreshToken: profile?.refreshToken
                })
            });

            Swal.fire({
                icon: 'success',
                title: t("success"),
                text: t("role_updated_successfully"),
                showConfirmButton: false,
                timer: 1500
            });
            onClose();
        } catch (error) {
            console.error("Error updating role:", error);
            Swal.fire({
                icon: 'error',
                title: t("error"),
                text: error?.response?.data?.message || t("error_updating_role"),
                showConfirmButton: true
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={open} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{t('edit_role')}</Modal.Title>
            </Modal.Header>
            <Card border="none" style={{ margin: 0, height: "calc(100vh - 200px)", display: "flex", flexDirection: "column" }}>
                <Card.Body style={{ overflowY: "auto", flex: 1 }}>
                    <div className="flex items-center gap-4">
                        <div className="w-1/3">
                            <label className="block text-sm font-medium mb-2">{t("name")}</label>
                            <input
                                type="text"
                                name="accountName"
                                value={formData.accountName}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                                placeholder="...."
                                required
                            />
                        </div>
                        <div className="w-2/3">
                            <label className="block text-sm font-medium mb-2">{t("note")}</label>
                            <input
                                type="text"
                                name="note"
                                value={formData.note}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                                placeholder="...."
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{t(error)}</p>}

                    <div className="bg-gray-50 px-4 py-2 rounded-md mt-2">
                        <label className="flex items-center font-medium space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.canAccessAllSystems}
                                onChange={() => handleCheckboxChange('root', 'canAccessAllSystems')}
                                className="rounded"
                            />
                            <span className="font-medium">{t("can_access_everything_in_the_system")}</span>
                        </label>
                    </div>

                    {Object.entries(permissionsConfig.permissionsCategories).map(([categoryKey, category]) => (
                        <div key={categoryKey} className="space-y-4 mt-4">
                            <h2 className="text-lg font-bold">{category.label}</h2>
                            {Object.entries(category.permissions).map(([permKey]) => (
                                <label
                                    key={permKey}
                                    className="flex items-center font-medium space-x-2 pl-4 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData[categoryKey][permKey]}
                                        onChange={() => handleCheckboxChange(categoryKey, permKey)}
                                        className="rounded"
                                    />
                                    <span>{permKey}</span>
                                </label>
                            ))}
                        </div>
                    ))}
                </Card.Body>
                <Card.Footer className="bg-white border-t mt-4">
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                            disabled={loading}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-color-app text-white rounded-md hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !hasChanges}
                        >
                            {loading ? t("updating") : t("confirm")}
                        </button>
                    </div>
                </Card.Footer>
            </Card>
        </Modal>
    );
}