import React from "react";
import { Outlet } from "react-router-dom";
import AudioSettingPage from "../pages/audio/AudioSettingPage";
import FarkPage from "../pages/fark/FarkPage";
import FarkCreatePage from "../pages/fark/FarkCreatePage";
import UserPage from "../pages/users/UserPage";

// eslint-disable-next-line
export default {
  path: "/user",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <UserPage />,
    },
    {
      path: "create",
      element: <FarkCreatePage />,
    },
  ],
};
