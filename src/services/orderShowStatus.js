// orderShowStatusService.js
import axios from 'axios';
import { END_POINT_SEVER } from '../constants/api';

const orderShowStatusService = {
  // Get all order show statuses
  getAllOrderShowStatus: async (storeId) => {
    try {
      const response = await axios.get(`${END_POINT_SEVER}/v7/order-show-status?storeId=${storeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order show statuses:', error);
      throw error;
    }
  },

  // Create new order show status
  createOrderShowStatus: async (orderShowStatusData) => {
    try {
      const response = await axios.post(`${END_POINT_SEVER}/v7/create/order-show-status`, orderShowStatusData);
      return response.data;
    } catch (error) {
      console.error('Error creating order show status:', error);
      throw error;
    }
  },

  // Update order show status
  updateOrderShowStatus: async (id, orderShowStatusData) => {
    try {
      const response = await axios.put(`${END_POINT_SEVER}/v7/update/order-show-status/${id}`, orderShowStatusData);
      return response.data;
    } catch (error) {
      console.error('Error updating order show status:', error);
      throw error;
    }
  }
};

export default orderShowStatusService;