import { useState, useEffect } from "react";
import { getCategories } from "../../services/menuCategory";

export const useMenuCategoryState = ({ storeDetail }) => {
  const [isMenuCategoryLoadings, setMenuCategoryLoadings] = useState(false);
  const [menuCategorys, setMenuCategorys] = useState([]);

  // function
  const getMenuCategorysState = async () => {
    setMenuCategoryLoadings(true);
    let findby = "?";
    findby += `storeId=${storeDetail?._id}`;
    const data = await getCategories(findby);
    setMenuCategorys(data);
    setMenuCategoryLoadings(false);
  };

  // useEffect
  useEffect(() => {
    getMenuCategorysState();
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
