import React, { useState } from "react";
import Box from "../components/Box";
import NavBar from "./Navbar";
import Sidenav from "./SideNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function MainLayout({ children }) {
  const [expanded, setExpanded] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const _onToggle = (exp) => {
    setExpanded(exp);
  };

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
          maxHeight: 64,
          width: 64,
          overflow: { md: "visible", xs: expanded ? "visible" : "hidden" },
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
      <NavBar />
      <div className="min-h-[calc(100vh-65px)] h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] overflow-y-scroll relative">
        <Outlet />
      </div>
    </Box>
  );
}
