export const convertRole = (status) => {
  switch (status) {
    case "APPZAP_ADMIN":
      return "ຜູ້ບໍລິຫານ";
    case "APPZAP_STAFF":
      return "ພະນັກງານເສີບ";
    case "APPZAP_COUNTER":
      return "ພະນັກງານເຄົາເຕີ້";
    case "APPZAP_KITCHEN":
      return "ພໍ່ຄົວ / ແມ່ຄົວ";
    case "APPZAP_CUSTOM_ROLE":
      return "ກຳນົດເອງ";
    default:
      return status;
  }
};
