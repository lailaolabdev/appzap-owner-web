import React from "react";
import { Outlet } from "react-router-dom";
import AudioSettingPage from "../pages/audio/AudioSettingPage";
import Dashboard from "../pages/branch/Dashboard";
import BranchCreatePage from "../pages/branch/BranchCreatePage";

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
  ],
};
