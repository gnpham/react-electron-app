import { io } from "socket.io-client";

// const tenantId = "system";
const tenantId = "e42b2852-99ec-40a1-bfdf-16d82c567236";
const tokenDashboard =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0OTJhZDBhZC1jZjc4LTQ2MjktYjY2MS1lMDkzZjY1NTc2OTEiLCJ0ZW5hbnRfaWQiOm51bGwsIm5hbWUiOiJTdXBlciBBZG1pbiIsImVtYWlsIjoiY29ubmVjdEBxY20uY29tLnZuIiwicm9sZXMiOlsiU3VwZXIgQWRtaW4iXSwicGVybWlzc2lvbnMiOlsiVEVOQU5UUzpBREQiLCJURU5BTlRTOlZJRVciLCJURU5BTlRTOkVESVQiLCJURU5BTlRTOkRFTEVURSIsIlRFTkFOVFM6Q09ORklHLVZJRVciLCJURU5BTlRTOkNPTkZJRy1FRElUIiwiVVNFUlM6QUREIiwiVVNFUlM6VklFVyIsIlVTRVJTOkVESVQiLCJVU0VSUzpERUxFVEUiLCJST0xFUzpBREQiLCJST0xFUzpWSUVXIiwiUk9MRVM6RURJVCIsIlJPTEVTOkRFTEVURSIsIkRFVklDRVM6QUREIiwiREVWSUNFUzpWSUVXIiwiREVWSUNFUzpFRElUIiwiREVWSUNFUzpERUxFVEUiLCJERVZJQ0VTOkFDQ0VTUy1LRVkiLCJERVZJQ0U6Q09ORklHLVZJRVciLCJERVZJQ0VTOlRFTkFOVC1WSUVXIiwiREVWSUNFOkNPTkZJRy1FRElUIiwiREVWSUNFUzpURU5BTlQtRURJVCIsIkRFVklDRS1NT0RFTFM6QUREIiwiREVWSUNFLU1PREVMUzpWSUVXIiwiREVWSUNFLU1PREVMUzpFRElUIiwiREVWSUNFLU1PREVMUzpERUxFVEUiLCJUSUNLRVRTOkFERCIsIlRJQ0tFVFM6VklFVyIsIlRJQ0tFVFM6SE9TVC1WSUVXIiwiVElDS0VUUzpFRElUIiwiVElDS0VUUzpIT1NULUVESVQiLCJUSUNLRVRTOkRFTEVURSIsIlRJQ0tFVFM6RU1BSUwtT04tQ1JFQVRFRCIsIlRJQ0tFVFM6QVNTSUdOLVRPIiwiVElDS0VUUzpBREQtTk9URSIsIkVNUExPWUVFUzpBREQiLCJFTVBMT1lFRVM6VklFVyIsIkVNUExPWUVFUzpFRElUIiwiRU1QTE9ZRUVTOkRFTEVURSIsIlBST0NFU1M6QUREIiwiUFJPQ0VTUzpWSUVXIiwiUFJPQ0VTUzpFRElUIiwiUFJPQ0VTUzpFRElULVNUQVRVUyIsIlBST0NFU1M6REVMRVRFIiwiQ09ORklHVVJBVElPTlM6QUREIiwiQ09ORklHVVJBVElPTlM6VklFVyIsIkNPTkZJR1VSQVRJT05TOkVESVQiLCJDT05GSUdVUkFUSU9OUzpERUxFVEUiLCJQUk9EVUNUUzpBREQiLCJQUk9EVUNUUzpWSUVXIiwiUFJPRFVDVFM6RURJVCIsIlBST0RVQ1RTOkRFTEVURSIsIlNUQUdFUzpBREQiLCJTVEFHRVM6VklFVyIsIlNUQUdFUzpFRElUIiwiU1RBR0VTOkRFTEVURSIsIlNJWkVTOkFERCIsIlNJWkVTOlZJRVciLCJTSVpFUzpFRElUIiwiU0laRVM6REVMRVRFIl0sImlhdCI6MTc1NjI4NzE2MSwiZXhwIjoxNzU5ODg3MTYxfQ.OktjM1fMmwWIs8fymsMqqz3iB9kzp7R7wT-SkJ-FhP0";

const socketDashboardConfig = {
  path: "/socket.io/",
  transports: ["websocket"],
  query: { type: "web", deviceId: "", tenantId },
  auth: { token: tokenDashboard },
  reconnection: true
};

// Report namespace socket
export const dashBoardSocket = io("ws://localhost:4000/ws/dashboard", socketDashboardConfig);

// Connection status tracking
let isDashboardConnected = false;
// Report socket event handlers
dashBoardSocket.on("connect", () => {
  isDashboardConnected = true;
  window.dispatchEvent(new CustomEvent("dashboard-socket-connected"));
});

dashBoardSocket.on("disconnect", () => {
  isDashboardConnected = false;
  window.dispatchEvent(new CustomEvent("dashboard-socket-disconnected"));
});

// Report namespace functions
export const sendReportProduction = (payload: unknown) => {
  if (dashBoardSocket.connected) {
    dashBoardSocket.emit("dashboard-charts", payload);
    console.log("Sent dashboard-charts event", payload);
  } else {
    console.log("Report socket not connected");
  }
};

dashBoardSocket.on("dashboard-charts-result", (result) => {
  console.log("Dashboard charts result:", result);
  window.dispatchEvent(new CustomEvent("dashboard-charts-result", { detail: result }));
});

// Connection status functions
export const getDashboardConnectionStatus = () => isDashboardConnected;

// Legacy compatibility - keep the old socket reference for backward compatibilit
export const getConnectionStatus = () => isDashboardConnected;
