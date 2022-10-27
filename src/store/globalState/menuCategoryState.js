import { useState } from "react";

export const useMenuCategoryState = () => {
  const [isMenuCategoryLoading, setMenuCategoryLoading] = useState(false);
  const [menuCategory, setMenuCategory] = useState([]);

  return {
    isMenuCategoryLoading,
    setMenuCategoryLoading,
    menuCategory,
    setMenuCategory,
  };
};
