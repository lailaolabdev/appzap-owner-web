import React from "react";
import { Outlet } from "react-router-dom";
import OrderPage from "../pages/order/OrderPage";
import SelfOrderingOrderPage from "../pages/self_ordering_order/SelfOrderingOrderPage";

// eslint-disable-next-line
export default {
  path: "/self-ordering-order",
  element: <SelfOrderingOrderPage />,
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
