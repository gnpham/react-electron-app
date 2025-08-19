// import { useEffect, useRef, useState } from "react";
// import { sendProcessData, getConnectionStatus } from "./web-socket";

// function WebApp() {
//   const [isConnected, setIsConnected] = useState(getConnectionStatus());
//   const [processResult, setProcessResult] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Lưu payload lần gọi gần nhất để auto-refetch
//   const lastPayloadRef = useRef<{
//     process_id?: string;
//     filterProcessDataDto?: {
//       page?: number;
//       pageSize?: number;
//       tenant_id?: string;
//       search?: string;
//       size_id?: string;
//       product_id?: string;
//       approval_required?: boolean | null;
//     };
//   } | null>(null);

//   useEffect(() => {
//     const handleSocketConnected = () => {
//       setIsConnected(true);
//       console.log("Connected to server");
//     };

//     const handleSocketDisconnected = () => {
//       setIsConnected(false);
//       console.log("Disconnected from server");
//     };

//     const handleProcessResult = (event: CustomEvent) => {
//       setProcessResult(event.detail);
//       setIsLoading(false);
//       console.log("Received process-data result:", event.detail);
//     };

//     // Khi BE báo có dữ liệu mới (theo tenant), tự refetch
//     const handleDataChanged = (event: CustomEvent) => {
//       const { process_id } = event.detail || {};
//       const lastPayload = lastPayloadRef.current;

//       // Nếu đang xem 1 process cụ thể thì nên check trùng process_id
//       if (!lastPayload) return;
//       if (lastPayload.process_id && process_id && lastPayload.process_id !== process_id) return;

//       setIsLoading(true);
//       sendProcessData(lastPayload);
//     };

//     window.addEventListener("socket-connected", handleSocketConnected);
//     window.addEventListener("socket-disconnected", handleSocketDisconnected);
//     window.addEventListener("process-data-result", handleProcessResult as EventListener);
//     window.addEventListener("data-changed", handleDataChanged as EventListener);

//     return () => {
//       window.removeEventListener("socket-connected", handleSocketConnected);
//       window.removeEventListener("socket-disconnected", handleSocketDisconnected);
//       window.removeEventListener("process-data-result", handleProcessResult as EventListener);
//       window.removeEventListener("data-changed", handleDataChanged as EventListener);
//     };
//   }, []);

//   const handleGetProcessData = () => {
//     const payload = {
//       process_id: "3c0912f3-34b8-4b50-98d6-43773ac6b4e1",
//       filterProcessDataDto: {
//         page: 1,
//         pageSize: 10,
//         tenant_id: "550e8400-e29b-41d4-a716-446655440000",
//         search: "",
//         size_id: "",
//         product_id: "",
//         approval_required: null
//       }
//     };

//     lastPayloadRef.current = payload; // lưu lại để auto-refetch
//     setIsLoading(true);
//     setProcessResult(null);
//     sendProcessData(payload);
//   };

//   return (
//     <div className="app-container">
//       <h1 className="header">React + WebSocket - Process Data</h1>

//       <div style={{ marginBottom: "20px" }}>
//         <h3>Connection Status:</h3>
//         <div className={`status-box ${isConnected ? "status-connected" : "status-disconnected"}`}>{isConnected ? "Connected" : "Disconnected"}</div>
//       </div>

//       <div style={{ marginBottom: "20px" }}>
//         <button onClick={handleGetProcessData} disabled={!isConnected || isLoading} className="display-btn">
//           {isLoading ? "Loading..." : "Get Process Data"}
//         </button>
//       </div>

//       {processResult && (
//         <div className="result-box">
//           <h3>Process Data Result:</h3>
//           <pre className="result-pre">{JSON.stringify(processResult, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

// export default WebApp;
