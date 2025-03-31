import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getSetting = async (storeId) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/setting-store/${storeId}`;
    const res = await axios.get(url, null, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const updateSetting = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v3/setting/update`;
    const res = await axios.put(
      url,
      { id: settingId, data: dataUpdate },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getSettingCafe = async (storeId) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v3/store/`;
    const res = await axios.get(url, storeId, { headers: _header });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateSettingCafe = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v3/store-cafe/update`;
    const res = await axios.put(
      url,
      { id: settingId, data: dataUpdate },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateSettingCRM = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v3/store-crm/update`;
    const res = await axios.put(
      url,
      { id: settingId, data: dataUpdate },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
export const updateSettingDelivery = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v6/store-delivery/update`;
    const res = await axios.put(
      url,
      { id: settingId, data: dataUpdate },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
export const updateSettingShift = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/store-shift/update`;
    const res = await axios.put(
      url,
      { id: settingId, data: dataUpdate },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
export const updateSettingServiceChange = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/store-service-change/update`;
    const res = await axios.put(
      url,
      { id: settingId, data: dataUpdate },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
export const updateSettingStock = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/store-stock-view/update`;
    const res = await axios.put(
      url,
      { id: settingId, data: dataUpdate },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
export const updateSettingStockAccess = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/store-stock-access/update`;
    const res = await axios.put(
      url,
      { id: settingId, data: dataUpdate },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
