import React from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SignupPage from "../pages/signup/SignupPage";

// eslint-disable-next-line
export default {
  path: "/auth",
  element: <Outlet />,
  children: [
    {
      path: "",
      element: <Navigate to="/auth/signup" />,
    },
    {
      path: "signup",
      element: <SignupPage />,
    },
  ],
};
