// src/context/SocketContext.jsx
import { createContext, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SERVER =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://quizlit.onrender.com";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(
    io(SERVER, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 500,
    })
  );

  useEffect(() => {
    const socket = socketRef.current;

    console.log("Connecting to:", SERVER);

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("🔴 Connection error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Disconnected:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
