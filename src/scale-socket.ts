import { io } from "socket.io-client";

// Mock device data
export const device_id = "TV360";
export const access_key = "cba417a8-da45-477b-8572-20507169fd82";
export const model_type = "Display";
export const worker_summary = true;

// Create socket connection
export const socket = io("ws://localhost:4000/ws/iot", {
  transports: ["websocket"],
  query: { type: "device", deviceId: "DEVICE_ID" },
  auth: { token: "" },
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
