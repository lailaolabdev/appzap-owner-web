import React from "react";
import { Outlet } from "react-router-dom";
// page
import DashboardPage from "../pages/dashboardnew/DashboardPage";
import ReportStockPage from "../pages/report/ReportStockPage";
import ReportLayout from "../layouts/ReportLayout";
import MemberPage from "../pages/member/MemberPage";
import CreateMemberPage from "../pages/member/CreateMemberPage";
import SettingMemberPointPage from "../pages/member/SettingMemberPointPage";
import ReportStocks from "../pages/report/ReportStocks";

// eslint-disable-next-line
export default {
  path: "/reports",
  element: <ReportLayout />,
  children: [
    {
      path: "/reports/sales-report",
      element: <DashboardPage />,
    }, 
    {
      path: "members-report",
      element: <MemberPage />,
    },
    {
      path: "members-report/create-member",
      element: <CreateMemberPage />,
    },
    {
      path: "members-report/setting-point",
      element: <SettingMemberPointPage />,
    },
    {
      path: "stock",
      element: <ReportStockPage />,
    },
    {
      path: "reportStocks",
      element: <ReportStocks />,
    },
  ],
};
