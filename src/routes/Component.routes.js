import React from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SignupPage from "../pages/signup/SignupPage";
import BillForReport80 from "../components/bill/BillForReport80";
import PrintTest from "../components/bill/PrintTest";

// eslint-disable-next-line
export default {
  path: "/component",
  element: <Outlet />,
  children: [
    {
      path: "BillForReport80",
      element: <BillForReport80 />,
    },
    {
      path: "testPrint",
      element: <PrintTest/>,
    },
  ],
};
