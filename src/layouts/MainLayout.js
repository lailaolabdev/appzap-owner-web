import React, { useState } from "react";
import Box from "../components/Box";
import Navbar from "./Navbar";
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
        marginLeft: { md: 65 },
      }}
    >
      <div>
        {/* <Box sx={{ display: { md: "block", xs: "none" } }}> */}
          <Sidenav
            location={location}
            navigate={navigate}
            onToggle={(exp) => _onToggle(exp)}
          />
        {/* </Box> */}
        <Navbar />
        <div style={{ paddingTop: 65 }} />
        <div>
          <Outlet />
        </div>
      </div>
    </Box>
  );
}
