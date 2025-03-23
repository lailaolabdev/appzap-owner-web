import React from "react";
import { Outlet } from "react-router-dom";

import ClearData from "../pages/clearRestaurant/clearData";

export default {
  path: "/clear_restaurant",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <ClearData />,
    },
  ],
};