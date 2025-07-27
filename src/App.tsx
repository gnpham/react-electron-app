import { useEffect, useState } from "react";
import { sendDisplayDevice, getConnectionStatus } from "./socket";

function App() {
  const [isConnected, setIsConnected] = useState(getConnectionStatus());
  const [deviceResult, setDeviceResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for connection status via custom events
    const handleSocketConnected = () => {
      setIsConnected(true);
      console.log("Connected to server");
    };

    const handleSocketDisconnected = () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    };

    // Listen for device result
    const handleDeviceResult = (event: CustomEvent) => {
      setDeviceResult(event.detail);
      setIsLoading(false);
      console.log("Received device result:", event.detail);
    };

    // Add event listeners for custom events
    window.addEventListener("socket-connected", handleSocketConnected);
    window.addEventListener("socket-disconnected", handleSocketDisconnected);
    window.addEventListener("device-result", handleDeviceResult as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener("socket-connected", handleSocketConnected);
      window.removeEventListener("socket-disconnected", handleSocketDisconnected);
      window.removeEventListener("device-result", handleDeviceResult as EventListener);
    };
  }, []);

  const handleDeviceInfo = () => {
    setIsLoading(true);
    setDeviceResult(null);
    sendDisplayDevice();
  };

  return (
    <div className="app-container">
      <h1 className="header">Electron + React + WebSocket</h1>

      <div style={{ marginBottom: "20px" }}>
        <h3>Connection Status:</h3>
        <div className={`status-box ${isConnected ? "status-connected" : "status-disconnected"}`}>{isConnected ? "Connected" : "Disconnected"}</div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleDeviceInfo} disabled={!isConnected || isLoading} className="display-btn">
          {isLoading ? "Loading..." : "Display Device"}
        </button>
      </div>

      {deviceResult && (
        <div className="result-box">
          <h3>Device Result:</h3>
          <pre className="result-pre">{JSON.stringify(deviceResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
