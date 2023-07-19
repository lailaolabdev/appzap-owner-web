import React from "react";
import { Outlet } from "react-router-dom";
// page
import MenuList from "../pages/menu_and_stock/List";
import MenuSortPage from "../pages/menu/MenuSortPage";

// eslint-disable-next-line
export default {
  path: "/menu-new",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <MenuList />,
    },
    {
      path: "sort",
      element: <MenuSortPage />,
    },
  ],
};
