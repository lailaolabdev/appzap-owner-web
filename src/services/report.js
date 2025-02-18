import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getReports = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/report-daily/${storeId}${findBy}`;
    const res = await axios.post(
      url,
      { tableIds: tableIds },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getSalesInformationReport = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/sales-information-report/${storeId}${findBy}`;
    const res = await axios.post(
      url,
      { tableIds },
      { tableIds },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getTotalBillActiveReport = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/total-bill-active-report/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getUserReport = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/user-report/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMenuReport = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/menu-report/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getCategoryReport = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/category-report/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMoneyReport = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/report-money/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getMoneyReportChart = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/report-money/chart/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getDebtReport = async (findby, token) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/bill-debts-remaining${findby}`;
    const res = await axios.get(url, {
      headers: _header,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};

export const getPromotionReport = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/report-promotion/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getBillReport = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/bill-report/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getActiveBillReport = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/active-bill-report/${storeId}${findBy}`;
    const res = await axios.post(
      url,
      { tableIds: tableIds ? tableIds : [] },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getBankReport = async (storeId, findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/count-bank${findBy}&storeId=${storeId}`;
    const res = await axios.get(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getCurrencyReport = async (storeId, findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v3/currencies-count${findBy}&storeId=${storeId}`;
    const res = await axios.get(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getDeliveryReport = async (storeId, findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/delivery-report/${storeId}${findBy}`;
    const res = await axios.post(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};
