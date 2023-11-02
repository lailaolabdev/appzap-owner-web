import React from "react";
import { Outlet } from "react-router-dom";
// page
import SettingTable from "../pages/settingStore/SettingTable";
import ReportMenuPage from "../pages/report/ReportMenuPage";
import DashboardPage from "../pages/dashboardnew/DashboardPage";
import ReportStockPage from "../pages/report/ReportStockPage";

// eslint-disable-next-line
export default {
  path: "/new-report",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <DashboardPage />,
    },
    {
      path: "stock",
      element: <ReportStockPage />,
    },
  ],
};
