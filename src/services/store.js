import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getStores = async (search) => {
  try {
    let findBy = "?";

    if (search) {
      findBy += `name=${search}`;
    }
    const url = `${END_POINT_APP}/v3/stores${findBy}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return {error};
  }
};
export const getStore = async (storeId) => {
  try {
    const url = `${END_POINT_APP}/v3/store?id=${storeId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return {error};
  }
};
export const updateStorePin = async (usePin = false) => {
  try {
    const url = `${END_POINT_APP}/v4/store/pin`;
    const reservation = await axios.put(
      url,
      {
        usePin: usePin,
      },
      {
        headers: await getHeaders(),
      }
    );
    return reservation;
  } catch (error) {
    return {error};
  }
};

export const updateStore = async (data, id) => {
  try {
    const url = `${END_POINT_APP}/v3/store/update`;
    const reservation = await axios.put(
      url,
      {
        id: id,
        data: data,
      },
      {
        headers: await getHeaders(),
      }
    );
    console.log({reservation})
    return reservation;
  } catch (error) {
    return {error};
  }
};
