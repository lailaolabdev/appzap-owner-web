import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getBills = async (findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v3/bills${findBy}`;
    const res = await axios.get(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getBillsNolimit = async (findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v3/bills/no-limit${findBy}`;
    const res = await axios.get(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getBillCafe = async (findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/bill${findBy}`;
    const res = await axios.get(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getCountBills = async (findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v3/bills/count${findBy}`;
    const res = await axios.get(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getCountBillsV7 = async (storeId, findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/bills/count/${storeId}${findBy}`;
    const res = await axios.get(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const createBillCancelCafe = async (data) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/admin/bill-cafe-checkout`;
    const res = await axios.post(
      url,
      {
        data: data,
      },
      { headers: _header }
    );
    return res;
  } catch (error) {
    return error;
  }
};
