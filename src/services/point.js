import axios from "axios";
import { getLocalData, END_POINT_APP } from "../constants/api";
import { getHeaders } from "./auth";
export const RedeemPoint = async (value) => {
  try {
    const url = `${END_POINT_APP}/v4/point-redeem`;
    const res = await axios.post(url, value, {
      headers: await getHeaders(),
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log("RedeemPoint error:", error);
  }
};
export const GetRedeemPoint = async () => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v4/point-redeem/history?storeId=${LocalData?.DATA?.storeId}`;
    const res = await axios.get(url, {
      headers: await getHeaders(),
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log("RedeemPoint error:", error);
  }
};
export const GetEarnPoint = async () => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v4/point-earn/history?storeId=${LocalData?.DATA?.storeId}`;
    const res = await axios.get(url, {
      headers: await getHeaders(),
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log("RedeemPoint error:", error);
  }
};
