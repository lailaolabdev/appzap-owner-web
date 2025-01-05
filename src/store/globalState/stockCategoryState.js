import { useState, useEffect } from "react";
export const useStockCategoryState = ({ storeDetail }) => {
  const [stockCategoryCreate, setStockCategoryCreate] = useState([]);

  return {
    stockCategoryCreate,
    setStockCategoryCreate,
  };
};
