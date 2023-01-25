import React from "react";
import Routes from "./routes";
import { ThemeProvider } from "styled-components";
import { StateProvider } from "./store";
import { ToastContainer, toast } from "react-toastify";
import PubNub from "pubnub";
import { PubNubProvider, usePubNub } from "pubnub-react";
import uuid from "react-uuid";
import "react-toastify/dist/ReactToastify.css";
const theme = {
  xl: "@media screen and (min-width: 1536px)",
  lg: "@media screen and (min-width: 1200px)",
  md: "@media screen and (min-width: 900px)",
  sm: "@media screen and (min-width: 600px)",
  xs: "@media screen and (min-width: 0px)",
};
const pubnub = new PubNub({
  subscribeKey: "sub-c-beae3a2d-dfb1-4e6c-836c-db121d1df744",
  uuid: uuid(),
});
function App() {
  return (
    <PubNubProvider client={pubnub}>
      <StateProvider>
        <ThemeProvider theme={theme}>
          <Routes />
          <ToastContainer />
        </ThemeProvider>
      </StateProvider>
    </PubNubProvider>
  );
}
export default App;
