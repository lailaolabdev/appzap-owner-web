export const redirectByPermission = (user, setPath, storeDetail) => {
    if (user?.data?.data?.role === "APPZAP_DEALER") {
      const permissions = user?.data?.data?.permissionRoleId?.permissions || [];
      const firstFoundPermission = permissions.find(p =>
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
        ].includes(p)
      );
  
      if (firstFoundPermission) {
        switch (firstFoundPermission) {
          case "TABLE_STATUS":
            setPath("tables");
            break;
          case "MANAGE_ORDERS":
            setPath("orders");
            break;
          case "MANAGE_STOCK":
            setPath("stock");
            break;
          case "MANAGE_CAFE":
            setPath("cafe");
            break;
          case "MANAGE_RESERVATIONS":
            setPath("reservations");
            break;
          case "MANAGE_MENU":
            setPath("menu");
            break;
          case "FINANCIAL_STATISTICS":
            setPath(`report/${storeDetail?._id}`);
            break;
          case "REPORT_NEW":
            setPath("reports/sales-report");
            break;
          case "MANAGE_BRANCHES":
            setPath("branch");
            break;
          case "SHOP_SETING":
            setPath(`settingStore/${storeDetail?._id}`);
            break;
          case "MANAGE_PRODUCT_EXPRESS":
            setPath("fark");
            break;
          case "REPORT_INDEBTED":
            setPath("debt");
            break;
          case "MANAGE_CUSTOMER_REQUESTS":
            window.location.href = "https://dtf6wpulhnd0r.cloudfront.net/store/songs/61d8019f9d14fc92d015ee8e?token=...";
            return;
          case "MANAGE_MARKETING":
            window.location.href = "https://supplier.appzap.la/";
            return;
          case "MANAGE_STAFF":
            setPath("user");
            return;
          case "CONFIGURE_ZONE":
            setPath(`settingStore/settingZone/${storeDetail?._id}`);
            return;
          case "CONFIGURE_TABLE":
            setPath(`settingStore/settingTable/${storeDetail?._id}`);
            return;
          case "HISTORY_USED":
            setPath(`historyUse/${storeDetail?._id}`);
            return;
          case "CONFIGURE_PRINTER":
            setPath("printer");
            return;
          case "MANAGE_SOUND":
            setPath("audio");
            return;
          case "CONFIGURE_POS":
            setPath("config");
            return;
          case "MANAGE_CURRENCY_RATES":
            setPath(`settingStore/currency/${storeDetail?._id}`);
            return;
          case "MANAGE_BANKS":
            setPath(`settingStore/bank/${storeDetail?._id}`);
            return;
          case "MANAGE_ROLES":
            setPath(`settingStore/role`);
            return;
          case "MANAGE_BANNER":
            setPath(`settingStore/banner`);
            return;
          case "CONFIGURE_PIN":
            setPath(`PIN`);
            return;
          case "MANAGE_DELIVERY":
            setPath(`settingStore/delivery/${storeDetail?._id}`);
            return;
          case "CONFIGURE_SECOND_SCREEN":
            setPath(`setting-screen`);
            return;
          case "CONFIGURE_STORE_DETAIL":
            setPath(`settingStore/storeDetail/${storeDetail?._id}`);
            return;
          default:
            setPath("tables");
            break;
        }
      } else {
        setPath("");
      }
    }
  };
  