import { useState, useEffect } from "react";
export const useStockCategoryState = ({ storeDetail }) => {
  const [isMenuCategoryLoadings, setMenuCategoryLoadings] = useState(false);
  const [stockCategoryCreate, setStockCategoryCreate] = useState([]);

  return {
    stockCategoryCreate,
    setStockCategoryCreate,
  };
};
