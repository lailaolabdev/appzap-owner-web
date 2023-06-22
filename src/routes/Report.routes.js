import React from "react";
import { Outlet } from "react-router-dom";
// page
import SettingTable from "../pages/settingStore/SettingTable";
import ReportMenuPage from "../pages/report/ReportMenuPage";

// eslint-disable-next-line
export default {
  path: "/reportmenu",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <ReportMenuPage />,
    },
  ],
};
