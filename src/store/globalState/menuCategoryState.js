import { useState, useEffect } from "react";
import { getCategories } from "../../services/menuCategory";

export const useMenuCategoryState = ({ storeDetail }) => {
  const [isMenuCategoryLoadings, setMenuCategoryLoadings] = useState(false);
  const [menuCategorys, setMenuCategorys] = useState([]);

  // function
  const getMenuCategorysState = async () => {
    setMenuCategoryLoadings(true);
    const data = await getCategories(storeDetail?._id);
    setMenuCategorys(data);
    setMenuCategoryLoadings(false);
  };

  // useEffect
  useEffect(() => {
    getMenuCategorysState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDetail]);
  return {
    isMenuCategoryLoadings,
    setMenuCategoryLoadings,
    menuCategorys,
    setMenuCategorys,
    // function
    getMenuCategorysState,
  };
};
