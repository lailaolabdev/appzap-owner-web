import React from "react";
import { Outlet } from "react-router-dom";
import PrinterCounter from "../pages/printer/PrinterCounter";
// page
import PrinterList from "../pages/printer/PrinterList";
import PrinterMenuType from "../pages/printer/PrinterMenuType";

// eslint-disable-next-line
export default {
  path: "/printer",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <PrinterList />,
    },
    {
      path: "counter",
      element: <PrinterCounter />,
    },
    {
      path: "menu-type",
      element: <PrinterMenuType />,
    },
  ],
};
