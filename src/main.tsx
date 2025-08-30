import React from "react";
import ReactDOM from "react-dom/client";
// import ScaleApp from "./ScaleApp";
// import WebAppRoot from "./WebAppRoot";
// import DisplayApp from "./DisplayApp";
import "./css/main.css";
import DashboardApp from "./DashBoardApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ScaleApp /> */}
    {/* <WebAppRoot /> */}
    {/* <DisplayApp /> */}
    <DashboardApp />
  </React.StrictMode>
);
