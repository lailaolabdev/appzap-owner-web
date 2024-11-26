import axios from "axios";
import { getLocalData, END_POINT_APP } from "../constants/api";
import { getHeaders } from "./auth";

export const getAllDelivery = async () => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v4/delivery/all?storeId=${LocalData?.DATA?.storeId}`;
    const res = await axios.get(url, {
      headers: await getHeaders(),
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log("get delivery error:", error);
  }
};
export const creatDelivery = async (values) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v4/delivery/create?storeId=${LocalData?.DATA?.storeId}`;
    const res = await axios.post(url, values, {
      headers: await getHeaders(),
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log("create delivery error:", error);
  }
};
export const DeleteDelivery = async (deliveryId) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v4/delivery/delete?storeId=${LocalData?.DATA?.storeId}&deliveryId=${deliveryId}`;
    const res = await axios.delete(url, {
      headers: await getHeaders(),
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log("Delete delivery error:", error);
  }
};

export const updateDelivery = async (values, deliveryId) => {
  const LocalData = await getLocalData();
  const url = `${END_POINT_APP}/v4/delivery/update?storeId=${LocalData?.DATA?.storeId}&deliveryId=${deliveryId}`;
  const res = await axios.put(url, values, {
    headers: await getHeaders(),
  });
  const data = res.data;
  return data;
};
