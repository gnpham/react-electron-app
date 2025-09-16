import React from "react";
import ReactDOM from "react-dom/client";
import "./css/main.css";
// import DashboardAppRoot from "./dashboard/DashboardAppRoot";
import WebAppRoot from "./report/WebAppRoot";
// import DisplayApp from "./display/DisplayApp";
// import ScaleApp from "./scale/ScaleApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ScaleApp /> */}
    <WebAppRoot />
    {/* <DisplayApp /> */}
    {/* <DashboardAppRoot /> */}
  </React.StrictMode>
);
