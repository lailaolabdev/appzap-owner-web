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
    const url = `${END_POINT_APP}/v3/stock-history-groups?storeId=${storeId}${findBy}`;
    const res = await axios.get(url);

    return res;
  } catch (error) {
    return error;
  }
};

export const createStockeCategoryAll = async (storeId, findBy) => {
  try {
    const url = `${END_POINT_APP}/v3/stock-history-groups?storeId=${storeId}${findBy}`;
    const res = await axios.get(url);

    return res;
  } catch (error) {
    return error;
  }
};
