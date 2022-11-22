import axios from "axios";
import { END_POINT } from "../constants";
import { getLocalData, END_POINT_APP } from "../constants/api";
import { getHeaders } from "./auth";

export const getMenuCategorysCount = async (findBy) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v3/categories/count?storeId=${
      LocalData?.DATA?.storeId
    }${findBy || ""}`;
    const menuCategorysCount = await axios.get(url, {
      headers: await getHeaders(),
    });
    if (menuCategorysCount) {
      let data = menuCategorysCount?.data;
      return data;
    }
    return null;
  } catch (error) {
    console.log({ error: true, message: error });
    return error;
  }
};

export const getMenuCategorys = async (findBy, storeId) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v3/categories?storeId=${
      storeId || LocalData?.DATA?.storeId
    }${findBy || ""}`;
    const menuCategory = await axios.get(url, {
      headers: await getHeaders(),
    });
    if (menuCategory) {
      let data = menuCategory?.data;
      return data;
    }
    return null;
  } catch (error) {
    console.log({ error: true, message: error });
    return error;
  }
};

export const addMenuCategory = async (data) => {
  try {
    const _localData = await getLocalData();
    const url = `${END_POINT_APP}/v3/categories/create`;
    const menuCategory = await axios.post(
      url,
      { ...data, storeId: _localData?.DATA?.storeId },
      {
        headers: await getHeaders(),
      }
    );
    if (menuCategory) {
      let data = menuCategory?.data;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log({ error: true, message: error });
    return error;
  }
};

export const updateMenuCategory = async (data, id) => {
  try {
    const url = `${END_POINT_APP}/v3/categories/update`;
    const menuCategory = await axios.put(
      url,
      {
        id: id,
        data: data,
      },
      {
        headers: await getHeaders(),
      }
    );
    return menuCategory;
  } catch (error) {
    console.log({ error: true, message: error });
    return error;
  }
};

export const deleteMenuCategory = async (id) => {
  try {
    const url = `${END_POINT_APP}/v3/categories/delete/${id}`;
    const menuCategory = await axios.delete(url, {
      headers: await getHeaders(),
    });
    return menuCategory;
  } catch (error) {
    console.log({ error: true, message: error });
    return error;
  }
};
