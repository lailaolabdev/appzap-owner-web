import { END_POINT_APP } from "../constants/api";
import axios from "axios";

export const getBillFarkById = async (billFarkId, token) => {
  try {
    const url = `${END_POINT_APP}/v4/bill-fark/id/${billFarkId}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getBillFarkByCode = async (billFarkId, token) => {
  try {
    const url = `${END_POINT_APP}/v4/bill-fark/code/${billFarkId}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const updateBillFark = async (billFarkId, data, token) => {
  try {
    const url = `${END_POINT_APP}/v4/bill-fark/update`;
    const res = await axios.put(
      url,
      { id: billFarkId, data: data },
      {
        headers: token,
      }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
export const createBillFark = async (body, token) => {
  try {
    const url = `${END_POINT_APP}/v4/bill-fark/create`;
    const res = await axios.post(url, body, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};
export const getBillFarks = async (findby, token) => {
  try {
    // console.log("token", token);
    const url = `${END_POINT_APP}/v4/bill-farks${findby}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};

export const getMenuFarks = async (findby, token) => {
  try {
    console.log("token", token);
    const url = `${END_POINT_APP}/v4/menu-farks${findby}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};
