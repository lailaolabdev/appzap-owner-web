import { END_POINT_SEVER } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";
import { values } from "lodash";

export const getImageSlide = async (findby) => {
  try {
    const url = `${END_POINT_SEVER}/v7/imageslides${findby}`;
    const res = await axios.get(url, {
      headers: await getHeaders(),
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const createImageSlide = async (values) => {
  try {
    const url = `${END_POINT_SEVER}/v7/imageslide/create`;
    const res = await axios.post(url, values, {
      headers: await getHeaders(),
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const deleteImageSlide = async (imageId, storeId) => {
  try {
    const url = `${END_POINT_SEVER}/v7/imageslide/delete/${imageId}/${storeId}`;
    const res = await axios.delete(url, {
      headers: await getHeaders(),
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const UpdateImageSlide = async (imageId, storeId, values) => {
  try {
    const url = `${END_POINT_SEVER}/v7/imageslide/update/${imageId}/${storeId}`;
    const res = await axios.put(url, values, {
      headers: await getHeaders(),
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const UseImageSlide = async (imageId, storeId, status) => {
  const url = `${END_POINT_SEVER}/v7/use-imageslide/${imageId}/${storeId}?status=${status}`;
  return await axios.put(url, values, {
    headers: await getHeaders(),
  });
};
export const UseShowSlide = async (storeId, status) => {
  let findBy = "?";
  findBy += `storeId=${storeId}`;

  if (status) {
    findBy += `&status=${status}`;
  }
  const url = `${END_POINT_SEVER}/v7/show-slide${findBy}`;
  return await axios.put(url, values, {
    headers: await getHeaders(),
  });
};
export const UseShowTable = async (storeId, status) => {
  let findBy = "?";
  findBy += `storeId=${storeId}`;
  if (status) {
    findBy += `&status=${status}`;
  }
  const url = `${END_POINT_SEVER}/v7/show-table${findBy}`;
  return await axios.put(url, values, {
    headers: await getHeaders(),
  });
};
export const UseShowTitle = async (storeId, status) => {
  let findBy = "?";
  findBy += `storeId=${storeId}`;
  if (status) {
    findBy += `&status=${status}`;
  }
  const url = `${END_POINT_SEVER}/v7/show-title${findBy}`;
  return await axios.put(url, values, {
    headers: await getHeaders(),
  });
};
export const UseOpenTwoScreen = async (storeId, status) => {
  let findBy = "?";
  findBy += `storeId=${storeId}`;
  if (status) {
    findBy += `&status=${status}`;
  }
  const url = `${END_POINT_SEVER}/v7/open-two-screen${findBy}`;
  return await axios.put(url, values, {
    headers: await getHeaders(),
  });
};
