import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getMenusByStoreId } from "../services/menu"; // Import necessary API helpers
import { getCategories } from "../services/menuCategory";

export const useMenuStore = create(
  persist(
    (set) => ({
      // Initial store state
      menus: [],
      menuCategories: [],
      selectedCategory: "All",
      isMenuLoading: false,
      staffCart: [],

      // Action to set loading state
      setMenuLoading: (isLoading) => set({ isMenuLoading: isLoading }),

      // Action to set menu data
      setMenus: (menusData) => set({ menus: menusData }),

      // Action to set menu categories
      setMenuCategories: (categoriesData) => set({ menuCategories: categoriesData }),

      // Action to set the selected category
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      // Action to set staff cart
      setStaffCart: (cart) => set({ staffCart: cart }),

      // Action to fetch menus by store ID
      fetchMenus: async (storeId) => {
        console.log({storeId})
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

      // Action to fetch menu categories for a store
      fetchMenuCategories: async (storeId) => {
        set({ isMenuLoading: true });
        try {
          const data = await getCategories(storeId);
          set({ menuCategories: data, isMenuLoading: false });
          return data;
        } catch (error) {
          console.error("Fetch menu categories error:", error.message);
          set({ isMenuLoading: false });
        }
      },

    //   // Action to update a menu item by ID
    //   updateMenuItem: async (menuData, menuId) => {
    //     set({ isMenuLoading: true });
    //     try {
    //       const updatedMenu = await updateMenu(menuData, menuId);
    //       set((state) => ({
    //         menus: state.menus.map((menu) =>
    //           menu._id === menuId ? updatedMenu.data : menu
    //         ),
    //         isMenuLoading: false,
    //       }));
    //       return updatedMenu;
    //     } catch (error) {
    //       console.error("Update menu item error:", error.message);
    //       set({ isMenuLoading: false });
    //     }
    //   },

      // Action to clear menu data
      clearMenus: () => set({ menus: [], menuCategories: [], staffCart: [], isMenuLoading: false }),
    }),
    {
      name: "menuStore", // Name of the key in localStorage
      getStorage: () => localStorage, // Use localStorage as the storage method
    }
  )
);
