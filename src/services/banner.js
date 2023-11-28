import { END_POINT_SEVER } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getBanners = async (findby) => {
  try {
    const url = `${END_POINT_SEVER}/v4/banners${findby}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};
