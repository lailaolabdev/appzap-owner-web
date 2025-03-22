import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import { useStoreStore } from "../../zustand/storeStore";
import { PermissionsConfig } from "../../helpers/permissionRole";
import Swal from "sweetalert2";

export default function PopUpRole({ open, onClose, createPermissionRole }) {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const { storeDetail } = useStoreStore();

  const {
    permissionsConfig,
    createInitialState,
    transformPermissions,
    createInputChangeHandler,
    createCheckboxChangeHandler,
  } = PermissionsConfig();

  const [formData, setFormData] = useState(createInitialState());

  const handleInputChange = createInputChangeHandler(setFormData);
  const handleCheckboxChange = createCheckboxChangeHandler(setFormData);

  const handleOptionChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      stockManageOption: e.target.value,
    }));
  };

  // ກຳນົດ permissions ທີຖືກຕອງໂດຍບໍ່ຊຳຄ່າ
  const permissions = useMemo(() => {
    // ຮັບ permissions ຈາກ transformPermissions
    const basePermissions = transformPermissions(formData);

    // ກອງເອົາສະເພາະ permissions ທີບໍ່ກ່ຽວຂອງກັບ MANAGE_STOCK
    const filteredPermissions = basePermissions.filter(
      (perm) => !perm.startsWith("MANAGE_STOCK_")
    );

    // ຖ້າມີ MANAGE_STOCK ໄຫ້ເພີ່ມ permission ຕາມຕົວເລືອກ
    if (filteredPermissions.includes("MANAGE_STOCK")) {
      if (formData.stockManageOption === "CAN_EDIT") {
        return [...filteredPermissions, "MANAGE_STOCK_CAN_EDIT"];
      } else if (formData.stockManageOption === "VIEW_ONLY") {
        return [...filteredPermissions, "MANAGE_STOCK_VIEW_ONLY"];
      }
    }

    return filteredPermissions;
  }, [formData, transformPermissions]);

  const mutationPayload = {
    roleName: formData.accountName,
    note: formData.note || "-",
    permissions: permissions,
    storeId: storeDetail._id,
  };

  const isAnyPermissionSelected = useMemo(() => {
    if (formData.canAccessAllSystems) {
      return true;
    }

    return Object.entries(permissionsConfig.permissionsCategories).some(
      ([categoryKey]) => {
        return Object.keys(formData[categoryKey]).some(
          (permKey) => formData[categoryKey][permKey]
        );
      }
    );
  }, [formData, permissionsConfig]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.accountName.trim()) {
        setError(t("please_enter_name_of_role"));
        return;
      }
      await createPermissionRole(mutationPayload);
      Swal.fire({
        icon: "success",
        title: t("success"),
        text: t("role_added_successfully"),
        showConfirmButton: false,
        timer: 1500,
      });
      onClose();
    } catch (error) {
      console.error("Submit error:", error?.response?.data || error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: error?.response?.data?.message || t("error_adding_role"),
        showConfirmButton: true,
      });
    }
  };

  return (
    <Modal show={open} onHide={onClose} size="lg" className="font-noto">
      <Modal.Header closeButton>
        <Modal.Title>
          {t("add")} {t("role")}
        </Modal.Title>
      </Modal.Header>
      <div className="m-0 h-[calc(100vh-200px)] flex flex-col">
        <div className="overflow-y-auto flex-1 p-4">
          <div className="flex items-center gap-4">
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-2">
                {t("name")}
              </label>
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
              <label className="block text-sm font-medium mb-2">
                {t("note")}
              </label>
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
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="bg-gray-50 px-4 py-2 rounded-md mt-2">
            <label className="flex items-center font-medium space-x-2">
              <input
                type="checkbox"
                checked={formData.canAccessAllSystems}
                onChange={() =>
                  handleCheckboxChange("root", "canAccessAllSystems")
                }
                className="rounded"
              />
              <span className="font-medium">
                {t("can_access_everything_in_the_system")}
              </span>
            </label>
          </div>

          {Object.entries(permissionsConfig.permissionsCategories).map(
            ([categoryKey, category]) => (
              <div key={categoryKey} className="space-y-4 mt-4">
                <h2 className="text-lg font-bold">{category.label}</h2>
                {Object.entries(category.permissions).map(
                  ([permKey, permission]) => (
                    <div key={permKey} className="pl-4">
                      <label className="flex items-center font-medium space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[categoryKey][permKey]}
                          onChange={() =>
                            handleCheckboxChange(categoryKey, permKey)
                          }
                          className="rounded"
                        />
                        <span>{permKey}</span>
                      </label>
                      {permKey === t("stock_manage") &&
                        formData[categoryKey][permKey] && (
                          <div className="ml-6 mt-2">
                            <select
                              value={formData.stockManageOption}
                              onChange={handleOptionChange}
                              className="p-2 border rounded-md"
                            >
                              <option value="VIEW_ONLY">
                                {t("not_can_edit")}
                              </option>
                              <option value="CAN_EDIT">{t("can_edit")}</option>
                            </select>
                          </div>
                        )}
                    </div>
                  )
                )}
              </div>
            )
          )}
        </div>

        <div className="bg-white border-t mt-4 p-4">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isAnyPermissionSelected}
              className={`px-4 py-2 rounded-md ${
                isAnyPermissionSelected
                  ? "bg-color-app text-white hover:bg-orange-400"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {t("confirm")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
