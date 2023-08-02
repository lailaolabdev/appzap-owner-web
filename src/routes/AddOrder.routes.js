import React from "react";
import { Outlet } from "react-router-dom";
import StaffTableDetail from "../pages/staff/StaffTableDetail";
import AddOrderPage from "../pages/add_order/AddOrderPage";

// eslint-disable-next-line
export default {
  path: "/add-order",
  element: <Outlet />,
  children: [
    {
      path: ":codeId",
      element: <AddOrderPage />,
    },
  ],
};
