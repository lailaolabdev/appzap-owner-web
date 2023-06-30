import * as _ from "lodash";
import { USER_KEY } from "../constants";
import moment from "moment"
//
export const orderStatus = (status) => {
  switch (status) {
    case "WAITING":
      return "ອໍເດີເຂົ້າ";
    case "DOING":
      return "ກໍາລັງຄົວ";
    case "SERVED":
      return `ເສີບແລ້ວ`;
    case "CART":
      return `ກຳລັງຈະສັງ`;
    case "FEEDBACK":
      return `ສົ່ງຄືນ`;
    default:
      return "ຍົກເລີກ";
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
  const user = JSON.parse(localStorage.getItem(USER_KEY));
  return user;
};
export const useAuth = () => {
  const userData = getUserDataFromLCStorage();
  const isAuthenticated = !_.isEmpty(userData);
  return isAuthenticated;
};
export const _statusCheckBill = (item) => {
  if (item === "CALLTOCHECKOUT") {
    return "ຕ້ອງການຈ່າຍເງິນ";
  } else if (item === "ACTIVE") {
    return "ມີອໍເດີ";
  } else if (item === "CHECKOUT") {
    return "ຊຳລະສຳເລັດ";
  } else if (item === "CART") {
    return "ກຳລັງສັ່ງອາຫານ";
  }
};
export const STATUS_USERS = (item) => {
  if (item === "APPZAP_ADMIN") {
    return "ຜູ້ບໍລິຫານ";
  } else if (item === "USER") {
    return "ຜູ້ໃຊ້";
  } else if (item === "APPZAP_STAFF") {
    return "ພະນັກງານ";
  }
};
export const STATUS_MENU = (item) => {
  if (item) return "ເປີດ";
  if (!item) return "ປິດ";
};
export const STATUS_OPENTABLE = (item) => {
  if (item === false) {
    return "ວ່າງ";
  } else if (item === true) {
    return "ເປີດແລ້ວ";
  }
};
export const base64ToBlob = (dataurl) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const sliceSize = 10;
  const byteChars = window.atob(arr[1]);
  const byteArrays = [];

  for (
    let offset = 0, len = byteChars.length;
    offset < len;
    offset += sliceSize
  ) {
    let slice = byteChars.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mime });
};

export const resizeImage = (base64Str, maxWidth = 400, maxHeight = 350) => {
  return new Promise((resolve) => {
    let img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let canvas = document.createElement("canvas");
      const MAX_WIDTH = maxWidth;
      const MAX_HEIGHT = maxHeight;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL());
    };
  });
};


export const convertPayment = (status) => {
  switch (status) {
    case "CASH":
      return "ເງິນສົດ";
    case "TRANSFER":
      return "ເງິນໂອນ";
    case "OTHER":
      return `ອື່ນໆ`;
    default:
      return "ອື່ນໆ";
  }
};

// ກຳນົດ ວັນທີປັດຈຸບັນ(ພາສາລາວ)
export const formatDate = (dateTime) => {
  moment.locale("lo");
  let resp = moment(dateTime).format("DD-MM-YYYY");
  if (dateTime) return resp;
  else return "";
};

export const formatDateTime = (dateTime) => {
  moment.locale("lo");
  let resp = moment(dateTime).format("DD-MM-YYYY HH:MM");
  if (dateTime) return resp;
  else return "";
};