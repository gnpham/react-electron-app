import { useEffect, useState } from "react";
import { socket, sendDisplayDevice } from "./socket";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceResult, setDeviceResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for connection status
    const handleConnect = () => {
      setIsConnected(true);
      console.log("Connected to server");
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    };

    // Listen for device result
    const handleDeviceResult = (event: CustomEvent) => {
      setDeviceResult(event.detail);
      setIsLoading(false);
      console.log("Received device result:", event.detail);
    };

    // Add event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    window.addEventListener("device-result", handleDeviceResult as EventListener);

    // Set initial connection status
    setIsConnected(socket.connected);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      window.removeEventListener("device-result", handleDeviceResult as EventListener);
    };
  }, []);

  const handleDeviceInfo = () => {
    setIsLoading(true);
    setDeviceResult(null);
    sendDisplayDevice();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Electron + React + WebSocket</h1>

      <div style={{ marginBottom: "20px" }}>
        <h3>Connection Status:</h3>
        <div
          style={{
            display: "inline-block",
            padding: "8px 16px",
            borderRadius: "4px",
            backgroundColor: isConnected ? "#4CAF50" : "#f44336",
            color: "white",
            fontWeight: "bold"
          }}
        >
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleDeviceInfo}
          disabled={!isConnected || isLoading}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: isConnected ? "#2196F3" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isConnected && !isLoading ? "pointer" : "not-allowed",
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? "Loading..." : "Display Device"}
        </button>
      </div>

      {deviceResult && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            border: "1px solid #ddd"
          }}
        >
          <h3>Device Result:</h3>
          <pre
            style={{
              backgroundColor: "white",
              padding: "12px",
              borderRadius: "4px",
              overflow: "auto"
            }}
          >
            {JSON.stringify(deviceResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
