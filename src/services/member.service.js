import axios from "axios";
import { END_POINT_SEVER } from "../constants/api";

export const getMembers = async (storeId, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/members?storeId=${storeId}`;
    const res = await axios.get(url, { headers: TOKEN });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMemberCount = async (storeId, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/count?storeId=${storeId}`;
    const res = await axios.get(url, { headers: TOKEN });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const addMember = async (data, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/create`;
    const _category = await axios.post(url, data, {
      headers: TOKEN,
    });
    return _category;
  } catch (error) {
    return error;
  }
};

// report 
