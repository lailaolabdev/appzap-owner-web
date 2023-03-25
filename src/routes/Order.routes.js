import React from "react";
import WaitingOrder from "../pages/order/WaitingOrder";
import DoingOrder from "../pages/order/DoingOrder";
import ServedOrder from "../pages/order/ServedOrder";
import CanceledOrder from "../pages/order/CanceledOrder";
import { Outlet } from "react-router-dom";

// eslint-disable-next-line
export default {
  path: "/orders",
  element: <Outlet />,
  children: [
    {
      path: "waiting",
      element: <WaitingOrder />,
    },
    {
      path: "doing",
      element: <DoingOrder />,
    },
    {
      path: "served",
      element: <ServedOrder />,
    },
    {
      path: "canceled/pagenumber/:number",
      element: <CanceledOrder />,
    },
  ],
};
