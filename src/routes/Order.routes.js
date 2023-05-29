import React from "react";
import { Outlet } from "react-router-dom";
import OrderPage from "../pages/order/OrderPage";

// eslint-disable-next-line
export default {
  path: "/orders",
  element: <OrderPage />,
  // children: [
  //   {
  //     path: "waiting",
  //     element: <WaitingOrder />,
  //   },
  //   {
  //     path: "doing",
  //     element: <DoingOrder />,
  //   },
  //   {
  //     path: "served",
  //     element: <ServedOrder />,
  //   },
  //   {
  //     path: "canceled/pagenumber/:number",
  //     element: <CanceledOrder />,
  //   },
  // ],
};
