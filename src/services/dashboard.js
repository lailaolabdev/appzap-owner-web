import axios from "axios";
import { getLocalData, END_POINT_APP } from "../constants/api";
import { getHeaders } from "./auth";

export const getDashboard = async (findBy) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v3/dashboard?storeId=${LocalData?.DATA?.storeId}${findBy}`;
    const res = await axios.get(url, {
      headers: await getHeaders(),
    });
    let data = res.data;
    return data;
  } catch (error) {
    console.log("get orders error:", error);
  }
};

export const getDashboardBillMonth = async (storeId, findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/dashboard-bill-month/${storeId}${findBy}`;
    const res = await axios.post(url, null, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};
