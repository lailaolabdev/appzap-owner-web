import * as _ from "lodash"
import { USER_KEY } from "../constants"
export const orderStatus = (status) => {
  switch (status) {
    case "WAITING":
      return "ອໍເດີເຂົ້າ";
      break;
    case "DOING":
      return "ກໍາລັງຄົວ";
      break;
    case "SERVED":
      return `ເສີບແລ້ວ`;
      break;
    case "CART":
      return `ກຳລັງຈະສັງ`;
      break;
    case "FEEDBACK":
      return `ສົ່ງຄືນ`;
      break;
    default:
      return "ຍົກເລີກ";
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
export const getUserDataFromLCStorage = () => {
  const user = JSON.parse(localStorage.getItem(USER_KEY))
  return user
}
export const useAuth = () => {
  const userData = getUserDataFromLCStorage()
  const isAuthenticated = !_.isEmpty(userData)
  return isAuthenticated
}
export const _statusCheckBill = (item) => {
  if (item === 'CALLTOCHECKOUT') {
    return "ຕ້ອງການຈ່າຍເງິນ"
  } else if (item === 'ACTIVE') {
    return "ມີອໍເດີ"
  } else if (item === 'CHECKOUT') {
    return "ຊຳລະສຳເລັດ"
  } else if (item === 'CART') {
    return "ກຳລັງສັ່ງອາຫານ"
  }

}
export const STATUS_USERS = (item) => {
  if (item === 'APPZAP_ADMIN') {
    return "ຜູ້ໃຫ້ບໍລິຫານ"
  } else if (item === 'USER') {
    return "ພະນັກງານ"
  } else if (item === 'APPZAP_STAFF') {
    return "ຜູ້ບໍລິຫານ"
  }
}
export const STATUS_MENU = (item) => {
  if (item) return "ເປີດ"
  if (!item) return "ປິດ"
}
export const STATUS_OPENTABLE = (item) => {
  if (item === false) {
    return "ວ່າງ"
  } else if (item === true) {
    return "ເປີດແລ້ວ"
  }
}