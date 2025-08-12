import { useEffect, useState } from "react";
import { sendReportProduction, getConnectionStatus } from "./web-socket";

function WebApp() {
  const [isConnected, setIsConnected] = useState(getConnectionStatus());
  const [reportResult, setReportResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleSocketConnected = () => {
      setIsConnected(true);
      console.log("Connected to server");
    };

    const handleSocketDisconnected = () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    };

    const handleReportResult = (event: CustomEvent) => {
      setReportResult(event.detail);
      setIsLoading(false);
      console.log("Received report-production result:", event.detail);
    };

    window.addEventListener("socket-connected", handleSocketConnected);
    window.addEventListener("socket-disconnected", handleSocketDisconnected);
    window.addEventListener("report-result", handleReportResult as EventListener);

    return () => {
      window.removeEventListener("socket-connected", handleSocketConnected);
      window.removeEventListener("socket-disconnected", handleSocketDisconnected);
      window.removeEventListener("report-result", handleReportResult as EventListener);
    };
  }, []);

  const handleReportProduction = () => {
    setIsLoading(true);
    setReportResult(null);

    // Call event report-production by WS
    sendReportProduction({
      page: 1,
      pageSize: 10,
      tenant_id: "e42b2852-99ec-40a1-bfdf-16d82c567236",
      show_product: false
    });
  };

  return (
    <div className="app-container">
      <h1 className="header">React + WebSocket - Report Production</h1>

      <div style={{ marginBottom: "20px" }}>
        <h3>Connection Status:</h3>
        <div className={`status-box ${isConnected ? "status-connected" : "status-disconnected"}`}>{isConnected ? "Connected" : "Disconnected"}</div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleReportProduction} disabled={!isConnected || isLoading} className="display-btn">
          {isLoading ? "Loading..." : "Report Production"}
        </button>
      </div>

      {reportResult && (
        <div className="result-box">
          <h3>Report Result:</h3>
          <pre className="result-pre">{JSON.stringify(reportResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default WebApp;
