import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Form, Nav, Modal, Spinner } from "react-bootstrap";

import Swal from "sweetalert2";
import { COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import { BsInfoCircle } from "react-icons/bs";
import { Plus, Edit, Trash2 } from "lucide-react";

import {
  MENUS,
  getLocalData,
  END_POINT_SEVER_TABLE_MENU,
} from "../../constants/api";
import { useNavigate } from "react-router-dom";
import DateTimeComponent from "../../components/DateTimeComponent";
import {
  addMemberPoint,
  getAllStorePoints,
  updatePointStore,
  addMemberPointUse,
  updatePointUseStore,
} from "../../services/member.service";
import { useStoreStore } from "../../zustand/storeStore";
import { useMenuStore } from "../../zustand/menuStore";
import { useTranslation } from "react-i18next";
import theme from "../../theme";
import { moneyCurrency } from "./../../helpers/index";
import { Card } from "./../../components/ui/Card";

import {
  creatExchangePointStore,
  getAllExchangePointStore,
  getExchangePointStore,
  DeleteExchangePointStore,
  updateExchangePointStore,
  updateStatusExchangePointStore,
} from "../../services/exchangePointStore";

// Number formatting utilities
const formatNumberWithCommas = (value) => {
  if (!value) return "";

  const cleanValue = value.toString().replace(/[^\d.]/g, "");
  const parts = cleanValue.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
};

const parseFormattedNumber = (formattedValue) => {
  if (!formattedValue) return "";
  return formattedValue.toString().replace(/,/g, "");
};

const validateAndFormatNumber = (value) => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts[1];
  }
  return cleaned;
};

const safeParseFloat = (value) => {
  const cleaned = parseFormattedNumber(value);
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// NumberInput component with comma formatting
const NumberInput = React.memo(
  ({
    name,
    value,
    onChange,
    placeholder,
    disabled = false,
    required = false,
    label,
  }) => {
    const [displayValue, setDisplayValue] = useState(
      formatNumberWithCommas(value)
    );
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (!isFocused) {
        setDisplayValue(formatNumberWithCommas(value));
      }
    }, [value, isFocused]);

    const handleInputChange = (e) => {
      const inputValue = e.target.value;
      const cleanedValue = validateAndFormatNumber(inputValue);
      const formattedValue = formatNumberWithCommas(cleanedValue);

      setDisplayValue(formattedValue);

      if (onChange) {
        onChange({
          target: {
            name,
            value: cleanedValue,
          },
        });
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
      setDisplayValue(parseFormattedNumber(displayValue));
    };

    const handleBlur = () => {
      setIsFocused(false);
      const cleanValue = parseFormattedNumber(displayValue);
      setDisplayValue(formatNumberWithCommas(cleanValue));
    };

    return (
      <Form.Group>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control
          name={name}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={{
            borderColor:
              displayValue && !/^[\d,]*\.?\d*$/.test(displayValue)
                ? "#ef4444"
                : "#d1d5db",
            // fontFamily: "monospace",
            textAlign: "left",
          }}
        />
      </Form.Group>
    );
  }
);

NumberInput.displayName = "NumberInput";

// FormattedInput for modal inputs
const FormattedInput = React.memo(
  ({ name, value, onChange, placeholder, className = "", style = {} }) => {
    const [displayValue, setDisplayValue] = useState(
      formatNumberWithCommas(value)
    );
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (!isFocused) {
        setDisplayValue(formatNumberWithCommas(value));
      }
    }, [value, isFocused]);

    const handleInputChange = (e) => {
      const inputValue = e.target.value;
      const cleanedValue = validateAndFormatNumber(inputValue);
      const formattedValue = formatNumberWithCommas(cleanedValue);

      setDisplayValue(formattedValue);

      if (onChange) {
        onChange({
          target: {
            name,
            value: cleanedValue,
          },
        });
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
      setDisplayValue(parseFormattedNumber(displayValue));
    };

    const handleBlur = () => {
      setIsFocused(false);
      const cleanValue = parseFormattedNumber(displayValue);
      setDisplayValue(formatNumberWithCommas(cleanValue));
    };

    return (
      <input
        name={name}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type="text"
        placeholder={placeholder}
        className={className}
        style={{
          borderColor:
            displayValue && !/^[\d,]*\.?\d*$/.test(displayValue)
              ? "#ef4444"
              : "#d1d5db",
          // fontFamily: "monospace",
          textAlign: "left",
          ...style,
        }}
      />
    );
  }
);

