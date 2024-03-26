import React from "react";
import { Outlet } from "react-router-dom";
// page
import DashboardPage from "../pages/dashboardnew/DashboardPage";
import ReportStockPage from "../pages/report/ReportStockPage";
import ReportLayout from "../layouts/ReportLayout";
import MemberPage from "../pages/member/MemberPage";
import CreateMemberPage from "../pages/member/CreateMemberPage";
import ReportStocks from "../pages/report/ReportStocks";

// eslint-disable-next-line
export default {
  path: "/reports",
  element: <ReportLayout />,
  children: [
    {
      path: "sales-report",
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
      path: "stock",
      element: <ReportStockPage />,
    },
    {
      path: "reportStocks",
      element: <ReportStocks />,
    },
  ],
};
