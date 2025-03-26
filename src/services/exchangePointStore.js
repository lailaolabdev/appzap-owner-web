import axios from "axios";
import { getLocalData, END_POINT_APP } from "../constants/api";
import { getHeaders } from "./auth";

export const getAllExchangePointStore = async () => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v7/exchangePointStore/all?storeId=${LocalData?.DATA?.storeId}`;
    const res = await axios.get(url, {
      headers: await getHeaders(),
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log("get exchangePointStore error:", error);
  }
};
export const getExchangePointStore = async (id) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v7/exchangePointStore/one?storeId=${LocalData?.DATA?.storeId}&id=${id}`;
    const res = await axios.get(url, {
      headers: await getHeaders(),
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log("get exchangePointStore error:", error);
  }
};
export const creatExchangePointStore = async (values) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v7/exchangePointStore/create?storeId=${LocalData?.DATA?.storeId}`;
    const res = await axios.post(url, values, {
      headers: await getHeaders(),
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log("create exchangePointStore error:", error);
  }
};
export const DeleteExchangePointStore = async (id) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v7/exchangePointStore/delete?storeId=${LocalData?.DATA?.storeId}&id=${id}`;
    const res = await axios.delete(url, {
      headers: await getHeaders(),
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log("Delete exchangePointStore error:", error);
  }
};

export const updateExchangePointStore = async (values, id) => {
  const LocalData = await getLocalData();
  const url = `${END_POINT_APP}/v7/exchangePointStore/update?storeId=${LocalData?.DATA?.storeId}&id=${id}`;
  const res = await axios.put(url, values, {
    headers: await getHeaders(),
  });
  const data = res.data;
  return data;
};
export const updateStatusExchangePointStore = async (values, id) => {
  const LocalData = await getLocalData();
  const url = `${END_POINT_APP}/v7/exchangePointStore/update/status?storeId=${LocalData?.DATA?.storeId}&id=${id}`;
  const res = await axios.put(url, values, {
    headers: await getHeaders(),
  });
  const data = res.data;
  return data;
};
