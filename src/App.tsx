import { useEffect } from "react";
import { socket } from "./socket";

function App() {
  useEffect(() => {
    socket.on("welcome", (msg) => {
      console.log("Server:", msg);
    });

    return () => {
      socket.off("welcome");
    };
  }, []);

  return (
    <div>
      <h1>Electron + React + Vite + Socket.IO</h1>
    </div>
  );
}

export default App;
