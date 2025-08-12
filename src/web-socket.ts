import { io } from "socket.io-client";

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0OTJhZDBhZC1jZjc4LTQ2MjktYjY2MS1lMDkzZjY1NTc2OTEiLCJ0ZW5hbnRfaWQiOm51bGwsIm5hbWUiOiJTdXBlciBBZG1pbiIsImVtYWlsIjoiY29ubmVjdEBxY20uY29tLnZuIiwicm9sZXMiOlsiU3VwZXIgQWRtaW4iXSwicGVybWlzc2lvbnMiOlsiVEVOQU5UUzpBREQiLCJURU5BTlRTOlZJRVciLCJURU5BTlRTOkVESVQiLCJURU5BTlRTOkRFTEVURSIsIlRFTkFOVFM6Q09ORklHLVZJRVciLCJURU5BTlRTOkNPTkZJRy1FRElUIiwiVVNFUlM6QUREIiwiVVNFUlM6VklFVyIsIlVTRVJTOkVESVQiLCJVU0VSUzpERUxFVEUiLCJST0xFUzpBREQiLCJST0xFUzpWSUVXIiwiUk9MRVM6RURJVCIsIlJPTEVTOkRFTEVURSIsIkRFVklDRVM6QUREIiwiREVWSUNFUzpWSUVXIiwiREVWSUNFUzpFRElUIiwiREVWSUNFUzpERUxFVEUiLCJERVZJQ0VTOkFDQ0VTUy1LRVkiLCJERVZJQ0U6Q09ORklHLVZJRVciLCJERVZJQ0VTOlRFTkFOVC1WSUVXIiwiREVWSUNFOkNPTkZJRy1FRElUIiwiREVWSUNFUzpURU5BTlQtRURJVCIsIkRFVklDRS1NT0RFTFM6QUREIiwiREVWSUNFLU1PREVMUzpWSUVXIiwiREVWSUNFLU1PREVMUzpFRElUIiwiREVWSUNFLU1PREVMUzpERUxFVEUiLCJUSUNLRVRTOkFERCIsIlRJQ0tFVFM6VklFVyIsIlRJQ0tFVFM6SE9TVC1WSUVXIiwiVElDS0VUUzpFRElUIiwiVElDS0VUUzpIT1NULUVESVQiLCJUSUNLRVRTOkRFTEVURSIsIlRJQ0tFVFM6RU1BSUwtT04tQ1JFQVRFRCIsIlRJQ0tFVFM6QVNTSUdOLVRPIiwiVElDS0VUUzpBREQtTk9URSIsIkVNUExPWUVFUzpBREQiLCJFTVBMT1lFRVM6VklFVyIsIkVNUExPWUVFUzpFRElUIiwiRU1QTE9ZRUVTOkRFTEVURSIsIlBST0NFU1M6QUREIiwiUFJPQ0VTUzpWSUVXIiwiUFJPQ0VTUzpFRElUIiwiUFJPQ0VTUzpFRElULVNUQVRVUyIsIlBST0NFU1M6REVMRVRFIiwiQ09ORklHVVJBVElPTlM6QUREIiwiQ09ORklHVVJBVElPTlM6VklFVyIsIkNPTkZJR1VSQVRJT05TOkVESVQiLCJDT05GSUdVUkFUSU9OUzpERUxFVEUiLCJQUk9EVUNUUzpBREQiLCJQUk9EVUNUUzpWSUVXIiwiUFJPRFVDVFM6RURJVCIsIlBST0RVQ1RTOkRFTEVURSIsIlNUQUdFUzpBREQiLCJTVEFHRVM6VklFVyIsIlNUQUdFUzpFRElUIiwiU1RBR0VTOkRFTEVURSIsIlNJWkVTOkFERCIsIlNJWkVTOlZJRVciLCJTSVpFUzpFRElUIiwiU0laRVM6REVMRVRFIl0sImlhdCI6MTc1NTAwMDYyMSwiZXhwIjoxNzU4NjAwNjIxfQ.UP8aqJwtAjQYiWE-qXMQPeZfBe73ouTukJVGJba-FEY";

export const socket = io("ws://localhost:4000/ws/report", {
  transports: ["websocket"],
  reconnection: true,
  auth: { token }
});

let isConnected = false;

socket.on("connect", () => {
  isConnected = true;
  window.dispatchEvent(new CustomEvent("socket-connected"));
});

socket.on("disconnect", () => {
  isConnected = false;
  window.dispatchEvent(new CustomEvent("socket-disconnected"));
});

// report-production
export const sendReportProduction = (payload: unknown) => {
  if (socket.connected) {
    socket.emit("report-production", payload);
    console.log("Sent report-production event", payload);
  } else {
    console.log("Socket not connected");
  }
};

socket.on("report-production-result", (result) => {
  console.log("Report production result:", result);
  window.dispatchEvent(new CustomEvent("report-result", { detail: result }));
});

export const getConnectionStatus = () => isConnected;
