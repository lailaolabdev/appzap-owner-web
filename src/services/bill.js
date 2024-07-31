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
export const getBillCafe = async (findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v3/bills${findBy}`;
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
