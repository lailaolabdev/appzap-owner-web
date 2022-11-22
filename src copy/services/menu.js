import axios from "axios";
import { END_POINT } from "../constants";
import { getLocalData, END_POINT_APP } from "../constants/api";
import { getHeaders } from "./auth";

export const getMenuCount = async (findBy) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v3/menu/count?storeId=${
      LocalData?.DATA?.storeId
    }${findBy || ""}`;
    const menuCategorysCount = await axios.get(url, {
      headers: await getHeaders(),
    });
    if (menuCategorysCount) {
      let data = menuCategorysCount?.data;
      return data;
    }
    return;
  } catch (error) {
    console.log({ error: true, message: error });
    return error;
  }
};

export const getMenus = async (findBy, storeId) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v3/menus?storeId=${
      storeId || LocalData?.DATA?.storeId
    }${findBy || ""}`;
    const _menu = await axios.get(url, {
      headers: await getHeaders(),
    });
    if (_menu.status < 300) {
      let data = _menu?.data;
      return data;
    }
    return;
  } catch (error) {
    console.log({ error: true, message: error });
    return;
  }
};

export const addMenu = async (data) => {
  try {
    const _localData = await getLocalData();
    const url = `${END_POINT_APP}/v3/menu/create`;
    const menuCategory = await axios.post(
      url,
      { ...data, storeId: _localData?.DATA?.storeId },
      {
        headers: await getHeaders(),
      }
    );
    if (menuCategory.status < 300) {
      let data = menuCategory?.data;
      return data;
    } else {
      return;
    }
  } catch (error) {
    console.log({ error: true, message: error });
    return;
  }
};

export const updateMenu = async (data, id) => {
  try {
    const url = `${END_POINT_APP}/v3/menu/update`;
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
    if (menuCategory.status < 300) {
      let data = menuCategory?.data;
      return data;
    } else {
      return;
    }
  } catch (error) {
    console.log({ error: true, message: error });
    return;
  }
};

export const deleteMenu = async (id) => {
  try {
    const url = `${END_POINT_APP}/v3/menu/delete/${id}`;
    const menuCategory = await axios.delete(url, {
      headers: await getHeaders(),
    });
    if (menuCategory.status < 300) {
      let data = menuCategory?.data;
      return data;
    } else {
      return;
    }
  } catch (error) {
    console.log({ error: true, message: error });
    return;
  }
};
