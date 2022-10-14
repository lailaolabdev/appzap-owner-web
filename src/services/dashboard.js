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
