import React from "react";
import { Outlet } from "react-router-dom";
// page
import SettingTable from "../pages/settingStore/SettingTable";


// eslint-disable-next-line
export default {
  path: "/settingStore",
  element: <Outlet />,
  children: [
    {
      path: "settingTable/:id",
      element: <SettingTable />,
    },
  ],
};
