// services/salesApi.js
import axios from 'axios';
import { END_POINT_SEVER } from '../constants/api';

export const showSalesService = {
  // ดึงข้อมูล sales ทั้งหมด
  fetchSalesData: async () => {
    try {
      const response = await axios.get(`${END_POINT_SEVER}/v3/show-sales`);
      // ตรวจสอบว่ามีข้อมูลหรือไม่
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null; // ส่งคืน null ถ้าไม่มีข้อมูล
    } catch (error) {
      console.error("Error fetching sales data:", error);
      return null;
    }
  },

  // อัพเดทสถานะ available ของ store
  updateAvailableStoreId: async (id, isAvailable, salesId, storeId) => {
    try {
      const response = await axios.put(
        `${END_POINT_SEVER}/v3/show-sales/updateAvailableStoreId/${id}`,
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

  // อัพเดทจำนวนคลิก
  updateSalesClick: async (id, currentClicks) => {
    try {
      const updatedClicks = (currentClicks || 0) + 1;
      await axios.put(`${END_POINT_SEVER}/v3/show-sales/${id}`, {
        clicks: updatedClicks,
      });
      return true;
    } catch (error) {
      console.error("Error updating clicks:", error);
      return false;
    }
  },

  // อัพเดทจำนวนวิว
  updateViews: async (id) => {
    try {
      await axios.put(`${END_POINT_SEVER}/v3/show-sales/updateViews/${id}`);
      return true;
    } catch (error) {
      console.error("Error updating views:", error);
      return false;
    }
  }
};