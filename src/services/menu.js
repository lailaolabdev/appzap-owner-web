import { END_POINT_SEVER } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getMenus = async (findby) => {
  try {
    const url = `${END_POINT_SEVER}/v3/menus${findby}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMenu = async (categoryId) => {
  try {
    const url = `${END_POINT_SEVER}/v3/menu?id=${categoryId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateMenu = async (data, id) => {
  try {
    const url = `${END_POINT_SEVER}/v3/category/update`;
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

export const addMenu = async (data) => {
  try {
    const url = `${END_POINT_SEVER}/v3/category/create`;
    const _category = await axios.post(url, data, {
      headers: await getHeaders(),
    });
    return _category;
  } catch (error) {
    return error;
  }
};
