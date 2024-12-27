import { END_POINT_SEVER_TABLE_MENU } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getCategories = async (storeId) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/categories?storeId=${storeId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getCategory = async (categoryId) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/category?id=${categoryId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateCategory = async (data, id) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/category/update`;
    const _category = await axios.put(
      url,
      {
        id: id,
        data: data,
      },
      {
        headers: await getHeaders(),
      }
    );
    return _category;
  } catch (error) {
    return error;
  }
};

export const addCategory = async (data) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/category/create`;
    const _category = await axios.post(url, data, {
      headers: await getHeaders(),
    });
    return _category;
  } catch (error) {
    return error;
  }
};
