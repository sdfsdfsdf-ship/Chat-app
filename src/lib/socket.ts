// import { io } from "socket.io-client";

// const SOCKET_URL =
//   process.env.NEXT_PUBLIC_APP_URL || 
//   (typeof window !== "undefined" && window.location.origin) ||
//   "http://localhost:3000";

// const socket = io(SOCKET_URL, {
//   path: "/api/socket/io", // Important: match your Socket.IO path
//   transports: ["websocket"], // optional optimization
// });

// export default socket;


import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_APP_URL || 
  (typeof window !== "undefined" && window.location.origin) ||
  "http://localhost:3000"; // Update this with your Render URL

const socket = io(SOCKET_URL, {
  path: "/api/socket/io",
  transports: ["websocket", "polling"], // Added polling as fallback
});

export default socket;