import { useState } from "react";

export const useThemeState = () => {
  const [menuItemSet, setMenuItemSet] = useState([]);
  const [themeColors, setThemeColors] = useState([
    {
      name: "primary",
      color: "#007bff",
    },
    {
      name: "secondary",
      color: "#6c757d",
    },
    {
      name: "success",
      color: "#28a745",
    },
    {
      name: "danger",
      color: "#dc3545",
    },
    {
      name: "warning",
      color: "#ffc107",
    },
    {
      name: "info",
      color: "#17a2b8",
    },
    {
      name: "light",
      color: "#f8f9fa",
    },
    {
      name: "dark",
      color: "#343a40",
    },
    {
      name: "muted",
      color: "#6c757d",
    },
    {
      name: "white",
      color: "#fff",
    },
  ]);
  const [themeSections, setThemeSections] = useState();

  // root
  const [rootVariant, setRootVariant] = useState({
    backgroundColor: "#fff",
  });

  // bottombar
  const [bottombarVariant, setBottombarVariant] = useState({
    backgroundColor: "#fff",
    color: "#000",
  });

  // menu
  const [menuItemVariant, setMenuItemVariant] = useState({
    backgroundColor: "#fff",
    border: "1px solid #000",
    color: "#000",
  });
  const [menuDetailVariant, setMenuDetailVariant] = useState({
    backgroundColor: "#fff",
    border: "1px solid #000",
    color: "#000",
  });

  return {
    menuItemSet,
    setMenuItemSet,
    themeColors,
    setThemeColors,
    themeSections,
    setThemeSections,
    bottombarVariant,
    setBottombarVariant,
  };
};
