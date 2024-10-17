import React from "react";
import { Outlet } from "react-router-dom";
import Dashboard from "../pages/branch/Dashboard";
import BranchCreatePage from "../pages/branch/BranchCreatePage";
import DetailBrancPage from "../pages/branch/DetailBrancPage";

// eslint-disable-next-line
export default {
  path: "/branch",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <Dashboard />,
    },
    {
      path: "create",
      element: <BranchCreatePage />,
    },
    {
      path: "detail/:id",
      element: <DetailBrancPage />,
    },
  ],
};
