import { io } from "socket.io-client";

// const tenantId = "system";
const tenantId = "550e8400-e29b-41d4-a716-446655440000";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0OTJhZDBhZC1jZjc4LTQ2MjktYjY2MS1lMDkzZjY1NTc2OTEiLCJ0ZW5hbnRfaWQiOm51bGwsIm5hbWUiOiJDRU8gUUNNIC0gU3VwZXIgQWRtaW4iLCJlbWFpbCI6ImNvbm5lY3RAcWNtLmNvbS52biIsInJvbGVzIjpbIlN1cGVyIEFkbWluIl0sInBlcm1pc3Npb25zIjpbIlRFTkFOVFM6QUREIiwiVEVOQU5UUzpWSUVXIiwiVEVOQU5UUzpFRElUIiwiVEVOQU5UUzpERUxFVEUiLCJURU5BTlRTOkNPTkZJRy1WSUVXIiwiVEVOQU5UUzpDT05GSUctRURJVCIsIlVTRVJTOkFERCIsIlVTRVJTOlZJRVciLCJVU0VSUzpFRElUIiwiVVNFUlM6REVMRVRFIiwiUk9MRVM6QUREIiwiUk9MRVM6VklFVyIsIlJPTEVTOkVESVQiLCJST0xFUzpERUxFVEUiLCJERVZJQ0VTOkFERCIsIkRFVklDRVM6VklFVyIsIkRFVklDRVM6RURJVCIsIkRFVklDRVM6REVMRVRFIiwiREVWSUNFUzpBQ0NFU1MtS0VZIiwiREVWSUNFOkNPTkZJRy1WSUVXIiwiREVWSUNFUzpURU5BTlQtVklFVyIsIkRFVklDRTpDT05GSUctRURJVCIsIkRFVklDRVM6VEVOQU5ULUVESVQiLCJERVZJQ0UtTU9ERUxTOkFERCIsIkRFVklDRS1NT0RFTFM6VklFVyIsIkRFVklDRS1NT0RFTFM6RURJVCIsIkRFVklDRS1NT0RFTFM6REVMRVRFIiwiVElDS0VUUzpBREQiLCJUSUNLRVRTOlZJRVciLCJUSUNLRVRTOkhPU1QtVklFVyIsIlRJQ0tFVFM6RURJVCIsIlRJQ0tFVFM6SE9TVC1FRElUIiwiVElDS0VUUzpERUxFVEUiLCJUSUNLRVRTOkVNQUlMLU9OLUNSRUFURUQiLCJUSUNLRVRTOkFTU0lHTi1UTyIsIlRJQ0tFVFM6QURELU5PVEUiLCJFTVBMT1lFRVM6QUREIiwiRU1QTE9ZRUVTOlZJRVciLCJFTVBMT1lFRVM6RURJVCIsIkVNUExPWUVFUzpERUxFVEUiLCJQUk9DRVNTOkFERCIsIlBST0NFU1M6VklFVyIsIlBST0NFU1M6RURJVCIsIlBST0NFU1M6RURJVC1TVEFUVVMiLCJQUk9DRVNTOkRFTEVURSIsIkNPTkZJR1VSQVRJT05TOkFERCIsIkNPTkZJR1VSQVRJT05TOlZJRVciLCJDT05GSUdVUkFUSU9OUzpFRElUIiwiQ09ORklHVVJBVElPTlM6REVMRVRFIiwiUFJPRFVDVFM6QUREIiwiUFJPRFVDVFM6VklFVyIsIlBST0RVQ1RTOkVESVQiLCJQUk9EVUNUUzpERUxFVEUiLCJTVEFHRVM6QUREIiwiU1RBR0VTOlZJRVciLCJTVEFHRVM6RURJVCIsIlNUQUdFUzpERUxFVEUiLCJTSVpFUzpBREQiLCJTSVpFUzpWSUVXIiwiU0laRVM6RURJVCIsIlNJWkVTOkRFTEVURSJdLCJpYXQiOjE3NTU1OTQwMjIsImV4cCI6MTc1OTE5NDAyMn0.EnI9XJ5fRiW4RNGtXpXRPK7RSfQx_ASSdteiFlvgt5I";

// Socket configuration
const socketConfig = {
  path: "/socket.io/",
  transports: ["websocket"],
  query: { type: "web", deviceId: "", tenantId },
  auth: { token: token },
  reconnection: true
};

// Process namespace socket
export const processSocket = io("ws://localhost:4000/ws/process", socketConfig);

// Report namespace socket
export const reportSocket = io("ws://localhost:4000/ws/report", socketConfig);

// Connection status tracking
let isProcessConnected = false;
let isReportConnected = false;

// Process socket event handlers
processSocket.on("connect", () => {
  isProcessConnected = true;
  window.dispatchEvent(new CustomEvent("process-socket-connected"));
});

processSocket.on("disconnect", () => {
  isProcessConnected = false;
  window.dispatchEvent(new CustomEvent("process-socket-disconnected"));
});

// Report socket event handlers
reportSocket.on("connect", () => {
  isReportConnected = true;
  window.dispatchEvent(new CustomEvent("report-socket-connected"));
});

reportSocket.on("disconnect", () => {
  isReportConnected = false;
  window.dispatchEvent(new CustomEvent("report-socket-disconnected"));
});

// Process namespace functions
export const sendProcessData = (payload: unknown) => {
  if (processSocket.connected) {
    processSocket.emit("process-data", payload);
    console.log("Sent process-data event", payload);
  } else {
    console.log("Process socket not connected");
  }
};

processSocket.on("process-data-result", (result) => {
  console.log("Process data result:", result);
  window.dispatchEvent(new CustomEvent("process-data-result", { detail: result }));
});

processSocket.on("data-changed", (msg) => {
  console.log("Data changed:", msg);
  window.dispatchEvent(new CustomEvent("data-changed", { detail: msg }));
});

// Report namespace functions
export const sendReportProduction = (payload: unknown) => {
  if (reportSocket.connected) {
    reportSocket.emit("report-production", payload);
    console.log("Sent report-production event", payload);
  } else {
    console.log("Report socket not connected");
  }
};

reportSocket.on("report-production-result", (result) => {
  console.log("Report production result:", result);
  window.dispatchEvent(new CustomEvent("report-production-result", { detail: result }));
});

// Connection status functions
export const getProcessConnectionStatus = () => isProcessConnected;
export const getReportConnectionStatus = () => isReportConnected;

// Legacy compatibility - keep the old socket reference for backward compatibility
export const socket = processSocket;
export const getConnectionStatus = () => isProcessConnected;
