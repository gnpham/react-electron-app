/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { sendProcessData, getProcessConnectionStatus } from "./web-socket";

// const DEFAULT_PAYLOAD = {
//   process_id: "56f0cc3f-59b4-4d73-b0c7-223bd24f0064",
//   filterProcessDataDto: {
//     page: 1,
//     pageSize: 10,
//     // tenant_id: "e42b2852-99ec-40a1-bfdf-16d82c567236",
//     tenant_id: null,
//     search: "",
//     size_id: "",
//     product_id: ""
//   }
// };
const DEFAULT_PAYLOAD = {
  filterProcessDto: {
    page: 1,
    pageSize: 10,
    tenant_id: "e42b2852-99ec-40a1-bfdf-16d82c567236",
    search: ""
  }
};

function WebApp() {
  const [isConnected, setIsConnected] = useState(getProcessConnectionStatus());
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
      // const { process_id } = event.detail || {};
      const lastPayload = lastPayloadRef.current;

      if (!lastPayload) return;
      // if (lastPayload.process_id && process_id && lastPayload.process_id !== process_id) return;

      // Throttle 500ms để gom nhiều sự kiện liên tiếp
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = setTimeout(() => {
        triggerFetch(lastPayload);
      }, 500);
    };

    // Đăng ký listener
    window.addEventListener("process-socket-connected", handleSocketConnected);
    window.addEventListener("process-socket-disconnected", handleSocketDisconnected);
    window.addEventListener("process-data-result", handleProcessResult as EventListener);
    window.addEventListener("data-changed", handleDataChanged as EventListener);

    // Nếu đã connected sẵn khi mount -> gọi ngay
    if (getProcessConnectionStatus()) {
      triggerFetch(DEFAULT_PAYLOAD);
    }

    return () => {
      window.removeEventListener("process-socket-connected", handleSocketConnected);
      window.removeEventListener("process-socket-disconnected", handleSocketDisconnected);
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
        <>
          {/* <div className="table-container">
            {((processResult as any)?.data?.data?.list ?? []).length === 0 ? (
              <div className="result-box">Không có dữ liệu</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã thẻ</th>
                    <th>Nhân viên</th>
                    <th>Sản phẩm</th>
                    <th>Công đoạn</th>
                    <th>Size</th>
                    <th>Thiết bị</th>
                    <th className="text-right">Khối lượng</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {((processResult as any)?.data?.data?.list ?? []).map((item: any, index: number) => {
                    return (
                      <tr key={item.id ?? index}>
                        <td className="nowrap">{item?.card_code}</td>
                        <td className="nowrap">{item?.employee_name}</td>
                        <td className="nowrap">{item?.product_name}</td>
                        <td className="nowrap">{item?.stage_name}</td>
                        <td className="nowrap">{item?.size_name}</td>
                        <td className="nowrap">{item?.name_scales}</td>
                        <td className="text-right">{item?.quantity}</td>
                        <td className="nowrap">{item?.date_time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div> */}

          {/* JSON đầy đủ để debug (tuỳ chọn) */}
          <div className="result-box">
            <h3>Process Data Result (raw):</h3>
            <pre className="result-pre">{JSON.stringify(processResult, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}

export default WebApp;
