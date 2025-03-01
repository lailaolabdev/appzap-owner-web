const data = {
  defaultPath: "-PATH-",
  reportManagement: true,
  tableManagement: true,
  orderManagement: true,
  reservationManagement: true,
  menuManagement: true,
  settingManagement: true,
  themeManagement: true,
};
/**
 * ຈັດການສິດການເຂົ້າເຖິງຕາມ Role
 * @param {String} role
 * @param {Object} user
 * @returns {data}
 */
const role = (role, user, storeDetail, shiftCurrent, path) => {
  const getDefaultPath = () => {
    if (storeDetail?.isShift) {
      if (shiftCurrent?.[0]?.status === "OPEN") return "/tables";
      if (shiftCurrent?.[0]?.status === "CLOSE") return "/cafe";
      return "/shift-open-pages";
    }
    return storeDetail?.isStatusCafe ? "/cafe" : "/tables";
  };

  // const defaultPath = getDefaultPath();

  const defaultPath = storeDetail?.isShift
    ? shiftCurrent?.[0]?.status === "OPEN"
      ? storeDetail?.isStatusCafe
        ? "/cafe"
        : "/tables"
      : shiftCurrent?.[0]?.status === "CLOSE"
      ? "/cafe"
      : "/shift-open-pages"
    : storeDetail?.isStatusCafe
    ? "/cafe"
    : "/tables";

  switch (role) {
    case "APPZAP_ADMIN":
      return {
        defaultPath: `/settingStore/storeDetail/${user?.storeId}`,
        reportManagement: true,
        tableManagement: true,
        orderManagement: true,
        reservationManagement: true,
        menuManagement: true,
        settingManagement: true,
        themeManagement: true,
        report: true,
        stockManagement: true,
        farkManagement: true,
      };
    case "APPZAP_STAFF":
      return {
        defaultPath: `/tables`,
        // reportManagement: true,
        tableManagement: true,
        // orderManagement: true,
        // reservationManagement: true,
        // menuManagement: true,
        // settingManagement: true,
        // themeManagement: true,
        // farkManagement:true,
      };
    case "APPZAP_RESTAURANT":
      return {
        defaultPath: `/settingStore/storeDetail/${user?.storeId}`,
        reportManagement: true,
        tableManagement: true,
        orderManagement: true,
        reservationManagement: true,
        menuManagement: true,
        settingManagement: true,
        themeManagement: true,
        report: true,
        stockManagement: true,
        farkManagement: true,
      };
    case "APPZAP_USER":
      return {
        // defaultPath: "-PATH-",
        // reportManagement: true,
        // tableManagement: true,
        // orderManagement: true,
        // reservationManagement: true,
        // menuManagement: true,
        // settingManagement: true,
        // themeManagement: true,
      };
    case "APPZAP_FREELANCER":
      return {
        // defaultPath: "-PATH-",
        // reportManagement: true,
        // tableManagement: true,
        // orderManagement: true,
        // reservationManagement: true,
        // menuManagement: true,
        // settingManagement: true,
        // themeManagement: true,
      };
    case "APPZAP_DEALER":
      return {
        defaultPath: `/${path}`,
        reportManagement: true,
        tableManagement: true,
        orderManagement: true,
        reservationManagement: true,
        menuManagement: true,
        settingManagement: true,
        themeManagement: true,
        report: true,
        stockManagement: true,
        farkManagement: true,
      };
    case "APPZAP_KITCHEN":
      return {
        defaultPath: "/orders",
        // reportManagement: true,
        // tableManagement: true,
        orderManagement: true,
        // reservationManagement: true,
        // menuManagement: true,
        // settingManagement: true,
        // themeManagement: true,
      };
    case "APPZAP_COUNTER":
      return {
        defaultPath: defaultPath,
        // defaultPath: storeDetail?.isShift
        //   ? shiftCurrent[0]?.status === "OPEN"
        //     ? "/tables"
        //     : "/shift-open-pages"
        //   : storeDetail?.isStatusCafe
        //   ? "/cafe"
        //   : "/tables",
        reportManagement: true,
        tableManagement: true,
        orderManagement: true,
        reservationManagement: true,
        // menuManagement: true,
        // settingManagement: true,
        // themeManagement: true,
        report: true,
        // stockManagement: true,
        farkManagement: true,
      };
    default:
      return {};
  }
};
export default role;
