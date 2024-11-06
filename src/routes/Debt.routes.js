import React from "react";
import { Outlet } from "react-router-dom";
import AudioSettingPage from "../pages/audio/AudioSettingPage";
import DebtPage from "../pages/debt/DebtPage";

// eslint-disable-next-line
export default {
  path: "/debt",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <DebtPage />,
    },
  ],
};
