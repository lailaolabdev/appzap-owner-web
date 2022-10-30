import React from "react";
import Routes from "./routes";
import { ThemeProvider } from "styled-components";
// import { SocketContext, socket } from "./services/socket";
import { StateProvider } from "./store";
const theme = {
  xl: "@media screen and (min-width: 1536px)",
  lg: "@media screen and (min-width: 1200px)",
  md: "@media screen and (min-width: 900px)",
  sm: "@media screen and (min-width: 600px)",
  xs: "@media screen and (min-width: 0px)",
};
function App() {
  return (
    <ThemeProvider theme={theme}>
      <StateProvider>
        <Routes />
      </StateProvider>
    </ThemeProvider>
  );
}
export default App;
