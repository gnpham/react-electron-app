import { useEffect, useRef, useState } from "react";
import { sendProcessData, getConnectionStatus } from "./web-socket";

const DEFAULT_PAYLOAD = {
  process_id: "3c0912f3-34b8-4b50-98d6-43773ac6b4e1",
  filterProcessDataDto: {
    page: 1,
    pageSize: 10,
    tenant_id: "550e8400-e29b-41d4-a716-446655440000",
    search: "",
    size_id: "",
    product_id: "",
    approval_required: null
  }
};

function WebApp() {
  const [isConnected, setIsConnected] = useState(getConnectionStatus());
  const [processResult, setProcessResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Lưu payload gần nhất (để auto-refetch)
  const lastPayloadRef = useRef(DEFAULT_PAYLOAD);

  // (Tuỳ chọn) throttle refetch khi có nhiều event dồn dập
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerFetch = (payload = lastPayloadRef.current) => {
    if (!payload) return;
    setIsLoading(true);
    sendProcessData(payload);
  };

  useEffect(() => {
    const handleSocketConnected = () => {
      setIsConnected(true);
      // Kết nối xong -> gọi ngay lần đầu
      triggerFetch(DEFAULT_PAYLOAD);
    };

    const handleSocketDisconnected = () => {
      setIsConnected(false);
    };

    const handleProcessResult = (event: CustomEvent) => {
      setProcessResult(event.detail);
      setIsLoading(false);
    };

    // Khi BE báo có dữ liệu mới -> tự refetch
    const handleDataChanged = (event: CustomEvent) => {
      const { process_id } = event.detail || {};
      const lastPayload = lastPayloadRef.current;

      if (!lastPayload) return;
      if (lastPayload.process_id && process_id && lastPayload.process_id !== process_id) return;

      // Throttle 500ms để gom nhiều sự kiện liên tiếp
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = setTimeout(() => {
        triggerFetch(lastPayload);
      }, 500);
    };

    // Đăng ký listener
    window.addEventListener("socket-connected", handleSocketConnected);
    window.addEventListener("socket-disconnected", handleSocketDisconnected);
    window.addEventListener("process-data-result", handleProcessResult as EventListener);
    window.addEventListener("data-changed", handleDataChanged as EventListener);

    // Nếu đã connected sẵn khi mount -> gọi ngay
    if (getConnectionStatus()) {
      triggerFetch(DEFAULT_PAYLOAD);
    }

    return () => {
      window.removeEventListener("socket-connected", handleSocketConnected);
      window.removeEventListener("socket-disconnected", handleSocketDisconnected);
      window.removeEventListener("process-data-result", handleProcessResult as EventListener);
      window.removeEventListener("data-changed", handleDataChanged as EventListener);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  // Không cần nút nữa, có thể bỏ hẳn
  return (
    <div className="app-container">
      <h1 className="header">React + WebSocket - Process Data</h1>

      <div style={{ marginBottom: "20px" }}>
        <h3>Connection Status:</h3>
        <div className={`status-box ${isConnected ? "status-connected" : "status-disconnected"}`}>{isConnected ? "Connected" : "Disconnected"}</div>
      </div>

      {isLoading && <div style={{ marginBottom: 12 }}>Loading...</div>}

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
