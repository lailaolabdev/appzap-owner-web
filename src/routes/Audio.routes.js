import React from "react";
import { Outlet } from "react-router-dom";
import AudioSettingPage from "../pages/audio/AudioSettingPage";

// eslint-disable-next-line
export default {
  path: "/audio",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <AudioSettingPage />,
    },
  ],
};
