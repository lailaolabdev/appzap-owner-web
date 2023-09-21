import { END_POINT_SEVER } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getTheme = async (storeId, token) => {
  try {
    // const LocalData = await getLocalData();
    const url = `${END_POINT_SEVER}/v4/self-ordering-theme/${storeId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateTheme = async (data, id) => {
  try {
    // const LocalData = await getLocalData();
    const url = `${END_POINT_SEVER}/v4/self-ordering-theme/update`;
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
