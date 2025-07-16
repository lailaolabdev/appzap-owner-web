import React, { useMemo, useEffect } from "react";
// import ReactGA from 'react-ga4';
import Routes from "./routes";
import { ThemeProvider } from "styled-components";
import { StateProvider } from "./store";
import { ToastContainer /* toast */ } from "react-toastify";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useLocation, useBeforeUnload } from 'react-router-dom';

const theme = {
  xl: "@media screen and (min-width: 1536px)",
  lg: "@media screen and (min-width: 1200px)",
  md: "@media screen and (min-width: 900px)",
  sm: "@media screen and (min-width: 600px)",
  xs: "@media screen and (min-width: 0px)",
};

// Create QueryClient
const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: false,
      },
      mutations: {
        retryDelay: 1000,
      },
    },
  });


function App() {
  const { i18n } = useTranslation();
  const location = useLocation();

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

  return (
    <StateProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Routes />
          <ToastContainer />
        </ThemeProvider>
      </QueryClientProvider>
    </StateProvider>
  );
}
export default App;
