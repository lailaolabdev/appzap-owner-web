import React from "react";
import { Outlet } from "react-router-dom";
import PinPage from "../pages/pin/PinPage";

// eslint-disable-next-line
export default {
  path: "/PIN",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <PinPage />,
    },
  ],
};
