import React from "react";
import ReactDOM from "react-dom/client";
// import ScaleApp from "./ScaleApp";
import WebApp from "./WebApp";
import "./css/main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ScaleApp /> */}
    <WebApp />
  </React.StrictMode>
);
