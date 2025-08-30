/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { sendReportProduction, getDashboardConnectionStatus } from "./dashboard-socket";

const DEFAULT_DASHBOARD_PAYLOAD = {
  tenant_id: "e42b2852-99ec-40a1-bfdf-16d82c567236",
  search: ""
};

function DashboardApp() {
  const [isConnected, setIsConnected] = useState(getDashboardConnectionStatus());
  const [reportResult, setReportResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Lưu payload gần nhất (để auto-refetch)
  const lastPayloadRef = useRef(DEFAULT_DASHBOARD_PAYLOAD);

  // (Tuỳ chọn) throttle refetch khi có nhiều event dồn dập
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerFetch = (payload = lastPayloadRef.current) => {
    if (!payload) return;
    setIsLoading(true);
    sendReportProduction(payload);
  };

  useEffect(() => {
    const handleSocketConnected = () => {
      setIsConnected(true);
      // Kết nối xong -> gọi ngay lần đầu
      triggerFetch(DEFAULT_DASHBOARD_PAYLOAD);
    };

    const handleSocketDisconnected = () => {
      setIsConnected(false);
    };

    const handleReportResult = (event: CustomEvent) => {
      setReportResult(event.detail);
      setIsLoading(false);
    };

    // Đăng ký listener
    window.addEventListener("report-socket-connected", handleSocketConnected);
    window.addEventListener("report-socket-disconnected", handleSocketDisconnected);
    window.addEventListener("report-production-result", handleReportResult as EventListener);

    // Nếu đã connected sẵn khi mount -> gọi ngay
    if (getDashboardConnectionStatus()) {
      triggerFetch(DEFAULT_DASHBOARD_PAYLOAD);
    }

    return () => {
      window.removeEventListener("report-socket-connected", handleSocketConnected);
      window.removeEventListener("report-socket-disconnected", handleSocketDisconnected);
      window.removeEventListener("report-production-result", handleReportResult as EventListener);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  return (
    <div className="app-container">
      <h1 className="header">React + WebSocket - Report Production</h1>

      <div style={{ marginBottom: "20px" }}>
        <h3>Report Connection Status:</h3>
        <div className={`status-box ${isConnected ? "status-connected" : "status-disconnected"}`}>{isConnected ? "Connected" : "Disconnected"}</div>
      </div>

      {isLoading && <div style={{ marginBottom: 12 }}>Loading...</div>}

      {reportResult && (
        <>
          <div className="table-container">
            {((reportResult as any)?.data?.data?.list ?? []).length === 0 ? (
              <div className="result-box">Không có dữ liệu báo cáo</div>
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
                  {((reportResult as any)?.data?.data?.list ?? []).map((item: any, index: number) => {
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
          </div>

          {/* JSON đầy đủ để debug (tuỳ chọn) */}
          <div className="result-box">
            <h3>Report Production Result (raw):</h3>
            <pre className="result-pre">{JSON.stringify(reportResult, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardApp;
