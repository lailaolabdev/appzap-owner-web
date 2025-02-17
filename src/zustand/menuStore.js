import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addMenu,
  addMenuOption,
  createMenu,
  deleteMenuData,
  getMenuOptions,
  getMenusByStoreId,
  updateCategoryMenu,
  updateMenu,
} from "../services/menu"; // Import necessary API helpers
import {
  addCategory,
  deleteCategory,
  deleteCategoryData,
  getCategories,
  updateCategory,
} from "../services/menuCategory";
import { get } from "lodash";

export const useMenuStore = create(
  persist(
    (set) => ({
      // Initial store state
      menus: [],
      menuCategories: [],
      selectedCategory: "All",
      isMenuLoading: false,
      isMenuCategoryLoading: false,
      staffCart: [],
      menuOption: [],

      // Action to set loading state
      setMenuLoading: (isLoading) => set({ isMenuLoading: isLoading }),

      // Action to set menu data
      setMenus: (menusData) => {
        console.log("Setting menus data:", menusData);
        set({ menus: menusData });
      },

      // Action to set menu categories
      setMenuCategories: (categoriesData) =>
        set({ menuCategories: categoriesData }),

      // Action to set the selected category
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      // Action to set staff cart
      setStaffCart: (updateCart) =>
        set((state) => ({
          staffCart: updateCart(state.staffCart), // Call the function with previous state (staffCart)
        })),

      // Action to reset staff cart to an empty array
      resetStaffCart: () => set({ staffCart: [] }),

      // Action to fetch menus by store ID
      getMenus: async (storeId) => {
        set({ isMenuLoading: true });
        try {
          const data = await getMenusByStoreId(storeId);
          set({ menus: data, isMenuLoading: false });
          return data;
        } catch (error) {
          console.error("Fetch menus error:", error.message);
          set({ isMenuLoading: false });
        }
      },

      getMenusByStoreId: async (storeId) => {
        set({ isMenuLoading: true });
        try {
          const data = await getMenuOptions(storeId);
          set({ menus: data, isMenuLoading: false });
          return data;
        } catch (error) {
          console.error("Fetch menus error:", error.message);
          set({ isMenuLoading: false });
        }
      },
      //TODO: Add menu option
      addMunuOption: async (menuId, optionId) => {
        set({ isMenuLoading: true });
        try {
          const res = await addMenuOption(menuId, optionId);
          console.log("ADD MENU OPTION", res);
          set({ menuOption: res, isMenuLoading: false });
        } catch (error) {
          console.error("Fetch menus error:", error.message);
          set({ isMenuLoading: false });
        }
      },

      // Action to fetch menu categories for a store
      getMenuCategories: async (storeId) => {
        set({ isMenuCategoryLoading: true });
        try {
          const data = await getCategories(storeId);

          set({ menuCategories: data, isMenuCategoryLoading: false });
          return data;
        } catch (error) {
          console.error("Fetch menu categories error:", error.message);
          set({ isMenuCategoryLoading: false });
        }
      },

      //TODO: Action to update a Category menu
      updateCategory: async (categoryData, categoryId) => {
        set({ isMenuCategoryLoading: true }); // Set loading state
        try {
          const updatedCategory = await updateCategoryMenu(
            categoryData,
            categoryId
          );
          set({
            menuCategories: updatedCategory?.data,
            isMenuCategoryLoading: false,
          });
          return updatedCategory;
        } catch (error) {
          // Log the error with more details
          console.error("Failed to update category item:", {
            error: error.message,
            categoryData,
            categoryId,
          });

          set({ isMenuCategoryLoading: false });

          throw new Error(`Error updating category item: ${error.message}`);
        }
      },

      //TODO: Action to update a menu item by ID
      updateMenuItem: async (menuData, menuId) => {
        set({ isMenuLoading: true }); // Set loading state

        try {
          //TODO: CALL API UPDATE MENU
          const updatedMenu = await updateMenu(menuData, menuId);

          //TODO: Update the local menus state
          set({ menus: updatedMenu, isMenuLoading: false });
          // set((state) => ({
          //   menus: state.menus.map((menu) =>
          //     menu._id === menuId ? { ...menu, ...updatedMenu.data } : menu
          //   ),
          //   isMenuLoading: false, // Reset loading state
          // }));

          return updatedMenu;
        } catch (error) {
          // Log the error with more details
          console.error("Failed to update menu item:", {
            error: error.message,
            menuData,
            menuId,
          });

          set({ isMenuLoading: false });

          throw new Error(`Error updating menu item: ${error.message}`);
        }
      },

      //TODO: Create a new category menu
      createCategory: async (data) => {
        set({ isMenuCategoryLoading: true });
        try {
          const res = await addCategory(data);
          set({ menuCategories: res?.data, isMenuCategoryLoading: false });
          return res;
        } catch (error) {
          set({ isMenuCategoryLoading: false });
          throw new Error(`Error updating menu item: ${error.message}`);
        }
      },

      createMenuItem: async (data) => {
        set({ isMenuLoading: true });
        try {
          const res = await createMenu(data);
          set({ menus: res, isMenuLoading: false });
          return res;
        } catch (error) {
          set({ isMenuLoading: false });
          throw new Error(`Error updating menu item: ${error.message}`);
        }
      },

      //TODO: Action to delete category menu
      deleteCategory: async (id) => {
        try {
          console.log("id", id);
          const res = await deleteCategoryData(id);
          set({ menuCategories: res?.data, isMenuCategoryLoading: false });
          return res;
        } catch (error) {
          set({ isMenuCategoryLoading: false });
          throw new Error(`Error deleting category item: ${error.message}`);
        }
      },

      //TODO: Delete a menu item by ID
      deleteMenuItem: async (menuId) => {
        try {
          const res = await deleteMenuData(menuId);
          set({ menus: res?.data, isMenuLoading: false });
          return res;
        } catch (error) {
          set({ isMenuLoading: false });
          throw new Error(`Error deleting menu item: ${error.message}`);
        }
      },

      // Action to clear menu data
      clearMenus: () =>
        set({
          menus: [],
          menuCategories: [],
          staffCart: [],
          isMenuLoading: false,
        }),
    }),
    {
      name: "menuStore", // Name of the key in localStorage
      getStorage: () => localStorage, // Use localStorage as the storage method
    }
  )
);
