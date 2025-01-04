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
    const response = await axios.put(
      `${END_POINT_SEVER}/v6/show-sales/update-available-store-id/${id}`,
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
};

export const updateSalesClick = async (id, currentClicks) => {
  try {
    const updatedClicks = (currentClicks || 0) + 1;
    await axios.put(`${END_POINT_SEVER}/v6/show-sales/${id}`, {
      clicks: updatedClicks,
    });
    return true;
  } catch (error) {
    console.error("Error updating clicks:", error);
    return false;
  }
};

export const updateViews = async (id) => {
  try {
    await axios.put(`${END_POINT_SEVER}/v6/show-sales/update-views/${id}`);
    return true;
  } catch (error) {
    console.error("Error updating views:", error);
    return false;
  }
};