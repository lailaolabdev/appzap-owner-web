import React from "react";
import socketio from "socket.io-client";
import { END_POINT } from "./../constants";

export const socket = socketio.connect(END_POINT);
export const SocketContext = React.createContext();