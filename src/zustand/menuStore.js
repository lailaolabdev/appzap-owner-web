import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createMenu, getMenusByStoreId, updateMenu } from "../services/menu"; // Import necessary API helpers
import { getCategories } from "../services/menuCategory";

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

      // Action to set loading state
      setMenuLoading: (isLoading) => set({ isMenuLoading: isLoading }),

      // Action to set menu data
      setMenus: (menusData) => set({ menus: menusData }),

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
        console.log({ storeId });
        set({ isMenuLoading: true });
        try {
          const data = await getMenusByStoreId(storeId);
          console.log("DATA", data);
          set({ menus: data, isMenuLoading: false });
          return data;
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

      //TODO: Action to update a menu item by ID
      updateMenuItem: async (menuData, menuId) => {
        set({ isMenuLoading: true }); // Set loading state

        try {
          //TODO: CALL API UPDATE MENU
          const updatedMenu = await updateMenu(menuData, menuId);

          //TODO: Update the local menus state
          set({ menus: updatedMenu?.data, isMenuLoading: false });
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

      createMenuItem: async (data) => {
        set({ isMenuLoading: true });
        console.log("DATA: ", data);
        try {
          const res = await createMenu(data);
          console.log("RES", res);
          set({ menus: res, isMenuLoading: false });
          return res;
        } catch (error) {
          set({ isMenuLoading: false });
          throw new Error(`Error updating menu item: ${error.message}`);
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
