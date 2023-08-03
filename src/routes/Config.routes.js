import React from "react";
import { Outlet } from "react-router-dom";
import ConfigPage from "../pages/config/ConfigPage";

// eslint-disable-next-line
export default {
  path: "/config",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <ConfigPage />,
    },
  ],
};
