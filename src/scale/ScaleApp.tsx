import { useEffect, useState } from "react";
import { getConnectionStatus, emitIotInteracted } from "./scale-socket";

function ScaleApp() {
  const [isConnected, setIsConnected] = useState(getConnectionStatus());
  const [deviceResult, setDeviceResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [programId, setProgramId] = useState<string | null>(null);
  const [interactionStatus, setInteractionStatus] = useState<string | null>(null);

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
      setInteractionStatus(null);
      console.log("Received device result:", event.detail);

      // Nếu đây là pause-request, khởi tạo đếm ngược (hỗ trợ cả string/number)
      if (event.detail && event.detail.countdown_seconds !== undefined) {
        const seconds = Number(event.detail.countdown_seconds);
        if (!Number.isNaN(seconds)) {
          setCountdown(seconds);
        }
        if (event.detail.program_id) {
          setProgramId(event.detail.program_id);
        }
      }
    };

    // Lắng nghe phản hồi từ iot-interacted-result
    const handleIotInteractedResult = (event: CustomEvent) => {
      const result = event.detail as { success?: boolean; message?: string; error?: string };
      if (result?.success) {
        setInteractionStatus(result.message || "Đã ghi nhận tương tác");
      } else {
        setInteractionStatus(result?.error || "Gửi tương tác thất bại");
      }
    };

    // Add event listeners for custom events
    window.addEventListener("socket-connected", handleSocketConnected);
    window.addEventListener("socket-disconnected", handleSocketDisconnected);
    window.addEventListener("device-result", handleDeviceResult as EventListener);
    window.addEventListener("iot-interacted-result", handleIotInteractedResult as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener("socket-connected", handleSocketConnected);
      window.removeEventListener("socket-disconnected", handleSocketDisconnected);
      window.removeEventListener("device-result", handleDeviceResult as EventListener);
      window.removeEventListener("iot-interacted-result", handleIotInteractedResult as EventListener);
    };
  }, []);

  // Chạy đồng hồ đếm ngược mỗi giây và tự động emit khi còn 30 giây
  useEffect(() => {
    if (countdown === null) return;

    // if (countdown === 30 && programId) {
    //   // Tự động gửi sự kiện iot-interacted để hủy pause
    //   emitIotInteracted(programId);
    // }

    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, programId]);

  const handleDeviceInfo = () => {
    setIsLoading(true);
    setDeviceResult(null);
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
          {isLoading ? "Loading..." : "Device"}
        </button>
      </div>

      {countdown !== null && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Đếm ngược (giây):</h3>
          <div className="status-box status-countdown">{countdown}</div>
          {interactionStatus && <div style={{ marginTop: 8 }}>{interactionStatus}</div>}
        </div>
      )}

      {deviceResult && (
        <div className="result-box">
          <h3>Device Result (pause-request):</h3>
          <pre className="result-pre">{JSON.stringify(deviceResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ScaleApp;
