import axios from 'axios';
import { END_POINT_SEVER } from '../constants/api';
import { getHeaders } from "./auth";

export const manageCounterService = {
  // Get manage counter data
  getManageCounter: async (storeId) => {
    const headers = await getHeaders();
    try {
      const response = await axios.get(`${END_POINT_SEVER}/v5/manage-counter?storeId=${storeId}`, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new manage counter
  createManageCounter: async (data) => {
    const headers = await getHeaders();
    try {
      const response = await axios.post(`${END_POINT_SEVER}/v5/manage-counter`, data, {
        headers: headers, 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update manage counter
  updateManageCounter: async (id, data) => {
    const headers = await getHeaders();  
    try {
      const response = await axios.put(`${END_POINT_SEVER}/v5/manage-counter/${id}`, data, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};