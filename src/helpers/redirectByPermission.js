export const redirectByPermission = (user, storeDetail) => {
  const permissions = user?.data?.data?.permissionRoleId?.permissions || [];
  const firstFoundPermission = permissions.find((p) =>
    [
      "REPORT_SALES_SUMMARY",
      "TABLE_STATUS",
      "REPORT_INCOME_EXPENSE",
      "REPORT_STOCK",
      "REPORT_INDEBTED",
      "REPORT_NEW",
      "MANAGE_STOCK",
      "REPORT_MEMBER",
      "MANAGE_STAFF",
      "MANAGE_BANNER",
      "MANAGE_ROLES",
      "MANAGE_MENU",
      "MANAGE_SOUND",
      "MANAGE_CURRENCY_RATES",
      "MANAGE_BANKS",
      "MANAGE_DELIVERY",
      "MANAGE_RESERVATIONS",
      "MANAGE_EXPENSES",
      "FINANCIAL_STATISTICS",
      "MANAGE_ORDERS",
      "MANAGE_CAFE",
      "MANAGE_BRANCHES",
      "MANAGE_PRODUCT_EXPRESS",
      "MANAGE_CUSTOMER_REQUESTS",
      "MANAGE_MARKETING",
      "CONFIGURE_STORE",
      "CONFIGURE_ZONE",
      "CONFIGURE_TABLE",
      "CONFIGURE_PRINTER",
      "CONFIGURE_POS",
      "CONFIGURE_PIN",
      "CONFIGURE_SECOND_SCREEN",
      "CONFIGURE_STORE_DETAIL",
      "HISTORY_USED",
      "CLRAR_HISTORY",
      "SHOP_SETING",
      "PROMOTION",
    ].includes(p)
  );

  if (!firstFoundPermission) return "";

  switch (firstFoundPermission) {
    case "TABLE_STATUS":
      return "tables";
    case "MANAGE_ORDERS":
      return "orders";
    case "MANAGE_STOCK":
      return "stock";
    case "MANAGE_CAFE":
      return "cafe";
    case "MANAGE_RESERVATIONS":
      return "reservations";
    case "MANAGE_MENU":
      return "menu";
    case "FINANCIAL_STATISTICS":
      return `report/${storeDetail?._id}`;
    case "REPORT_NEW":
      return "reports/sales-report";
    case "MANAGE_BRANCHES":
      return "branch";
    case "SHOP_SETING":
      return `settingStore/${storeDetail?._id}`;
    case "MANAGE_PRODUCT_EXPRESS":
      return "fark";
    case "REPORT_INDEBTED":
      return "debt";
    case "MANAGE_CUSTOMER_REQUESTS":
      window.location.href =
        "https://dtf6wpulhnd0r.cloudfront.net/store/songs/61d8019f9d14fc92d015ee8e?token=...";
      return "";
    case "MANAGE_MARKETING":
      window.location.href = "https://supplier.appzap.la/";
      return "";
    case "MANAGE_STAFF":
      return "user";
    case "CONFIGURE_ZONE":
      return `settingStore/settingZone/${storeDetail?._id}`;
    case "CONFIGURE_TABLE":
      return `settingStore/settingTable/${storeDetail?._id}`;
    case "HISTORY_USED":
      return `historyUse/${storeDetail?._id}`;
    case "CONFIGURE_PRINTER":
      return "printer";
    case "MANAGE_SOUND":
      return "audio";
    case "CONFIGURE_POS":
      return "config";
    case "MANAGE_CURRENCY_RATES":
      return `settingStore/currency/${storeDetail?._id}`;
    case "MANAGE_BANKS":
      return `settingStore/bank/${storeDetail?._id}`;
    case "MANAGE_ROLES":
      return `settingStore/role`;
    case "MANAGE_BANNER":
      return `settingStore/banner`;
    case "CONFIGURE_PIN":
      return `PIN`;
    case "MANAGE_DELIVERY":
      return `settingStore/delivery/${storeDetail?._id}`;
    case "CONFIGURE_SECOND_SCREEN":
      return `setting-screen`;
    case "CONFIGURE_STORE_DETAIL":
      return `settingStore/storeDetail/${storeDetail?._id}`;
    case "PROMOTION":
      return `"/promotion"`;
    default:
      return "tables";
  }
};
