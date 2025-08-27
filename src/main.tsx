import React from "react";
import ReactDOM from "react-dom/client";
// import ScaleApp from "./ScaleApp";
import WebAppRoot from "./WebAppRoot";
// import DisplayApp from "./DisplayApp";
import "./css/main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ScaleApp /> */}
    <WebAppRoot />
    {/* <DisplayApp /> */}
  </React.StrictMode>
);
