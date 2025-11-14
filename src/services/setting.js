import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";
import axiosInstance from "../utils/axios";

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
export const updateSettingStockMissing = async (id, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/store-stock-missing/update`;
    const res = await axios.put(
      url,
      { id: id, data: dataUpdate },
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

export const updateSettingShowAmountCafe = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/store-show-amount-cafe/update`;
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
export const updateCounterFilterShift = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/counter-filter-shift/update`;
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

export const updateSettingByStore = async ({ storeId, settings }) => {
  try {
    let body = {
      storeId: storeId,
      settings: settings,
    };
    const response = await axiosInstance.put(
      `/v4/setting-store/update-by-store`,
      body
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating settings for store ${storeId}:`, error);
    throw error; // Re-throw to let the caller handle it
  }
};

export const getSettingByStore = async (storeId) => {
  try {
    const response = await axiosInstance.get(`/v4/setting-store/${storeId}`);
    return response.data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const updateCounterMenu = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/counter-edit-menu/update`;
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
export const updateCounterBill = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/counter-edit-bill/update`;
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

export const updateSettingPrintBillToKitchen = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/store-print-bill-kitchen/update`;
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

export const updateSettingPrintBillSticker = async (settingId, dataUpdate) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v7/store-print-bill-sticker/update`;
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
