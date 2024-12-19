import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getStocksAll = async (storeId, findBy) => {
  try {
    const url = `${END_POINT_APP}/v3/stocks/${storeId}${findBy}`;
    const res = await axios.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const getCountStocksAll = async (storeId, findBy) => {
  try {
    const url = `${END_POINT_APP}/v3/count-stocks/${storeId}`;
    const res = await axios.get(url);
    return res;
  } catch (error) {
    return error;
  }
};

export const getStocksHistories = async (storeId, findBy) => {
  try {
    console.log({ findBy });
    const url = `${END_POINT_APP}/v6/stock-history-groups?storeId=${storeId}${findBy}`;
    const res = await axios.get(url);
    console.log({ res });
    return res;
  } catch (error) {
    return error;
  }
};

export const getStocksCategory = async (storeId) => {
  try {
    const url = `${END_POINT_APP}/v3/stock-categories?storeId=${storeId}&isDeleted=false`;
    const res = await axios.get(url);

    return res;
  } catch (error) {
    return error;
  }
};

export const createStockeCategoryAll = async (data) => {
  try {
    const url = `${END_POINT_APP}/v3/stock-category/create`;
    const res = await axios.post(url, data, {
      headers: await getHeaders(),
    });

    return res;
  } catch (error) {
    return error;
  }
};
export const createStockeAll = async (data) => {
  try {
    const url = `${END_POINT_APP}/v3/stock/create`;
    const res = await axios.post(url, data, {
      headers: await getHeaders(),
    });

    return res;
  } catch (error) {
    return error;
  }
};
