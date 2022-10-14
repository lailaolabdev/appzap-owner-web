import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getStores = async () => {
  try {
    const url = `${END_POINT_APP}/v3/stores`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
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
    return reservation;
  } catch (error) {
    return error;
  }
};
