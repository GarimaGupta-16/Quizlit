// src/context/SocketContext.jsx
import { createContext, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SERVER = "http://localhost:4000";

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

    console.log("Trying to connect to:", SERVER);

    socket.on("connect", () => {
      console.log("🟢 Socket connected successfully!", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("🔴 Socket connection error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
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
