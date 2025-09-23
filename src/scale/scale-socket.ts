import { io } from "socket.io-client";

// Mock device data
// scale_web_prod
// export const device_id = "D83ADDAA4863";
// export const access_key = "cac11dfd-4387-491a-8d7b-ca529a8bf230";
// const clientType = "device";
// export const deviceId = "D83ADDAA4863";
// const accessKey = "cac11dfd-4387-491a-8d7b-ca529a8bf230";
// const accessToken = "";

// scale_web_beta
export const device_id = "QCM1234";
export const access_key = "c702c684-0bd7-44fd-949b-b0727f488346";
const clientType = "device";
export const deviceId = "QCM1234";
const accessKey = "c702c684-0bd7-44fd-949b-b0727f488346";
const accessToken = "";

export const socket = io("ws://localhost:4000/ws/iot", {
  path: "/socket.io/",
  transports: ["websocket"],
  query: { type: clientType, deviceId, accessKey },
  auth: { token: accessToken },
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

// Listen for sync-request
socket.on("sync-request", (result) => {
  // console.log("Sync request:", result);
  console.log("sync-request");
  // alert(result);
  window.dispatchEvent(new CustomEvent("device-result", { detail: result }));
});

socket.on("pause-request", (result) => {
  // console.log("Pause request:", result);
  // alert(result);
  console.log("countdown", result.countdown_seconds);
  window.dispatchEvent(new CustomEvent("device-result", { detail: result }));
});

socket.on("update-version", (result) => {
  console.log("Sync request:", result);
  // alert(result);
  window.dispatchEvent(new CustomEvent("device-result", { detail: result }));
});

// Listen iot-interacted-result from server and bubble to UI
socket.on("iot-interacted-result", (result) => {
  console.log("iot-interacted-result:", result);
  window.dispatchEvent(new CustomEvent("iot-interacted-result", { detail: result }));
});

// Helper to emit iot-interacted to server
export const emitIotInteracted = (programId: string) => {
  try {
    socket.emit("iot-interacted", {
      device_id,
      program_id: programId
    });
  } catch (error) {
    console.error("Failed to emit iot-interacted", error);
  }
};

export const getConnectionStatus = () => isConnected;
