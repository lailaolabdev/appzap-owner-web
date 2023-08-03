import React from "react";
import { Outlet } from "react-router-dom";
import StaffTableDetail from "../pages/staff/StaffTableDetail";
import StaffCartPage from "../pages/cart/StaffCartPage";

// eslint-disable-next-line
export default {
  path: "/staff",
  element: <Outlet />,
  children: [
    {
      path: "tableDetail/:codeId",
      element: <StaffTableDetail />,
    },
    {
      path: "cart/:codeId",
      element: <StaffCartPage />,
    },
  ],
};
