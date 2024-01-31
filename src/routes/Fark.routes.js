import React from "react";
import { Outlet } from "react-router-dom";
import AudioSettingPage from "../pages/audio/AudioSettingPage";
import FarkPage from "../pages/fark/FarkPage";
import FarkCreatePage from "../pages/fark/FarkCreatePage";

// eslint-disable-next-line
export default {
  path: "/fark",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <FarkPage />,
    },
    {
      path: "create",
      element: <FarkCreatePage />,
    },
  ],
};
