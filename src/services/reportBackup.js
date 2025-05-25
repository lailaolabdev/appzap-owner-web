import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getReportsBackup = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/backup/report-daily/${storeId}${findBy}`;
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

export const getSalesInformationReportBackup = async (
  storeId,
  findBy,
  tableIds
) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/backup/sales-information-report/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getTotalBillActiveReport = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/backup/total-bill-active-report/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getUserReportBackup = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/backup/user-report/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMenuReportBackup = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/backup/menu-report/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getCategoryReportBackup = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/backup/category-report/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMoneyReportBackup = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/backup/report-money/${storeId}${findBy}`;
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

export const getPromotionReportBackup = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/backup/report-promotion/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getPromotionReportDisCountAndFreeBackup = async (
  storeId,
  findBy,
  tableIds
) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/backup/reports-promotion-discount-free/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds }, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getBillReportBackup = async (storeId, findBy, tableIds) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/backup/bill-report/${storeId}${findBy}`;
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
export const getBankReportBackup = async (storeId, findBy) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/backup/count-bank${findBy}&storeId=${storeId}`;
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
    const url = `${END_POINT_APP}/v4/delivery-report/${storeId}${findBy}`;
    const res = await axios.post(url, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};
