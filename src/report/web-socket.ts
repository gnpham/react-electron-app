import { io } from "socket.io-client";

// const tenantId = "system";
const tenantId = "e42b2852-99ec-40a1-bfdf-16d82c567236";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0OTJhZDBhZC1jZjc4LTQ2MjktYjY2MS1lMDkzZjY1NTc2OTEiLCJ0ZW5hbnRfaWQiOm51bGwsIm5hbWUiOiJTdXBlciBBZG1pbiIsImVtYWlsIjoiY29ubmVjdEBxY20uY29tLnZuIiwicm9sZXMiOlsiU3VwZXIgQWRtaW4iXSwicGVybWlzc2lvbnMiOlsiVEVOQU5UUzpBREQiLCJURU5BTlRTOlZJRVciLCJURU5BTlRTOkVESVQiLCJURU5BTlRTOkRFTEVURSIsIlRFTkFOVFM6Q09ORklHLVZJRVciLCJURU5BTlRTOkNPTkZJRy1FRElUIiwiVVNFUlM6QUREIiwiVVNFUlM6VklFVyIsIlVTRVJTOkVESVQiLCJVU0VSUzpERUxFVEUiLCJST0xFUzpBREQiLCJST0xFUzpWSUVXIiwiUk9MRVM6RURJVCIsIlJPTEVTOkRFTEVURSIsIkRFVklDRVM6QUREIiwiREVWSUNFUzpWSUVXIiwiREVWSUNFUzpFRElUIiwiREVWSUNFUzpERUxFVEUiLCJERVZJQ0VTOkFDQ0VTUy1LRVkiLCJERVZJQ0VTOlRFTkFOVC1WSUVXIiwiREVWSUNFOkNPTkZJRy1WSUVXIiwiREVWSUNFOkNPTkZJRy1FRElUIiwiREVWSUNFUzpURU5BTlQtRURJVCIsIkRFVklDRS1NT0RFTFM6QUREIiwiREVWSUNFLU1PREVMUzpWSUVXIiwiREVWSUNFLU1PREVMUzpFRElUIiwiREVWSUNFLU1PREVMUzpERUxFVEUiLCJUSUNLRVRTOkFERCIsIlRJQ0tFVFM6VklFVyIsIlRJQ0tFVFM6SE9TVC1WSUVXIiwiVElDS0VUUzpFRElUIiwiVElDS0VUUzpIT1NULUVESVQiLCJUSUNLRVRTOkRFTEVURSIsIlRJQ0tFVFM6RU1BSUwtT04tQ1JFQVRFRCIsIlRJQ0tFVFM6QVNTSUdOLVRPIiwiVElDS0VUUzpBREQtTk9URSIsIkVNUExPWUVFUzpBREQiLCJFTVBMT1lFRVM6VklFVyIsIkVNUExPWUVFUzpFRElUIiwiRU1QTE9ZRUVTOkRFTEVURSIsIlBST0NFU1M6QUREIiwiUFJPQ0VTUzpWSUVXIiwiUFJPQ0VTUzpFRElUIiwiUFJPQ0VTUzpFRElULVNUQVRVUyIsIlBST0NFU1M6REVMRVRFIiwiQ09ORklHVVJBVElPTlM6QUREIiwiQ09ORklHVVJBVElPTlM6VklFVyIsIkNPTkZJR1VSQVRJT05TOkVESVQiLCJDT05GSUdVUkFUSU9OUzpERUxFVEUiLCJQUk9EVUNUUzpBREQiLCJQUk9EVUNUUzpWSUVXIiwiUFJPRFVDVFM6RURJVCIsIlBST0RVQ1RTOkRFTEVURSIsIlNUQUdFUzpBREQiLCJTVEFHRVM6VklFVyIsIlNUQUdFUzpFRElUIiwiU1RBR0VTOkRFTEVURSIsIlNJWkVTOkFERCIsIlNJWkVTOlZJRVciLCJTSVpFUzpFRElUIiwiU0laRVM6REVMRVRFIiwiUEFUQ0hFUzpBREQiLCJQQVRDSEVTOlZJRVciLCJQQVRDSEVTOkVESVQiLCJQQVRDSEVTOkRFTEVURSJdLCJpYXQiOjE3NTc1NzUzMzMsImV4cCI6MTc2MTE3NTMzM30.XCTJ-OBfc2HPgHL8TcjiAzl4_0YK1UfJFRaSHqnsFY4";
const tokenReport =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0OTJhZDBhZC1jZjc4LTQ2MjktYjY2MS1lMDkzZjY1NTc2OTEiLCJ0ZW5hbnRfaWQiOm51bGwsIm5hbWUiOiJTdXBlciBBZG1pbiIsImVtYWlsIjoiY29ubmVjdEBxY20uY29tLnZuIiwicm9sZXMiOlsiU3VwZXIgQWRtaW4iXSwicGVybWlzc2lvbnMiOlsiVEVOQU5UUzpBREQiLCJURU5BTlRTOlZJRVciLCJURU5BTlRTOkVESVQiLCJURU5BTlRTOkRFTEVURSIsIlRFTkFOVFM6Q09ORklHLVZJRVciLCJURU5BTlRTOkNPTkZJRy1FRElUIiwiVVNFUlM6QUREIiwiVVNFUlM6VklFVyIsIlVTRVJTOkVESVQiLCJVU0VSUzpERUxFVEUiLCJST0xFUzpBREQiLCJST0xFUzpWSUVXIiwiUk9MRVM6RURJVCIsIlJPTEVTOkRFTEVURSIsIkRFVklDRVM6QUREIiwiREVWSUNFUzpWSUVXIiwiREVWSUNFUzpFRElUIiwiREVWSUNFUzpERUxFVEUiLCJERVZJQ0VTOkFDQ0VTUy1LRVkiLCJERVZJQ0U6Q09ORklHLVZJRVciLCJERVZJQ0VTOlRFTkFOVC1WSUVXIiwiREVWSUNFOkNPTkZJRy1FRElUIiwiREVWSUNFUzpURU5BTlQtRURJVCIsIkRFVklDRS1NT0RFTFM6QUREIiwiREVWSUNFLU1PREVMUzpWSUVXIiwiREVWSUNFLU1PREVMUzpFRElUIiwiREVWSUNFLU1PREVMUzpERUxFVEUiLCJUSUNLRVRTOkFERCIsIlRJQ0tFVFM6VklFVyIsIlRJQ0tFVFM6SE9TVC1WSUVXIiwiVElDS0VUUzpFRElUIiwiVElDS0VUUzpIT1NULUVESVQiLCJUSUNLRVRTOkRFTEVURSIsIlRJQ0tFVFM6RU1BSUwtT04tQ1JFQVRFRCIsIlRJQ0tFVFM6QVNTSUdOLVRPIiwiVElDS0VUUzpBREQtTk9URSIsIkVNUExPWUVFUzpBREQiLCJFTVBMT1lFRVM6VklFVyIsIkVNUExPWUVFUzpFRElUIiwiRU1QTE9ZRUVTOkRFTEVURSIsIlBST0NFU1M6QUREIiwiUFJPQ0VTUzpWSUVXIiwiUFJPQ0VTUzpFRElUIiwiUFJPQ0VTUzpFRElULVNUQVRVUyIsIlBST0NFU1M6REVMRVRFIiwiQ09ORklHVVJBVElPTlM6QUREIiwiQ09ORklHVVJBVElPTlM6VklFVyIsIkNPTkZJR1VSQVRJT05TOkVESVQiLCJDT05GSUdVUkFUSU9OUzpERUxFVEUiLCJQUk9EVUNUUzpBREQiLCJQUk9EVUNUUzpWSUVXIiwiUFJPRFVDVFM6RURJVCIsIlBST0RVQ1RTOkRFTEVURSIsIlNUQUdFUzpBREQiLCJTVEFHRVM6VklFVyIsIlNUQUdFUzpFRElUIiwiU1RBR0VTOkRFTEVURSIsIlNJWkVTOkFERCIsIlNJWkVTOlZJRVciLCJTSVpFUzpFRElUIiwiU0laRVM6REVMRVRFIl0sImlhdCI6MTc1NjI4NzE2MSwiZXhwIjoxNzU5ODg3MTYxfQ.OktjM1fMmwWIs8fymsMqqz3iB9kzp7R7wT-SkJ-FhP0";

