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
      headers: TOKEN
    });
    return _category;
  } catch (error) {
    return { error: true };
  }
};

export const addMemberPoint = async (data) => {
  try {
    const url = `${END_POINT_SEVER}/v4/piont-stroe/create`;
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    return { error: true };
  }
};

export const getAllStorePoints = async () => {
  try {
    const url = `${END_POINT_SEVER}/v4/piont-stroe`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in getAllPoints: ", error);
    return { error: true };
  }
};

export const updatePointStore = async (data) => {
  try {
    const url = `${END_POINT_SEVER}/v4/piontStore/update`;
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    console.error("Error in updatePointStore: ", error);
    return { error: true };
  }
};

export const getAllPoints = async (TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/all-point`;
    const response = await axios.get(url, { headers: TOKEN });
    return response.data;
  } catch (error) {
    console.error("Error in getAllPoints: ", error);
    return { error: true };
  }
};

export const getMemberOrderMenu = async (TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/orders-menu`;
    const response = await axios.get(url, { headers: TOKEN });
    return response.data;
  } catch (error) {
    console.error("Error in GetMemberOrderMenu: ", error);
    return { error: true };
  }
};

export const getTotalPoint = async (findBy, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/total-point${findBy}`;
    const response = await axios.get(url, { headers: TOKEN });
    console.log("DATA: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in GetMemberOrderMenu: ", error);
    return { error: true };
  }
};

export const updateMember = async (id, data, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/update/${id}`;
    const response = await axios.put(url, data, {
      headers: TOKEN
    });
    return response.data;
  } catch (error) {
    return { error: true };
  }
};

export const getSearchOne = async (findBy, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/search-one${findBy}`;
    const res = await axios.get(url, { headers: TOKEN });
    console.log(res.data);
    return res.data;
  } catch (error) {
    return error;
  }
};

// report
