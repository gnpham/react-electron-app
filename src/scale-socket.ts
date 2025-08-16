import { io } from "socket.io-client";

// Mock device data
export const device_id = "TV360";
export const access_key = "cba417a8-da45-477b-8572-20507169fd82";
export const model_type = "Display";
export const worker_summary = true;

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0OTJhZDBhZC1jZjc4LTQ2MjktYjY2MS1lMDkzZjY1NTc2OTEiLCJ0ZW5hbnRfaWQiOm51bGwsIm5hbWUiOiJTdXBlciBBZG1pbiIsImVtYWlsIjoiY29ubmVjdEBxY20uY29tLnZuIiwicm9sZXMiOlsiU3VwZXIgQWRtaW4iXSwicGVybWlzc2lvbnMiOlsiVEVOQU5UUzpBREQiLCJURU5BTlRTOlZJRVciLCJURU5BTlRTOkVESVQiLCJURU5BTlRTOkRFTEVURSIsIlRFTkFOVFM6Q09ORklHLVZJRVciLCJURU5BTlRTOkNPTkZJRy1FRElUIiwiVVNFUlM6QUREIiwiVVNFUlM6VklFVyIsIlVTRVJTOkVESVQiLCJVU0VSUzpERUxFVEUiLCJST0xFUzpBREQiLCJST0xFUzpWSUVXIiwiUk9MRVM6RURJVCIsIlJPTEVTOkRFTEVURSIsIkRFVklDRVM6QUREIiwiREVWSUNFUzpWSUVXIiwiREVWSUNFUzpFRElUIiwiREVWSUNFUzpERUxFVEUiLCJERVZJQ0VTOkFDQ0VTUy1LRVkiLCJERVZJQ0U6Q09ORklHLVZJRVciLCJERVZJQ0VTOlRFTkFOVC1WSUVXIiwiREVWSUNFOkNPTkZJRy1FRElUIiwiREVWSUNFUzpURU5BTlQtRURJVCIsIkRFVklDRS1NT0RFTFM6QUREIiwiREVWSUNFLU1PREVMUzpWSUVXIiwiREVWSUNFLU1PREVMUzpFRElUIiwiREVWSUNFLU1PREVMUzpERUxFVEUiLCJUSUNLRVRTOkFERCIsIlRJQ0tFVFM6VklFVyIsIlRJQ0tFVFM6SE9TVC1WSUVXIiwiVElDS0VUUzpFRElUIiwiVElDS0VUUzpIT1NULUVESVQiLCJUSUNLRVRTOkRFTEVURSIsIlRJQ0tFVFM6RU1BSUwtT04tQ1JFQVRFRCIsIlRJQ0tFVFM6QVNTSUdOLVRPIiwiVElDS0VUUzpBREQtTk9URSIsIkVNUExPWUVFUzpBREQiLCJFTVBMT1lFRVM6VklFVyIsIkVNUExPWUVFUzpFRElUIiwiRU1QTE9ZRUVTOkRFTEVURSIsIlBST0NFU1M6QUREIiwiUFJPQ0VTUzpWSUVXIiwiUFJPQ0VTUzpFRElUIiwiUFJPQ0VTUzpFRElULVNUQVRVUyIsIlBST0NFU1M6REVMRVRFIiwiQ09ORklHVVJBVElPTlM6QUREIiwiQ09ORklHVVJBVElPTlM6VklFVyIsIkNPTkZJR1VSQVRJT05TOkVESVQiLCJDT05GSUdVUkFUSU9OUzpERUxFVEUiLCJQUk9EVUNUUzpBREQiLCJQUk9EVUNUUzpWSUVXIiwiUFJPRFVDVFM6RURJVCIsIlBST0RVQ1RTOkRFTEVURSIsIlNUQUdFUzpBREQiLCJTVEFHRVM6VklFVyIsIlNUQUdFUzpFRElUIiwiU1RBR0VTOkRFTEVURSIsIlNJWkVTOkFERCIsIlNJWkVTOlZJRVciLCJTSVpFUzpFRElUIiwiU0laRVM6REVMRVRFIl0sImlhdCI6MTc1NTAwMDYyMSwiZXhwIjoxNzU4NjAwNjIxfQ.UP8aqJwtAjQYiWE-qXMQPeZfBe73ouTukJVGJba-FEY";

// Create socket connection
export const socket = io("ws://localhost:4000/ws/iot", {
  transports: ["websocket"],
  query: { type: "web", deviceId: "" },
  auth: { token },
  reconnection: true
});

// Global connection status
let isConnected = false;

// Listen connect
socket.on("connect", () => {
  isConnected = true;
  console.log("Connected to server");
  // Emit custom event can listen
  window.dispatchEvent(new CustomEvent("socket-connected"));
});

// Listen disconnect
socket.on("disconnect", () => {
  isConnected = false;
  console.log("Disconnected from server");
  // Emit custom event to listen
  window.dispatchEvent(new CustomEvent("socket-disconnected"));
});

// Function to send display-device event
export const sendDisplayDevice = () => {
  if (socket.connected) {
    socket.emit("display-device", { device_id, access_key, model_type, worker_summary });
    console.log("Sent display-device event");
  } else {
    console.log("Socket not connected");
  }
};

// Listen for display-device-result
socket.on("display-device-result", (result) => {
  console.log("Display device result:", result);
  // You can emit a custom event here to notify React components
  window.dispatchEvent(new CustomEvent("device-result", { detail: result }));
});

// Listen for sync-request
socket.on("sync-request", (result) => {
  console.log("Sync request:", result);
});

export const getConnectionStatus = () => isConnected;
