import axios from "axios";
import { END_POINT_SEVER } from "../constants/api";

export const getMembers = async (findBy, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/members${findBy}`;
    const res = await axios.get(url, { headers: TOKEN });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMemberAllCount = async (storeId, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/count?storeId=${storeId}`;
    const res = await axios.get(url, { headers: TOKEN });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};

export const getMemberBillCount = async (findBy, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/total-bill${findBy}`;
    const res = await axios.get(url, { headers: TOKEN });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};
export const getMemberTotalMoney = async (findBy, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/total-money${findBy}`;
    const res = await axios.get(url, { headers: TOKEN });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};
export const getMemberCount = async (findBy, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/count${findBy}`;
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
