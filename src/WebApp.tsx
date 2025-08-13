import { useEffect, useState } from "react";
import { sendProcessData, getConnectionStatus } from "./web-socket";

function WebApp() {
  const [isConnected, setIsConnected] = useState(getConnectionStatus());
  const [processResult, setProcessResult] = useState(null);
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

    const handleProcessResult = (event: CustomEvent) => {
      setProcessResult(event.detail);
      setIsLoading(false);
      console.log("Received process-data result:", event.detail);
    };

    window.addEventListener("socket-connected", handleSocketConnected);
    window.addEventListener("socket-disconnected", handleSocketDisconnected);
    window.addEventListener("process-data-result", handleProcessResult as EventListener);

    return () => {
      window.removeEventListener("socket-connected", handleSocketConnected);
      window.removeEventListener("socket-disconnected", handleSocketDisconnected);
      window.removeEventListener("process-data-result", handleProcessResult as EventListener);
    };
  }, []);

  const handleGetProcessData = () => {
    setIsLoading(true);
    setProcessResult(null);

    sendProcessData({
      process_id: "b3c1e04b-018e-4f2f-b9ca-666e35a42985",
      filterProcessDataDto: {
        page: 1,
        pageSize: 10,
        tenant_id: "e42b2852-99ec-40a1-bfdf-16d82c567236",
        search: "",
        size_id: "",
        product_id: "",
        approval_required: null
      }
    });
  };

  return (
    <div className="app-container">
      <h1 className="header">React + WebSocket - Process Data</h1>

      <div style={{ marginBottom: "20px" }}>
        <h3>Connection Status:</h3>
        <div className={`status-box ${isConnected ? "status-connected" : "status-disconnected"}`}>{isConnected ? "Connected" : "Disconnected"}</div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleGetProcessData} disabled={!isConnected || isLoading} className="display-btn">
          {isLoading ? "Loading..." : "Get Process Data"}
        </button>
      </div>

      {processResult && (
        <div className="result-box">
          <h3>Process Data Result:</h3>
          <pre className="result-pre">{JSON.stringify(processResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default WebApp;
