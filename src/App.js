import React from "react";
import Routes from "./routes";
import { SocketContext, socket } from './services/socket';
import { StateProvider } from "./store";
function App() {
  return <StateProvider>
    <SocketContext.Provider value={socket}>
      <Routes />
    </SocketContext.Provider>
  </StateProvider>;
}
export default App;
