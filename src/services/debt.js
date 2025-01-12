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
export const createBilldebt = async (body, token) => {
  try {
    const url = `${END_POINT_APP}/v4/bill-debt/create`;
    const res = await axios.post(url, body, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};
export const getBilldebts = async (findby, token) => {
  try {
    const url = `${END_POINT_APP}/v4/bill-debts${findby}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};

export const getdebtHistory = async (findby, token) => {
  try {
    const url = `${END_POINT_APP}/v4/debt-history${findby}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};

export const getMenuDebt = async (findby, token) => {
  try {
    const url = `${END_POINT_APP}/v4/bill-debt-order${findby}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};




