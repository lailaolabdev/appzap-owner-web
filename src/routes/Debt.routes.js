import React from "react";
import { Outlet } from "react-router-dom";
import AudioSettingPage from "../pages/audio/AudioSettingPage";
import DebtPage from "../pages/debt/DebtPage";
import DebtCreatePage from "../pages/debt/DebtCreatePage";

// eslint-disable-next-line
export default {
  path: "/debt",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <DebtPage />,
    },
    {
      path: "create",
      element: <DebtCreatePage />,
    },
  ],
};
