import {
  END_POINT_PRINTBILL,
  END_POINT_PRINT_DISCOVEER_IP,
} from "../constants/index";
import axios from "axios";
export const prinBill80 = async (data) => {
  try {
    const url = `${END_POINT_PRINTBILL}`;
    const res = await axios.post(url, data);
    return { message: res, status: true };
  } catch (error) {
    return { message: error, status: false };
  }
};
export const printBillDiscoverIp = async () => {
  try {
    const url = `${END_POINT_PRINT_DISCOVEER_IP}`;
    const res = await axios.get(url);
    return { data: res, status: true };
  } catch (error) {
    return { message: error, status: false };
  }
};
