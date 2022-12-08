import React from "react";
import socketio from "socket.io-client";
import { END_POINT } from "./../constants";

export const socket = socketio.connect(END_POINT, {
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionDelayMax: 10000,
  reconnectionAttempts: 25,
});
export const SocketContext = React.createContext();
