import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";
import axiosInstance from "../utils/axios";

/**
 * Get CFD settings for a specific store
 * @param {string} storeId - The store ID
 * @returns {Promise} CFD settings object
 */
export const getCFDSettings = async (storeId) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/cfd-settings/${storeId}`;
    const res = await axios.get(url, { headers: _header });
    return res.data;
  } catch (error) {
    console.error("Error fetching CFD settings:", error);
    return {
      showItemImages: true,
      showPrices: true,
      showTaxes: true,
      showTotals: true,
      showPromotions: true,
      showChange: true,
      showDiscounts: true,
      enabledForStoreType: ["GENERAL", "CAFE"],
    };
  }
};

/**
 * Update CFD settings for a specific store
 * @param {string} storeId - The store ID
 * @param {object} settings - CFD settings to update
 * @returns {Promise} Updated settings
 */
export const updateCFDSettings = async (storeId, settings) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/cfd-settings/update`;
    const res = await axios.put(
      url,
      { storeId, settings },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating CFD settings:", error);
    throw error;
  }
};

/**
 * Update a specific CFD setting field
 * @param {string} storeId - The store ID
 * @param {string} field - The field name to update
 * @param {any} value - The new value
 * @returns {Promise} Updated settings
 */
export const updateCFDSettingField = async (storeId, field, value) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/cfd-settings/update-field`;
    const res = await axios.put(
      url,
      { storeId, field, value },
      { headers: _header }
    );
    return res.data;
  } catch (error) {
    console.error(`Error updating CFD setting field ${field}:`, error);
    throw error;
  }
};

/**
 * Check if CFD is enabled for current store type
 * @param {string} storeId - The store ID
 * @param {string} storeType - The store type (GENERAL, CAFE, etc.)
 * @returns {Promise<boolean>} Whether CFD is enabled for this store type
 */
export const isCFDEnabledForStore = async (storeId, storeType) => {
  try {
    const settings = await getCFDSettings(storeId);
    return settings.enabledForStoreType?.includes(storeType) ?? true;
  } catch (error) {
    console.error("Error checking CFD availability:", error);
    return true; // Default to enabled
  }
};

