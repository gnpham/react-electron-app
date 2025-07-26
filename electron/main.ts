import { app, BrowserWindow } from "electron";
const path = require("node:path");

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Check if we're in development or production
  const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

  if (isDev) {
    // Development: load from Vite dev server
    await win.loadURL("http://localhost:5173");
    // win.webContents.openDevTools();
  } else {
    // Production: load from built static files
    await win.loadFile(path.resolve(__dirname, "../dist/index.html"));
    // Open DevTools for debugging
    // win.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