// Socket configuration
const socketConfig = {
  path: "/socket.io/",
  transports: ["websocket"],
  query: { type: "web", deviceId: "", tenantId },
  auth: { token: token },
  reconnection: true
};

const socketReportConfig = {
  path: "/socket.io/",
  transports: ["websocket"],
  query: { type: "web", deviceId: "", tenantId },
  auth: { token: tokenReport },
  reconnection: true
};

// Process namespace socket
export const processSocket = io("ws://localhost:4000/ws/process", socketConfig);

// Report namespace socket
export const reportSocket = io("ws://localhost:4000/ws/report", socketReportConfig);

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
    processSocket.emit("list-process", payload);
    console.log("Sent process-data event", payload);
  } else {
    console.log("Process socket not connected");
  }
};

processSocket.on("list-process-result", (result) => {
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

processSocket.on("connect_error", (err) => {
  const errorMap: Record<string, { statusCode: number; message: string }> = {
    unauthorized: { statusCode: 401, message: "Unauthorized" },
    token_invalid: { statusCode: 401, message: "Invalid token" },
    handshake_error: { statusCode: 500, message: "Handshake error" }
  };
  const error = errorMap[err.message] || { statusCode: 500, message: err.message };
  alert(error.message);
  alert(error.statusCode);
});

processSocket.on("ws-error", (e) => {
  alert(e.message);
  alert(e.statusCode);
});

// Connection status functions
export const getProcessConnectionStatus = () => isProcessConnected;
export const getReportConnectionStatus = () => isReportConnected;

// Legacy compatibility - keep the old socket reference for backward compatibility
export const socket = processSocket;
export const getConnectionStatus = () => isProcessConnected;
