import React, { useMemo, useEffect} from "react";
// import ReactGA from 'react-ga4';
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

  
//   useMemo(() => {
//     console.log("GOOGLE ANALYTICS STARTED")
//     const TRACKING_ID = 'G-LLZP539QT0';
//     ReactGA.initialize(TRACKING_ID, { debug: true })
// }, [])

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
