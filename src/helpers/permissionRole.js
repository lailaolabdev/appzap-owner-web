import { useTranslation } from "react-i18next";

export const PermissionsConfig = () => {
  const { t } = useTranslation();

  const permissionsConfig = {
    permissionsCategories: {
      reportTypes: {
        label: t("1. ປະເພດລາຍງານຂໍ້ມູນ"),
        permissions: {
          [t("table_status")]: "TABLE_STATUS",
          [t("statistic_money")]: "FINANCIAL_STATISTICS",
          [t("report_new")]: "REPORT_NEW",
          [t("debt_report")]: "REPORT_INDEBTED",
        },
      },
      productManagement: {
        label: t("2. ປະເພດການຈັດການ"),
        permissions: {
          [t("stock_manage")]: {
            code: "MANAGE_STOCK",
            options: {
              edit: "CAN_EDIT",
              viewOnly: "VIEW_ONLY",
            },
          },
          [t("employeeManage")]: "MANAGE_STAFF",
          [t("manage_role")]: "MANAGE_ROLES",
          [t("menuManage")]: "MANAGE_MENU",
          [t("sound_manage")]: "MANAGE_SOUND",
          [t("currency_manage")]: "MANAGE_CURRENCY_RATES",
          [t("bank")]: "MANAGE_BANKS",
          [t("setting_delivery")]: "MANAGE_DELIVERY",
          [t("booking_manage")]: "MANAGE_RESERVATIONS",
          [t("paid_manage")]: "MANAGE_EXPENSES",
          [t("orderManage")]: "MANAGE_ORDERS",
          [t("manage_banner")]: "MANAGE_BANNER",
          [t("manage_cafe")]: "MANAGE_CAFE",
          [t("manage_branch")]: "MANAGE_BRANCHES",
          [t("manage_product_storage")]: "MANAGE_PRODUCT_EXPRESS",

          [t("manage_promotion")]: "MANAGE_PROMOTION",
        },
      },
      settings: {
        label: t("3. ປະເພດການຕັ້ງຄ່າ"),
        permissions: {
          [t("shop_setting")]: "SHOP_SETING",
          [t("zone_setting")]: "CONFIGURE_ZONE",
          [t("setting_table")]: "CONFIGURE_TABLE",
          [t("printer_setting")]: "CONFIGURE_PRINTER",
          [t("posconfig")]: "CONFIGURE_POS",
          [t("pin_setting")]: "CONFIGURE_PIN",
          [t("configure_second_screen")]: "CONFIGURE_SECOND_SCREEN",
          [t("edit_store_details")]: "CONFIGURE_STORE_DETAIL",
          [t("sound_setting")]: "AUDIO",
        },
      },
      etc: {
        label: t("4. ອື່ນໆ"),
        permissions: {
          [t("transaction_history")]: "HISTORY_USED",
          [t("clear_restaurant_data")]: "CLRAR_HISTORY",
          [t("manage_song_requests")]: "MANAGE_CUSTOMER_REQUESTS",
          [t("manage_marketing")]: "MANAGE_MARKETING",
        },
      },
    },
  };

  const createInitialState = () => {
    const initialState = {
      accountName: "",
      note: "",
      canAccessAllSystems: false,
      stockManageOption: "VIEW_ONLY",
    };

    Object.keys(permissionsConfig.permissionsCategories).forEach(
      (categoryKey) => {
        initialState[categoryKey] = {};
        Object.keys(
          permissionsConfig.permissionsCategories[categoryKey].permissions
        ).forEach((permKey) => {
          initialState[categoryKey][permKey] = false;
        });
      }
    );

    return initialState;
  };

  const transformPermissions = (formData) => {
    const permissions = [];

    Object.entries(permissionsConfig.permissionsCategories).forEach(
      ([categoryKey, category]) => {
        Object.entries(category.permissions).forEach(([key, permission]) => {
          if (formData[categoryKey][key]) {
            if (key === t("stock_manage")) {
              permissions.push(permission.code);

              permissions.push(
                `${permission.code}_${formData.stockManageOption}`
              );
            } else {
              permissions.push(
                typeof permission === "string" ? permission : permission.code
              );
            }
          }
        });
      }
    );

    return permissions;
  };

  const createInputChangeHandler = (setFormData) => (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createCheckboxChangeHandler = (setFormData) => (section, name) => {
    setFormData((prev) => {
      if (section === "root" && name === "canAccessAllSystems") {
        const newValue = !prev.canAccessAllSystems;
        const updatedState = {
          ...prev,
          canAccessAllSystems: newValue,
        };

        Object.keys(permissionsConfig.permissionsCategories).forEach(
          (categoryKey) => {
            updatedState[categoryKey] = Object.keys(
              permissionsConfig.permissionsCategories[categoryKey].permissions
            ).reduce((acc, permKey) => {
              acc[permKey] = newValue;
              return acc;
            }, {});
          }
        );

        return updatedState;
      } else if (section === "root") {
        return {
          ...prev,
          [name]: !prev[name],
        };
      } else {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: !prev[section][name],
          },
        };
      }
    });
  };

  return {
    permissionsConfig,
    createInitialState,
    transformPermissions,
    createInputChangeHandler,
    createCheckboxChangeHandler,
  };
};

export default PermissionsConfig;
