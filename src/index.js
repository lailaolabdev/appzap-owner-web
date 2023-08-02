import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./i18n";
import { BrowserRouter } from "react-router-dom";
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./index.scss";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector("#root")
);
// serviceWorkerRegistration.unregister();