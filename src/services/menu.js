import { END_POINT_SEVER, END_POINT_SEVER_TABLE_MENU } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";
import { Store } from "@material-ui/icons";
import { data } from "browserslist";

export const getMenus = async (findby) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/menus${findby}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMenusByStoreId = async (storeId) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/menus?storeId=${storeId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMenu = async (categoryId) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/menu?id=${categoryId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateCategoryMenu = async (data, id) => {
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

export const updateMenu = async (data, id) => {
  try {
    const url = `${END_POINT_SEVER}/v3/menu/update`;
    const res = await axios.put(
      url,
      {
        id: id,
        data: data,
      },
      {
        headers: await getHeaders(),
      }
    );
    return res;
  } catch (error) {
    return error;
  }
};

export const createMenu = async (menuData) => {
  try {
    const url = `${END_POINT_SEVER}/v3/menu/create`;
    const res = await axios.post(url, menuData, {
      headers: await getHeaders(),
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const addMenu = async (data) => {
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

export const getCategoryType = async (storeId) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/category-type?storeId=${storeId}`;
    const res = await axios.get(url);
    return res.data?.data;
  } catch (error) {
    return error;
  }
};

export const updateMenuStockAmount = async (id, data) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/menu-and-menu-stock/update`;
    const res = await axios.put(
      url,
      {
        id: id,
        data: data,
      },
      {
        headers: await getHeaders(),
      }
    );

    console.log("RES:", res);
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteMenuData = async (menuId) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/menu/delete/${menuId}`;
    const res = await axios.delete(url, {
      headers: await getHeaders(),
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const addMenuOption = async (id, optionId) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/menu/${id}/menu-option/${optionId}/add`;
    const res = await axios.post(url, {
      headers: await getHeaders(),
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteMenuOption = async (id, optionId) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/menu/${id}/menu-option/${optionId}/delete`;
    const res = await axios.delete(url, {
      headers: await getHeaders(),
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const getMenuOptions = async (id) => {
  try {
    const url = `${END_POINT_SEVER_TABLE_MENU}/v3/menu/${id}/menu-options`;
    const res = await axios.get(url, {
      headers: await getHeaders(),
    });
    return res;
  } catch (error) {
    return error;
  }
};
