import React, { useState } from "react";
import Box from "../components/Box";
import Navbar from "./Navbar";
import Sidenav from "./SideNav";
import { Route } from "react-router-dom";

export default function MainLayout({ children }) {
  const [expanded, setExpanded] = useState();
  const _onToggle = (exp) => {
    setExpanded(exp);
  };
  return (
    <>
      <Box
        sx={{
          marginLeft: { md: 65 },
        }}
      >
        <Route
          render={({ location, history }) => (
            <React.Fragment>
              <div>
                <Box sx={{ display: { md: "block", xs: "none" } }}>
                  <Sidenav
                    location={location}
                    history={history}
                    onToggle={(exp) => _onToggle(exp)}
                  />
                </Box>
                <Navbar />
                <div style={{ paddingTop: 65 }} />
                <div>{children}</div>
              </div>
            </React.Fragment>
          )}
        />
      </Box>
    </>
  );
}
