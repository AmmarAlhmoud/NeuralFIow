import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  secure: true,
  rejectUnauthorized: false,
});

// Connect when user is authenticated
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Disconnect when user logs out
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Debug logging in development
if (import.meta.env.VITE_ENV === "development") {
  socket.on("connect", () => {
    console.log("🔌 Connected to Socket.IO server:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔌 Disconnected from Socket.IO server:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("🔌 Socket connection error:", error);
  });
}
