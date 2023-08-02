import { useState, useEffect } from "react";
import { getMenus } from "../../services/menu";

export const useMenuState = ({ storeDetail }) => {
  const [isMenuLoadings, setMenuLoadings] = useState(false);
  const [menus, setMenus] = useState([]);

  const [staffCart, setStaffCart] = useState([]);

  // function
  const getMenusState = async () => {
    setMenuLoadings(true);
    let findby = "?";
    findby += `storeId=${storeDetail?._id}`;
    const data = await getMenus(findby);
    setMenus(data);
    setMenuLoadings(false);
  };

  // useEffect
  useEffect(() => {
    getMenusState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDetail]);
  return {
    isMenuLoadings,
    setMenuLoadings,
    menus,
    setMenus,
    staffCart,
    setStaffCart,
    // function
    getMenusState,
  };
};
