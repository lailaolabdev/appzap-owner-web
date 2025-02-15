import { create } from "zustand";
import axios from "axios";
import Swal from "sweetalert2";
import { END_POINT_SEVER_TABLE_MENU } from "../constants/api";

const useMenuOptionsStore = create((set) => ({
  allMenuOptions: [],
  specificMenuOptions: [],
  loadingOptionId: null,

  fetchAllMenuOptions: async (storeId) => {
    try {
      const response = await axios.get(
        `${END_POINT_SEVER_TABLE_MENU}/v3/restaurant/${storeId}/menu-options`
      );
      set({ allMenuOptions: response.data });
    } catch (error) {
      console.error("Error fetching all menu options:", error);
    }
  },

  fetchSpecificMenuOptions: async (menuId, updateMenuOptionsCount) => {
    try {
      const response = await axios.get(
        `${END_POINT_SEVER_TABLE_MENU}/v3/menu/${menuId}/menu-options`
      );
      set({ specificMenuOptions: response.data });
      updateMenuOptionsCount(menuId, response.data.length);
    } catch (error) {
      console.error("Error fetching specific menu options:", error);
    }
  },

  addMenuOption: async (menuId, optionId, updateMenuOptionsCount) => {
    set({ loadingOptionId: optionId });
    try {
      await axios.post(
        `${END_POINT_SEVER_TABLE_MENU}/v3/menu/${menuId}/menu-option/${optionId}/add`
      );
      const updatedOptions = await axios.get(
        `${END_POINT_SEVER_TABLE_MENU}/v3/menu/${menuId}/menu-options`
      );
      set({ specificMenuOptions: updatedOptions.data });
      updateMenuOptionsCount(menuId, updatedOptions.data.length);
    } catch (error) {
      console.error("Error adding menu option:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error adding menu option. Please try again.",
      });
    } finally {
      set({ loadingOptionId: null });
    }
  },

  deleteMenuOption: async (menuId, optionId, updateMenuOptionsCount) => {
    set({ loadingOptionId: optionId });
    try {
      await axios.delete(
        `${END_POINT_SEVER_TABLE_MENU}/v3/menu/${menuId}/menu-option/${optionId}/remove`
      );
      const updatedOptions = await axios.get(
        `${END_POINT_SEVER_TABLE_MENU}/v3/menu/${menuId}/menu-options`
      );
      set({ specificMenuOptions: updatedOptions.data });
      updateMenuOptionsCount(menuId, updatedOptions.data.length);
    } catch (error) {
      console.error("Error deleting menu option:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error deleting menu option. Please try again.",
      });
    } finally {
      set({ loadingOptionId: null });
    }
  },
}));

export default useMenuOptionsStore;
