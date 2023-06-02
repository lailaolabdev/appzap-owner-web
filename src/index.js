import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './i18n'
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./index.scss";
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector("#root")
);