FormattedInput.displayName = "FormattedInput";

export default function SettingMemberPointPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // States
  const [disabledButton, setDisabledButton] = useState(false);
  const [formData, setFormData] = useState({
    totalAmount: "",
    points: "",
    storeId: "",
  });
  const [loading, setLoading] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [error, setError] = useState(false);
  const [pointsData, setPointsData] = useState([]);
  const [show, setShow] = useState(false);
  const [showUsePoint, setShowUsePoint] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editModePointUse, setEditModePointUse] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterName, setFilterName] = useState("");
  const [Categorys, setCategorys] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [redemptionItems, setRedemptionItems] = useState([]);
  const [formDataMenu, setFormDataMenu] = useState({
    exchangePoint: "",
    status: "active",
    selectedMenus: [],
  });

  // Providers
  const { setStoreDetail, storeDetail } = useStoreStore();
  const {
    menus,
    menuCategories,
    getMenus,
    getMenuCategories,
    setMenus,
    setMenuCategories,
    isMenuLoading,
  } = useMenuStore();

  // Number validation helper - updated for comma formatting
  const validateNumberInput = useCallback((value) => {
    return validateAndFormatNumber(value);
  }, []);

  // Optimized handlers - updated for comma formatting
  const handleNumberInput = useCallback(
    (e, fieldName, setter) => {
      const { value } = e.target;
      const validatedValue = validateNumberInput(value);

      setter((prev) => ({
        ...prev,
        [fieldName]: validatedValue,
      }));
    },
    [validateNumberInput]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === "totalAmount" || name === "points") {
        handleNumberInput(e, name, setFormData);
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    [handleNumberInput]
  );

  const handleUpdateChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      let validatedValue = value;
      if (name === "money" || name === "piont") {
        validatedValue = validateNumberInput(value);
      }

      setPointsData((prev) => {
        const updated = [...prev];
        updated[0] = { ...updated[0], [name]: validatedValue };
        return updated;
      });
    },
    [validateNumberInput]
  );

  const handleUpdateChangePointUse = useCallback(
    (e) => {
      const { name, value } = e.target;

      let validatedValue = value;
      if (name === "piontUse" || name === "moneyUse") {
        validatedValue = validateNumberInput(value);
      }

      setPointsData((prev) => {
        const updated = [...prev];
        updated[0] = { ...updated[0], [name]: validatedValue };
        return updated;
      });
    },
    [validateNumberInput]
  );

  const handleExchangePointChange = useCallback(
    (e) => {
      const { value } = e.target;
      const validatedValue = validateNumberInput(value);

      setFormDataMenu((prev) => ({
        ...prev,
        exchangePoint: validatedValue,
      }));
    },
    [validateNumberInput]
  );

  // Modal handlers
  const handleClose = useCallback(() => setShow(false), []);
  const handleCloseUsePoint = useCallback(() => setShowUsePoint(false), []);

  const handleShow = useCallback(async () => {
    try {
      const { DATA } = await getLocalData();
      setFormData((prev) => ({ ...prev, storeId: DATA.storeId }));
      setShow(true);
    } catch (err) {
      console.error("Error loading store data:", err);
    }
  }, []);

  const handleShowUsePoint = useCallback(async () => {
    try {
      const { DATA } = await getLocalData();
      setFormData((prev) => ({ ...prev, storeId: DATA.storeId }));
      setShowUsePoint(true);
    } catch (err) {
      console.error("Error loading store data:", err);
    }
  }, []);

  // Fetch functions with error handling
  const fetchDataMenu = useCallback(async () => {
    if (storeDetail?._id) {
      try {
        const storeId = storeDetail._id;
        const [fetchedMenus, fetchedCategories] = await Promise.all([
          getMenus(storeId),
          getMenuCategories(storeId),
        ]);

        setMenus(fetchedMenus);
        setMenuCategories(fetchedCategories);
      } catch (err) {
        console.error("Error fetching menu data:", err);
      }
    }
  }, [
    storeDetail?._id,
    getMenus,
    getMenuCategories,
    setMenus,
    setMenuCategories,
  ]);

  const getcategory = useCallback(async (id) => {
    if (!id) return;

    try {
      const response = await fetch(
        `${END_POINT_SEVER_TABLE_MENU}/v3/categories?storeId=${id}&isDeleted=false`,
        { method: "GET" }
      );
      const json = await response.json();
      setCategorys(json);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const getMenu = useCallback(
    async (id, categoryId) => {
      if (!id) return;

      try {
        setLoadingMenu(true);
        const url = `${MENUS}/?storeId=${id}${
          filterName ? `&name=${filterName}` : ""
        }${
          categoryId && categoryId !== "All" ? `&categoryId=${categoryId}` : ""
        }`;

        const response = await fetch(url, { method: "GET" });
        const json = await response.json();
        setMenuData(json);
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setLoadingMenu(false);
      }
    },
    [filterName]
  );

  const fetchPointsData = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const { DATA } = await getLocalData();
      const data = await getAllStorePoints(DATA.storeId);
      const filteredData = data.filter(
        (point) => point.storeId === DATA.storeId
      );

      setPointsData(filteredData);
      setStoreDetail({ pointStore: filteredData[0]?.money });
    } catch (error) {
      console.error("Failed to fetch points data: ", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [setStoreDetail]);

  const handleGetExchangePointStore = useCallback(async () => {
    try {
      const res = await getAllExchangePointStore();
      setRedemptionItems(res);
    } catch (err) {
      console.error("Error fetching exchange points:", err);
    }
  }, []);

  // Menu selection handlers
  const handleDeselectAll = useCallback(() => {
    setFormDataMenu((prev) => ({ ...prev, selectedMenus: [] }));
    setSelectAllChecked(false);
  }, []);

  const handleSelectAll = useCallback(() => {
    const allMenuIds = menuData.map((menu) => menu._id);
    setFormDataMenu((prev) => ({ ...prev, selectedMenus: allMenuIds }));
    setSelectAllChecked(true);
  }, [menuData]);

  const handleMenuSelect = useCallback(
    (e) => {
      const selectedMenus = Array.isArray(formDataMenu.selectedMenus)
        ? formDataMenu.selectedMenus
        : [];

      const selected = e.target.checked
        ? [...selectedMenus, e.target.value]
        : selectedMenus.filter((id) => id !== e.target.value);

      setFormDataMenu((prev) => ({ ...prev, selectedMenus: selected }));
    },
    [formDataMenu.selectedMenus]
  );

  // CRUD operations - updated to use safeParseFloat
  const createMemberPoint = useCallback(async () => {
    try {
      setDisabledButton(true);
      const body = {
        money: safeParseFloat(formData.totalAmount),
        piont: safeParseFloat(formData.points),
        storeId: formData.storeId,
      };

      const _data = await addMemberPoint(body);
      if (_data.error) throw new Error("Cannot create point");

      handleClose();
      fetchPointsData();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: t("error"),
        text: t("failed_to_create_point"),
        icon: "error",
        timer: 2500,
        showConfirmButton: false,
      });
    } finally {
      setDisabledButton(false);
    }
  }, [formData, handleClose, fetchPointsData, t]);

  const createMemberPointUse = useCallback(async () => {
    try {
      setDisabledButton(true);
      const body = {
        moneyUse: safeParseFloat(formData.totalAmount),
        piontUse: safeParseFloat(formData.points),
        storeId: formData.storeId,
      };

      const _data = await addMemberPointUse(body);
      if (_data.error) throw new Error("Cannot create point");

      handleCloseUsePoint();
      fetchPointsData();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: t("error"),
        text: t("failed_to_create_point"),
        icon: "error",
        timer: 2500,
        showConfirmButton: false,
      });
    } finally {
      setDisabledButton(false);
    }
  }, [formData, handleCloseUsePoint, fetchPointsData, t]);

  const handleUpdate = useCallback(async () => {
    try {
      const dataToSend = {
        piontStoreId: pointsData[0]._id,
        money: safeParseFloat(pointsData[0].money),
        point: safeParseFloat(pointsData[0].piont),
      };

      const response = await updatePointStore(dataToSend);
      if (response.error) throw new Error("Cannot update point");

      fetchPointsData();
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update points data: ", err);
    }
  }, [pointsData, fetchPointsData]);

  const handleUpdatePointUse = useCallback(async () => {
    try {
      const dataToSend = {
        piontStoreId: pointsData[0]._id,
        moneyUse: safeParseFloat(pointsData[0].moneyUse),
        pointUse: safeParseFloat(pointsData[0].piontUse),
      };

      const response = await updatePointUseStore(dataToSend);
      if (response.error) throw new Error("Cannot update point");

      fetchPointsData();
      setEditModePointUse(false);
    } catch (err) {
      console.error("Failed to update points data: ", err);
    }
  }, [pointsData, fetchPointsData]);

  const handleSaveExchangePointStore = useCallback(async () => {
    try {
      setLoadingMenu(true);
      const dataToSend = {
        ...formDataMenu,
        exchangePoint: safeParseFloat(formDataMenu.exchangePoint),
      };

      let data;
      if (editingItem) {
        data = await updateExchangePointStore(dataToSend, editingItem._id);
      } else {
        data = await creatExchangePointStore(dataToSend);
      }

      if (data.error) throw new Error("Cannot save point");

      setIsOpen(false);
      setFormDataMenu({
        exchangePoint: "",
        status: "active",
        selectedMenus: [],
      });
      handleGetExchangePointStore();
      fetchDataMenu();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMenu(false);
    }
  }, [formDataMenu, editingItem, handleGetExchangePointStore, fetchDataMenu]);

  const handleEdit = useCallback(async (item) => {
    try {
      setEditingItem(item);
      setIsOpen(true);

      const res = await getExchangePointStore(item._id);
      setFormDataMenu((prev) => ({
        ...prev,
        exchangePoint: res?.exchangePoint?.toString() || "",
        selectedMenus: res?.menuId || [],
      }));
    } catch (err) {
      console.error("Error loading exchange point data:", err);
    }
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        text: t("are_you_sure"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: COLOR_APP,
        cancelButtonColor: COLOR_APP_CANCEL,
        confirmButtonText: t("confirm"),
        cancelButtonText: t("cancel"),
      });

      if (result.isConfirmed) {
        try {
          await DeleteExchangePointStore(id);
          Swal.fire({
            title: t("deleted"),
            text: t("your_item_has_been_deleted"),
            icon: "success",
            timer: 2500,
            showConfirmButton: false,
          });
          handleGetExchangePointStore();
          fetchDataMenu();
        } catch (err) {
          Swal.fire({
            title: t("error"),
            text: t("your_item_has_not_been_deleted"),
            icon: "error",
            timer: 2500,
            showConfirmButton: false,
          });
        }
      }
    },
    [t, handleGetExchangePointStore, fetchDataMenu]
  );

  const toggleItemEnabled = useCallback(
    async (e, id) => {
      try {
        setLoading(true);
        const isActive = e.target.checked;
        const status = isActive ? "active" : "inactive";

        await updateStatusExchangePointStore({ status }, id);
        handleGetExchangePointStore();
        fetchDataMenu();
      } catch (err) {
        console.error("Error updating status:", err);
      } finally {
        setLoading(false);
      }
    },
    [handleGetExchangePointStore, fetchDataMenu]
  );

  const resetForm = useCallback(() => {
    setIsOpen(false);
    setEditingItem(null);
    setFormDataMenu({
      exchangePoint: "",
      status: "active",
      selectedMenus: [],
    });
  }, []);

  // Effects
  useEffect(() => {
    const initializeData = async () => {
      try {
        const _localData = await getLocalData();
        if (_localData?.DATA?.storeId) {
          await Promise.all([
            getcategory(_localData.DATA.storeId),
            getMenu(_localData.DATA.storeId),
            handleGetExchangePointStore(),
          ]);
        }
      } catch (err) {
        console.error("Error initializing data:", err);
      }
    };

    initializeData();
    fetchPointsData();
    setStoreDetail({ changeUi: "setting_point" });
  }, []);

  useEffect(() => {
    if (filterName || filterCategory !== "All") {
      const fetchFilteredData = async () => {
        try {
          const _localData = await getLocalData();
          if (_localData?.DATA?.storeId) {
            await getMenu(_localData.DATA.storeId, filterCategory);
          }
        } catch (err) {
          console.error("Error fetching filtered data:", err);
        }
      };

      fetchFilteredData();
    }
  }, [filterName, filterCategory, getMenu]);

  // Memoized values
  const isPointsDataAvailable = useMemo(
    () => pointsData.length > 0,
    [pointsData.length]
  );

  const navigationTabs = useMemo(
    () => [
      {
        key: "setting_point",
        label: t("point_setting"),
        condition: true,
      },
      {
        key: "setting_use_point",
        label: t("point_use_setting_form"),
        condition: true,
      },
      {
        key: "setting_change_point",
        label: t("setting_change_point"),
        condition: storeDetail?.isStatusCafe,
      },
    ],
    [t, storeDetail?.isStatusCafe]
  );

  if (loading) {
    return (
      <div className="pt-[15rem]">
        <center>
          <Spinner animation="border" variant="warning" />
        </center>
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: 20 }}>
        {/* Navigation Tabs */}
        <div className="font-bold bg-[#f2f2f0] h-[45px] border-none grid grid-cols-5 md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-2 mb-[10px]">
          {navigationTabs.map(
            (tab) =>
              tab.condition && (
                <Nav.Item key={tab.key}>
                  <Nav.Link
                    style={{
                      color: theme.primaryColor,
                      backgroundColor:
                        storeDetail.changeUi === tab.key
                          ? theme.mutedColor
                          : "",
                      border: "none",
                      height: 45,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => setStoreDetail({ changeUi: tab.key })}
                  >
                    <span>{tab.label}</span>
                  </Nav.Link>
                </Nav.Item>
              )
          )}
        </div>

        {/* Point Setting Tab */}
        {storeDetail.changeUi === "setting_point" &&
          (isPointsDataAvailable ? (
            <div className="flex gap-2">
              <Card className="w-[500px]">
                <h3 className="p-3 rounded-t-lg bg-color-app text-white text-[16px] font-bold">
                  {t("point_setting_form")}
                </h3>
                <div className="p-4">
                  <div
                    className="mb-3"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 20,
                      width: "100%",
                    }}
                  >
                    <NumberInput
                      name="money"
                      value={pointsData[0]?.money || ""}
                      onChange={handleUpdateChange}
                      disabled={!editMode}
                      label={t("bill_total_price")}
                    />
                    <NumberInput
                      name="piont"
                      value={pointsData[0]?.piont || ""}
                      onChange={handleUpdateChange}
                      disabled={!editMode}
                      label={t("money_will_got")}
                    />
                  </div>
                  {editMode ? (
                    <Button variant="primary" onClick={handleUpdate}>
                      {t("save")}
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => setEditMode(true)}
                    >
                      {t("update")}
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
              }}
            >
              <Button
                variant="primary"
                onClick={handleShow}
                disabled={disabledButton}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <BsInfoCircle />
                {t("setting_point")}
              </Button>
            </div>
          ))}

        {/* Point Use Setting Tab */}
        {storeDetail.changeUi === "setting_use_point" &&
          (isPointsDataAvailable ? (
            <div className="flex gap-2">
              <Card className="w-[500px]">
                <h3 className="p-3 rounded-t-lg bg-color-app text-white text-[16px] font-bold">
                  {t("point_use_setting_form")}
                </h3>
                <div className="p-4">
                  <div
                    className="mb-3"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 20,
                      width: "100%",
                    }}
                  >
                    <NumberInput
                      name="piontUse"
                      value={pointsData[0]?.piontUse || ""}
                      onChange={handleUpdateChangePointUse}
                      disabled={!editModePointUse}
                      label={t("money_will_got")}
                    />
                    <NumberInput
                      name="moneyUse"
                      value={pointsData[0]?.moneyUse || ""}
                      onChange={handleUpdateChangePointUse}
                      disabled={!editModePointUse}
                      label={t("money_amount")}
                    />
                  </div>
                  {editModePointUse ? (
                    <Button variant="primary" onClick={handleUpdatePointUse}>
                      {t("save")}
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => setEditModePointUse(true)}
                    >
                      {t("update_redemption_item")}
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
              }}
            >
              <Button
                variant="primary"
                onClick={handleShowUsePoint}
                disabled={disabledButton}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <BsInfoCircle />
                {t("setting_point")}
              </Button>
            </div>
          ))}

        {/* Exchange Point Setting Tab */}
        {storeDetail.changeUi === "setting_change_point" && (
          <Card className="mx-auto py-1 p-4">
            <Card className="p-6 mb-2 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">
                  {t("points_redemption_management")}
                </h2>
                <p className="text-gray-500">
                  {t("configure_menu_items_redeemed_points")}
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-orange-500 text-white rounded-md flex items-center hover:bg-orange-700"
                onClick={() => {
                  resetForm();
                  setIsOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("add_redemption_item")}
              </button>
            </Card>

            <Card className="bg-white rounded-lg drop-shadow-lg overflow-hidden">
              <div className="p-2 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 overflow-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[17px] font-medium text-gray-500 uppercase">
                        {t("points_required")}
                      </th>
                      <th className="px-6 py-3 text-left text-[17px] font-medium text-gray-500 uppercase">
                        {t("menu_item")}
                      </th>
                      <th className="px-6 py-3 text-left text-[17px] font-medium text-gray-500 uppercase">
                        {t("status")}
                      </th>
                      <th className="px-6 py-3 text-right text-[17px] font-medium text-gray-500 uppercase">
                        {t("_manage")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-[16px]">
                    {redemptionItems?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No redemption items configured yet
                        </td>
                      </tr>
                    ) : (
                      redemptionItems.map((item) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatNumberWithCommas(
                              item.exchangePoint.toString()
                            )}{" "}
                            {t("point")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {item?.menuId?.map((menuItem) => (
                              <ul key={menuItem._id}>
                                <li>- {menuItem?.name}</li>
                              </ul>
                            ))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <label className="inline-flex relative items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={item.status === "active"}
                                  onChange={(e) =>
                                    toggleItemEnabled(e, item._id)
                                  }
                                />
                                <div
                                  className={`w-10 h-5 rounded-full transition-colors ${
                                    item.status === "active"
                                      ? "bg-orange-500"
                                      : "bg-gray-200"
                                  }`}
                                >
                                  <div
                                    className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform shadow-md ${
                                      item.status === "active"
                                        ? "transform translate-x-5"
                                        : ""
                                    }`}
                                  />
                                </div>
                              </label>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              type="button"
                              className="text-orange-600 hover:text-orange-500 mr-3"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-6 w-6" />
                            </button>
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDelete(item._id)}
                            >
                              <Trash2 className="h-6 w-6" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Exchange Point Modal */}
            {isOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[600px] h-[600px]">
                  {loadingMenu ? (
                    <div className="pt-[20rem]">
                      <center>
                        <Spinner animation="border" variant="warning" />
                      </center>
                    </div>
                  ) : (
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-color-app">
                        {editingItem
                          ? t("edit_redemption_item")
                          : t("add_redemption_item")}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {t(
                          "set_the_number_of_points_required_to_redeem_a_menu_item"
                        )}
                      </p>

                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="points"
                            className="col-span-1 text-md font-bold"
                          >
                            {t("point")}
                          </label>
                          <FormattedInput
                            name="exchangePoint"
                            value={formDataMenu?.exchangePoint || ""}
                            onChange={handleExchangePointChange}
                            className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="2,500"
                          />
                        </div>

                        <label className="col-span-1 text-md font-bold">
                          {t("menu_item")}
                        </label>
                        <div className="flex justify-center items-center">
                          <div className="bg-white rounded-lg p-2 w-full">
                            <div className="flex flex-row gap-2 items-center py-3">
                              <select
                                className="w-[200px] border h-[40px] p-2 focus:outline-none focus-visible:outline-none rounded-md"
                                value={filterCategory}
                                onChange={(e) =>
                                  setFilterCategory(e.target.value)
                                }
                              >
                                <option value="All">{t("all")}</option>
                                {Categorys?.map((data) => (
                                  <option
                                    key={`category${data?._id}`}
                                    value={data?._id}
                                  >
                                    {data?.name}
                                  </option>
                                ))}
                              </select>
                              <input
                                onChange={(e) => setFilterName(e.target.value)}
                                className="w-[350px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                                type="text"
                                placeholder={t("search")}
                              />
                            </div>
                            <div className="h-[240px] overflow-auto">
                              <table className="w-full">
                                <thead>
                                  <tr>
                                    <th className="border-b p-2">
                                      <label className="flex gap-1 items-center mt-2">
                                        <input
                                          type="checkbox"
                                          checked={selectAllChecked}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              handleSelectAll();
                                            } else {
                                              handleDeselectAll();
                                            }
                                          }}
                                        />
                                        {t("select")}
                                      </label>
                                    </th>
                                    <th className="border-b p-2">
                                      {t("menuname")}
                                    </th>
                                    <th className="border-b p-2">
                                      {t("name_type")}
                                    </th>
                                    <th className="border-b p-2">
                                      {t("price")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {menuData?.length > 0 ? (
                                    menuData.map((menu) => (
                                      <tr key={menu._id}>
                                        <td className="border-b p-2">
                                          <input
                                            type="checkbox"
                                            value={menu._id}
                                            checked={
                                              Array.isArray(
                                                formDataMenu.selectedMenus
                                              ) &&
                                              formDataMenu.selectedMenus.includes(
                                                menu._id
                                              )
                                            }
                                            onChange={handleMenuSelect}
                                          />
                                        </td>
                                        <td className="border-b p-2 text-ellipsis">
                                          {menu.name}
                                        </td>
                                        <td className="border-b p-2">
                                          {menu.categoryId?.name}
                                        </td>
                                        <td className="border-b p-2">
                                          {formatNumberWithCommas(
                                            menu.price.toString()
                                          )}{" "}
                                          {storeDetail?.firstCurrency}
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td className="border-b p-2" colSpan="4">
                                        <div className="flex justify-center items-center">
                                          <p className="text-lg text-gray-400">
                                            {t("no_data")}
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-center space-x-3">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-4 py-2 border bg-red-500 w-[100px] rounded-md text-sm font-medium text-white hover:bg-red-600"
                        >
                          {t("cancel")}
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveExchangePointStore}
                          className={`px-4 py-2 ${
                            !formDataMenu.exchangePoint ||
                            formDataMenu.selectedMenus.length === 0
                              ? "bg-orange-400 cursor-not-allowed  w-[100px] text-white rounded-md text-sm font-medium"
                              : "bg-orange-600 w-[100px] text-white rounded-md text-sm font-medium hover:bg-orange-700"
                          } `}
                          disabled={
                            !formDataMenu.exchangePoint ||
                            formDataMenu.selectedMenus.length === 0
                          }
                        >
                          {editingItem ? t("update_redemption_item") : t("add")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Point Creation Modal */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{t("point_setting_form")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div
                className="mb-3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  width: "100%",
                }}
              >
                <NumberInput
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  required
                  label={t("bill_total_price")}
                  placeholder="Enter amount"
                />
                <NumberInput
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  required
                  label={t("point_will_got")}
                  placeholder="Enter points"
                />
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t("close")}
            </Button>
            <Button
              variant="primary"
              onClick={createMemberPoint}
              disabled={
                disabledButton || !formData.totalAmount || !formData.points
              }
            >
              {t("set_point")}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Point Use Creation Modal */}
        <Modal show={showUsePoint} onHide={handleCloseUsePoint}>
          <Modal.Header closeButton>
            <Modal.Title>{t("point_use_setting_form")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div
                className="mb-3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  width: "100%",
                }}
              >
                <NumberInput
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  required
                  label={t("bill_total_price")}
                  placeholder="Enter amount"
                />
                <NumberInput
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  required
                  label={t("point_will_got")}
                  placeholder="Enter points"
                />
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUsePoint}>
              {t("close")}
            </Button>
            <Button
              variant="primary"
              onClick={createMemberPointUse}
              disabled={
                disabledButton || !formData.totalAmount || !formData.points
              }
            >
              {t("set_point")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
