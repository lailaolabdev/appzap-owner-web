import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getStocksAll = async (storeId, findBy) => {
    
    try {
    const url = `${END_POINT_APP}/v3/stocks/${storeId}${findBy}`;
    const res = await axios.get(url);
    console.log("resdata:--->", res)
    return res;
  } catch (error) {
    return error;
  }
}; 