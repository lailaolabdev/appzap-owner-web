
import axios from 'axios';
import { END_POINT_SERVER_SHOWSALES } from '../constants/api';

export const showSalesService = {
  
  fetchSalesData: async () => {
    try {
      const response = await axios.get(`${END_POINT_SERVER_SHOWSALES}/v3/show-sales`);
     
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null; 
    } catch (error) {
      console.error("Error fetching sales data:", error);
      return null;
    }
  },

  
  updateAvailableStoreId: async (id, isAvailable, salesId, storeId) => {
    try {
      const response = await axios.put(
        `${END_POINT_SERVER_SHOWSALES}/v3/show-sales/updateAvailableStoreId/${id}`,
        {
          isAvailable,
          salesId,
          storeId
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating availability:", error);
      return null;
    }
  },

  
  updateSalesClick: async (id, currentClicks) => {
    try {
      const updatedClicks = (currentClicks || 0) + 1;
      await axios.put(`${END_POINT_SERVER_SHOWSALES}/v3/show-sales/${id}`, {
        clicks: updatedClicks,
      });
      return true;
    } catch (error) {
      console.error("Error updating clicks:", error);
      return false;
    }
  },


  updateViews: async (id) => {
    try {
      await axios.put(`${END_POINT_SERVER_SHOWSALES}/v3/show-sales/updateViews/${id}`);
      return true;
    } catch (error) {
      console.error("Error updating views:", error);
      return false;
    }
  }
};