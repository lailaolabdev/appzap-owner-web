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
export const deleteImageSlide = async (imageId, storeId, shiftId) => {
  try {
    const url = `${END_POINT_SEVER}/v7/imageslide/delete/${imageId}/${storeId}/${shiftId}`;
    const res = await axios.delete(url, {
      headers: await getHeaders(),
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const UpdateImageSlide = async (imageId, storeId, shiftId, values) => {
  try {
    const url = `${END_POINT_SEVER}/v7/imageslide/update/${imageId}/${storeId}/${shiftId}`;
    const res = await axios.put(url, values, {
      headers: await getHeaders(),
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const UseImageSlide = async (imageId, storeId, shiftId, status) => {
  const url = `${END_POINT_SEVER}/v7/use-imageslide/${imageId}/${storeId}/${shiftId}?status=${status}`;
  return await axios.put(url, values, {
    headers: await getHeaders(),
  });
};
export const UseShowSlide = async (storeId, shiftId, status) => {
  const url = `${END_POINT_SEVER}/v7/show-slide/${storeId}/${shiftId}?status=${status}`;
  return await axios.put(url, values, {
    headers: await getHeaders(),
  });
};
export const UseShowTable = async (storeId, shiftId, status) => {
  const url = `${END_POINT_SEVER}/v7/show-table/${storeId}/${shiftId}?status=${status}`;
  return await axios.put(url, values, {
    headers: await getHeaders(),
  });
};
export const UseShowTitle = async (storeId, shiftId, status) => {
  const url = `${END_POINT_SEVER}/v7/show-title/${storeId}/${shiftId}?status=${status}`;
  return await axios.put(url, values, {
    headers: await getHeaders(),
  });
};
export const UseOpenTwoScreen = async (storeId, shiftId, status) => {
  const url = `${END_POINT_SEVER}/v7/open-two-screen/${storeId}/${shiftId}?status=${status}`;
  return await axios.put(url, values, {
    headers: await getHeaders(),
  });
};
