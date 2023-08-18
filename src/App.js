import React, { useEffect } from "react";
import ReactGA from 'react-ga';
import Routes from "./routes";
import { ThemeProvider } from "styled-components";
import { StateProvider } from "./store";
import { ToastContainer /* toast */ } from "react-toastify";

const theme = {
  xl: "@media screen and (min-width: 1536px)",
  lg: "@media screen and (min-width: 1200px)",
  md: "@media screen and (min-width: 900px)",
  sm: "@media screen and (min-width: 600px)",
  xs: "@media screen and (min-width: 0px)",
};

function App() {

  useEffect(() => {
    console.log("GOOGLE ANALYTICS STARTED")
    // ReactGA.initialize('G-LLZP539QT0', { debug: false })
    ReactGA.initialize('G-B6GKR3MCEE', { debug: false })
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [])

  return (
    <StateProvider>
      <ThemeProvider theme={theme}>
        <Routes />
        <ToastContainer />
      </ThemeProvider>
    </StateProvider>
  );
}
export default App;
