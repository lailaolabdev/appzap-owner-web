import axios from 'axios';
import { END_POINT_SEVER } from '../constants/api';

export const manageCounterService = {
  // Get manage counter data
  getManageCounter: async (storeId) => {
    try {
      const response = await axios.get(`${END_POINT_SEVER}/v5/manage-counter?storeId=${storeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new manage counter
  createManageCounter: async (data) => {
    try {
      const response = await axios.post(`${END_POINT_SEVER}/v5/manage-counter`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update manage counter
  updateManageCounter: async (id, data) => {
    try {
      const response = await axios.put(`${END_POINT_SEVER}/v5/manage-counter/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};