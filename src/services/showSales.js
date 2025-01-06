import axios from 'axios';
import { END_POINT_SERVER_SHOWSALES, END_POINT_SEVER } from '../constants/api';

export const fetchSalesData = async () => {
  try {
    const response = await axios.get(`${END_POINT_SEVER}/v6/show-sales`);
    
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return null;
  }
};

export const addStoreId = async ( isAvailable, salesId, storeId) => {
  try {
    const response = await axios.put(`${END_POINT_SEVER}/v6/show-sales/add-available-store-id`
      ,
      {
        isAvailable,
        salesId,
        storeId,
        
      }
    );

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error) {
    console.error("Error updating availability:", error);
    throw error;
  }
};

export const updateStoreAvailability = async (salesId, storeIds, isAvailable) => {
  try {
    const response = await axios.put(`${END_POINT_SEVER}/v6/store-availability/show-sales`, {
      salesId,
      _id: storeIds,
      isAvailable,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating store availability:', error.response?.data || error.message);
    throw error;
  }
};


export const updateSalesClick = async (id) => {
  try {
    const response = await axios.put(
      `${END_POINT_SEVER}/v6/show-sales/update-click/${id}`
    );
    return response.data.clicks; 
  } catch (error) {
    console.error("Error updating clicks:", error);
    throw error;
  }
};

export const updateViews = async (id) => {
  try {
    const response = await axios.put(`${END_POINT_SEVER}/v6/show-sales/update-views/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating views:", error);
    throw error;
  }
};