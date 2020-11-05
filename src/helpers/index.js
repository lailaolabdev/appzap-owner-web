export const orderStatus = (status) => {
  switch (status) {
    case "WAITING":
      return "ອໍເດີເຂົ້າ";
      break;
    case "DOING":
      return "ກໍາລັງຄົວ";
      break;
    case "SERVED":
      return "ເສີບແລ້ວ";
      break;
    default:
      return "ຍົກເລີກແລ້ວ";
      break;
  }
};

export const moneyCurrency = (value) => {
  if (value) {
    let currencys = new Intl.NumberFormat("en-CA").format(value);
    return currencys;
  } else {
    return 0;
  }
};
