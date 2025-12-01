import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { SocketProvider } from "./context/SocketContext.jsx";  // ← ADD THIS

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>     {/* ← WRAP YOUR APP HERE */}
      <App />
    </SocketProvider>
  </StrictMode>
);
