import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getReports = async (storeId, findBy, token) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/report-daily/${storeId}${findBy}`;
    const res = await axios.post(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getSalesInformationReport = async (storeId, findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/sales-information-report/${storeId}${findBy}`;
    const res = await axios.post(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getUserReport = async (storeId, findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/user-report/${storeId}${findBy}`;
    const res = await axios.post(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMenuReport = async (storeId, findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/menu-report/${storeId}${findBy}`;
    const res = await axios.post(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getCategoryReport = async (storeId, findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/category-report/${storeId}${findBy}`;
    const res = await axios.post(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMoneyReport = async (storeId, findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/report-money/${storeId}${findBy}`;
    const res = await axios.post(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getPromotionReport = async (storeId, findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/report-promotion/${storeId}${findBy}`;
    const res = await axios.post(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};
