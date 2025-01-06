import { END_POINT_APP, END_POINT_SEVER_TABLE_MENU } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getStocksAll = async (findBy) => {
  try {
    const url = `${END_POINT_APP}/v6/stocks/${findBy}`;
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
    const url = `${END_POINT_APP}/v6/stock-history-groups?storeId=${storeId}${findBy}`;
    const res = await axios.get(url);
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
    const url = `${END_POINT_APP}/v6/stock-category/create`;
    const res = await axios.post(url, data, {
      headers: await getHeaders(),
    });

    return res;
  } catch (error) {
    return error.response || error;
  }
};
export const createStockeAll = async (data) => {
  try {
    const url = `${END_POINT_APP}/v6/stock/create`;
    const res = await axios.post(url, data, {
      headers: await getHeaders(),
    });

    return res;
  } catch (error) {
    return error.response || error;
  }
};

export const deleteStock = async (id) => {
  try {
    const url = `${END_POINT_APP}/v3/stock/delete/${id}`;
    const res = await axios.delete(url, {
      headers: await getHeaders(),
    });

    return res;
  } catch (error) {
    return error;
  }
};

export const createStockCategory = async (data) => {
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

export const deleteStockMenu = async (id) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/menu-stock/delete/${id}`;
    const res = await axios.delete(url, {
      headers: await getHeaders(),
    });

    return res;
  } catch (error) {
    return error;
  }
};
