import React, { useState } from "react";
import Box from "../components/Box";
import Navbar from "./Navbar";
import Sidenav from "./SideNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useWindowDimensions2 from "../helpers/useWindowDimension2";

export default function MainLayout({ children }) {
  const [expanded, setExpanded] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const _onToggle = (exp) => {
    setExpanded(exp);
  };

  const { width, hight } = useWindowDimensions2();
  console.log("widthtt:", width);
  console.log("highttt:", hight);

  return (
    <Box
      sx={{
        paddingLeft: { md: 65 },
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: { md: "block", xs: "block" },
          height: 64,
          overflow: { md: "visible" },
          // overflow: { md: "visible", xs: expanded ? "visible" : "hidden" },
          transform: "translate3d(0,0,0)",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 100000,
        }}
      >
        <Sidenav
          location={location}
          navigate={navigate}
          onToggle={(exp) => _onToggle(exp)}
        />
      </Box>
      <Navbar />
      <div
        style={{
          minHeight: "calc(100dvh - 65px)",
          backgroundColor: "#F9F9F9",
          height: "calc(100dvh - 65px)",
          maxHeight: "calc(100dvh - 65px)",
          overflowY: "auto",
          position: "relative",
          paddingLeft: width < 500?"12%": width< 600 ? "10%": width < 900 ? "8%" : width < 1200 ? "20%" : "14%",
        }}
      >
        <Outlet />
      </div>
    </Box>
  );
}
