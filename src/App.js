import React, { useMemo, useEffect } from "react";
// import ReactGA from 'react-ga4';
import Routes from "./routes";
import { ThemeProvider } from "styled-components";
import { StateProvider } from "./store";
import { ToastContainer /* toast */ } from "react-toastify";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';
import { USER_KEY } from "./constants";

const theme = {
  xl: "@media screen and (min-width: 1536px)",
  lg: "@media screen and (min-width: 1200px)",
  md: "@media screen and (min-width: 900px)",
  sm: "@media screen and (min-width: 600px)",
  xs: "@media screen and (min-width: 0px)",
};

function App() {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const setToken = async () => {
      const params = new URLSearchParams(location.search);
      const accessToken = params.get('accessToken');
      const refreshToken = params.get('refreshToken');
      const role = params.get('role'); 
      const gender = params.get('gender'); 
      const _id = params.get('_id'); 
      const userAuthId = params.get('userAuthId'); 
      const userId = params.get('userId'); 
      const storeId = params.get('storeId'); 
      const createdAt = params.get('createdAt'); 
      const __v = params.get('__v'); 
      const posData = {role, gender, _id, userAuthId, userId, storeId, createdAt, __v}

      if (accessToken && refreshToken && posData) {
        sessionStorage.setItem(USER_KEY, JSON.stringify({ 
          accessToken: accessToken, 
          refreshToken: refreshToken, 
          data: posData 
        }));
      }
    };

    setToken();
  }, [location.search]);

  useEffect(() => {
    const changeMomentLocale = (lng) => {
      moment.locale(lng);
    };

    // Initialize locale
    changeMomentLocale(i18n.language);

    // Listen for language changes
    i18n.on("languageChanged", changeMomentLocale);

    // Cleanup on component unmount
    return () => {
      i18n.off("languageChanged", changeMomentLocale);
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
