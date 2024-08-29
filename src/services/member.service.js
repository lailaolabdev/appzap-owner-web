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
export const getMembersAll = async (findBy, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/members/all${findBy}`;
    const res = await axios.get(url, { headers: TOKEN });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getMembersListTop = async (findBy, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/members${findBy}`;
    const res = await axios.get(url, { headers: TOKEN });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getMembersListBirthday = async (findBy, TOKEN) => {
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

export const getMemberBillCount = async (memberId, findBy, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/total-bill?memberId=${memberId}${findBy}`;

    const res = await axios.get(url, { headers: TOKEN });

    return res.data;
  } catch (error) {
    return { error: true };
  }
};
export const getMemberTotalMoney = async (memberId, findBy, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/total-money?memberId=${memberId}${findBy}`;
    console.log("URL: ", url);
    const res = await axios.get(url, { headers: TOKEN });
    console.log("RESDATA: ", res.data);
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

export const getAllBills = async (TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/all-bill`;
    const response = await axios.get(url, { headers: TOKEN });
    return response.data;
  } catch (error) {
    console.error("Error in getAllBills: ", error);
    return { error: true };
  }
};

export const getAllMoneys = async (TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/all-money`;
    const response = await axios.get(url, { headers: TOKEN });
    return response.data;
  } catch (error) {
    console.error("Error in getAllMoneys: ", error);
    return { error: true };
  }
};

export const getMemberOrderMenu = async (memmberId, findby, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/orders-menu?memberid=${memmberId}${findby}`;
    const response = await axios.post(url, null, { headers: TOKEN });
    return response.data.data;
  } catch (error) {
    console.error("Error in GetMemberOrderMenu: ", error);
    return { error: true };
  }
};

export const getTotalPoint = async (memmberId, findBy, TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/total-point?memberId=${memmberId}${findBy}`;
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
      headers: TOKEN,
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

export const getMemberAllMenu = async (TOKEN) => {
  try {
    const url = `${END_POINT_SEVER}/v4/member/all-menu`;
    const res = await axios.get(url, { headers: TOKEN });
    return res.data.data;
  } catch (error) {
    return error;
  }
};

// report
