import { useState, useEffect } from "react";
export const useStockCategoryState = ({ storeDetail }) => {
  const [isMenuCategoryLoadings, setMenuCategoryLoadings] = useState(false);
  const [stockCategoryCreate, setStockCategoryCreate] = useState([]);

  // function

  console.log("object");

  return {
    stockCategoryCreate,
    setStockCategoryCreate,
  };
};
