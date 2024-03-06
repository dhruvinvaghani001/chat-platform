import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import store from "./context/store.js";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { SocketContextProvider } from "./context/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </Provider>
    <Toaster />
  </>
);
