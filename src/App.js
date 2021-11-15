import React from "react";
import Routes from "./routes";
import { SocketContext, socket } from './services/socket';

function App() {
  return <SocketContext.Provider value={socket}>
    <Routes />
  </SocketContext.Provider>;
}
export default App;
