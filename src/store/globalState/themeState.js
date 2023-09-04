import { useState } from "react";

export const useThemeState = () => {
  const [menuItemSet, setMenuItemSet] = useState([]);

  return {
    menuItemSet,
    setMenuItemSet,
  };
};
