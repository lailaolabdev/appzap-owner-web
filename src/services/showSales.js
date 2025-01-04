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

export const updateAvailableStoreId = async (id, isAvailable, salesId, storeId) => {
  try {
    const isAllStore = !id && storeId; 

    const response = await axios.put(
      `${END_POINT_SEVER}/v6/show-sales/update-available-store-id/${id || 'all'}`,
      {
        isAvailable,
        salesId,
        storeId,
        isAllStore 
      }
    );
    
    if (!response.data) {
      throw new Error('No data received from server');
    }

    // ตรวจสอบว่าการอัปเดตสำเร็จ
    if (response.data.selectedStores) {
      const storeUpdated = response.data.selectedStores.some(store => 
        (id ? store._id === id : store.storeId === storeId) && 
        store.isAvailable === isAvailable
      );
      
      if (!storeUpdated) {
        console.warn("Store availability update not reflected in response");
      }
    }
    
    return response.data;
  } catch (error) {
    console.error("Error updating availability:", error);
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