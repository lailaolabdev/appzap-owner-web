import { useState } from "react";

export const useMenuState = () => {
  const [isMenuLoading, setMenuLoading] = useState(false);
  const [menu, setMenu] = useState([]);

  return {
    isMenuLoading,
    setMenuLoading,
    menu,
    setMenu,
  };
};
