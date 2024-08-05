import React, { useMemo, useEffect } from "react";
// import ReactGA from 'react-ga4';
import Routes from "./routes";
import { ThemeProvider } from "styled-components";
import { StateProvider } from "./store";
import { ToastContainer /* toast */ } from "react-toastify";
import moment from "moment";
import { useTranslation } from "react-i18next";

const theme = {
  xl: "@media screen and (min-width: 1536px)",
  lg: "@media screen and (min-width: 1200px)",
  md: "@media screen and (min-width: 900px)",
  sm: "@media screen and (min-width: 600px)",
  xs: "@media screen and (min-width: 0px)",
};

function App() {

  const { i18n } = useTranslation();

  useEffect(() => {
    const changeMomentLocale = (lng) => {
      moment.locale(lng);
    };

    // Initialize locale
    changeMomentLocale(i18n.language);

    // Listen for language changes
    i18n.on('languageChanged', changeMomentLocale);

    // Cleanup on component unmount
    return () => {
      i18n.off('languageChanged', changeMomentLocale);
    };
  }, [i18n]);
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
